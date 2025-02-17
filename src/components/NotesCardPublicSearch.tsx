import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {get} from 'lodash';
import {Bell, DotsThree, PencilSimple, Trash} from 'phosphor-react-native';
import {
  FormatDateToReadable,
  FormatDateToReadableShort,
  GetParsedTime,
} from '../config/Utils';
interface NotesCardPublicSearchProps {
  item: any;
  finalIndex?: boolean;
  SetCurrentItem?: () => void;
  visibleAgent?:boolean
}

const NotesCardPublicSearch = ({
  item,
  finalIndex = false,
  SetCurrentItem,
  visibleAgent=true
}: NotesCardPublicSearchProps) => {
  // console.log('item__', item.text ,finalIndex);
  const [showMore, setshowMore] = useState<boolean>(false);
  const opacity = 0.9;
  let isUpdated = item?.timestamp != item?.updatedAt;
  let isAgent = item?.authorRole == 'agent';
  let authRole = item?.authorRole == 'agent' || item?.authorRole=='client'

  return (
    <View style={[{marginBottom: finalIndex ? AutoScaledFont(100) : 0}]}>
      <View
        style={[
          styles.cardContainer,
          {backgroundColor: isAgent ? Colors.whiteAlabaster : Colors.white},
        ]}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.userName}>{item.text}</Text>
          <TouchableOpacity onPress={SetCurrentItem}>
            <DotsThree
              color={Colors.black}
              size={24}
              weight={'regular'}
              style={{opacity: opacity}}
            />
          </TouchableOpacity>
        </View>

        {showMore && (
          <View style={{flexDirection: 'row', margin: AutoScaledFont(20)}}>
            <TouchableOpacity>
              <PencilSimple
                color={Colors.black}
                size={20}
                weight={'regular'}
                style={{opacity: 1, marginEnd: AutoScaledFont(20)}}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Trash
                color={Colors.red}
                size={20}
                weight={'regular'}
                style={{opacity: 1}}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: AutoScaledFont(14),
          textAlign: 'center',
          marginEnd: AutoScaledFont(20),
          color: Colors.white,
          opacity: 0.7,
        }}>
        {visibleAgent && (
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: AutoScaledFont(14),
              textAlign: 'left',
              marginEnd: AutoScaledFont(20),
              color: Colors.white,
              opacity: 0.7,
            }}>
            {'By -'}
            {item?.authorRole === 'agent' ? 'Agent' : 'Client'}
            {'     '}
          </Text>
        )}

        {/* {isUpdated && (
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: AutoScaledFont(14),
              textAlign: 'right',
              marginEnd: AutoScaledFont(20),
              color: Colors.secondary,
              opacity: 0.7,
            }}>
            {'Edited -'}
            {GetParsedTime(item?.updatedAt)}{' '}
            {FormatDateToReadableShort(item?.updatedAt)}
          </Text>
        )} */}

        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: AutoScaledFont(14),
            textAlign: 'right',
            marginEnd: AutoScaledFont(20),
            color: Colors.white,
            opacity: 0.7,
          }}>
          {'    '}
          {GetParsedTime(item?.createdAt)}{' '}
          {FormatDateToReadableShort(item?.createdAt)}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(15),
    marginHorizontal: AutoScaledFont(10),
    marginVertical: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
    backgroundColor: Colors.whiteAlabaster,
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
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
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

export default NotesCardPublicSearch;
