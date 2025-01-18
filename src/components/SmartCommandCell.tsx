import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
interface SmartCommandCellProps {
  item: any;
}

const SmartCommandCell = ({
  item,
}: SmartCommandCellProps) => {
  return (
    <View style={styles.cardContainer}>
      {item?.icon}
      <Text style={styles.userName}>{item?.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(10),
    marginTop: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    flexDirection:'row',
    minWidth:AutoScaledFont(180),
    justifyContent:'center',
    backgroundColor:Colors.whiteAlabaster,
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: AutoScaledFont(5),
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
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  type_: {
    fontSize: AutoScaledFont(14),
    marginStart: AutoScaledFont(12),
    color: Colors.white,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
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

export default SmartCommandCell;
