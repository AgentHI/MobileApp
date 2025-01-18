import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont, getDeviceWidth } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { get } from 'lodash';
import { Routes } from '../../fonts/routers/Routes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { CalendarDots, Plus } from 'phosphor-react-native';
import { FetchAppointments } from '../../services/AppointmentService';
import { useSelector } from 'react-redux';
import CalenderTabs from '../../components/CalenderTabs';
import MeetingCardClean from '../../components/MeetingCardClean';
import { FetchReminders } from '../../services/ReminderService';
import ReminderCardClean from '../../components/ReminderCardClean';
import CalenderHeader from '../../components/CalenderHeader';
import { FetchAllClients } from '../../services/AgentServices';

export const Calender = () => {
  const [piData, setpiData] = React.useState<any>({});
  const [selectedDate, setselectedDate] = React.useState<any>('');
  const [meetings, setmeetings] = React.useState<any>([]);
  const [reminders, setReminders] = React.useState<any>([]);
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const useFouced = useIsFocused();
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selected, setselected] = React.useState<number>(1);
  const [clients, setClients] = useState<boolean>(false);
  const useFocued = useIsFocused();

  // React.useEffect(() => {
  //   getUserData();
  // }, []);

  React.useEffect(() => {
    console.log('selected day', selectedDate);

    // getUserData();
  }, [selectedDate]);

  useEffect(() => {
    getUserData();
  }, [useFouced]);

  const getUserData = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log('userData__', userData);
      setpiData(userData);

      let agentData_ = await FetchAllClients(
        get(agentData, 'agent._id', ''),
        get(userData, 'token', ''),
        1,
      );
      setClients(get(agentData_, 'total', ''))


      // const tokens = await GoogleSignin.getTokens();
      // const tokens11 = await GoogleSignin.signIn();

      // console.log('tokens__', tokens);
      // console.log('tokens11', tokens11);

      // const accessToken = tokens.accessToken;
      // console.log('accessToken___', accessToken);
      // let calenderEvent = await fetchCalendarEvents(accessToken);
      let calenderEvent = await FetchAppointments(
        get(agentData, 'atwin._id', ''),
        token_,
      );

      console.log('calenderEvent', calenderEvent);

      let reminders = await FetchReminders(
        get(agentData, 'atwin._id', ''),
        token_,
      );

      console.log('reminders__', reminders);

      const confirmedEvents: any = [];
      get(calenderEvent, 'items', []).forEach(event => {
        if (event.status === 'confirmed') {
          confirmedEvents.push(event);
        }
      });

      console.log('calenderEvent_____', confirmedEvents);

      setmeetings(get(calenderEvent, 'data.appointments', []));
      setReminders(get(reminders, 'data', []));

      setLoading(false);

      return userData;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const fetchCalendarEvents = async (accessToken: any) => {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();
    console.log(data);
    return data;
  };

  const toggleVisibility = () => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{ backgroundColor: Colors.primary, flex: 1 }}>
      {useFocued && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}

      <CalenderHeader
        leftTitle={Constants.availability}
        secondIcon={true}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={true}
        titleColor={Colors.white}
        iconTint={Colors.white}
        deviderHeight={0.5}
        secondIconSrc={<CalendarDots color={Colors.white} />}
        onPressSecondIcon={() => toggleVisibility()}
      />

      <ScrollView>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(50),
            marginHorizontal: AutoScaledFont(15),
          }}>
          {visible && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                paddingBottom: AutoScaledFont(1),
                alignSelf: 'center',
              }}>
              <Calendar
                onDayPress={day => {
                  setselectedDate(day);
                }}
                style={{
                  borderBottomWidth: AutoScaledFont(0.5),
                  borderColor: 'gray',
                  backgroundColor: Colors.primary,
                  // height: getDeviceWidth() - AutoScaledFont(100),
                  width: getDeviceWidth() - AutoScaledFont(20),
                }}
                theme={{
                  backgroundColor: Colors.primary,
                  calendarBackground: Colors.primary,
                  textSectionTitleColor: Colors.white,
                  selectedDayBackgroundColor: Colors.greenHex,
                  selectedDayTextColor: Colors.white,
                  todayTextColor: Colors.secondary,
                  monthTextColor: Colors.white,
                  dayTextColor: Colors.white,
                  textDisabledColor: Colors.gray,
                  textDayHeaderFontWeight: 'bold',
                  textDayHeaderFontFamily: 'Poppins-Medium',
                  textDayFontFamily: 'Poppins-Regular',
                  textMonthFontFamily: 'Poppins-Regular',
                  selectedDotColor: '#ffffff',
                  dotStyle: { borderRadius: AutoScaledFont(10) },
                }}
                markedDates={{
                  [get(selectedDate, 'dateString', '')]: {
                    selected: true,
                    selectedColor: Colors.greenHex,
                  },
                }}
              />

              {/* <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: AutoScaledFont(20),
                  paddingBottom: AutoScaledFont(10),
                  marginTop: AutoScaledFont(20),
                }}>
                {get(selectedDate, 'dateString', '') ? (
                  <Text style={styles.headerText}>
                    <Text style={styles.headerText}>
                      {selected == 1
                        ? Constants.Appointment
                        : Constants.reminders}
                      {Constants.scheduledOn}
                    </Text>
                    <Text
                      style={[
                        styles.headerText,
                        {fontFamily: 'Poppins-Medium'},
                      ]}>
                      {' '}
                      {formatDate(get(selectedDate, 'dateString', ''))}
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.headerText}>
                    {Constants.pleaseSelectDate}
                    {selected == 1
                      ? Constants.Appointment
                      : Constants.reminders}
                  </Text>
                )}
              </View> */}


            </Animated.View>
          )}

          <CalenderTabs
            warningTitle={Constants.yourSubscriptionHasExpired}
            funFirst={() => {
              setselected(1);
            }}
            funSecond={() => {
              setselected(2);
            }}
            countFirst={(meetings || [])?.length}
            countSecond={(reminders || [])?.length}
            selected={selected}
          />

          <TouchableOpacity
            onPress={() =>
              selected == 1
                ? navigation.navigate(Routes.CreateNewMeeting)
                : navigation.navigate(Routes.Reminders)
            }>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: AutoScaledFont(20),
                paddingBottom: AutoScaledFont(10),
                marginTop: AutoScaledFont(10),
              }}>
              <Text style={styles.headerText}>
                {Constants.add}{' '}
                {selected == 1 ? Constants.Appointment : Constants.reminders}
              </Text>

              <Plus size={18} color={Colors.white} />
            </View>
          </TouchableOpacity>

          {selected == 1 && (
            <FlatList
              data={meetings}
              renderItem={({ item }) => <MeetingCardClean item={item} />}
              keyExtractor={item => get(item, '_id', '')}
              scrollEnabled={false}
              ListEmptyComponent={
                <View>
                  {loading ? (
                    <ActivityIndicator
                      size={'small'}
                      color={Colors.primary}></ActivityIndicator>
                  ) : (
                    clients ? (
                      <Text style={styles.warning}>
                        {Constants.noMeetingsAvailable}
                      </Text>
                    ) : (
                      <Text style={styles.warning}>
                        {Constants.noClientAvailable}
                      </Text>
                    )
                  )}
                </View>
              }
            />
          )}

          {selected == 2 && (
            <FlatList
              data={reminders}
              renderItem={({ item }) => <ReminderCardClean item={item} />}
              keyExtractor={item => get(item, '_id', '')}
              scrollEnabled={false}
              ListEmptyComponent={
                <View>
                  {loading ? (
                    <ActivityIndicator
                      size={'small'}
                      color={Colors.primary}></ActivityIndicator>
                  ) : (
                    <Text style={styles.warning}>
                      {Constants.noReminderAvailable}
                    </Text>
                  )}
                </View>
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(18),
    marginEnd: AutoScaledFont(10),
    color: Colors.white,
    textAlign: 'right',
    flex: 1,
    opacity: 0.8,
    fontFamily: 'Poppins-Regular',
  },
  warning: {
    fontSize: AutoScaledFont(20),
    marginTop: AutoScaledFont(30),
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    opacity: 0.8,
    fontFamily: 'Poppins-Medium',
  },
});
