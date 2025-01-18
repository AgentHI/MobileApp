import {
  View,
  Text,
  TouchableOpacity,
  ColorValue,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { ArrowLeft, NotePencil } from 'phosphor-react-native';
import { Colors } from '../constants/Colors';
import { AutoScaledFont, getPrimaryButtonHeight } from '../config/Size';
import { ReactNode } from 'react';



interface TwoIconsHeaderProps {
  title?: string;
  leftTitle?: string;
  onPress?: () => void;
  onPressSecondIcon?: () => void;
  leftTitleColor?: ColorValue;
  titleColor?: ColorValue;
  iconTint?: ColorValue;
  secondIcon?: boolean;
  backHidden?: boolean;
  secondIconSrc?: ReactNode,
  isDeviderShown?: boolean;
  iconSize?: number;
  titleFontSize?: number;
  titleOpacity?: number;
  deviderHeight?: number;
  otherIcons?: ReactNode;
}

const TwoIconsHeader = ({
  onPress,
  onPressSecondIcon,
  iconTint = Colors.originalBlue,
  backHidden,
  leftTitle,
  iconSize = 30,
  isDeviderShown = true,
  secondIcon,
  secondIconSrc,
  titleColor = Colors.primary,
  deviderHeight = 2,
  otherIcons
}: TwoIconsHeaderProps) => {
  return (
    <View>
      <View
        style={[
          styles.mainView,
          { marginTop: 10 },
        ]}>
        <TouchableOpacity onPress={onPress}>
          {!backHidden && (
            <View style={styles.iconView}>
              <ArrowLeft size={22} color={iconTint} />
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.rightText, { color: titleColor }]}>{leftTitle}</Text>

        {
          otherIcons
        }

        {secondIcon && (
          <TouchableOpacity onPress={onPressSecondIcon}>
            <View style={styles.secondicon}>
              {secondIconSrc}
            </View>
          </TouchableOpacity>
        )}
      </View>

      {isDeviderShown && <View style={[styles.mediumdDevider, { height: deviderHeight }]}></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Regular',
    paddingEnd: AutoScaledFont(20),
  },
  rightText: {
    fontSize: AutoScaledFont(22),
    marginStart: AutoScaledFont(10),
    fontFamily: 'Poppins-Medium',
    flex: 1,
    color: Colors.originalBlue,
  },
  mainView: {
    flexDirection: 'row',
    height: getPrimaryButtonHeight(),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: AutoScaledFont(15),
  },
  iconView: {
    padding: AutoScaledFont(10),
    // borderWidth: AutoScaledFont(0.6),
    borderRadius: AutoScaledFont(12),
    borderColor: Colors.primaryBlue,
  },
  secondicon: {
    padding: AutoScaledFont(10),
    borderRadius: AutoScaledFont(12),
  },
  mediumdDevider: {
    height: AutoScaledFont(2),
    alignSelf: 'stretch',
    marginHorizontal: -AutoScaledFont(15),
    marginTop: AutoScaledFont(5),
    backgroundColor: Colors.lighterGray,
  },
});

export default TwoIconsHeader;
