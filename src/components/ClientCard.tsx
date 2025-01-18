import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../config/Size';
import {Colors} from '../constants/Colors';
import FastImage from 'react-native-fast-image';

interface ClientCardProps {
  item: any;
}

const ClientCard = ({item}: ClientCardProps) => {
  // const userPic = 'https://fastly.picsum.photos/id/143/200/300.jpg?hmac=LXGdX9PiyshH-j3_aFp9tazDDPkI0CDtwP-Q4EXBSoA'
  const userPic = '';

  return (
    <View style={styles.cardContainer}>
      <View>
        {userPic ? (
          <FastImage source={{uri: userPic}} style={styles.userPic}></FastImage>
        ) : (
          <View
            style={{
              height: AutoScaledFont(50),
              width: AutoScaledFont(50),
              borderRadius: AutoScaledFont(25),
              borderWidth: AutoScaledFont(0.5),
              marginTop: AutoScaledFont(5),
              borderColor: Colors.black,
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.white,
            }}>
            <Text
              style={{
                fontSize: AutoScaledFont(20),
                color: Colors.black,
                alignSelf: 'center',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              {(item.name || 'AH')?.substring(0, 2)?.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.userName}>{item.name}</Text>
      {/* <Text style={styles.postedTime}>{'New User'}</Text> */}

      <View style={styles.row}>
        <Text style={styles.text}>{'Visit Profile'}</Text>
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
    width: getDeviceWidth() / 2 - AutoScaledFont(60),
    backgroundColor: Colors.secondaryLight,
  },
  row: {
    alignItems: 'center',
    padding: AutoScaledFont(10),
    margin: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    backgroundColor: Colors.white,
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(12),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    fontSize: AutoScaledFont(18),
    marginTop: AutoScaledFont(5),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
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

export default ClientCard;
