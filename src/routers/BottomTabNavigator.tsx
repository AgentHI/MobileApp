import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {Keyboard, Platform, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import {AutoScaledFont} from '../config/Size';
import {
  CalendarDots,
  House,
  Lightning,
  Notepad,
} from 'phosphor-react-native';
import {NavigatorHome} from './NavigatorHome';
import {NavigatorCalender} from './NavigatorCalender';
import {NavigatorQuickAction} from './NavigatorQuckAction';
import {NavigatorSmartNotes} from './NavigatorSmartNotes';
import {NavigatorSmartAssist} from './NavigatorSmartAssist';
import AiLogo from '../components/Modal/AiLogo';
import { NavigatorAskAnything } from './NavigatorAskAnything';
import { AskAnything } from '../screens/onboarding/AskAnything';

const Tab = createBottomTabNavigator();

export const HomeTabbar = () => {
  const navigation = useNavigation();
  const iconSize = Platform.OS == 'ios' ? 26 : 24;
  const iconSizeFocused = Platform.OS == 'ios' ? 29 : 27;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);



  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  return (
    <Tab.Navigator
      initialRouteName="NavigatorHome"
      screenOptions={{
        tabBarStyle: {
          height: AutoScaledFont(70),
          paddingBottom: AutoScaledFont(10),
          paddingTop: AutoScaledFont(10),
          backgroundColor: Colors.primary,
          display: isKeyboardVisible ? 'none' : 'flex',

        },
      }}>
      <Tab.Screen
        name="NavigatorHome"
        component={NavigatorHome}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}: any) => (
            <House
              color={focused ? Colors.white : '#DCDCDC'}
              size={ focused ? iconSizeFocused : iconSize}
              weight={focused ? 'bold' : 'regular'}
            />
          ),
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: '#DCDCDC',
        }}
      />

      <Tab.Screen
        name="NavigatorCalender"
        component={NavigatorCalender}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: 'Calendar',
          tabBarIcon: ({focused}) => (
            <CalendarDots
            color={focused ? Colors.white : '#DCDCDC'}
            size={ focused ? iconSizeFocused : iconSize}
            weight={focused ? 'bold' : 'regular'}
            />
          ),
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: '#DCDCDC',
        }}
      />
      <Tab.Screen
        name="NavigatorSmartAssist"
        component={NavigatorSmartAssist}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <AiLogo
              isVisible={true}
              onPressIcon={() => navigation.navigate('NavigatorSmartAssist')}
              speed={1}
              selected={focused}
              size={120}
            />
          ),

          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: '#DCDCDC',
        }}
      />
      <Tab.Screen
        name="NavigatorAskAnything"
        component={NavigatorAskAnything}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: 'AskAnything',
          tabBarIcon: ({focused}) => (
            <Lightning
            color={focused ? Colors.white : '#DCDCDC'}
            size={ focused ? iconSizeFocused : iconSize}
            weight={focused ? 'bold' : 'regular'}
            />
          ),

          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: '#DCDCDC',
        }}
      />

      <Tab.Screen
        name="NavigatorSmartNotes"
        component={NavigatorSmartNotes}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: 'MyNotes',
          tabBarIcon: ({focused}) => (
            <Notepad
            color={focused ? Colors.white : '#DCDCDC'}
            size={ focused ? iconSizeFocused : iconSize}
            weight={focused ? 'bold' : 'regular'}
            />
          ),

          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: '#DCDCDC',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});
