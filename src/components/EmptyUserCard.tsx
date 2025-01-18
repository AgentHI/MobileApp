import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../config/Size';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import {CalendarDots, Plus} from 'phosphor-react-native';
import {Constants} from '../constants/Constants';

interface EmptyUserCardProps {
  item?: any;
}

const EmptyUserCard = ({item}: EmptyUserCardProps) => {
  return (
    <View style={styles.cardContainer}>
      {/* <View
        style={{
          height: AutoScaledFont(50),
          width: AutoScaledFont(50),
          borderRadius: AutoScaledFont(20),
          borderWidth: AutoScaledFont(0.5),
          borderColor: Colors.lighterGray,
          justifyContent: 'center',
          alignSelf: 'center',
          backgroundColor: Colors.white,
        }}>
        <Text
          style={{
            fontSize: AutoScaledFont(18),
            color: Colors.black,
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'Poppins-Medium',
          }}>
          {'NA'?.toUpperCase()}
        </Text>
      </View> */}

      <View style={{flex: 1}}>
        <Text style={styles.userName}>{Constants.noMatchingUserFound}</Text>
      </View>

      {/* <Plus color={Colors.white} size={20} weight={'regular'} style={{marginEnd:AutoScaledFont(20)}}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(20),
    paddingVertical: AutoScaledFont(20),
    marginVertical: AutoScaledFont(3),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
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
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
  },
  postedTime: {
    fontSize: AutoScaledFont(16),
    color: Colors.secondaryLightIcons,
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

export default EmptyUserCard;
