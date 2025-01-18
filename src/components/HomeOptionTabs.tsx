import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {AutoScaledFont, getDeviceWidth, getPrimaryTextInputSize} from '../config/Size';
import {Colors} from '../constants/Colors';
import {Constants} from '../constants/Constants';
import {ChatDots, Clock, User} from 'phosphor-react-native';

interface HomeOptionTabsProps {
  warningTitle?: string;
  onSchedulePress: () => void;
  onClientPress: () => void;
  onMessagesPress: () => void;
  scheduleCount?: string;
  clientCount?: string;
  messageCount?: string;
  selected:number
}

const HomeOptionTabs = ({
  warningTitle,
  onSchedulePress,
  scheduleCount = '0',
  onClientPress,
  onMessagesPress,
  clientCount='0',
  messageCount='0',
  selected=1
}: HomeOptionTabsProps) => {
  return (
    <View style={[styles.mainView]}>
      <View style={{flexDirection: 'row'}}>
        <Pressable onPress={onSchedulePress}>
          <View style={[selected==1 ? styles.firstTabSelected :styles.firstTabUnselected ]}>
            <Clock color={Colors.black} size={20} weight={'regular'} />
            <Text style={styles.title}>{Constants.schedules}</Text>
            <Text style={styles.subtitle}>{scheduleCount}</Text>
          </View>
        </Pressable>
        <View>


        <Pressable onPress={onClientPress}>
        <View style={[selected==2 ? styles.secondTabSelected :styles.secondTabUnselected ]}>
        <User color={Colors.secondaryLightIcons} size={16} weight={'regular'} />
            <View style={styles.secondTabInnerView}>
            <Text style={styles.title1}>{Constants.client}</Text>
            <Text style={styles.subtitle1}>{clientCount}</Text>
          </View>
          </View>

        </Pressable>

        <Pressable onPress={onMessagesPress}>
        <View style={[selected==3 ? styles.secondTabSelected :styles.secondTabUnselected ]}>
            <ChatDots color={Colors.secondaryLightIcons} size={16} weight={'regular'} />
            <View style={styles.secondTabInnerView}>
            <Text style={styles.title1}>{Constants.messages}</Text>
            <Text style={styles.subtitle1}>{messageCount}</Text>
          </View>
          </View>
        </Pressable>
      </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: AutoScaledFont(2),
    fontSize: AutoScaledFont(24),
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
  },
  subtitle: {
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
  },
  title1: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Regular',
    textAlign:'right',
    color: Colors.secondaryLightIcons,
  },
  subtitle1: {
    marginStart: AutoScaledFont(20),
    fontSize: AutoScaledFont(18),
    textAlign:'center',
   fontFamily: 'Poppins-SemiBold',
    color: Colors.secondaryLightIcons,
  },

  mainView: {
    marginTop: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(20),
    marginHorizontal: AutoScaledFont(30),
    borderRadius: AutoScaledFont(10),
    backgroundColor: Colors.white,
  },
  firstTabSelected: {
    paddingVertical: AutoScaledFont(25),
    paddingStart: AutoScaledFont(20),
    width:getDeviceWidth()/2-AutoScaledFont(35),
    marginEnd: AutoScaledFont(10),
    borderRadius: AutoScaledFont(20),
    backgroundColor: Colors.secondary,
  },
  firstTabUnselected: {
    paddingVertical: AutoScaledFont(25),
    paddingStart: AutoScaledFont(20),
    width:getDeviceWidth()/2-AutoScaledFont(35),
    marginEnd: AutoScaledFont(10),
    borderRadius: AutoScaledFont(20),
    backgroundColor: Colors.secondaryLight,
  },
  secondTabSelected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(30),
    marginVertical: AutoScaledFont(4),
    borderRadius: AutoScaledFont(10),
    width:getDeviceWidth()/2-AutoScaledFont(35),
    backgroundColor: Colors.secondary,
  },
  secondTabUnselected: {
    paddingVertical: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(30),
    marginVertical: AutoScaledFont(4),
    borderRadius: AutoScaledFont(10),
    width:getDeviceWidth()/2-AutoScaledFont(35),
    backgroundColor: Colors.secondaryLight,
  },
  secondTabInnerView:
  {flexDirection: 'row',
     alignItems:'center',    
     marginTop: AutoScaledFont(2),
  }
});

export default HomeOptionTabs;
