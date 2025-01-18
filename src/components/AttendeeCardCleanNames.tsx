import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../config/Size';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import {CalendarDots, CheckCircle, Plus} from 'phosphor-react-native';
import { TrimmedText } from '../config/Utils';

interface AttendeeCardCleanNamesProps {
  item: any;
  onPress?: () => void;
  isSelected?:boolean
}

const AttendeeCardCleanNames = ({item, onPress,isSelected=false}: AttendeeCardCleanNamesProps) => {

  return (
    <Pressable onPress={onPress}>
      <View style={styles.cardContainer}>
        <View>
          <Text style={styles.email}>{TrimmedText(item.email,10)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: AutoScaledFont(6),
    marginVertical: AutoScaledFont(8),
    marginStart: AutoScaledFont(10),
    borderRadius: AutoScaledFont(5),
    borderWidth: AutoScaledFont(0.5),
    borderColor:Colors.gray,
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.black,
    // backgroundColor: Colors.white,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(15),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    fontSize: AutoScaledFont(15),
    marginTop: AutoScaledFont(5),
    color: Colors.black,
    textAlign:'center',
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: AutoScaledFont(15),
    color: Colors.white,
    textAlign:'center',
    opacity:0.8,
    fontFamily: 'Poppins-Medium',
  },
  postedTime: {
    fontSize: AutoScaledFont(16),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  userPic: {
    height: AutoScaledFont(80),
    width: AutoScaledFont(80),
    borderRadius: AutoScaledFont(40),
    marginTop: AutoScaledFont(10),
    borderColor: Colors.primaryBlue,
    alignSelf: 'center',
    backgroundColor: Colors.charcole,
  },
});

export default AttendeeCardCleanNames;
