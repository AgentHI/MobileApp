import * as React from 'react';
import { Text, View, StyleSheet, Image, Linking } from 'react-native';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import Modal from 'react-native-modal';
import { Constants } from '../../constants/Constants';
import PrimaryButton from '../PrimaryButton';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { clone, get, set } from 'lodash';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Routes } from '../../fonts/routers/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CheckAgentViaEmail,
  CreateAiAgent,
  pushTokens,
} from '../../services/AgentServices';
import { authorize } from 'react-native-app-auth';

interface GoogleSignUpModalProps {
  isVisible: boolean;
  onPressGoogleButton: () => void;
  onPressEmailButton: () => void;
  onClose: () => void;
  backdropOpacity?: number;
  loading?: boolean;
}

const GoogleSignUpModal = (props: GoogleSignUpModalProps) => {
  let {
    isVisible = false,
    onPressGoogleButton,
    onClose,
    onPressEmailButton,
    backdropOpacity = 0.4,
  } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [prevLoginMethod, setPrevLoginMethod] = React.useState<string>('');
  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId: Constants.Secrets.GoogleWebClientId,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'profile',
      'email',
    ],
    offlineAccess: true,
  });

  const getPrevLoginMethod = async () => {
    setLoading(true);
    const loginMethod = await AsyncStorage.getItem('@login_method');
    setPrevLoginMethod(loginMethod ?? '');
    setLoading(false);
  }

  React.useEffect(() => {
    getPrevLoginMethod();
  }, []);

  const sendAuthCodeToBackend = async code => {
    try {
      const response = await fetch(
        'https://api.test.agenthi.ai:443/api/agents/authenticate/google/android',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
          }),
        },
      );

      const data = await response.json();
      console.log('Backend response:', data);
      // Handle the backend response as needed
    } catch (error) {
      console.error('Error sending code to backend:', error);
    }
  };

  const openTCUrl = () => {
    Linking.openURL(Constants.TermAndConditionUrl);
  };

  const openPPUrl = () => {
    Linking.openURL(Constants.PrivacyPolicyUrl);
  };


  const handleGoogleLogin = async () => {
    setLoading(true);
    isVisible = false;
    try {
      console.log('handleGoogleLogin');
      const userInfo = await GoogleSignin.signIn();
      const { idToken, user } = get(userInfo, 'data', {});
      console.log('userInfo__', userInfo);

      if (idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        console.log('googleCredential', googleCredential);
        const isSignedIn = await auth().signInWithCredential(googleCredential);
        console.log('isSignedIn', isSignedIn);
        await saveUserData(isSignedIn, idToken);
        if (
          get(isSignedIn, 'user.emailVerified', false) ||
          get(isSignedIn, 'additionalUserInfo.profile.emailVerified', false)
        ) {
          let ifExist = await CheckAgentViaEmail(
            get(isSignedIn, 'user.email', ''),
          );
          console.log('ifExist__', ifExist);

          await AsyncStorage.setItem('@login_method', "google");

          if (get(ifExist, 'agent._id', false)) {
            console.log('agent already exist');
            navigation.dispatch(StackActions.replace(Routes.HomeTabbar));
          } else {
            console.log('agent creation is in progress');
            navigation.dispatch(StackActions.replace(Routes.EditProfile));
          }

          onClose();
        }
      }
    } catch (apiError) {
      // setError(
      // 	apiError?.response?.data?.error?.message || 'Something went wrong'
      // );
      // handleGoogleLogin()

      console.log('handleGoogleLogin', apiError);
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async (userData: any, idToken: string) => {
    try {
      let userData1 = { ...userData, token: idToken };
      const jsonValue = JSON.stringify(userData1);
      await AsyncStorage.setItem('@user_data', jsonValue);
      console.log('User data saved successfully');
    } catch (e) {
      console.error('Error saving user data', e);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={backdropOpacity}>
      <View
        style={{
          height: '50%',
          marginTop: 'auto',
          marginHorizontal: AutoScaledFont(-25),
          marginBottom: AutoScaledFont(-25),
          borderTopStartRadius: AutoScaledFont(20),
          borderTopEndRadius: AutoScaledFont(20),
          backgroundColor: Colors.white,
          alignContent: 'center',
        }}>
        {/* <View
          style={{
            height: AutoScaledFont(4),
            backgroundColor: Colors.headerThreeColor,
            marginTop: AutoScaledFont(15),
            width: AutoScaledFont(80),
            alignSelf: 'center',
          }}></View> */}
        <View
          style={{
            marginTop: AutoScaledFont(30),
            height: '100%',
            backgroundColor: Colors.white,
          }}>
          <Image
            source={require('../../images/logo.png')}
            resizeMode="contain"
            style={styles.logo_}></Image>

          <View>
            <Text style={styles.headerTwo}>{Constants.continueToSignUp}</Text>
            <Text style={styles.headerThree}>{Constants.weWillLogYouIn}</Text>
            <PrimaryButton
              onPressContinue={onPressEmailButton}
              gradientColor={Colors.ghostWhiteGradient}
              textColor={Colors.black}
              loading={loading}
              buttonWidth={'80%'}
              title={prevLoginMethod === 'email' ? Constants.continueUsingEmail : Constants.loginUsingEmail}
              showIcon={false}
            />

            <PrimaryButton
              onPressContinue={handleGoogleLogin}
              gradientColor={Colors.secondaryGradient}
              textColor={Colors.black}
              loading={loading}
              buttonWidth={'80%'}
              title={prevLoginMethod === 'google' ? Constants.continueUsingGoogle : Constants.loginUsingGoogle}
            />

            <Text
              style={{
                textAlign: 'center',
                marginHorizontal: AutoScaledFont(30),
                marginTop: AutoScaledFont(20),
              }}>
              <Text style={styles.grayedText}>{Constants.byContinuing}</Text>
              <Text
                style={[styles.bluedText, { color: Colors.originalBlue }]}
                onPress={openTCUrl}>
                {' '}
                {Constants.termAndConditions}
              </Text>
              <Text style={styles.grayedText}> {Constants.and}</Text>
              <Text
                style={[styles.bluedText, { color: Colors.originalBlue }]}
                onPress={openPPUrl}>
                {' '}
                {Constants.privacyPolicy}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoogleSignUpModal;

const styles = StyleSheet.create({
  container: {},
  logo_: {
    height: AutoScaledFont(70),
    width: AutoScaledFont(70),
    marginBottom: AutoScaledFont(30),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerTwo: {
    fontSize: AutoScaledFont(30),
    fontFamily: 'Poppins-semiBold',
    color: Colors.primary,
    textAlign: 'center',
  },
  headerThree: {
    fontSize: AutoScaledFont(16),
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(20),
    fontFamily: 'Poppins-regular',
    color: Colors.primary,
    textAlign: 'center',
  },
  grayedText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(15),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.gray,
  },
  orText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(16),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginHorizontal: AutoScaledFont(2),
    color: Colors.gray,
  },
  bluedText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(15),
    marginStart: AutoScaledFont(5),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.originalBlue,
  },
});
