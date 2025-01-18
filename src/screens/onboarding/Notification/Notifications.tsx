import React from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppStatusBar from '../../../components/AppStatusBar';
import {Colors} from '../../../constants/Colors';
import TwoIconsHeader from '../../../components/TwoIconsHeader';
import {Constants} from '../../../constants/Constants';
import {AutoScaledFont, getDeviceHeight} from '../../../config/Size';
import NotesCard from '../../../components/NotesCard';
import {get} from 'lodash';
import {FetchAllNotifications} from '../../../services/NotificationService';
import {useSelector} from 'react-redux';
import NotificationCard from '../../../components/NotificationCard';

export const Notifications = () => {
  const [notifications_, setnotifications_] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigation = useNavigation();
  const token_ = useSelector(state => state.user.piData.token || {});

  const dummYnots_ = [
    {
      "_id": "635c5e5f1539325489012345",
      "type": "INFO",
      "title": "System Maintenance Notification",
      "message": "Scheduled maintenance will occur tomorrow between 2 AM and 5 AM.",
      "sound": null,
      "data": {},
      "recipient": "635c5e5f1539325489654321",
      "isRead": false,
      "createdAt": "2024-11-26T08:00:00.000Z",
      "updatedAt": "2024-11-26T08:00:00.000Z"
    },
    {
      "_id": "635c5e5f1539325489123456",
      "type": "ALERT",
      "title": "Urgent Security Update",
      "message": "An urgent security update is required. Please update your system immediately.",
      "sound": "alert_sound.mp3",
      "data": {
        "url": "https://example.com/security-update"
      },
      "recipient": "635c5e5f1539325489654321",
      "isRead": true,
      "createdAt": "2024-11-26T08:30:00.000Z",
      "updatedAt": "2024-11-26T08:35:00.000Z"
    },
    {
      "_id": "635c5e5f153932548901234534",
      "type": "INFO",
      "title": "System Maintenance Notification",
      "message": "Scheduled maintenance will occur tomorrow between 2 AM and 5 AM.",
      "sound": null,
      "data": {},
      "recipient": "635c5e5f1539325489654321",
      "isRead": false,
      "createdAt": "2024-11-26T08:00:00.000Z",
      "updatedAt": "2024-11-26T08:00:00.000Z"
    },
  

  ]

  React.useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setLoading(true);
      let notificationsData = await FetchAllNotifications(token_);
      console.log('notificationsData__', notificationsData);

      setnotifications_(notificationsData || []);
      // setnotifications_(dummYnots_);
      setLoading(false);
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  return (
    <View style={{backgroundColor: Colors.primary, flex: 1}}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={2}
        bgcolor={Colors.primary}
      />

      <TwoIconsHeader
        leftTitle={Constants.Notifications}
        secondIcon={false}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={false}
        iconTint={Colors.white}
        deviderHeight={0.5}
      />

      <View
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(5),
        }}>
        <FlatList
          data={notifications_}
          renderItem={({item, index}) => (
            <NotificationCard
              item={item}
              token_={token_}
            />
          )}
          keyExtractor={item => get(item, '_id', '')}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{
            paddingBottom: AutoScaledFont(200),
            marginBottom: AutoScaledFont(10),
          }}
          ListEmptyComponent={
            <View>
              {loading ? (
                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: getDeviceHeight() / 4,
                  }}>
                  <ActivityIndicator
                    size={'small'}
                    color={Colors.white}></ActivityIndicator>
                </View>
              ) : (
                <Text style={styles.headerText}>
                  {Constants.noNotificationsAvailable}
                </Text>
              )}
            </View>
          }
        />
      </View>
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
    alignSelf: 'center',
    position: 'absolute',
  },
  headerText: {
    fontSize: AutoScaledFont(22),
    marginTop: AutoScaledFont(50),
    marginHorizontal: AutoScaledFont(30),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  craftedText: {
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: AutoScaledFont(24),
  },
});
