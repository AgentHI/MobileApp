import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {get} from 'lodash';
import {FormatDateToReadableShort, GetParsedTime} from '../config/Utils';
import AiQuestionCell from './AiQuestionCell';
import AiSuggesstionsCell from './AiSuggestionsCell';
interface SummaryCardProps {
  item: any;
  finalIndex?: boolean;
  SetCurrentItem?: () => void;
}

const SummaryCard = ({
  item,
  finalIndex = false,
  SetCurrentItem,
}: SummaryCardProps) => {
  // console.log('item__', item.text ,finalIndex);
  const [showMore, setshowMore] = useState<boolean>(false);
  const [questionsData, setquestionsData] = useState<any>([]);
  const [Suggestions, setSuggestions] = useState<any>([]);
  const [parsedData, setparsedData] = useState<any>({});
  const opacity = 0.9;
  // let isUpdated = item?.timestamp != item?.updatedAt;
  let isUpdated = false;

  useEffect(() => {
    try {
      const data = JSON.parse(get(item, 'text', ''));
      let data1 = JSON.parse(data);

      console.log('data1', typeof data1);

      console.log('parsedData___', get(data1, 'Highlights', []));
      setparsedData(data1);
      setquestionsData(get(data1, 'Highlights', []));
      setSuggestions(get(data1, 'Suggestions', []));
    } catch (error) {}
  }, []);

  return (
    <View style={[{marginBottom: finalIndex ? AutoScaledFont(100) : 0}]}>
      <View style={[styles.cardContainer]}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.userName}>{parsedData.Summary}</Text>
        </View>

        {(questionsData || [])?.length ? (
          <View
            style={{
              width: '98%',
              alignSelf: 'center',
              columnGap: AutoScaledFont(20),
              marginBottom: AutoScaledFont(10),
            }}>
            <View
              style={{
                marginVertical: AutoScaledFont(4),
                marginStart: AutoScaledFont(-10),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.questionTitle}>{'AI-Highlights :'}</Text>
            </View>

            <FlatList
              data={questionsData}
              renderItem={({item, index}) => <AiQuestionCell item={item} />}
              keyExtractor={(item, index) => get(item, 'id', index)}
            />
          </View>
        ) : (
          <></>
        )}

        {(Suggestions || [])?.length ? (
          <View
            style={{
              width: '98%',
              alignSelf: 'center',
              columnGap: AutoScaledFont(20),
              marginBottom: AutoScaledFont(10),
            }}>
            <View
              style={{
                marginVertical: AutoScaledFont(4),
                marginStart: AutoScaledFont(-10),
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.questionTitle}>{'AI-Suggestions :'}</Text>
            </View>

            <FlatList
              data={Suggestions}
              renderItem={({item, index}) => <AiSuggesstionsCell item={item} />}
              keyExtractor={(item, index) => get(item, 'id', index)}
            />
          </View>
        ) : (
          <></>
        )}
      </View>

      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: AutoScaledFont(14),
          textAlign: 'right',
          marginEnd: AutoScaledFont(20),
          color: Colors.white,
          opacity: 0.7,
        }}>
        {isUpdated && (
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
        )}

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
          {GetParsedTime(item.timestamp)}{' '}
          {FormatDateToReadableShort(item.timestamp)}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(5),
    paddingVertical: AutoScaledFont(15),
    marginStart: AutoScaledFont(10),
    marginVertical: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
  },
  row: {
    alignItems: 'center',
    paddingVertical: AutoScaledFont(12),
    margin: AutoScaledFont(15),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
    // backgroundColor: Colors.white,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: AutoScaledFont(5),
  },
  questionTitle: {
    alignItems: 'center',
    color: Colors.jetBlack,
    fontFamily: 'Poppins-Medium',
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(18),
    marginVertical: AutoScaledFont(6),
    flex: 1,
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

export default SummaryCard;
