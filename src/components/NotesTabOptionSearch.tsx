import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {AutoScaledFont, getDeviceWidth} from '../config/Size';
import {Colors} from '../constants/Colors';
import {Constants} from '../constants/Constants';
import {Funnel, Sliders} from 'phosphor-react-native';

interface NotesTabsOptionsSearchProps {
  warningTitle?: string;
  onfirstPress: () => void;
  onSecondPress: () => void;
  onThirdPress: () => void;
  selected: number;
}

const NotesTabsOptionsSearch = ({
  warningTitle,
  onfirstPress,
  onSecondPress,
  onThirdPress,
  selected = 1,
}: NotesTabsOptionsSearchProps) => {
  return (
    <View style={[styles.mainView]}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Sliders
          size={25}
          color={Colors.secondary}
          style={{
            marginEnd: AutoScaledFont(10),
            marginStart: -AutoScaledFont(35),
            alignSelf: 'center',
            opacity: 0.8,
          }}
        />

        <Pressable onPress={onfirstPress}>
          <View
            style={[
              selected == 1
                ? styles.firstTabSelected
                : styles.firstTabUnselected,
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>{Constants.public}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable onPress={onSecondPress}>
          <View
            style={[
              selected == 2
                ? styles.firstTabSelected
                : styles.firstTabUnselected,
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.title}>{Constants.private}</Text>
            </View>
          </View>
        </Pressable>

        {false && (
          <Pressable onPress={onThirdPress}>
            <View
              style={[
                selected == 3
                  ? styles.firstTabSelected
                  : styles.firstTabUnselected,
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>{Constants.myNotes}</Text>
              </View>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: AutoScaledFont(18),
    marginHorizontal: AutoScaledFont(15),
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
    // marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    alignSelf: 'center',
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

export default NotesTabsOptionsSearch;
