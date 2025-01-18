import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Splash } from '../screens/onboarding/Splash';
import EditEmail from '../screens/onboarding/EnterEmail';


interface NavigatorHomeProps {}
export const NavigatorSplash = (props: NavigatorHomeProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="Splash" >
        <Home_.Screen name="Splash" component={Splash} options={{headerShown:false}}  />
        <Home_.Screen name="EditEmail" component={EditEmail} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


