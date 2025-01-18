import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {StackActions, useNavigation} from '@react-navigation/native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import AppButton from '../../components/AppButton';
import {Colors} from '../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import {AutoScaledFont} from '../../config/Size';
import {
  CheckAgentViaEmail,
  pushTokens,
  SendOtp,
  VerifyOtp,
} from '../../services/AgentServices';
import {isValidEmail, TOAST_} from '../../config/Utils';
import {GetFcmToken} from '../../services/NotificationService';
import {Routes} from '../../fonts/routers/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateAgentData_ } from '../../redux/piDataSlice';
import { FetchAppointmentSlots } from '../../services/AppointmentService';

const EditEmail = ({route}: any) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [OTP, SET_OTP] = useState('');
  const [email, setEmail] = useState('');
  const [otpView, showOtpView] = useState(false);
  const [showResendOtp, setshowResendOtp] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [step, setStep] = useState(1);
  const [loading_, setLoading_] = useState<boolean>(false);
  const [timer, setTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpView && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setshowResendOtp(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpView, timer]);

  const LetsSentOtp = async () => {
    if (!email?.trim() || !isValidEmail(email?.trim())) {
      return;
    }

    setshowResendOtp(false);
    setTimer(60);
    setLoading_(true);
    Keyboard.dismiss();

    try {
      let isOtp = await SendOtp(email);
      if (get(isOtp, 'message', '')) {
        setStep(2);
        showOtpView(true);
      } else {
        showOtpView(false);
      }
    } catch (error) {}

    setLoading_(false);
  };

  const VerifyTheOtp = async () => {
    if (!OTP) {
      return;
    }

    setLoading_(true);
    Keyboard.dismiss();

    let data = {
      contact: email,
      otp: OTP,
    };

    let isOtp = await VerifyOtp(data);
    if (get(isOtp, 'message', '')) {
      setStep(2);
      showOtpView(true);

      let ifExist: any;
      try {
        ifExist = await CheckAgentViaEmail(email);
      } catch (error) {}
      await AsyncStorage.setItem('@login_method', "email");
      if (get(ifExist, 'agent._id', false)) {
        console.log('agent already exist');
        let modified = {user: ifExist?.agent, ...ifExist};
        console.log('modified__', modified);
        await saveUserData(modified, get(ifExist, 'agent.accessToken'));
        dispatch(updateAgentData_(ifExist));
        navigation.dispatch(StackActions.replace(Routes.HomeTabbar));
      } else {
        console.log('agent creation is in progress');
        navigation.dispatch(
          StackActions.replace(Routes.EditProfileWithoutToken, {_email: email}),
        );
      }
    } else {
      TOAST_(Constants.OTPFailed, 'danger')
      
      setAttempts(prevAttempts => prevAttempts + 1);
      if (attempts >= 2) {
        navigation.dispatch(StackActions.replace(Routes.Splash));
      }
    }

    setLoading_(false);
  };

  const saveUserData = async (userData: any, idToken: string) => {
    try {
      let userData1 = {...userData, token: idToken};
      const jsonValue = JSON.stringify(userData1);
      await AsyncStorage.setItem('@user_data', jsonValue);
      console.log('User data saved successfully');
    } catch (e) {
      console.error('Error saving user data', e);
    }
  };

  return (
    <View style={{backgroundColor: Colors.primary, flex: 1}}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={2}
        bgcolor={Colors.primary}
      />

      <TwoIconsHeader
        leftTitle={''}
        secondIcon={true}
        onPress={() => navigation.goBack()}
        isDeviderShown={false}
        backHidden={false}
        iconTint={Colors.white}
      />

      <Image
        source={require('../../images/AppNameLogo.png')}
        style={styles.appIcon}
        resizeMode="contain"
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: AutoScaledFont(20),
        }}>
        {otpView ? (
          <Text
            style={{
              margin: AutoScaledFont(20),
              fontFamily: 'Poppins-Medium',
              color: Colors.white,
              opacity: 0.8,
              textAlign: 'center',
            }}>
            {`Your OTP has been sent to the provided email ie ${email}`}
          </Text>
        ) : (
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            placeholderTextColor={Colors.gray}
            editable={true}
          />
        )}

        {!otpView ? (
          <Text
            style={{
              margin: AutoScaledFont(20),
              fontFamily: 'Poppins-Medium',
              color: Colors.white,
              opacity: 0.8,
              textAlign: 'center',
            }}>
            {
              'You will receive a verification OTP at the provided email address'
            }
          </Text>
        ) : (
          <View>
            <TextInput
              style={[styles.otpInput, styles.descriptionInput]}
              value={OTP}
              onChangeText={SET_OTP}
              placeholder="Enter OTP"
              placeholderTextColor={Colors.gray}
              editable={true}
              inputMode="numeric"
            />

            {showResendOtp ? (
              <TouchableOpacity onPress={() => LetsSentOtp()}>
                <Text
                  style={{
                    margin: AutoScaledFont(20),
                    fontFamily: 'Poppins-Medium',
                    color: Colors.secondary,
                    opacity: 0.8,
                    textAlign: 'center',
                  }}>
                  {'Resend-Otp'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  margin: AutoScaledFont(20),
                  fontFamily: 'Poppins-Medium',
                  color: Colors.secondary,
                  opacity: 0.8,
                  textAlign: 'center',
                }}>
                {`Resend OTP in ${timer} seconds`}
              </Text>
            )}
          </View>
        )}
      </View>

      {step == 1 ? (
        <AppButton
          onPressContinue={() => LetsSentOtp()}
          gradientColor={Colors.secondaryGradient}
          textColor={Colors.primary}
          loading={loading_}
          buttonWidth={'80%'}
          buttonTitle={Constants.continue}
        />
      ) : (
        <AppButton
          onPressContinue={() => VerifyTheOtp()}
          gradientColor={Colors.secondaryGradient}
          textColor={Colors.primary}
          loading={loading_}
          buttonWidth={'80%'}
          buttonTitle={Constants.continue}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    opacity: 0.3,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: Colors.black,
    backgroundColor: '#fff',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: AutoScaledFont(40),
    color: Colors.black,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    textAlignVertical: 'top',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#8FC9CB',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#2B3D4E',
    fontWeight: '500',
  },
  appIcon: {
    width: AutoScaledFont(250),
    height: AutoScaledFont(250),
    alignSelf: 'center',
    // backgroundColor:'red'
  },
});

export default EditEmail;
