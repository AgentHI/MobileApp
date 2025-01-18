import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  FlatList,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {
  CalendarDots,
  Clock,
  DotsThree,
  Pencil,
  UsersThree,
  VideoConference,
} from 'phosphor-react-native';
import {FormatDateToReadable, GetParsedTime} from '../config/Utils';
import {get} from 'lodash';
import AttendeeCardCleanNames from './AttendeeCardCleanNames';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../fonts/routers/Routes';

interface MeetingCardCleanProps {
  item: any;
}

const MeetingCardClean = ({item}: MeetingCardCleanProps) => {
  const opacity = 0.8;
  const navigation = useNavigation()

  const openCalendarLink = async url => {
    try {
      console.log('url__', url);
      await Linking.openURL(url);
    } catch (error) {
      console.log('Failed to open the URL.');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: AutoScaledFont(0.5),
        flex: 1,
        borderColor: Colors.lighterGray,
        marginVertical: AutoScaledFont(8),
        borderRadius: AutoScaledFont(10),
      }}>
      <View style={styles.cardContainer}>
        {item.title ? (
          <View style={styles.cellStyle}>
            <CalendarDots
              color={Colors.white}
              size={18}
              weight={'regular'}
              style={{opacity: opacity}}
            />
            <Text style={styles.userName}>{item.title}</Text>
          </View>
        ) : (
          <View style={styles.cellStyle}>
            <CalendarDots
              color={Colors.white}
              size={18}
              weight={'regular'}
              style={{opacity: opacity}}
            />
            <Text style={[styles.userName, {fontFamily: 'Poppins-Regular'}]}>
              {item.title}
            </Text>
          </View>
        )}

        <View style={styles.cellStyle}>
          <Clock
            color={Colors.white}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                fontFamily: 'Poppins-Regular',
              },
            ]}>
            {FormatDateToReadable(item.start_time)}
          </Text>
        </View>

        <View style={styles.cellStyle}>
          <Clock
            color={Colors.primary}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                opacity: opacity,
                fontFamily: 'Poppins-Regular',
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
          <VideoConference
            color={Colors.white}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                fontFamily: 'Poppins-Regular',
                opacity: opacity,
              },
            ]}>
            {item.meeting_type}
          </Text>
        </View>

        <View style={styles.cellStyle}>
          <UsersThree
            color={Colors.white}
            size={17}
            weight={'regular'}
            style={{opacity: opacity}}
          />
          <Text
            style={[
              styles.userName,
              {
                color: Colors.white,
                fontSize: AutoScaledFont(17),
                fontFamily: 'Poppins-Medium',
                opacity: opacity,
              },
            ]}>
            {'Attendees : '}
            {get(item, 'attendees', []).length}
          </Text>
        </View>

        <FlatList
          data={get(item, 'attendees', [])}
          renderItem={({item}) => <AttendeeCardCleanNames item={item} />}
          keyExtractor={item => get(item, '_id', '')}
          horizontal={true}
          scrollEnabled={true}
          style={{marginStart: AutoScaledFont(20)}}
          showsHorizontalScrollIndicator={false}
          //  numColumns={2}
        />
      </View>

      <TouchableOpacity onPress={()=>navigation.navigate(Routes.EditNewMeeting,{item:item})}>
        <DotsThree
          color={Colors.white}
          size={25}
          weight={'bold'}
          style={{
            opacity: opacity,
            marginEnd: AutoScaledFont(20),
            marginTop: AutoScaledFont(20),
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(15),
    flex: 1,
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
    color: Colors.white,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
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

export default MeetingCardClean;
