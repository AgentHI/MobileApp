import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const FetchAllNotifications = async (token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/notifications/agent';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('Response Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

export const UpdateFcmToken = async (fcmtoken: string, token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/agents/fcmtoken';
  // console.log('UpdateFcmToken_parmas__', fcmtoken, token);
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({fcmToken: fcmtoken}),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('UpdateFcmTokenData:', data);
    return data;
  } catch (error) {
    console.error('ErrorUpdatingFCMToken:', error);
  }
};

export const GetFcmToken = async (token_: string) => {
  try {
    const oldToken = await AsyncStorage.getItem('fcmToken');
    let fcmToken = (await messaging().getToken()) || '';
    if (fcmToken != oldToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);

      try {
        await UpdateFcmToken(fcmToken, token_);
      } catch (error) {
        console.log('UpdateFcmToken_eRROR', error);
      }
    } else {
      await UpdateFcmToken(fcmToken, token_);
    }
  } catch (error) {
    await messaging().registerDeviceForRemoteMessages();
    let fcmToken = (await messaging().getToken()) || '';

    if (fcmToken) {
      try {
        await UpdateFcmToken(fcmToken, token_);
      } catch (error) {
        console.log('UpdateFcmToken_eRROR', error);
      }

      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
};

export const MarkNotificationAsRead = async (
  notificationId: string,
  token: string,
) => {
  const url = `http://api.test.agenthi.ai:3000/api/notifications/${notificationId}/read`;

  const options = {
    method: 'PUT',
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // console.log('Notification marked as read:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const GetUnreadNotificationsCount = async (token: string) => {
  const url = 'http://api.test.agenthi.ai:3000/api/notifications/unread/count';

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // console.log('Unread notifications:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
