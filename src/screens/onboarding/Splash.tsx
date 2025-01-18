import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {floatingLogoUpward} from '../../config/AnimUtils';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import GoogleSignUpModal from '../../components/Modal/GoogleSignUpModal';
import {Constants} from '../../constants/Constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Routes} from '../../fonts/routers/Routes';
import {
  StackActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckAgentViaEmail, pushTokens} from '../../services/AgentServices';
import {get} from 'lodash';
import {useDispatch} from 'react-redux';
import {updateAgentData_} from '../../redux/piDataSlice';
import {GetFcmToken} from '../../services/NotificationService';
import {TOAST_} from '../../config/Utils';

// GoogleSignin.configure({
//   webClientId: '',
//   // androidClientId: '',
//   iosClientId: '',
//   scopes: ['profile', 'email'],
// });

GoogleSignin.configure({
  webClientId: Constants.Secrets.GoogleWebClientId,
  scopes: [
    // 'https://www.googleapis.com/auth/calendar',
    // 'https://www.googleapis.com/auth/calendar.events',
    'profile',
    'email',
  ],
  offlineAccess: true,
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export const Splash = () => {
  let buttonTranslate = React.useRef(new Animated.Value(0))?.current;
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loading_, setLoading_] = React.useState<boolean>(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    handleGoogleLogin();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
      if (hasPreviousSignIn) {
        const userInfo = await GoogleSignin.signInSilently();
        let ifExist = {};
        try {
          ifExist = await CheckAgentViaEmail(
            get(userInfo, 'data.user.email', ''),
          );
        } catch (error) {}
        
        dispatch(updateAgentData_(ifExist));

        if (get(ifExist, 'agent', '')) {
          if (get(ifExist, 'agent._id', '')) {
            await pushTokens(
              get(userInfo, 'data.idToken', ''),
              get(userInfo, 'data.serverAuthCode', ''),
            )
              .then(data => {})
              .catch(error => {});
            setLoading(false);

            try {
              await GetFcmToken(get(ifExist, 'agent.accessToken', ''));
            } catch (error) {
              console.log('GetFcmTokenError', error);
            }

            navigation.dispatch(StackActions.replace(Routes.HomeTabbar));
          } else {
            setLoading(false);
            navigation.dispatch(StackActions.replace(Routes.EditProfile));
          }
        } else {
          TOAST_(
            `Server Unreachable: We're having trouble connecting. Please try again later.`,
            'danger',
            3000,
          );
        }
      } else {
        let jsonValue = await AsyncStorage.getItem('@user_data');
        let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log('userData__', userData);
        console.log('resu_______', get(userData, 'user._id', false));

        if (get(userData, 'user._id', false)) {
          navigation.dispatch(StackActions.replace(Routes.HomeTabbar));
        } else {
          setshowModal(true);
        }
      }
    } catch (apiError) {
      setshowModal(true);
      console.log('handleGoogleLogin', apiError);
    } finally {
    }
  };

  const sendToEmailScreen = () => {
    setshowModal(false);
    setTimeout(() => {
      navigation.navigate(Routes.EditEmail);
    }, 100);
  };

  React.useEffect(() => {
    floatingLogoUpward(buttonTranslate, AutoScaledFont(300), 2000);
    let startAnimateText = setTimeout(() => {
      // setshowModal(true);
    }, 1400);
    return () => {
      clearInterval(startAnimateText);
      // setshowModal(false);
    };
  }, []);

  return (
    <View style={{backgroundColor: Colors.primary, flex: 1}}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={2}
        bgcolor={Colors.primary}
      />
      <View>
        <Image
          source={require('../../images/splashFullF.png')}
          style={{
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            marginTop: -AutoScaledFont(10),
          }}
          resizeMode="cover"></Image>

        <Animated.View style={[{transform: [{translateY: buttonTranslate}]}]}>
          <Image
            source={require('../../images/AppNameLogo.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </Animated.View>

        <Text style={styles.craftedText}>{Constants.ByAppyouLabs}</Text>

        {loading_ && (
          <ActivityIndicator
            size={'small'}
            color={Colors.gray}
            style={{bottom: '10%'}}></ActivityIndicator>
        )}

        {showModal && (
          <Animated.View style={[{transform: [{translateY: buttonTranslate}]}]}>
            <GoogleSignUpModal
              isVisible={showModal}
              loading={loading}
              onPressGoogleButton={handleGoogleLogin}
              onPressEmailButton={sendToEmailScreen}
              onClose={() => setshowModal(false)}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  appIcon: {
    width: AutoScaledFont(250),
    height: AutoScaledFont(250),
    alignSelf: 'center',
    position: 'absolute',
  },
  craftedText: {
    alignSelf: 'center',
    color: Colors.white,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
    position: 'absolute',
    opacity: 0.5,
    fontSize: AutoScaledFont(14),
    bottom: 30,
  },
});
