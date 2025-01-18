import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {Constants} from '../constants/Constants';
import {get} from 'lodash';
import BottomModal from './Modal/BottomSheetModal';
import NotesCardHome from './NotesCardHome';

interface ClientListProps {
  messagePress: () => void;
  latestMessages: any;
}

const LatestMessagesList = ({
  latestMessages,
  messagePress,
}: ClientListProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);


  return (
    <View style={[styles.mainView]}>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignContent: 'center',
        }}>
      </View>

      <FlatList
        data={latestMessages}
        renderItem={({item}) => (
          <NotesCardHome item={item} />
        )}
        keyExtractor={item => get(item, '_id', '')}
        scrollEnabled={true}
        ListEmptyComponent={
          <View>
              <Text style={styles.headerText}>
                {Constants.noLatestNoteAvailable}
              </Text>
          </View>
        }
      />

      <BottomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    width: AutoScaledFont(60),
    textAlign: 'center',
    opacity: 0.8,
  },
  subtitle: {
    marginStart: AutoScaledFont(16),
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    flex: 1,
    opacity: 0.8,
  },
  mainView: {
    marginTop: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
  },
  headerText: {
    fontSize: AutoScaledFont(21),
    marginTop: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
});

export default LatestMessagesList;
