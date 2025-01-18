import * as React from 'react';
import {View, StyleSheet, Text, Pressable, Platform} from 'react-native';
import LottieView from 'lottie-react-native';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import FastImage from 'react-native-fast-image';

interface AiLogoProps {
  isVisible: boolean;
  onPressIcon?: () => void;
  speed?: number;
  selected?: boolean;
  size?: number;
}

const AiLogo = (props: AiLogoProps) => {
  let {
    isVisible = false,
    onPressIcon,
    speed = 1,
    selected = false,
    size = 36,
  } = props;

  React.useEffect(() => {}, []);

  return (
    <Pressable onPress={onPressIcon}>
      <View>
        {/* <LottieView
          style={[
            styles.referateAiAnimation,
            {height: AutoScaledFont(size), width: AutoScaledFont(size)},
          ]}
          // source={require('../../../animations/AIButtonAnim1.json')}
          source={require('../../animations/amibaAnim.json')}
          autoPlay
          loop
          speed={speed}
        /> */}
        {
          <FastImage
            source={require('../../images/logo.png')}
            style={{
              height: AutoScaledFont(36),
              width: AutoScaledFont(36),
              marginTop: AutoScaledFont(15),
              // position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              alignContent: 'center',
              // backgroundColor:Colors.white
              // bottom: Platform.OS == 'ios'?  '42%' : '25%',
            }}
            resizeMode="contain"
          />
        }
      </View>
    </Pressable>
  );
};

export default AiLogo;

const styles = StyleSheet.create({
  container: {
    marginBottom: AutoScaledFont(5),
  },
  referateAiAnimation: {
    alignSelf: 'center',
    marginTop: -AutoScaledFont(0),
    // backgroundColor:Colors.white
  },
  aiText: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    bottom: Platform.OS == 'ios' ? '32%' : '25%',
    fontFamily: 'Poppins-Medium',
    color: Colors.primaryBlue,
    fontSize: AutoScaledFont(14),
  },
});
