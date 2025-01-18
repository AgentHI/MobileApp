import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {
  AutoScaledFont,
  getDeviceWidth,
} from '../config/Size';
import {Colors} from '../constants/Colors';
import {Constants} from '../constants/Constants';

interface HomeOptionTabsCleanProps {
  warningTitle?: string;
  onSchedulePress: () => void;
  onClientPress: () => void;
  onMessagesPress: () => void;
  scheduleCount?: string;
  clientCount?: string;
  messageCount?: string;
  selected: number;
}

const HomeOptionTabsClean = ({
  warningTitle,
  onSchedulePress,
  scheduleCount = '0',
  onClientPress,
  onMessagesPress,
  clientCount = '0',
  messageCount = '0',
  selected = 1,
}: HomeOptionTabsCleanProps) => {
  return (
    <View style={[styles.mainView]}>
      <View style={{flexDirection: 'row'}}>

      <Pressable onPress={onClientPress}>
          <View
            style={[
              selected == 1
                ? styles.firstTabSelected
                : styles.firstTabUnselected,
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <User color={Colors.black} size={18} weight={'regular'} /> */}
              <Text style={styles.title}>{Constants.client}</Text>

              <Text style={styles.subtitle}>{clientCount}</Text>
            </View>
          </View>
        </Pressable>



        <Pressable onPress={onSchedulePress}>
          <View
            style={[
              selected == 2
                ? styles.firstTabSelected
                : styles.firstTabUnselected,
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Clock color={Colors.black} size={18} weight={'regular'} /> */}
              <Text style={styles.title}>{Constants.Appointment}</Text>

              <Text style={styles.subtitle}>{scheduleCount}</Text>
            </View>
          </View>
        </Pressable>


    


        <Pressable onPress={onMessagesPress}>
          <View
            style={[
              selected == 3
                ? styles.firstTabSelected
                : styles.firstTabUnselected,
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <ChatDots color={Colors.black} size={18} weight={'regular'} /> */}
              <Text style={styles.title}>{Constants.LatestNotes}</Text>
              <Text style={styles.subtitle}>{' '}</Text>
            </View>
          </View>
        </Pressable>
   
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(5),
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: AutoScaledFont(20),
    marginStart: AutoScaledFont(10),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    textAlign: 'center',
  },
  title1: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    color: Colors.secondaryLightIcons,
  },
  subtitle1: {
    marginStart: AutoScaledFont(20),
    fontSize: AutoScaledFont(18),
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: Colors.secondaryLightIcons,
  },

  mainView: {
    marginVertical: AutoScaledFont(20),
    borderRadius: AutoScaledFont(10),
    alignSelf:'center'
  },
  firstTabSelected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(15),
    marginEnd: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    // minWidth: AutoScaledFont(120),
    backgroundColor: Colors.secondary,
  },
  firstTabUnselected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(15),
    marginEnd: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    // minWidth: AutoScaledFont(120),
    backgroundColor: Colors.secondaryLight,
  },
  secondTabSelected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(30),
    marginVertical: AutoScaledFont(4),
    borderRadius: AutoScaledFont(10),
    width: getDeviceWidth() / 2 - AutoScaledFont(35),
    backgroundColor: Colors.secondary,
  },
  secondTabUnselected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(30),
    marginVertical: AutoScaledFont(4),
    borderRadius: AutoScaledFont(10),
    width: getDeviceWidth() / 2 - AutoScaledFont(35),
    backgroundColor: Colors.secondaryLight,
  },
  secondTabInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AutoScaledFont(2),
  },
});

export default HomeOptionTabsClean;
