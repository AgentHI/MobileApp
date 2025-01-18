import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {AutoScaledFont, getDeviceWidth, getPrimaryTextInputSize} from '../config/Size';
import {Colors} from '../constants/Colors';
import { Constants } from '../constants/Constants';
import { Clock, DotsThreeVertical, Phone, User } from 'phosphor-react-native';

interface ScheduleCardProps {
  item: any;
}

const ScheduleCard = ({
  item,
}: ScheduleCardProps) => {

  return (
      <View style={styles.cardContainer}>
        <View style={styles.row}>
        <User color={Colors.secondaryLightIcons} size={18} weight={'regular'} />
          <Text style={styles.userName}>{item.name}</Text>
        </View>
  
        <View style={styles.row}>
        <Clock color={Colors.secondaryLightIcons} size={18} weight={'regular'} />
          <Text style={styles.text}>{item.availabilityTimeRange}</Text>
        </View>
  
        <View style={styles.row}>
        <Phone color={Colors.secondaryLightIcons} size={18} weight={'regular'} />
          <Text style={styles.text}>{item.contactNumber}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.postedTime}>{item.postedAgo}</Text>
          <TouchableOpacity>
          {/* <DotsThreeVertical color={Colors.secondaryLightIcons} size={16} weight={'regular'} /> */}
          </TouchableOpacity>
        </View>
      </View>
    );

};

const styles = StyleSheet.create({
  cardContainer: {
    padding: AutoScaledFont(10),
    marginVertical: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    width:getDeviceWidth()/2-AutoScaledFont(30),
    backgroundColor: Colors.secondaryLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AutoScaledFont(10),
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(17),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(18),
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  postedTime: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(16),
    color: Colors.secondaryLightIcons,
    fontFamily: 'Poppins-Regular',

  }
});

export default ScheduleCard;
