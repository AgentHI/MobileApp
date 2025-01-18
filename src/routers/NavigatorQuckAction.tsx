import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { QuickAction } from '../screens/onboarding/QuickAction';


interface NavigatorQuickActionProps {}
export const NavigatorQuickAction = (props: NavigatorQuickActionProps) => {
    const Home_ = createNativeStackNavigator();
  return (
      <Home_.Navigator initialRouteName="QuickAction" >
        <Home_.Screen name="QuickAction" component={QuickAction} options={{headerShown:false}}  />
      </Home_.Navigator>
  );
};


