import {
  View,
  Text,
  TouchableOpacity,
  ColorValue,
  StyleSheet,
  Animated,
} from 'react-native';
import {ArrowLeft, CalendarDots, CaretDown} from 'phosphor-react-native';
import {Colors} from '../constants/Colors';
import {AutoScaledFont, getPrimaryButtonHeight} from '../config/Size';
import React, {ReactNode, useEffect} from 'react';
import {AccordionItem} from 'react-native-accordion-list-view';
import CalenderDetailsSection from './CalenderDetails';
import {get} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FetchAgentViaEmail} from '../services/AgentServices';
import AvailabilitySection from './AvailabilitySection';
import { useFocusEffect } from '@react-navigation/native';

interface CalenderHeaderProps {
  title?: string;
  leftTitle?: string;
  onPress?: () => void;
  onPressSecondIcon?: () => void;
  leftTitleColor?: ColorValue;
  titleColor?: ColorValue;
  iconTint?: string;
  secondIcon?: boolean;
  backHidden?: boolean;
  secondIconSrc?: ReactNode;
  isDeviderShown?: boolean;
  iconSize?: number;
  titleFontSize?: number;
  titleOpacity?: number;
  deviderHeight?: number;
}

const CalenderHeader = ({
  onPress,
  onPressSecondIcon,
  iconTint = Colors.originalBlue,
  backHidden,
  leftTitle,
  iconSize = 30,
  isDeviderShown = true,
  secondIcon,
  secondIconSrc,
  titleColor = Colors.primary,
  deviderHeight = 2,
}: CalenderHeaderProps) => {
  const [accordianView, setaccordianView] = React.useState(false);
  const [piData, setpiData] = React.useState<any>({});

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log('userData__', userData);
      let agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));
      console.log('FetchAgentViaEmail', agentData);
      setpiData(agentData);
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  return (
    <Animated.View style={{backgroundColor: Colors.primary, marginHorizontal:AutoScaledFont(15)}}>
      <AccordionItem
        containerStyle={{backgroundColor: accordianView ?  Colors.whiteAlabaster : Colors.primary}}
        customTitle={() => (
          <View style={[styles.mainView]}>
            <View
              style={[
                {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginTop: AutoScaledFont(10),
                },
              ]}>
              <Text style={[styles.rightText, {color:  accordianView ? Colors. black : titleColor}]}>
                {leftTitle}
              </Text>

              <View style={styles.iconView}>
                <CaretDown
                  color={accordianView ? Colors.black : Colors.white}
                  size={16}
                  weight="bold"
                  style={{alignSelf: 'center', marginTop: AutoScaledFont(1)}}
                />
              </View>
            </View>

            {!accordianView && (
              <TouchableOpacity onPress={onPressSecondIcon}>
                <View style={styles.secondicon}>{
                  <CalendarDots color={ accordianView ? Colors.black : Colors.white} />
                  }</View>
              </TouchableOpacity>
            )}
          </View>
        )}
        customBody={() => (
          <View style={styles.viewStyle}>
            <AvailabilitySection
              color={Colors.black}
              AvailableDates={
                get(piData, 'atwin.availability.working_hours', [])?.length +
                ' days'
              }
              EachDayHours={
                get(
                  piData,
                  'atwin.availability.working_hours[0].start_time',
                  '',
                ) +
                ' - ' +
                get(piData, 'atwin.availability.working_hours[0].end_time', '')
              }
              Exception={get(
                piData,
                'atwin.availability.working_hours[0].Exception',
                '-',
              )}
            />
          </View>
        )}
        animationDuration={200}
        customIcon={() => <></>}
        isOpen={false}
        onPress={isOpen =>
          isOpen ? setaccordianView(true) : setaccordianView(false)
        }></AccordionItem>

      {isDeviderShown && (
        <View style={[styles.mediumdDevider, {height: deviderHeight}]}></View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Regular',
    paddingEnd: AutoScaledFont(20),
  },
  rightText: {
    fontSize: AutoScaledFont(22),
    marginStart: AutoScaledFont(5),
    fontFamily: 'Poppins-Medium',
  },
  viewStyle: {
    // height: AutoScaledFont(300),
    // backgroundColor: Colors.red,
  },
  mainView: {
    flexDirection: 'row',
  },
  iconView: {
    marginStart: AutoScaledFont(5),
  },
  secondicon: {
    paddingHorizontal: AutoScaledFont(5),
  },
  mediumdDevider: {
    height: AutoScaledFont(0.1),
    alignSelf: 'stretch',
    marginHorizontal: -AutoScaledFont(15),
    marginTop: -AutoScaledFont(3),
    backgroundColor: Colors.lighterGray,
  },
});

export default CalenderHeader;
