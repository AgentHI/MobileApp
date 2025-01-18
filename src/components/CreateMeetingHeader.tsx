import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { AutoScaledFont, getPrimaryTextInputSize } from '../config/Size';
import { Constants } from '../constants/Constants';
import { Colors } from '../constants/Colors';
import { ArrowLeft } from 'phosphor-react-native';


interface MeetingHeaderProps {
  topic: string;
  onPressSecondIcon: () => void;
  onPressFirstIcon: () => void;
  searchTitle: string;
}

const CreateMeetingHeader = ({topic, onPressSecondIcon, onPressFirstIcon }: MeetingHeaderProps) => {

  return (
    <View
      style={[
        styles.textinputView_Pass,
        {
          marginTop:AutoScaledFont(30)
        },
      ]}>
      <View style={{flexDirection: 'row'}}>

      {true && (
          <TouchableOpacity onPress={onPressFirstIcon}>
            <View style={styles.secondicon}>
              <ArrowLeft
                color={Colors.jetBlack}
                size={22}
                weight={'bold'}
                style={styles.headerIcon}
              />
            </View>
          </TouchableOpacity>
        )}

    
        <View style={{justifyContent: 'center', flex:1}}>
          <Text style={styles.title}>{Constants.CreateNewMeeting}</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginStart: AutoScaledFont(10),
    fontSize: AutoScaledFont(22),
    lineHeight: AutoScaledFont(28),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.originalBlue,
  },
  subtitle: {
    marginStart: AutoScaledFont(10),
    fontSize: AutoScaledFont(17),
    fontFamily: 'Poppins-Medium',
    color: Colors.charcole,
  },
  headerIcon: {
    alignSelf: 'center',
  },
  topicName: {
    marginEnd: AutoScaledFont(5),
    fontSize: AutoScaledFont(17),
    fontFamily: 'Poppins-Medium',
    alignSelf: 'center',
    color: Colors.originalBlue,
  },
  input_pass: {
    marginStart: AutoScaledFont(15),
    fontSize: AutoScaledFont(16),
    fontFamily: 'Poppins-Regular',
    alignSelf: 'center',
    color: Colors.charcole,
  },
  textinputView_Pass: {
    marginBottom: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
    borderColor: Colors.headerThreeColor,
  },
  saerchBar: {
    height: getPrimaryTextInputSize() - AutoScaledFont(8),
    marginTop: AutoScaledFont(10),
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: AutoScaledFont(0.5),
    borderRadius: AutoScaledFont(10),
    borderColor: Colors.headerThreeColor,
  },
  secondicon: {
    padding: AutoScaledFont(10),
    borderRadius: AutoScaledFont(12),
  },
  searchIconView: {
    width: AutoScaledFont(40),
    height: AutoScaledFont(40),
    marginEnd: AutoScaledFont(30),
    borderColor: Colors.headerThreeColor,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  falgView: {
    width: AutoScaledFont(90),
    height: AutoScaledFont(40),
    borderColor: Colors.skipColor,
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderStartWidth: AutoScaledFont(0.3),
    justifyContent: 'center',
  },
  selectionView: {
    paddingHorizontal: AutoScaledFont(14),
    flexDirection: 'row',
    borderWidth: AutoScaledFont(0.3),
    borderRadius: AutoScaledFont(10),
    borderColor: Colors.skipColor,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  selection: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: AutoScaledFont(22),
    height: AutoScaledFont(22),
    marginStart: AutoScaledFont(22),
    alignSelf: 'center',
  },
  flagIcon: {
    width: AutoScaledFont(25),
    height: AutoScaledFont(25),
    // marginStart: AutoScaledFont(22),
    alignSelf: 'center',
  },
  articleIcon: {
    width: AutoScaledFont(25),
    height: AutoScaledFont(25),
    marginEnd: AutoScaledFont(5),
    alignSelf: 'center',
  },
  userPic: {
    height: AutoScaledFont(50),
    width: AutoScaledFont(50),
    borderRadius: AutoScaledFont(25),
    borderColor: Colors.primaryBlue,
    alignSelf: 'center',
    backgroundColor: Colors.charcole,
  },
  downArrowicon: {
    width: AutoScaledFont(12),
    height: AutoScaledFont(12),
    marginStart: AutoScaledFont(12),
    alignSelf: 'center',
  },
});

export default CreateMeetingHeader;
