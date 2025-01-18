import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';
import { AutoScaledFont, getDeviceWidth } from '../config/Size';
import { Colors } from '../constants/Colors';
import FastImage from 'react-native-fast-image';
import { CalendarDots, CheckCircle, Plus, Trash } from 'phosphor-react-native';
import { TrimmedText } from '../config/Utils';

interface SelectedMailsCardProps {
  item: any;
  onPressDelete: () => void;
  fullWidth?: boolean;
}

const SelectedMailsCard = ({ item, onPressDelete, fullWidth }: SelectedMailsCardProps) => {

  return (
    <View style={[styles.cardContainer, {
      width: fullWidth ? '100%' : 'auto',
      justifyContent: fullWidth ? 'space-between' : 'flex-start'
    }]}>
      <Text style={styles.email}>{fullWidth ? item.email : TrimmedText(item.email, 10)}</Text>

      <Pressable onPress={onPressDelete}>
        <Trash
          color={Colors.primary}
          size={20}
          weight={'regular'}
          style={{ margin: AutoScaledFont(5) }}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(5),
    paddingVertical: AutoScaledFont(10),
    marginVertical: AutoScaledFont(3),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    flexDirection: 'row',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightgray,
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
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: AutoScaledFont(15),
    color: Colors.primary,
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

export default SelectedMailsCard;
