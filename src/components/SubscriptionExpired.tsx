import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AutoScaledFont, getPrimaryTextInputSize} from '../config/Size';
import {Colors} from '../constants/Colors';
import { Constants } from '../constants/Constants';

interface SubscriptionExpiredProps {
  warningTitle: string;
  warningMessageClick: () => void;
  warningMessage: string;
}

const SubscriptionExpired = ({
  warningTitle,
  warningMessageClick,
  warningMessage,
}: SubscriptionExpiredProps) => {
  return (
    <View style={[styles.mainView]}>
      <View style={{alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={styles.subtitle}>{warningTitle}</Text>
        <Text style={styles.title}>{warningMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginStart: AutoScaledFont(10),
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.red,
    textAlign: 'center',
  },
  subtitle: {
    marginStart: AutoScaledFont(10),
    fontSize: AutoScaledFont(17),
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    textAlign: 'center',
  },

  mainView: {
    marginTop: AutoScaledFont(20),
    paddingVertical: AutoScaledFont(20),
    marginHorizontal: AutoScaledFont(30),
    borderRadius: AutoScaledFont(10),
    borderWidth:AutoScaledFont(0.5),
    backgroundColor: Colors.white,
    borderColor: Colors.lighterGray,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow (Elevation)
    elevation: 8,
  },
});

export default SubscriptionExpired;
