import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Home } from '../screens/onboarding/Home';
import { Calender } from '../screens/onboarding/Calender';


interface NavigatorCalenderProps {}
export const NavigatorCalender = (props: NavigatorCalenderProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="Calender" >
        <Home_.Screen name="Calender" component={Calender} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


