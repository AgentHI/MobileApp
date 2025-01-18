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

interface UserCardProps {
  item: any;
  onPress: () => void;
  isSelected?: boolean;
  showAdd?: boolean;
}

const UserCard = ({
  item,
  onPress,
  isSelected = false,
  showAdd = true,
}: UserCardProps) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.cardContainer}>
        <View
          style={{
            height: AutoScaledFont(40),
            width: AutoScaledFont(40),
            borderRadius: AutoScaledFont(15),
            borderWidth: AutoScaledFont(0.5),
            borderColor: Colors.lighterGray,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: Colors.primary,
          }}>
          <Text
            style={{
              fontSize: AutoScaledFont(14),
              color: Colors.white,
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins-Medium',
            }}>
            {(item.name || 'AH')?.substring(0, 2)?.toUpperCase()}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>

        {showAdd && (
          <View>
            {isSelected ? (
              <CheckCircle
                color={Colors.white}
                size={20}
                weight={'regular'}
                style={{marginEnd: AutoScaledFont(20)}}
              />
            ) : (
              <Plus
                color={Colors.white}
                size={20}
                weight={'regular'}
                style={{marginEnd: AutoScaledFont(20)}}
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(10),
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
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: AutoScaledFont(15),
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

export default UserCard;
