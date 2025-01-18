import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, FlatList} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../config/Size';
import {Colors} from '../constants/Colors';
import {CalendarDots, Clock, UsersThree, VideoConference} from 'phosphor-react-native';
import {FormatDateToReadable, GetParsedTime} from '../config/Utils';
import { get } from 'lodash';
import AttendeeCard from './AttendeeCard';

interface MeetingCardProps {
  item: any;
}

const MeetingCard = ({item}: MeetingCardProps) => {
  // console.log('item__', item.title);

  const openCalendarLink = async url => {
    try {
      console.log('url__', url);
      await Linking.openURL(url);
    } catch (error) {
      console.log('Failed to open the URL.');
    }
  };

  return (
    <View style={styles.cardContainer}>
      {item.title ? (
        <View style={styles.cellStyle}>
          <CalendarDots color={Colors.jetBlack} size={18} weight={'regular'} />
          <Text style={styles.userName}>{item.title}</Text>
        </View>
      ) : (
        <View style={styles.cellStyle}>
          <CalendarDots color={Colors.jetBlack} size={18} weight={'regular'} />
          <Text style={styles.userName}>{item.title}</Text>
        </View>
      )}

      <View style={styles.cellStyle}>
        <Clock color={Colors.jetBlack} size={17} weight={'regular'} />
        <Text
          style={[
            styles.userName,
            {
              color: Colors.jetBlack,
              fontSize: AutoScaledFont(17),
              fontFamily: 'Poppins-Medium',
            },
          ]}>
          {FormatDateToReadable(item.start_time)}
        </Text>
      </View>


      <View style={styles.cellStyle}>
        <Clock color={Colors.secondaryLight} size={17} weight={'regular'} />
        <Text
          style={[
            styles.userName,
            {
              color: Colors.jetBlack,
              fontSize: AutoScaledFont(17),
              fontFamily: 'Poppins-Medium',
            },
          ]}>
          {GetParsedTime(item.start_time)}
          {/* {item.start_time} */}
          {' - '}
          {GetParsedTime(item.end_time)}
          {/* {item.end_time} */}
        </Text>
      </View>

      <View style={styles.cellStyle}>
        <VideoConference color={Colors.jetBlack} size={17} weight={'regular'} />
        <Text
          style={[
            styles.userName,
            {
              color: Colors.greenHex,
              fontSize: AutoScaledFont(17),
              fontFamily: 'Poppins-Medium',
            },
          ]}>
          {item.meeting_type}
        </Text>
      </View>


      <View style={styles.cellStyle}>
        <UsersThree color={Colors.jetBlack} size={17} weight={'regular'} />
        <Text
          style={[
            styles.userName,
            {
              color: Colors.jetBlack,
              fontSize: AutoScaledFont(17),
              fontFamily: 'Poppins-Medium',
            },
          ]}>
          {'Attendees : '}{get(item,'attendees',[]).length}
        </Text>
      </View>




      <FlatList
            data={get(item,'attendees',[])}
            renderItem={({item}) => <AttendeeCard item={item} />}
            keyExtractor={item => get(item, '_id', '')}
            horizontal={true}
            scrollEnabled={true} 
            showsHorizontalScrollIndicator={false}
            //  numColumns={2}
          />



      {/* <Text style={styles.postedTime}>{'New User'}</Text> */}

      {/* <TouchableOpacity onPress={() => openCalendarLink(item?.htmlLink)}>
        <View style={styles.row}>
          <Text style={styles.text}>{'Meeting Details'}</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(25),
    marginVertical: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    // width: getDeviceWidth() - AutoScaledFont(20),
    backgroundColor: Colors.secondaryLight,
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
    marginStart: AutoScaledFont(10),
    color: Colors.black,
    flex: 1,
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

export default MeetingCard;
