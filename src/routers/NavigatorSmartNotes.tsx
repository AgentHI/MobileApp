import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Home } from '../screens/onboarding/Home';
import { Calender } from '../screens/onboarding/Calender';
import { SmartNotes } from '../screens/onboarding/SmartNotes';


interface NavigatorSmartNotesProps {}
export const NavigatorSmartNotes = (props: NavigatorSmartNotesProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="SmartNotes" >
        <Home_.Screen name="SmartNotes" component={SmartNotes} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


