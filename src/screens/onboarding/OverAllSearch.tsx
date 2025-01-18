import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AutoScaledFont, getDeviceHeight } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { debounce, get } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useSelector } from 'react-redux';
import {
  DeletePersonalContentBlock,
  OverAllSearch_,
} from '../../services/NotesService';
import { TOAST_ } from '../../config/Utils';
import NoteSearchHeader from '../../components/NoteSearchHeader';
import OverAllSearchCell from '../../components/OverAllSearchCell';

export const OverAllSearch = ({ route }: any) => {
  const navigation = useNavigation();
  const useFouced = useIsFocused();
  const [notes, setnotes] = React.useState<any>([]);
  const [myNotesId, setMyNotesId] = React.useState<any>('');
  const [currentNote, setcurrentNote] = React.useState<any>({});
  const [text, settext] = React.useState<any>('');
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const scrollViewRef = React.useRef(null);
  const [selected, setselected] = React.useState<number>(1);
  const [searchNote, setsearchNote] = useState(get(route, 'params.item.data.parameters.keyword', ''));

  React.useEffect(() => {
    console.log('OverAllSearch___', JSON.stringify(route.params));
    setMyNotesId(get(route, 'params.item.smartNote._id', ''))
    fetchSearch();

    // searchNotes();
  }, []);

  const searchNotes_ = async () => {
    if (!searchNote?.trim()) {
      return;
    }
    setLoading(true);
    setnotes([]);
    Keyboard.dismiss();

    console.log('myNotesId__', myNotesId);

    let data = {
      smartNoteId: myNotesId,
      query: searchNote?.trim(),
    };

    try {
      let result = await OverAllSearch_(data, token_);
      console.log('result____', result);
      setnotes(get(result, 'results', []));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateTextSubmit = (text: string) => {
    setsearchNote(text);
  };

  const fetchSearch = debounce(searchNotes_, 500);

  const SetCurrentItem = async (item: any) => {
    console.log('SetCurrentItem', get(item, 'item.authorRole', '') === 'agent');

    setcurrentNote(item);
    setshowModal(true);
  };

  // const deleteNoteSubmit = (item: any) => {
  //   deleteNote(item);
  // };

  const deleteNote = async (item: any) => {
    console.log('itemToUpdate__', item);
    console.log('textToUpdate__', text);
    if (!get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    let result = await DeletePersonalContentBlock(
      myNotesId,
      get(item, 'id', ''),
      token_,
    );
    if (get(result, 'status', '') == 'success') {
      searchNotes_();
      TOAST_('Note deleted successfully.', 'danger', 3000);
    }
  };

  // const updateTextSubmit_ = (text: any, item: any) => {
  //   UpdateNote(text, item);
  // };

  // const UpdateNote = async (text: string, item: any) => {
  //   console.log('itemToUpdate__', item);
  //   console.log('textToUpdate__', text);
  //   if (!(text || '').trim || !get(agentData, 'agent._id', '') || loading) {
  //     return;
  //   }
  //   Keyboard?.dismiss();
  //   let result = await UpdatePersonalContentBlock(
  //     myNotesId,
  //     get(item, 'id', ''),
  //     text,
  //     token_,
  //   );
  //   if (get(result, 'data._id', '')) {
  //     searchNotes_();
  //     TOAST_('Existing note updated successfully.', 'success', 3000);
  //   }
  // };

  return (
    <View style={{ backgroundColor: Colors.primary, flex: 1 }}>
      {useFouced && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}
      <NoteSearchHeader
        leftTitle={'Search client or notes'}
        secondIcon={true}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        onPressSecondIcon={fetchSearch}
        isDeviderShown={false}
        onTextSubmit={updateTextSubmit}
        secondIconSrc={
          <MagnifyingGlass
            color={Colors.white}
            size={20}
            weight={'bold'}
            style={{ marginEnd: AutoScaledFont(20) }}
          />
        }
        backHidden={false}
        iconTint={Colors.white}
        deviderHeight={0.5}
        defaultText={get(route, 'params.item.data.parameters.keyword', '')}
      />

      <View
        style={{
          flex: 1,
          marginHorizontal: AutoScaledFont(10),
          marginTop: AutoScaledFont(15),
          marginBottom: AutoScaledFont(10),
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(5),
          }}>

          <View
            style={[
              styles.mediumdDevider,
              { height: AutoScaledFont(0.5) },
            ]}></View>

          {selected == 1 && (
            <FlatList
              data={notes}
              renderItem={({ item, index }) => (
                <OverAllSearchCell
                  item={item}
                  finalIndex={index == (notes || []).length - 1}
                  SetCurrentItem={() => SetCurrentItem(item)}
                  visibleAgent={false}
                />
              )}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={{
                paddingBottom: AutoScaledFont(200),
                marginBottom: AutoScaledFont(10),
              }}
              ListEmptyComponent={
                <View>
                  {loading ? (
                    <View
                      style={{
                        alignSelf: 'center',
                        marginTop: getDeviceHeight() / 4,
                      }}>
                      <ActivityIndicator
                        size={'small'}
                        color={Colors.white}></ActivityIndicator>
                    </View>
                  ) : (
                    <Text style={styles.headerText}>
                      {`Search notes or client`}
                    </Text>
                  )}
                </View>
              }
            />
          )}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(22),
    marginTop: AutoScaledFont(40),
    marginHorizontal: AutoScaledFont(30),
    color: Colors.whiteAlabaster,
    fontFamily: 'Poppins-Regular',
  },
  mediumdDevider: {
    height: AutoScaledFont(2),
    alignSelf: 'stretch',
    marginHorizontal: -AutoScaledFont(15),
    marginTop: AutoScaledFont(5),
    backgroundColor: Colors.lighterGray,
  },
  input: {
    // borderWidth: AutoScaledFont(0.5),
    borderColor: '#ddd',
    borderRadius: AutoScaledFont(8),
    padding: AutoScaledFont(10),
    marginEnd: AutoScaledFont(10),
    marginStart: AutoScaledFont(10),
    color: Colors.black,
    // backgroundColor: Colors.white,
    flex: 1,
  },
});
