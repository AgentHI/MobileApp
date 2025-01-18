import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AutoScaledFont } from '../config/Size';
import { Colors } from '../constants/Colors';
import { Constants } from '../constants/Constants';
import { get } from 'lodash';
import { Plus } from 'phosphor-react-native';
import BottomModal from './Modal/BottomSheetModal';
import MeetingCardClean from './MeetingCardClean';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../fonts/routers/Routes';

interface ScheduleListProps {
  warningMessageClick: () => void;
  LoadMoreMeetings?: () => void;
  meetings: any;
  loading: boolean;
  clientList: any;
}

const ScheduleList = ({
  warningMessageClick,
  LoadMoreMeetings,
  meetings,
  loading,
  clientList
}: ScheduleListProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  return (
    <View style={[styles.mainView]}>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignContent: 'center',
        }}>
        <Text style={styles.subtitle}>{Constants.schedules}</Text>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          {/* <TouchableOpacity onPress={() => setModalVisible(true)}> */}
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.CreateNewMeeting)}>
            <View style={{ flexDirection: 'row' }}>
              <Plus size={20} color={Colors.white} style={{ opacity: 0.8 }} />

              <Text style={styles.title}>{Constants.add}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* <FlatList
       data={dummyData}
       renderItem={({ item }) => <ScheduleCard item={item} />}
       keyExtractor={(item) => get(item,'id','')}
       scrollEnabled={false}
       numColumns={2}
    /> */}

      <FlatList
        style={{ marginBottom: AutoScaledFont(100) }}
        data={meetings}
        renderItem={({ item }) => <MeetingCardClean item={item} />}
        keyExtractor={item => get(item, '_id', '')}
        scrollEnabled={true}
        ListEmptyComponent={
          <View>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={Colors.white} style={{ marginTop: AutoScaledFont(150) }}></ActivityIndicator>
            ) : (
              clientList ? (
                <Text style={styles.headerText}>
                  {Constants.noMeetingsAvailable}
                </Text>
              ) : (
                <Text style={styles.headerText}>
                  {Constants.noClientAvailable}
                </Text>
              )
            )}
          </View>
        }
      />

      <BottomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    width: AutoScaledFont(60),
    textAlign: 'center',
    opacity: 0.8,
  },
  headerText: {
    fontSize: AutoScaledFont(21),
    marginTop: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  subtitle: {
    marginStart: AutoScaledFont(16),
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    opacity: 0.8,
    flex: 1,
  },
  mainView: {
    marginTop: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
  },
});

export default ScheduleList;
