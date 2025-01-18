import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {Home} from '../screens/onboarding/Home';
import {Settings} from '../screens/settings/Settings';
import {HomeTabbar} from './BottomTabNavigator';
import CreateNewMeeting from '../screens/onboarding/CreateNewMeeting';
import Reminders from '../screens/onboarding/Reminders';
import {MyProfile} from '../screens/onboarding/MyProfile';
import {EditProfile} from '../screens/onboarding/EditProfile';
import {EditProfileHome} from '../screens/onboarding/EditProfileHome';
import {AddClient} from '../screens/onboarding/AddClient';
import {ClientNotes} from '../screens/onboarding/ClientNotes';
import {NotesSearch} from '../screens/onboarding/NotesSearch';
import {MyNotesSearch} from '../screens/onboarding/MyNotesSearch';
import {Notifications} from '../screens/onboarding/Notification/Notifications';
import {OverAllSearch} from '../screens/onboarding/OverAllSearch';
import EditNewMeeting from '../screens/onboarding/EditNewMeeting';
import {EditClient} from '../screens/onboarding/EditClient';
import EditReminders from '../screens/onboarding/EditReminder';
import {EditProfileDetails} from '../screens/onboarding/EditProfileDetails';
import {NavigatorSplash} from './NavigatorSplash';
import { EditProfileWithoutToken } from '../screens/onboarding/EditProfileWithoutToken';
import { EditUnavailability } from '../screens/onboarding/EditUnavailability';
import { AskAnythingDetail } from '../screens/onboarding/AskAnythingDetail';

interface componentNameProps {}
export const Navigator = (props: componentNameProps) => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Splash" > */}

      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Splash"
          component={NavigatorSplash}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="HomeTabbar"
          component={HomeTabbar}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="EditProfileDetails"
          component={EditProfileDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateNewMeeting"
          component={CreateNewMeeting}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Reminders"
          component={Reminders}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="EditProfileWithoutToken"
          component={EditProfileWithoutToken}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditReminders"
          component={EditReminders}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyProfile"
          component={MyProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OverAllSearch"
          component={OverAllSearch}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditNewMeeting"
          component={EditNewMeeting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditClient"
          component={EditClient}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotesSearch"
          component={NotesSearch}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyNotesSearch"
          component={MyNotesSearch}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfileHome"
          component={EditProfileHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditUnavailability"
          component={EditUnavailability}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddClient"
          component={AddClient}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ClientNotes"
          component={ClientNotes}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AskAnythingDetail"
          component={AskAnythingDetail}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
