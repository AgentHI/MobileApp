import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {
  CheckCircle,
  DotsThree,
  Notepad,
  Pencil,
  Plus,
} from 'phosphor-react-native';
import {Constants} from '../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../fonts/routers/Routes';

interface UserCardHomeProps {
  item: any;
  onPress: () => void;
  isSelected?: boolean;
  showAdd?: boolean;
  index?:number
}

const UserCardHome = ({
  item,
  onPress,
  isSelected = false,
  showAdd = true,
  index
}: UserCardHomeProps) => {
  // console.log('item_clientNotes__', item);

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate(Routes.ClientNotes, {item});
      }}>
      <View style={styles.cardContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.userName}>{item?.name}</Text>
            <Text style={styles.email}>{item?.email}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(Routes.EditClient, {item: item})
            }>
            <DotsThree
              color={Colors.white}
              size={25}
              weight={'bold'}
              style={{
                opacity: 0.8,
                marginEnd: AutoScaledFont(5),
                marginTop: AutoScaledFont(5),
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderRadius: AutoScaledFont(10),
            borderColor: Colors.gray,
            flexDirection: 'row',
            marginTop: AutoScaledFont(5),
            marginStart: AutoScaledFont(10),
          }}>
          <Notepad
            size={18}
            color={Colors.white}
            style={{marginEnd: AutoScaledFont(5), opacity: 0.6}}
          />

          <Text
            style={{
              color: Colors.white,
              fontFamily: 'poppins-Regular',
              fontSize: AutoScaledFont(16),
              opacity: 0.6,
            }}>
            {Constants.clickToviewNotes}
          </Text>
        </View>

        {/* <Text
            style={{
              color: Colors.white,
              textAlign:'right',
              fontFamily: 'poppins-Regular',
              fontSize: AutoScaledFont(14),
              marginEnd: AutoScaledFont(16),
              opacity: 0.6,
            }}>
            {(index || 0)+1}
          </Text> */}

        {showAdd && (
          <View>
            {isSelected ? (
              <CheckCircle
                color={Colors.white}
                size={20}
                weight={'regular'}
                style={{marginEnd: AutoScaledFont(20)}}
              />
            ) : (
              <Plus
                color={Colors.white}
                size={20}
                weight={'regular'}
                style={{marginEnd: AutoScaledFont(20)}}
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(22),
    marginVertical: AutoScaledFont(5),
    marginHorizontal: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    backgroundColor: Colors.primary,
    borderColor: Colors.lighterGray,
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
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    opacity: 0.9,
    fontFamily: 'Poppins-SemiBold',
  },
  email: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(15),
    color: Colors.white,
    opacity: 0.8,
    fontFamily: 'Poppins-Medium',
  },
  postedTime: {
    fontSize: AutoScaledFont(16),
    color: Colors.secondaryLightIcons,
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

export default UserCardHome;
