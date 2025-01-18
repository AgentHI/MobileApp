import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {get} from 'lodash';
import {Routes} from '../../fonts/routers/Routes';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/HomeHeader';
import BottomQucikActionModal from '../../components/Modal/BottomQuickActionModal';
import LottieView from 'lottie-react-native';
import {BellSimple, Calendar, Users} from 'phosphor-react-native';
import TwoIconsHeader from '../../components/TwoIconsHeader';

export const QuickAction = () => {
  const [piData, setpiData] = React.useState<any>({});
  const [showModal, setshowModal] = React.useState<boolean>(true);
  const navigation = useNavigation();
  const useFouced = useIsFocused();
  const slideAnim = useRef(new Animated.Value(300)).current; // Initial position off-screen (adjust 300 as needed)

  useEffect(() => {
    if (useFouced) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [useFouced]);

  const createNewMeet = () => {
    setTimeout(() => {
      // navigation.navigate(Routes.CreateNewMeeting)
      navigation.navigate(Routes.AddClient);
    }, 50);
  };

  const createNewAppointment = () => {
    setTimeout(() => {
      navigation.navigate(Routes.CreateNewMeeting);
    }, 50);
  };

  const createNewReminder = () => {
    setTimeout(() => {
      navigation.navigate(Routes.Reminders);
    }, 50);
  };

  return (
    <View style={{backgroundColor: Colors.primary, flex: 1}}>
      {useFouced && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}
      <TwoIconsHeader
        leftTitle={Constants.QuickAction}
        secondIcon={false}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={true}
        deviderHeight={0.5}
      />

      <View
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
          justifyContent: 'center',
        }}>
        {useFouced && (
          <LottieView
            style={[
              styles.referateAiAnimation,
              {height: AutoScaledFont(100), width: AutoScaledFont(100)},
            ]}
            source={require('../../animations/superflash_white.json')}
            autoPlay
            loop={false}
            speed={1}
          />
        )}

        {useFouced && (
          <Animated.View
            style={[
              styles.bottomSheet,
              {transform: [{translateY: slideAnim}]},
            ]}>
            <Text style={styles.headerLine}>{Constants.createANew}</Text>

            <View style={styles.innerView}>
              <Pressable onPress={() => createNewMeet()}>
                <View style={styles.buttonContainer}>
                  <Users size={20} color={Colors.primary} />
                  <Text style={styles.buttonText}>{Constants.client}</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => createNewAppointment()}>
                <View style={styles.buttonContainer}>
                  <Calendar size={20} color={Colors.primary} />
                  <Text style={styles.buttonText}>{Constants.Appointment}</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => createNewReminder()}>
                <View style={styles.buttonContainer}>
                  <BellSimple size={20} color={Colors.primary} />
                  <Text style={styles.buttonText}>{Constants.Reminder}</Text>
                </View>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>

      {/* <BottomQucikActionModal
        isVisible={showModal}
        onClose={() => setshowModal(false)}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(26),
    color: Colors.secondaryLightIcons,
    fontFamily: 'Poppins-Regular',
  },
  referateAiAnimation: {
    alignSelf: 'center',
    marginTop: -AutoScaledFont(20),
    opacity: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    borderTopWidth: AutoScaledFont(0.5),
    borderRightWidth: AutoScaledFont(0.5),
    borderLeftWidth: AutoScaledFont(0.5),
    marginHorizontal: AutoScaledFont(20),
    marginBottom: AutoScaledFont(30),
    borderRadius: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(25),
    borderColor: Colors.gray,
    backgroundColor: Colors.primary,
    alignSelf: 'center',

    // Shadow properties for iOS
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,

    // Shadow properties for Android
    elevation: 10,
  },
  innerView: {
    flexDirection: 'row',
  },
  buttonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: AutoScaledFont(130),
    maxWidth: AutoScaledFont(180),
    marginHorizontal: AutoScaledFont(5),
    backgroundColor: Colors.lighterGray,
    padding: AutoScaledFont(20),
    borderRadius: AutoScaledFont(10),
    shadowColor: Colors.lighterGray,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    marginTop: AutoScaledFont(5),
    fontSize: AutoScaledFont(15),
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    textAlign: 'center',
  },
  headerLine: {
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(10),
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#f2f3f4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
});
