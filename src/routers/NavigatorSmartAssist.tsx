import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Home } from '../screens/onboarding/Home';
import { Calender } from '../screens/onboarding/Calender';
import { SmartNotes } from '../screens/onboarding/SmartNotes';
import { SmartAssist } from '../screens/onboarding/SmartAssist';


interface NavigatorSmartAssistProps {}
export const NavigatorSmartAssist = (props: NavigatorSmartAssistProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="SmartAssist" >
        <Home_.Screen name="SmartAssist" component={SmartAssist} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


