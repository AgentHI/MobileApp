import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont, getDeviceHeight, getPrimaryButtonHeight } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { get, set } from 'lodash';
import { StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import {
  Camera,
  CaretDown,
  CheckCircle,
  NotePencil,
  Plus,
  X,
  XCircle,
} from 'phosphor-react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import AppButton from '../../components/AppButton';
import { CreateClient, UpdateAgentData, UpdateAtwinData } from '../../services/AgentServices';
import { Toast } from 'react-native-toast-notifications';
import { isValidEmail, RequestCameraPermissions, RequestContactsPermission, RequestGalleryPermissions, TOAST_ } from '../../config/Utils';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GetClientInfoFromImage } from '../../services/ClientService';
import Modal from 'react-native-modal';
import Contacts from 'react-native-contacts';

export const AddClient = () => {
  const [piData, setpiData] = React.useState<any>({});
  const [userName, setUserName] = React.useState<string>('');
  const [firstName, setfirstName] = React.useState<string>('');
  const [lastname, setlastname] = React.useState<string>('');
  const [email, setemail] = React.useState<string>('');
  const [userToken, setuserToken] = React.useState<string>('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setmobileNumber] = useState('');
  const [show, setShow] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [validMail, setvalidMail] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<string>('');
  const [cameraUploadLoading, setCameraUploadLoading] = React.useState<boolean>(false);
  const [galleryUploadLoading, setGalleryUploadLoading] = React.useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [bio, setBio] = useState('');
  const navigation = useNavigation();

  //  const userPic = 'https://fastly.picsum.photos/id/143/200/300.jpg?hmac=LXGdX9PiyshH-j3_aFp9tazDDPkI0CDtwP-Q4EXBSoA'

  useEffect(() => {
    if (isValidEmail((email || '')?.trim())) {
      setvalidMail(true);
    } else {
      setvalidMail(false);
    }
  }, [email]);

  const onSaveAndContinue = async () => {

    // if (
    //   !firstName.toString().trim() ||
    //   // !lastname.toString().trim() ||
    //   // !mobileNumber.toString().trim() ||
    //   !email.toString().trim() || !validMail
    // ) {
    //   Toast.show(Constants.AllFieldsWarningMessage);
    //   return;
    // }

    setLoading(true);

    const payload = {
      country_code: countryCode,
      mobile: mobileNumber,
      email: email,
      name: firstName,
      added_by: ''
    };

    console.log(
      'payload',
      payload,
    );

    const jsonValue = await AsyncStorage.getItem('@user_data');
    let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log('userData__', userData);

    let result = await CreateClient({"added_by": "", "country_code": "+91", "email": "demo18@gmail.com", "mobile": "", "name": "Demo"}, get(userData, 'token', ''))

    if (result.status == 'success') {
      if (mobileNumber.toString().trim()) {
        await RequestContactsPermission();
        const newPerson = {
          emailAddresses: [{
            label: "work",
            email: email,
          }],
          givenName: firstName,
          phoneNumbers: [{
            label: 'mobile',
            number: `${countryCode}-${mobileNumber.toString()}`,
          }]
        }

        Contacts.addContact(newPerson)
      }
      TOAST_(Constants.clientCreationSuccessful, 'success', 3000);
      navigation.goBack()
    }

    console.log(
      'result',
      result,
    );

    setLoading(false);
  };

  const handleImagePicker = async () => {
    setUploadError('');
    setGalleryUploadLoading(true);
    try {
      if (!await RequestGalleryPermissions()) {
        return;
      }
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
      };

      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets) {
        const photo = result.assets[0];
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = photo.fileName?.split('.').pop()?.toLowerCase()!;
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(Constants.invalidFileFormat);
        }
        const jsonValue = await AsyncStorage.getItem('@user_data');
        let userData = jsonValue != null ? JSON.parse(jsonValue) : null;

        const data = await GetClientInfoFromImage(photo, get(userData, 'token', ''));
        if (typeof data !== 'boolean') {
          setfirstName(data?.data?.name);
          setmobileNumber(data?.data?.mobile);
          setemail(data?.data?.email);
        }
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error('Error while uploading image:', error);
      setUploadError(error.message ?? 'Error while uploading image');
    } finally {
      setGalleryUploadLoading(false);
    }
  };

  const handleCamera = async () => {
    setUploadError('');
    setCameraUploadLoading(true);
    try {
      if (!await RequestCameraPermissions()) {
        return;
      }
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
      };

      const result = await launchCamera(options);

      if (!result.didCancel && result.assets) {
        const photo = result.assets[0];
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = photo.fileName?.split('.').pop()?.toLowerCase()!;
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(Constants.invalidFileFormat);
        }
        const jsonValue = await AsyncStorage.getItem('@user_data');
        let userData = jsonValue != null ? JSON.parse(jsonValue) : null;

        const data = await GetClientInfoFromImage(photo, get(userData, 'token', ''));
        if (typeof data !== 'boolean') {
          setfirstName(data?.data?.name);
          setmobileNumber(data?.data?.mobile);
          setemail(data?.data?.email);
        }
        setModalVisible(false);
      }
    } catch (error: any) {
      console.error('Error while uploading image:', error);
      setUploadError(error.message ?? 'Error while uploading image');

    } finally {
      setCameraUploadLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={1}
        bgcolor={modalVisible ? 'rgba(255,255,255,0.26)' : Colors.white}
      />

      <TwoIconsHeader
        leftTitle={Constants.addClient}
        secondIconSrc={<NotePencil size={26} color={Colors.originalBlue} />}
        secondIcon={false}
        onPressSecondIcon={() => { }}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(20),
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(50),
            marginTop: AutoScaledFont(30),
            marginHorizontal: AutoScaledFont(30),
          }}>
          <View>
            {/* <Text style={styles.profileDetails}>
              {Constants.profileDetails}
            </Text> */}
            <TouchableOpacity>
              <View
                style={{
                  height: AutoScaledFont(100),
                  width: AutoScaledFont(100),
                  borderRadius: AutoScaledFont(75),
                  borderColor: Colors.secondary,
                  borderWidth: AutoScaledFont(4),
                  justifyContent: 'center',
                  backgroundColor: Colors.lighterGray,
                }}>
                <Text
                  style={{
                    fontSize: AutoScaledFont(40),
                    color: Colors.black,
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {/* {(firstName || '-')?.substring(0, 1)?.toUpperCase() + (lastname || '-')?.substring(0, 1)?.toUpperCase()} */}
                  {(firstName || '-')?.substring(0, 1)?.toUpperCase()}
                </Text>

                {/* <View style={styles.cameraView}>
                    <Camera size={18} color={Colors.white} />
                  </View> */}
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: AutoScaledFont(10), flex: 1 }}>
            <Text style={styles.nameTitle}>
              {Constants.clientName}
              {'*'}
            </Text>
            <View style={styles.displayContainer}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  { height: AutoScaledFont(50) },
                ]}
                placeholder={Constants.clientName}
                multiline={false}
                value={firstName}
                onChangeText={setfirstName}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>
            </View>

            {/* <Text style={styles.nameTitle}>
              {Constants.lastName}
              {'*'}
            </Text> */}
            {/* <View style={styles.displayContainer}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {height: AutoScaledFont(50), padding: AutoScaledFont(5)},
                ]}
                placeholder={Constants.lastName}
                multiline={false}
                value={lastname}
                onChangeText={setlastname}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>
            </View> */}

            <Text style={styles.nameTitle}>
              {Constants.mobileNo}
            </Text>
            <View style={[{ flexDirection: 'row' }]}>
              <Pressable onPress={() => setShow(true)}>
                <View
                  style={[
                    styles.displayContainer,
                    {
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: AutoScaledFont(15),
                      height: AutoScaledFont(60),
                      marginEnd: AutoScaledFont(10),
                    },
                  ]}>
                  <Text
                    style={[
                      styles.textInputTextCentered,
                      { fontFamily: 'Poppins-Medium' },
                    ]}>
                    {countryCode}
                  </Text>

                  <CaretDown
                    size={20}
                    color={Colors.black}
                    weight="bold"
                    style={{
                      alignSelf: 'center',
                      marginHorizontal: AutoScaledFont(8),
                    }}
                  />
                </View>
              </Pressable>

              <View style={[styles.displayContainer]}>
                <TextInput
                  style={[
                    styles.textInputTextCentered,
                    {
                      height: AutoScaledFont(50),
                      paddingVertical: AutoScaledFont(5),
                      paddingHorizontal: AutoScaledFont(15),
                      textAlign: 'left',
                    },
                  ]}
                  placeholder={Constants.mobile}
                  multiline={false}
                  value={mobileNumber}
                  inputMode="numeric"
                  maxLength={11}
                  onChangeText={setmobileNumber}
                  placeholderTextColor={Colors.headerThreeColor}></TextInput>
              </View>
            </View>

            <Text style={styles.nameTitle}>
              {Constants.email}
              {'*'}
            </Text>
            <View
              style={[
                styles.displayContainer,
                { flexDirection: 'row', borderWidth: 0 },
              ]}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {
                    height: AutoScaledFont(60),
                    paddingStart: AutoScaledFont(10),
                    backgroundColor: Colors.white,
                    flex: 1,
                    justifyContent: 'center',
                    borderWidth: AutoScaledFont(0.5),
                    alignContent: 'center',
                    borderRadius: AutoScaledFont(10),
                  },
                ]}
                placeholder={Constants.email}
                multiline={false}
                value={email}
                editable={true}
                onChangeText={setemail}
                placeholderTextColor={Colors.gray}></TextInput>

              {email && (
                <View style={{ alignSelf: 'center' }}>
                  {validMail ? (
                    <CheckCircle
                      size={26}
                      color={Colors.greenHex}
                      style={{
                        alignSelf: 'center',
                        marginStart: AutoScaledFont(5),
                      }}
                    />
                  ) : (
                    <XCircle
                      size={26}
                      color={Colors.red}
                      style={{
                        alignSelf: 'center',
                        marginStart: AutoScaledFont(5),
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}>
            <View style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>
                {Constants.uploadBtnText}
              </Text>
            </View>
          </TouchableOpacity>

          <AppButton
            onPressContinue={() => onSaveAndContinue()}
            gradientColor={Colors.secondaryGradient}
            textColor={Colors.primary}
            loading={loading}
            buttonWidth={'100%'}
            buttonTitle={Constants.save}
            buttonStyle={{ marginBottom: AutoScaledFont(0), marginTop: AutoScaledFont(20) }}
          />

          <CountryPicker
            show={show}
            lang="en"
            popularCountries={['en', 'in', 'pl']}
            pickerButtonOnPress={item => {
              setCountryCode(item?.dial_code);
              setShow(false);
            }}
            onBackdropPress={() => setShow(false)}
            style={{
              modal: {
                height: getDeviceHeight() / 1.4,
                backgroundColor: Colors.gray,
                paddingTop: AutoScaledFont(100),
              },
              line: {
                backgroundColor: Colors.gray,
              },
              countryName: {
                fontFamily: 'Poppins-Medium',
                color: Colors.jetBlack,
                fontSize: AutoScaledFont(20),
              },
              textInput: {
                fontFamily: 'Poppins-Medium',
                color: Colors.black,
                fontSize: AutoScaledFont(20),
                paddingStart: AutoScaledFont(5),
              },
              dialCode: {
                fontFamily: 'Poppins-SemiBold',
                color: Colors.black,
                fontSize: AutoScaledFont(20),
              },
              flag: {
                fontFamily: 'Poppins-Medium',
                color: Colors.black,
                fontSize: AutoScaledFont(20),
                opacity: 1,
              },
            }}
          />
        </View>
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        backdropOpacity={0.6}
        onBackdropPress={() => {
          setModalVisible(false);
          setUploadError('');
        }}
      >
        <View style={styles.modalView}>
          <Text style={[styles.nameTitle, { textAlign: 'center', marginTop: 0 }]}>{Constants.uploadBtnText}</Text>
          <View style={styles.modalButtons}>
            <AppButton
              onPressContinue={handleCamera}
              gradientColor={Colors.secondaryGradient}
              textColor={Colors.primary}
              loading={cameraUploadLoading}
              buttonWidth={'100%'}
              buttonTitle={Constants.takePhoto}
              buttonStyle={{ marginVertical: AutoScaledFont(0) }}
            />
            <AppButton
              onPressContinue={handleImagePicker}
              gradientColor={Colors.secondaryGradient}
              textColor={Colors.primary}
              loading={galleryUploadLoading}
              buttonWidth={'100%'}
              buttonTitle={Constants.chooseFromGallery}
              buttonStyle={{ marginVertical: AutoScaledFont(0) }}
            />
          </View>
          {uploadError &&
            <Text style={[styles.nameTitle, { textAlign: 'center', marginBottom: 0, color: Colors.red }]}>
              {uploadError}
            </Text>
          }
        </View>
      </Modal >
    </View >
  );
};

const styles = StyleSheet.create({
  nameTitle: {
    fontSize: AutoScaledFont(20),
    marginTop: AutoScaledFont(25),
    marginBottom: AutoScaledFont(2),
    color: Colors.originalBlue,
    fontFamily: 'Poppins-Medium',
  },
  twinTitle: {
    fontSize: AutoScaledFont(24),
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(2),
    marginHorizontal: AutoScaledFont(5),
    color: Colors.originalBlue,
    fontFamily: 'Poppins-SemiBold',
  },
  optionalHint: {
    fontSize: AutoScaledFont(20),
    marginBottom: AutoScaledFont(5),
    marginHorizontal: AutoScaledFont(5),
    color: Colors.originalBlue,
    fontFamily: 'Poppins-Regular',
  },
  attachments: {
    fontSize: AutoScaledFont(20),
    marginBottom: AutoScaledFont(2),
    marginHorizontal: AutoScaledFont(5),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  displayContainer: {
    borderWidth: AutoScaledFont(0.5),
    borderRadius: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(5),
    borderColor: Colors.gray,
  },
  profileDetails: {
    fontSize: AutoScaledFont(22),
    marginTop: AutoScaledFont(10),
    marginBottom: AutoScaledFont(5),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  textInputText: {
    fontSize: AutoScaledFont(20),
    color: Colors.black,
    textAlign: 'auto',
    verticalAlign: 'top',
    fontFamily: 'Poppins-Regular',
  },
  textInputTextCentered: {
    fontSize: AutoScaledFont(20),
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  cameraView: {
    position: 'absolute',
    backgroundColor: Colors.gray,
    padding: AutoScaledFont(12),
    end: '0%',
    bottom: '0%',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: AutoScaledFont(20),
  },
  mediumdDevider: {
    height: AutoScaledFont(1),
    alignSelf: 'stretch',
    marginVertical: AutoScaledFont(35),
    backgroundColor: Colors.gray,
  },
  largeDevider: {
    height: AutoScaledFont(20),
    alignSelf: 'stretch',
    marginVertical: AutoScaledFont(35),
    marginHorizontal: -AutoScaledFont(35),
    borderRadius: AutoScaledFont(10),
    backgroundColor: Colors.lighterGray,
  },
  agentContainer: {
    borderWidth: AutoScaledFont(1),
    borderRadius: AutoScaledFont(10),
    backgroundColor: Colors.lighterGray,
  },
  aboutTitle: {
    fontSize: AutoScaledFont(22),
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },
  userPic: {
    height: AutoScaledFont(150),
    width: AutoScaledFont(150),
    borderRadius: AutoScaledFont(75),
    borderColor: Colors.secondary,
    alignSelf: 'center',
    borderWidth: AutoScaledFont(4),
    backgroundColor: Colors.charcole,
  },
  userPicView: {
    height: AutoScaledFont(150),
    width: AutoScaledFont(150),
    borderRadius: AutoScaledFont(75),
    backgroundColor: Colors.charcole,
  },
  modalView: {
    width: '90%',
    margin: 'auto',
    borderRadius: AutoScaledFont(20),
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalButtons: {
    gap: 10,
    marginTop: AutoScaledFont(20),
    width: '100%'
  },
  modalButtonText: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    textAlign: 'center',
  },
  outlineButton: {
    height: getPrimaryButtonHeight(),
    width: '100%',
    borderRadius: AutoScaledFont(10),
    marginTop: AutoScaledFont(10),
    borderWidth: 1,
    borderColor: Colors.secondary,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontSize: AutoScaledFont(20),
  },
});
