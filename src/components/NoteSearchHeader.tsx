import {
  View,
  Text,
  TouchableOpacity,
  ColorValue,
  Image,
  StyleSheet,
  ImageSourcePropType,
  TextInput,
} from 'react-native';
import {ArrowLeft, NotePencil} from 'phosphor-react-native';
import {Colors} from '../constants/Colors';
import {AutoScaledFont, getPrimaryButtonHeight} from '../config/Size';
import {ReactNode, useEffect, useState} from 'react';
import {Constants} from '../constants/Constants';

interface NoteSearchHeaderProps {
  title?: string;
  leftTitle?: string;
  onPress?: () => void;
  onPressSecondIcon?: () => void;
  leftTitleColor?: ColorValue;
  titleColor?: ColorValue;
  iconTint?: any;
  secondIcon?: boolean;
  backHidden?: boolean;
  secondIconSrc?: ReactNode;
  isDeviderShown?: boolean;
  iconSize?: number;
  titleFontSize?: number;
  titleOpacity?: number;
  deviderHeight?: number;
  onTextSubmit: (text: string) => void;
  defaultText?: string;
}

const NoteSearchHeader = ({
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
  onTextSubmit,
  defaultText,
}: NoteSearchHeaderProps) => {
  const [searchNote, setsearchNote] = useState(defaultText || '');

  // const onPressSearch = ()=>{
  //   onTextSubmit(searchNote)
  // }

  useEffect(() => {
    onTextSubmit(searchNote);
  }, [searchNote]);

  return (
    <View>
      <View style={[styles.mainView, {marginTop: 15}]}>
        <TouchableOpacity onPress={onPress}>
          {!backHidden && (
            <View style={styles.iconView}>
              <ArrowLeft size={22} color={iconTint} />
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.displayContainer]}>
          <TextInput
            style={[
              {
                paddingHorizontal: AutoScaledFont(15),
                color: Colors.white,
                fontFamily: 'Poppins-Medium',
                justifyContent: 'center',
                alignContent: 'center',
                textAlignVertical: 'center',
              },
            ]}
            placeholder={leftTitle}
            multiline={false}
            value={searchNote}
            onChangeText={setsearchNote}
            placeholderTextColor={Colors.headerThreeColor}></TextInput>
        </View>

        {secondIcon && (
          <TouchableOpacity onPress={onPressSecondIcon}>
            <View style={styles.secondicon}>{secondIconSrc}</View>
          </TouchableOpacity>
        )}
      </View>

      {/* {isDeviderShown && <View style={[styles.mediumdDevider,{height:deviderHeight}]}></View>} */}
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
  displayContainer: {
    borderWidth: AutoScaledFont(0.5),
    borderRadius: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(10),
    height: AutoScaledFont(60),
    flex: 1,
    borderColor: Colors.white,
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
    alignItems: 'center',
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

export default NoteSearchHeader;
