import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  DimensionValue,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {AutoScaledFont, getPrimaryButtonHeight} from '../config/Size';
import {Constants} from '../constants/Constants';
import {Colors} from '../constants/Colors';

interface PrimaryButtonProps {
  onPressContinue: () => void;
  gradientColor: (string | number)[];
  textColor: string;
  buttonWidth: DimensionValue;
  loading: boolean;
  showIcon?: boolean;
  title: string;
}

const PrimaryButton = (props: PrimaryButtonProps) => {
  let {
    onPressContinue,
    gradientColor,
    textColor,
    buttonWidth,
    loading,
    title,
    showIcon=true,
  } = props;
  // const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <View>
      <Pressable onPress={onPressContinue}>
        <LinearGradient
          colors={gradientColor}
          useAngle={true}
          angle={90}
          style={[styles.nextButtonLG, {width: buttonWidth}]}>
          <View>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={textColor}></ActivityIndicator>
            ) : (
              <View style={{flexDirection: 'row'}}>
                {showIcon && (
                  <Image
                    source={require('../images/GoogleIcon.png')}
                    resizeMode="contain"
                    style={styles.logo_}></Image>
                )}
                <Text style={[styles.signUpText, {color: textColor}]}>
                  {title}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  nextButtonLG: {
    height: getPrimaryButtonHeight(),
    borderRadius: AutoScaledFont(10),
    marginVertical: AutoScaledFont(6),
    borderWidth: 1,
    borderColor: Colors.secondary,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontSize: AutoScaledFont(16),
  },
  logo_: {
    height: AutoScaledFont(25),
    width: AutoScaledFont(25),
    justifyContent: 'center',
    alignSelf: 'center',
    marginEnd: AutoScaledFont(10),
  },
});
