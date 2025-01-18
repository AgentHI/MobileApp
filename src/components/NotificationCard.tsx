import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {DotsThree, PencilSimple, Trash} from 'phosphor-react-native';
import {FormatDateToReadableShort, GetParsedTime} from '../config/Utils';
import {MarkNotificationAsRead} from '../services/NotificationService';
import {get} from 'lodash';
interface NotificationCardProps {
  item: any;
  token_?: string;
}

const NotificationCard = ({
  item,
  token_ = '',
}: NotificationCardProps) => {
  const [status, setStatus] = useState<boolean>(false);
  useEffect(() => {
    setStatus(item?.isRead);
  }, [item]);

  const ReadNotification = async () => {
    if (!get(item, '_id', '') || !token_) {
      return;
    }
    let isRead = MarkNotificationAsRead(get(item, '_id', ''), token_);
    setStatus(true);
  };

  return (
    <TouchableOpacity onPress={() => ReadNotification()}>
      <View
        style={[
          {
            borderRadius: AutoScaledFont(10),
            marginTop: AutoScaledFont(5),
            marginHorizontal: AutoScaledFont(8),
            backgroundColor: status ? Colors.aliceBlue : Colors.whiteEggshell,
          },
        ]}>
        <View style={[styles.cardContainer]}>
          <View>
            <Text style={styles.userName}>{item?.title}</Text>
            <Text style={styles.userBody}>{item?.message}</Text>
          </View>

          {item.createdAt && (
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: AutoScaledFont(14),
                textAlign: 'right',
                marginEnd: AutoScaledFont(20),
                color: Colors.black,
                opacity: 0.6,
              }}>
              {'    '}
              {GetParsedTime(item?.createdAt)}{' '}
              {FormatDateToReadableShort(item?.createdAt)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(10),
    borderBottomWidth: AutoScaledFont(0.5),
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: AutoScaledFont(5),
  },
  text: {
    marginLeft: AutoScaledFont(10),
    fontSize: AutoScaledFont(15),
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  userName: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  userBody: {
    fontSize: AutoScaledFont(17),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  postedTime: {
    fontSize: AutoScaledFont(16),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  userPic: {
    height: AutoScaledFont(80),
    width: AutoScaledFont(80),
    borderRadius: AutoScaledFont(40),
    marginTop: AutoScaledFont(10),
    borderColor: Colors.primaryBlue,
    alignSelf: 'center',
    backgroundColor: Colors.charcole,
  },
});

export default NotificationCard;
