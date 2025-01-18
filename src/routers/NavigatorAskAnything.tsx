import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { AskAnything } from '../screens/onboarding/AskAnything';

interface NavigatorAskAnythingProps { }
export const NavigatorAskAnything = (props: NavigatorAskAnythingProps) => {
  const Home_ = createNativeStackNavigator();
  return (
    <Home_.Navigator initialRouteName="AskAnything" >
      <Home_.Screen name="AskAnything" component={AskAnything} options={{ headerShown: false }} />
    </Home_.Navigator>
  );
};

