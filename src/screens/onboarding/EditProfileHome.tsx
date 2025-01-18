import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AutoScaledFont, getDeviceHeight} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {get} from 'lodash';
import {StackActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import {
  Camera,
  CaretDown,
  CheckCircle,
  NotePencil,
  Plus,
} from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';
import {CountryPicker} from 'react-native-country-codes-picker';
import AttachmentsCell from '../../components/AttachmentsCell';
import AppButton from '../../components/AppButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import {
  CreateAiAgent,
  FetchAgentViaEmail,
  UpdateAgentData,
  UpdateAtwinData,
} from '../../services/AgentServices';
import {Routes} from '../../fonts/routers/Routes';
import {Toast} from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { updatePiData } from '../../redux/piDataSlice';

export const EditProfileHome = () => {
  const [piData, setpiData] = React.useState<any>({});
  const [userName, setUserName] = React.useState<string>('');
  const [firstName, setfirstName] = React.useState<string>('');
  const [lastname, setlastname] = React.useState<string>('');
  const [email, setemail] = React.useState<string>('');
  const [userToken, setuserToken] = React.useState<string>('');
  const [userPic, setuserPic] = React.useState<string>('');
  const [countryCode, setCountryCode] = useState('+91');
  const [occupation, setoccupation] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [show, setShow] = useState(false);
  const [daysAvailabilityArray, setdaysAvailabilityArray] = useState<any>([]);
  const [hoursArray, sethoursArray] = useState<any>([]);
  const [exceptionArray, setexceptionArray] = useState<any>([]);
  const [attachments, setattachments] = useState<any>([]);
  const [supportedDocs, setsupportedDocs] = useState([]);
  const [agentId, setAgentId] = useState('');
  const [twinId, settwinId] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const [bio, setBio] = useState('');
  const dispatch = useDispatch()
  const navigation = useNavigation();
  //  const userPic = 'https://fastly.picsum.photos/id/143/200/300.jpg?hmac=LXGdX9PiyshH-j3_aFp9tazDDPkI0CDtwP-Q4EXBSoA'

  let working_hours = [
    {
      day: 'Monday',
      start_time: '09:00',
      end_time: '17:00',
      _id: '672062c795ab95da7489ce37',
      isSelected: true,
    },
    {
      day: 'Tuesday',
      start_time: '09:00',
      end_time: '17:00',
      _id: '672062c795ab95da7489ce38',
      isSelected: true,
    },
    {
      day: 'Wednesday',
      start_time: '09:00',
      end_time: '17:00',
      _id: '672062c795ab95da7489ce39',
      isSelected: true,
    },
    {
      day: 'Thursday',
      start_time: '09:00',
      end_time: '17:00',
      _id: '672062c795ab95da7489ce3a',
      isSelected: true,
    },
    {
      day: 'Friday',
      start_time: '09:00',
      end_time: '17:00',
      _id: '672062c795ab95da7489ce3b',
      isSelected: true,
    },
    {
      day: 'Saturday',
      start_time: '10:00',
      end_time: '15:00',
      _id: '672062c795ab95da7489ce3c',
      isSelected: true,
    },
    {
      day: 'Sunday',
      start_time: 'Closed',
      end_time: 'Closed',
      _id: '672062c795ab95da7489ce3d',
      isSelected: false,
    },
  ];

  React.useEffect(() => {
    getUserData();
    setdaysAvailabilityArray(working_hours);
    sethoursArray(hoursPerDay);
  }, []);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setattachments(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const matchWorkingHours = (workingHours: any, daysArray: any) => {
    const workingHoursIds = new Set(workingHours.map(item => item.day));
    daysArray.forEach(day => {
      day.isSelected = workingHoursIds.has(day.day);
    });
    console.log('daysArray__', daysArray);
    return daysArray;
  };

  const dummyAttachments: ArrayLike<any> | null | undefined = [
    // {
    //   id: '1a2b3c',
    //   name: 'John Doe',
    //   availabilityTimeRange: '9:00 AM - 5:00 PM',
    //   contactNumber: '+1234567890',
    //   postedAgo: '2h ago',
    // },
  ];

  const hoursPerDay = [
    {
      id: '1a2b3c',
      start_time: '09:00',
      end_time: '12:00',
      isSelected: false,
    },
    {
      id: '2b3c4d',
      start_time: '12:00',
      end_time: '15:00',
      isSelected: false,
    },
    {
      id: '3c4d5e',
      start_time: '15:00',
      end_time: '18:00',
      isSelected: false,
    },
    {
      id: '4d5e6f',
      start_time: '18:00',
      end_time: '21:00',
      isSelected: false,
    },
    {
      id: '5e6f7g',
      start_time: '09:00',
      end_time: '17:00',
      isSelected: false,
    },
  ];

  useEffect(() => {
    setUserName(firstName + ' ' + lastname);
  }, [firstName, lastname]);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('userData__', userData);

      let agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));
      // console.log('_____', agentData);

      if (get(agentData, 'agent._id', '')) {
        setAgentId(get(agentData, 'agent._id', ''));
        settwinId(get(agentData, 'atwin._id', ''));

        console.log('country_code', get(agentData, 'user.country_code', ''));

        setpiData(userData);
        dispatch(updatePiData(userData))
        setuserPic(get(userData, 'user.photo', ''));
        setUserName(
          get(agentData, 'agent.first_name', '') +
            ' ' +
            get(agentData, 'agent.last_name', ''),
        );
        setfirstName(get(agentData, 'agent.first_name', ''));
        setlastname(get(agentData, 'agent.last_name', ''));
        setBio(get(agentData, 'atwin.brief_summary', ''));
        setemail(get(userData, 'user.email', ''));
        setmobileNumber(get(agentData, 'agent.mobile_number', ''));
        setCountryCode(get(agentData, 'agent.country_code', ''));

        matchWorkingHours(
          get(agentData, 'atwin.availability.working_hours', []),
          working_hours,
        );

        hoursPerDay.forEach(slot => {
          if (
            slot.start_time ==
              get(
                agentData,
                'atwin.availability.working_hours[0].start_time',
                '',
              ) &&
            slot.end_time ==
              get(agentData, 'atwin.availability.working_hours[0].end_time', '')
          ) {
            slot.isSelected = true;
          }
        });

        console.log('hoursPerDay',hoursPerDay);
        

        sethoursArray(hoursPerDay);
      } else {
        setpiData(userData);
        setuserPic(get(userData, 'user.photo', ''));
        setUserName(get(userData, 'user.displayName', ''));
        setfirstName(
          get(userData, 'additionalUserInfo.profile.given_name', ''),
        );
        setlastname(
          get(userData, 'additionalUserInfo.profile.family_name', ''),
        );
        setBio(get(userData, 'user.bio', ''));
        setemail(get(userData, 'user.email', ''));
      }
      setuserToken(get(userData, 'token', ''));
      return userData;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const getSelectedWorkingHours = (hours: any) => {

    const selectedHours = hoursArray.filter(hour => hour.isSelected)

    console.log('selectedHours____',selectedHours);
    

    console.log("_____________",hours
      .filter(item => item.isSelected)
      .map(({ isSelected, ...rest }:any) => rest)
      .map(item => ({
        ...item,
        start_time: selectedHours[0]?.start_time,
        end_time: selectedHours[0]?.end_time
      }))
     )

    return hours
    .filter(item => item.isSelected)
    .map(({ isSelected, ...rest }:any) => rest)
    .map(item => ({
      ...item,
      start_time:selectedHours[0]?.start_time,
      end_time: selectedHours[0]?.end_time
    }))

  };

  const onSaveAndContinue = async () => {
    if (
      !userName.toString().trim() ||
      !firstName.toString().trim() ||
      !lastname.toString().trim() ||
      !mobileNumber.toString().trim()
    ) {
      Toast.show(Constants.AllFieldsWarningMessage);
      return;
    }

    let agentObj = {
      first_name: firstName,
      last_name: lastname,
      email: email,
      mobile_number: mobileNumber,
      country_code: countryCode,
      availability: {
        working_hours: getSelectedWorkingHours(daysAvailabilityArray),
      },
      brief_summary: bio,
    };

    console.log(
      'getSelectedWorkingHours(daysAvailabilityArray)',
      getSelectedWorkingHours(daysAvailabilityArray),
    );

    if (!agentId) {
      Toast.show(Constants.agentIdError);
      return;
    }

    let twinObj = {
      auto_answer_enabled: true,
      brief_summary: bio,
      availability: {
        working_hours: getSelectedWorkingHours(daysAvailabilityArray),
      },
    };

    setLoading(true);
    console.log(agentObj);
    
    let agentCreate = await UpdateAgentData(agentObj, userToken, agentId);
    let twinCreate = await UpdateAtwinData(twinObj, twinId);
    console.log('agentUpdated__', agentCreate);
    console.log('twinCreate___', twinCreate);
    if (get(agentCreate, '_id', false)) {
      await AsyncStorage.setItem('@isAgentCreated', 'yes');
      navigation.goBack();
    }
    setLoading(false);
  };

  const toggleSelectionDays = (id: any) => {
    // setdaysAvailabilityArray((prevArray: any) =>
    //   prevArray.map((item: any) =>
    //     item.id === id ? {...item, isSelected: !item.isSelected} : item,
    //   ),
    // );

    // setdaysAvailabilityArray() working_hours

    setdaysAvailabilityArray((prevArray: any) =>
      prevArray.map((item: any) =>
        item._id === id ? {...item, isSelected: !item.isSelected} : item,
      ),
    );
  };

  const toggleSelectionHours = (id: any) => {
    sethoursArray((prevArray: any) =>
      prevArray.map((item: any) =>
        item.id === id
          ? {...item, isSelected: true}
          : {...item, isSelected: false},
      ),
    );
  };

  const toggleSelectionException = (id: any) => {
    setexceptionArray((prevArray: any) =>
      prevArray.map((item: any) =>
        item.id === id ? {...item, isSelected: !item.isSelected} : item,
      ),
    );
  };

  const openImagePicker = async () => {
    ImageCropPicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        setuserPic(get(image, 'path', ''));
        // setImageUploading(true);
        // let result = await UploadProfilePic(get(image, 'path', ''));
        // if (result) {
        //   await UpdateSinglePiData('profileDownloadURL', result);
        //   setImageUploading(false);
        //   setProfilePic(result);
        //   getUserProfileDetails();
        // }
      })
      .catch(err => {
        console.log('userCancelled', err);
      });
  };

  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={1}
        bgcolor={Colors.white}
      />

      <TwoIconsHeader
        leftTitle={Constants.updateAvailability}
        secondIconSrc={<NotePencil size={26} color={Colors.originalBlue} />}
        secondIcon={false}
        onPressSecondIcon={() => {}}
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
          {/* <View>
            {userPic ? (
              <TouchableOpacity onPress={openImagePicker}>
                <View style={styles.userPicView}>
                  <FastImage
                    source={{uri: userPic}}
                    style={styles.userPic}></FastImage>

                  <View style={styles.cameraView}>
                    <Camera size={18} color={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={openImagePicker}>
                <View
                  style={{
                    height: AutoScaledFont(150),
                    width: AutoScaledFont(150),
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
                    {(userName || 'AH')?.substring(0, 2)?.toUpperCase()}
                  </Text>

                  <View style={styles.cameraView}>
                    <Camera size={18} color={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View> */}

          <View style={{marginVertical: AutoScaledFont(10), flex: 1}}>
            {/* <Text style={styles.nameTitle}>{Constants.displayName}</Text> */}
            {/* <View
              style={[
                styles.displayContainer,
                {flexDirection: 'row', borderWidth: 0},
              ]}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {
                    height: AutoScaledFont(60),
                    padding: AutoScaledFont(5),
                    backgroundColor: Colors.lighterGray,
                    justifyContent: 'center',
                    alignContent: 'center',
                    flex: 1,
                    borderRadius: AutoScaledFont(10),
                  },
                ]}
                placeholder={Constants.displayName}
                multiline={false}
                value={userName}
                editable={false}
                onChangeText={setUserName}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>

              <CheckCircle
                size={28}
                color={Colors.white}
                style={{alignSelf: 'center', marginStart: AutoScaledFont(5)}}
              />
            </View> */}

            {/* <Text style={styles.nameTitle}>
              {Constants.firstName}
              {'*'}
            </Text>
            <View style={styles.displayContainer}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {height: AutoScaledFont(50), padding: AutoScaledFont(5)},
                ]}
                placeholder={Constants.firstName}
                multiline={false}
                value={firstName}
                onChangeText={setfirstName}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>
            </View> */}

            {/* <Text style={styles.nameTitle}>
              {Constants.lastName}
              {'*'}
            </Text>
            <View style={styles.displayContainer}>
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

            {/* <Text style={styles.nameTitle}>
              {Constants.mobileNo}
              {'*'}
            </Text>
            <View style={[{flexDirection: 'row'}]}>
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
                      {fontFamily: 'Poppins-Medium'},
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
            </View> */}

            {/* <Text style={styles.nameTitle}>
              {Constants.email}
              {'*'}
            </Text>
            <View
              style={[
                styles.displayContainer,
                {flexDirection: 'row', borderWidth: 0},
              ]}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {
                    height: AutoScaledFont(60),
                    padding: AutoScaledFont(5),
                    backgroundColor: Colors.lighterGray,
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: AutoScaledFont(10),
                  },
                ]}
                placeholder={Constants.email}
                multiline={false}
                value={email}
                editable={false}
                onChangeText={setemail}
                placeholderTextColor={Colors.gray}></TextInput>

              <CheckCircle
                size={28}
                color={Colors.greenHex}
                style={{alignSelf: 'center', marginStart: AutoScaledFont(5)}}
              />
            </View> */}

            {/* <Text style={styles.nameTitle}>{Constants.occupation}</Text>
            <View style={styles.displayContainer}>
              <TextInput
                style={[
                  styles.textInputTextCentered,
                  {height: AutoScaledFont(50), padding: AutoScaledFont(5)},
                ]}
                placeholder={Constants.occupation}
                multiline={false}
                value={occupation}
                onChangeText={setoccupation}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>
            </View> */}

            {/* <View style={{flexDirection: 'row', marginTop: AutoScaledFont(40)}}>
              <Text style={[styles.attachments, {flex: 1}]}>
                <Text>{Constants.Certificates}</Text>
                <Text
                  style={[styles.optionalHint, {fontSize: AutoScaledFont(18)}]}>
                  {Constants.Optional}
                </Text>
              </Text>

              <TouchableOpacity onPress={handleDocumentSelection}>
                <Plus size={22} weight={'bold'} />
              </TouchableOpacity>
            </View> */}

            {/* <FlatList
              data={dummyAttachments}
              renderItem={({item}) => <AttachmentsCell item={item} />}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={false}
              numColumns={2}
            /> */}

            {/* {<View style={styles.mediumdDevider}></View>} */}

            {/* {<View style={styles.largeDevider}></View>} */}

            {/* <Text style={styles.twinTitle}>{Constants.twin}</Text>
            <Text style={styles.optionalHint}>{Constants.twinHint}</Text> */}

            {/* <Text
              style={[
                styles.attachments,
                {flex: 1, marginVertical: AutoScaledFont(20)},
              ]}>
              <Text>{Constants.about}</Text>
              <Text
                style={[styles.optionalHint, {fontSize: AutoScaledFont(18)}]}>
                {Constants.Optional}
              </Text>
            </Text> */}

            {/* <View style={styles.displayContainer}>
              <TextInput
                style={styles.textInputText}
                placeholder={Constants.about}
                multiline={true}
                value={bio}
                onChangeText={setBio}
                placeholderTextColor={Colors.headerThreeColor}></TextInput>
            </View> */}

            <Text
              style={[
                styles.attachments,
                {fontFamily: 'Poppins-SemiBold', marginTop: AutoScaledFont(1)},
              ]}>
              {Constants.availability}
            </Text>

            {/* <Text style={[styles.attachments]}>{Constants.availability}</Text> */}

            <FlatList
              data={daysAvailabilityArray}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => toggleSelectionDays(item._id)}>
                  <AttachmentsCell
                    item={item}
                    showClose={false}
                    title={get(item, 'day', '')}
                    isSelected={get(item, 'isSelected', false)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => get(item, '_id', '')}
              scrollEnabled={false}
              numColumns={3}
            />

            <Text style={[styles.attachments, {marginTop: AutoScaledFont(20)}]}>
              {Constants.hoursPerDay}
            </Text>

            <FlatList
              data={hoursArray}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => toggleSelectionHours(item.id)}>
                  <AttachmentsCell
                    item={item}
                    showClose={false}
                    title={
                      get(item, 'start_time', '') +
                      ' - ' +
                      get(item, 'end_time', '')
                    }
                    isSelected={get(item, 'isSelected', false)}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={false}
              numColumns={2}
            />

            {/* <View
              style={{
                flexDirection: 'row',
                marginVertical: AutoScaledFont(30),
              }}>
              <Text style={[styles.attachments, {flex: 1}]}>
                <Text>{Constants.supportedDocuments}</Text>
                <Text
                  style={[styles.optionalHint, {fontSize: AutoScaledFont(18)}]}>
                  {Constants.Optional}
                </Text>
              </Text>

              <TouchableOpacity onPress={handleDocumentSelection}>
                <Plus size={22} weight={'bold'} />
              </TouchableOpacity>
            </View> */}

            {/* <FlatList
              data={dummyAttachments}
              renderItem={({item}) => <AttachmentsCell item={item} />}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={false}
              numColumns={2}
            /> */}
          </View>

          <AppButton
            onPressContinue={() => onSaveAndContinue()}
            gradientColor={Colors.secondaryGradient}
            textColor={Colors.primary}
            loading={loading}
            buttonWidth={'90%'}
            buttonTitle={Constants.save}
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
    </View>
  );
};

const styles = StyleSheet.create({
  nameTitle: {
    fontSize: AutoScaledFont(20),
    marginTop: AutoScaledFont(25),
    marginBottom: AutoScaledFont(2),
    marginHorizontal: AutoScaledFont(5),
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
    padding: AutoScaledFont(5),
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
});
