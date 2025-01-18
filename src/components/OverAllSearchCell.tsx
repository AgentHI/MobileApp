import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { AutoScaledFont } from '../config/Size';
import { Colors } from '../constants/Colors';
import { get } from 'lodash';
import { DotsThree, PencilSimple, Trash } from 'phosphor-react-native';
import UserCardHome from './UserCardHome';
import { useNavigation } from '@react-navigation/native';
interface OverAllSearchCellProps {
  item: any;
  finalIndex?: boolean;
  SetCurrentItem?: () => void;
  visibleAgent?: boolean
}

const OverAllSearchCell = ({
  item,
  finalIndex = false,
  SetCurrentItem,
  visibleAgent = true
}: OverAllSearchCellProps) => {
  // console.log('item__', item.text ,finalIndex);
  const navigation = useNavigation();
  const [showMore, setshowMore] = useState<boolean>(false);
  const opacity = 0.9;
  let isUpdated = item?.timestamp != item?.updatedAt;
  let isAgent = item?.authorRole == 'agent';
  let authRole = item?.authorRole == 'agent' || item?.authorRole == 'client'

  return (
    <View style={[{ marginBottom: finalIndex ? AutoScaledFont(100) : 0 }]}>
      {
        get(item, 'type', '') == 'notes' &&
        <TouchableOpacity
          style={[
            styles.cardContainer,
            // {backgroundColor: isAgent ? Colors.whiteAlabaster : Colors.white},
          ]}
          onPress={() => navigation.navigate('NavigatorSmartNotes')}
          >
          <View >
            <Text style={styles.type_}>{'Type: Notes'}</Text>
            <Text style={styles.userName}>{item.text}</Text>
            {/* <FlatList
              data={item.text}
              renderItem={({ item }) => (
                <Text style={styles.userName}>{item}</Text>
              )}
            /> */}
          </View>
        </TouchableOpacity>
      }
      {
        get(item, 'type', '') == 'user' &&
        <UserCardHome item={item} onPress={() => { }} showAdd={false} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(15),
    marginHorizontal: AutoScaledFont(10),
    marginTop: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
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
    color: Colors.white,
    flex: 1,
    fontFamily: 'Poppins-Medium',
  },
  type_: {
    fontSize: AutoScaledFont(14),
    marginStart: AutoScaledFont(12),
    color: Colors.white,
    opacity: 0.6,
    fontFamily: 'Poppins-Regular',
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

export default OverAllSearchCell;
