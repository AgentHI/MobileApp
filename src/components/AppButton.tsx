import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AutoScaledFont, getPrimaryButtonHeight} from '../config/Size';
import {Constants} from '../constants/Constants';
import {Colors} from '../constants/Colors';

interface AppButtonProps {
  onPressContinue: () => void;
  gradientColor: (string | number)[];
  textColor: string;
  buttonWidth: DimensionValue;
  loading: boolean;
  showIcon?: boolean;
  buttonTitle?: string;
  buttonStyle?: any;
}

const AppButton = (props: AppButtonProps) => {
  let {
    onPressContinue,
    gradientColor,
    textColor,
    buttonWidth,
    loading,
    buttonTitle,
    buttonStyle
  } = props;
  // const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <View>
      <Pressable
        // onPress={() => navigation.navigate(Routes.PersonalInformation)}
        onPress={onPressContinue}>
        <LinearGradient
          colors={gradientColor}
          useAngle={true}
          angle={90}
          style={[styles.nextButtonLG, {width: buttonWidth}, buttonStyle]}>
          <View style={{flexDirection: 'row'}}>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={textColor}></ActivityIndicator>
            ) : (
              <Text style={[styles.signUpText, {color: textColor}]}>
                {buttonTitle}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  nextButtonLG: {
    height: getPrimaryButtonHeight(),
    borderRadius: AutoScaledFont(10),
    marginVertical: AutoScaledFont(40),
    borderWidth: 1,
    borderColor: Colors.secondary,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontSize: AutoScaledFont(20),
  },
  logo_: {
    height: AutoScaledFont(25),
    width: AutoScaledFont(25),
    justifyContent: 'center',
    alignSelf: 'center',
    marginEnd: AutoScaledFont(10),
  },
});
