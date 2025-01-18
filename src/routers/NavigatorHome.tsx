import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Home } from '../screens/onboarding/Home';


interface NavigatorHomeProps {}
export const NavigatorHome = (props: NavigatorHomeProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="Home" >
        <Home_.Screen name="Home" component={Home} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


