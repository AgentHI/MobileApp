import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
interface NotesCardCenteredProps {
  item: any;
  finalIndex?: boolean;
  SetCurrentItem?: () => void;
  editable?: boolean;
}

const NotesCardCentered = ({
  item,
  finalIndex = false,
  SetCurrentItem,
  editable,
}: NotesCardCenteredProps) => {
  // console.log('item__', item.text, finalIndex);
  const [text, settext] = useState<string>(item?.text);
  const textInputRef = useRef(null);

  useEffect(() => {
    // Focus the TextInput when `editable` is true
    if (editable && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [editable]);

  return (
    <View style={[{marginBottom: finalIndex ? AutoScaledFont(100) : 0}]}>
      <View style={[styles.cardContainer]}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            ref={textInputRef}
            style={styles.userName}
            placeholderTextColor={Colors.gray}
            value={text}
            multiline={true}
            editable={editable}
            onChangeText={settext}
          />

          <TouchableOpacity onPress={SetCurrentItem}></TouchableOpacity>
        </View>
      </View>
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
    // borderWidth: AutoScaledFont(0.5),
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
    // backgroundColor: Colors.white,
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

export default NotesCardCentered;
