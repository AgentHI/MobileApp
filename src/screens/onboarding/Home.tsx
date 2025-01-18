import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { debounce, get, set } from 'lodash';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Routes } from '../../fonts/routers/Routes';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionExpired from '../../components/SubscriptionExpired';
import { useDispatch, useSelector } from 'react-redux';
import { updateAgentData_, updatePiData } from '../../redux/piDataSlice';
import {
  FetchAgentViaEmail,
  FetchAllClients,
} from '../../services/AgentServices';
import { FetchAppointments } from '../../services/AppointmentService';
import HomeHeaderClean from '../../components/HomeHeaderClean';
import HomeOptionTabsClean from '../../components/HomeOptionTabsClean';
import { FetchLatestNotes } from '../../services/NotesService';
import { GetUnreadNotificationsCount } from '../../services/NotificationService';
import { Plus } from 'phosphor-react-native';
import UserCardHome from '../../components/UserCardHome';
import BottomModal from '../../components/Modal/BottomSheetModal';
import ScheduleList from '../../components/ScheduleList';
import LatestMessagesList from '../../components/LatesMessagesList';

GoogleSignin.configure({
  webClientId: '',
  // androidClientId: '',
  iosClientId: '',
  scopes: ['profile', 'email'],
});

export const Home = () => {
  let buttonTranslate = React.useRef(new Animated.Value(0))?.current;
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [piData, setpiData] = React.useState<any>({});
  const [isViewVisible, setIsViewVisible] = useState(false);
  const [unreadCount, setunreadCount] = useState(0);
  const [clientList, setclientList] = useState<any>([]);
  const [latestMessages, setlatestMessages] = useState<any>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userName, setUserName] = React.useState<string>('Agent Hi');
  const [userPic, setuserPic] = React.useState<string>('Agent Hi');
  const [selected, setselected] = React.useState<number>(1);
  // const [clientPage, setclientPage] = React.useState<number>(1);
  let clientPage = 1;
  const [meetings, setmeetings] = React.useState<any>([]);
  const agentData = useSelector(state => state || {});
  // const token_ = useSelector(state => state || {});
  const useFocued = useIsFocused();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [clientMoreAvailable, setclientMoreAvailable] = useState<boolean>(false);
  const [token_, settoken] = useState<string>('');
  const [clientCount, setclientCount] = useState<number>(0);
  const [scheduleCount, setscheduleCount] = useState<number>(0);
  const [totalClientPage, setTotalClientPage] = useState<number>(1);


  // React.useEffect(() => {
  //   getUserData();
  //   toggleView();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      clientPage = 1;
      getUserData();
      toggleView();
      // getClientList();
    }, []),
  );

  const toggleView = () => {
    const randomNumber = Math?.floor(Math?.random() * 10);
    if (randomNumber % 2 === 0) {
      setIsViewVisible(true);
    } else {
      setIsViewVisible(false);
    }
  };

  const getUserData = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem('@user_data');
      console.log('__user_data_home', jsonValue);

      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;

      console.log('userData_____', userData);
      let agentData = {}
      try {
        agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));
        console.log('FetchAgentViaEmail___', agentData);
        dispatch(updateAgentData_(agentData));

      } catch (error) {
        console.log('FetchAgentViaEmailError', error);

      }

      setpiData(agentData);
      setuserPic(get(userData, 'user.photo', ''));
      setUserName(
        get(agentData, 'agent.first_name', '') +
        ' ' +
        get(agentData, 'agent.last_name', ''),
      );
      dispatch(updatePiData(userData));
      let calenderEvent = await FetchAppointments(
        get(agentData, 'atwin._id', ''),
        get(userData, 'token', ''),
      );

      console.log('calenderEvent__', calenderEvent);


      setscheduleCount(get(calenderEvent, 'total', 0) || 0)
      const confirmedEvents: any = [];
      get(calenderEvent, 'items', []).forEach(event => {
        if (event.status === 'confirmed') {
          confirmedEvents.push(event);
        }
      });
      setmeetings(get(calenderEvent, 'data.appointments', []));
      await LoadMoreClients_()
      let respo_ = await FetchLatestNotes(
        get(agentData, 'agent.accessToken', ''),
      );
      setlatestMessages(respo_ || []);

      try {
        let notificationCount = await GetUnreadNotificationsCount(
          get(agentData, 'agent.accessToken', ''),
        );
        setunreadCount(get(notificationCount, 'unreadCount', 0));
      } catch (error) {
        console.log('notificationCountError', error);
      }
      setLoading(false);
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const LoadMoreClients_ = async () => {
    console.log('clientPage', clientPage, totalClientPage);

    if (loadingMore && clientCount < 10) {
      return
    }


    if (clientPage > totalClientPage) {
      return
    }

    const jsonValue = await AsyncStorage.getItem('@user_data');
    let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
    let agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));

    try {
      console.log('Loading more clients...');

      setLoadingMore(true);
      let agentData_: any;
      try {
        agentData_ = await FetchAllClients(
          get(agentData, 'agent._id', ''),
          get(userData, 'token', ''),
          clientPage,
        );
        console.log('agentData_', clientPage, agentData_);
        setclientCount(get(agentData_, 'total', ''))
        setTotalClientPage(get(agentData_, 'totalPages', 1));
        if (clientPage === 1) {
          setclientList(agentData_?.data || []);
        } else {
          setclientList(prevList => {
            const newClients = agentData_?.data || [];
            const uniqueClients = [
              ...prevList,
              ...newClients.filter(
                newItem =>
                  !prevList.some(existingItem => existingItem._id === newItem._id),
              ),
            ];
            return uniqueClients;
          });
        }
        // setclientPage(clientPage + 1);
        clientPage = clientPage + 1

      } catch (error) { }
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more clients:', error);
    }
  };

  const debouncedLoadMore = useCallback(debounce(LoadMoreClients_, 300), []);

  const onClientPress = () => {
    setselected(1);
  };

  const onSchedulePress = () => {
    setselected(2);
  };

  const onMessagesPress = () => {
    setselected(3);
  };

  const SecondIconPress = async () => {
    setunreadCount(0);
    navigation.navigate(Routes.Notifications);
  };

  const getClientList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('userData__', userData);
      let respo = await FetchAgentViaEmail(get(userData, 'user.email', ''));
      let agentData = await FetchAllClients(
        get(respo, 'agent._id', ''),
        get(userData, 'token', ''),
      );
      console.log('agentData', agentData);
      setclientList(agentData?.data || []);
    } catch (e) {
      console.log('Error retrieving user data', e);
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

      <HomeHeaderClean
        topic={Constants.gladToSeeYou}
        userName={userName}
        userPic={userPic}
        onPressSecondIcon={() => SecondIconPress()}
        onPressThirdIcon={() => navigation.navigate(Routes.Settings)}
        onPressFirstIcon={() =>
          navigation.navigate(Routes.OverAllSearch, { item: piData })
        }
        onPressProfilePic={() => navigation.navigate(Routes.MyProfile)}
        unreadCount={unreadCount}
      />
      <View
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
        }}>
        {false && (
          <SubscriptionExpired
            warningTitle={Constants.yourSubscriptionHasExpired}
            warningMessage={Constants.tapHereToRenew}
            warningMessageClick={() => { }}
          />
        )}

        <HomeOptionTabsClean
          warningTitle={Constants.yourSubscriptionHasExpired}
          onSchedulePress={() => onSchedulePress()}
          onClientPress={() => onClientPress()}
          onMessagesPress={() => onMessagesPress()}
          // scheduleCount={meetings?.length}
          scheduleCount={scheduleCount + ''}
          messageCount={'0'}
          // clientCount={clientList?.length}
          clientCount={clientCount + ''}
          selected={selected}
        />

        {selected == 1 && (
          <View style={[styles.mainView]}>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                alignContent: 'center',
              }}>
              <Text style={styles.subtitle}>{Constants.client}{` : ${(clientList || [])?.length} - ${clientCount}`}</Text>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(Routes.AddClient)}>
                  <View style={{ flexDirection: 'row' }}>
                    <Plus
                      size={20}
                      color={Colors.white}
                      style={{ opacity: 0.8 }}
                    />

                    <Text style={styles.title}>{Constants.add}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={clientList}
              renderItem={({ item, index }) => (
                <UserCardHome item={item} onPress={() => { }} showAdd={false} index={index} />
              )}
              keyExtractor={item => get(item, '_id', '')}
              onEndReached={debouncedLoadMore}
              showsVerticalScrollIndicator={false}
              style={{ marginBottom: AutoScaledFont(100) }}
              scrollEnabled={true}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : null
              }
              ListEmptyComponent={
                <View>
                  <Text style={styles.headerText}>{Constants.noNewClient}</Text>
                </View>
              }
            />

            <BottomModal
              isVisible={isModalVisible}
              onClose={() => setModalVisible(false)}
            />
          </View>
        )}

        {selected == 2 && (
          <ScheduleList
            warningMessageClick={() => { }}
            meetings={meetings}
            loading={loading}
            clientList={clientList.length}
          />
        )}

        {selected == 3 && (
          <LatestMessagesList
            latestMessages={latestMessages}
            messagePress={() => {
              navigation.navigate(Routes.AddClient);
            }}
          />
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  appIcon: {
    width: AutoScaledFont(250),
    height: AutoScaledFont(250),
    // borderRadius: AutoScaledFont(10),
    // marginBottom: AutoScaledFont(50),
    alignSelf: 'center',
    position: 'absolute',
  },
  craftedText: {
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: AutoScaledFont(24),
  },
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
    flex: 1,
    opacity: 0.8,
  },
  mainView: {
    marginTop: AutoScaledFont(5),
    marginHorizontal: AutoScaledFont(20),
  },
});
