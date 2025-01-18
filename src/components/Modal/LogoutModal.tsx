import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import Modal from 'react-native-modal';
import {Constants} from '../../constants/Constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  backdropOpacity?: number;
  loading?: boolean;
}

const LogoutModal = (props: LogoutModalProps) => {
  let {
    isVisible = false,
    onClose,
    backdropOpacity = 0.4,
    // loading,
  } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const navigation = useNavigation();

  const handleGoogleLogout = async () => {
    try {
      const signOut = await GoogleSignin.signOut();
      console.log('signOut', signOut);
      await AsyncStorage.removeItem('@isAgentCreated')
      await AsyncStorage.removeItem('@user_data')
      // navigation.navigate(Routes.Splash)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Splash' }], // Replace 'Login' with your login screen name
        })
      );

    } catch (apiError) {
      console.log('handleGoogleLogin', apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={backdropOpacity}>
      <View
        style={{
          height: AutoScaledFont(220),
          borderRadius: AutoScaledFont(20),
          justifyContent:'center',
          backgroundColor: Colors.white,
        }}>
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <View>
            <Text style={{textAlign: 'center'}}>
              <Text style={styles.headerTwo}>
                {Constants.areYouSureWantToLogout}
              </Text>
              <Text style={styles.logoutText}>{Constants.logout}</Text>
            </Text>

            <View
              style={{
                marginTop: AutoScaledFont(20),
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Pressable onPress={onClose}>
                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(30),
                    paddingVertical: AutoScaledFont(10),
                    backgroundColor: Colors.lighterGray,
                    alignSelf: 'center',
                    borderRadius: AutoScaledFont(10),
                    marginHorizontal: AutoScaledFont(10),
                  }}>
                  <Text style={styles.buttonText}>{Constants.cancel}</Text>
                </View>
              </Pressable>
              <Pressable onPress={handleGoogleLogout}>
                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(30),
                    paddingVertical: AutoScaledFont(10),
                    backgroundColor: Colors.secondary,
                    alignSelf: 'center',
                    borderRadius: AutoScaledFont(10),
                    marginHorizontal: AutoScaledFont(10),
                  }}>
                  <Text style={[styles.buttonText, {color: Colors.primary}]}>
                    {Constants.logout}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

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
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-Medium',
    color: Colors.red,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    textAlign: 'center',
  },
  headerThree: {
    fontSize: AutoScaledFont(16),
    marginTop: AutoScaledFont(5),
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
