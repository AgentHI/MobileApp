import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  AutoScaledFont,
} from '../config/Size';
import {Colors} from '../constants/Colors';
import {X} from 'phosphor-react-native';
import { get } from 'lodash';

interface AttachmentsCellProps {
  item: any;
  onPressClose?: () => {};
  showClose?: boolean;
  isSelected?: boolean;
  title?:string
}

const AttachmentsCell = ({
  item,
  onPressClose,
  showClose = true,
  isSelected=true,
  title=get(item,'name','')
}: AttachmentsCellProps) => {
  return (
    <View style={[styles.cardContainer,{backgroundColor:isSelected? Colors.secondary : Colors.lighterGray}]}>
      <View style={styles.row}>
        <Text style={styles.userName}>{title}</Text>
        <TouchableOpacity onPress={onPressClose}>
          {showClose && <X size={18} weight={'regular'} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: AutoScaledFont(12),
    marginVertical: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(17),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    marginLeft: AutoScaledFont(5),
    fontSize: AutoScaledFont(18),
    color: Colors.black,
    // lineHeight:AutoScaledFont(25),
    marginEnd: AutoScaledFont(20),
    fontFamily: 'Poppins-regular',
    textAlign: 'center',
  },
  postedTime: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(16),
    color: Colors.secondaryLightIcons,
    fontFamily: 'Poppins-Regular',
  },
});

export default AttachmentsCell;
