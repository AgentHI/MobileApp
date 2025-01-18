import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AutoScaledFont, getDeviceHeight} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {debounce, get} from 'lodash';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import {MagnifyingGlass, Microphone, NotePencil} from 'phosphor-react-native';
import {useSelector} from 'react-redux';
import NotesCard from '../../components/NotesCard';
import {
  AddPersonalContentBlock,
  AddPrivateContentBlock,
  AddPublicContentBlock,
  DeletePersonalContentBlock,
  FetchSummaryNotes,
  SearchNotes,
  UpdatePersonalContentBlock,
} from '../../services/NotesService';
import MyNotesModal from '../../components/Modal/MyNotesModal';
import UpdateNotesModal from '../../components/Modal/UpdateNotesModal';
import {TOAST_, TrimmedText} from '../../config/Utils';
import Voice from '@react-native-voice/voice';
import NotesTabsOptions from '../../components/NotesTabOption';
import NotesCardPublic from '../../components/NotesCardPublic';
import SummaryCard from '../../components/SummaryCard';
import NoteSearchHeader from '../../components/NoteSearchHeader';
import NotesTabsOptionsSearch from '../../components/NotesTabOptionSearch';
import NotesCardPublicSearch from '../../components/NotesCardPublicSearch';

export const NotesSearch = ({route}: any) => {
  const [piData, setpiData] = React.useState<any>({});
  const navigation = useNavigation();
  const useFouced = useIsFocused();
  const [notes, setnotes] = React.useState<any>([]);
  const [privateNotes, setprivateNotes] = React.useState<any>([]);
  const [summaryNotes, setsummaryNotes] = React.useState<any>([]);

  const [privateNoteId, setprivateNoteId] = React.useState<any>('');
  const [currentNote, setcurrentNote] = React.useState<any>({});
  const [text, settext] = React.useState<any>('');
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [showModalUpdate, setshowModalUpdate] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const scrollViewRef = React.useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [selected, setselected] = React.useState<number>(1);
  const [searchNote, setsearchNote] = useState('');

  React.useEffect(() => {
    console.log('NotesSearch___', route.params);
    setselected(get(route, 'params.selected', 1));
    setprivateNoteId(get(route, 'params.privateNoteId', ''));
    // searchNotes();
  }, []);

  const searchNotes_ = async () => {
    if (!searchNote?.trim()) {
      return;
    }
    setLoading(true);
    setnotes([]);
    Keyboard.dismiss();

    console.log('privateNoteId__',privateNoteId);
    

    let data = {
      notes_id:
        selected == 1
          ? get(route, 'params.item.public_note', '')
          : selected == 2
          ? privateNoteId
          : '',
      query: searchNote?.trim(),
    };

    try {
      let result = await SearchNotes(data, token_);
      console.log('result____', result);

      selected == 1
      ?setnotes(get(result, 'results.content', []))
      : selected == 2
      ? setprivateNotes(get(result, 'results.content', []))
      : '',


      // setnotes(get(result, 'results.content', []));
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

    // if (get(item, 'item.authorRole', '') === 'agent') {
    //   setshowModal(true);
    // }
  };

  const deleteNoteSubmit = (item: any) => {
    deleteNote(item);
  };

  const deleteNote = async (item: any) => {
    console.log('itemToUpdate__', item);
    console.log('textToUpdate__', text);
    if (!get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    let statusId =
      selected == 1
        ? get(route, 'params.item.public_note', '')
        : selected == 2
        ? privateNoteId
        : '';
    let result = await DeletePersonalContentBlock(
      statusId,
      get(item, 'id', ''),
      token_,
    );
    if (get(result, 'status', '') == 'success') {
      searchNotes_();
      TOAST_('Note deleted successfully.', 'danger', 3000);
    }
  };

  const updateTextSubmit_ = (text: any, item: any) => {
    UpdateNote(text, item);
  };

  const UpdateNote = async (text: string, item: any) => {
    console.log('itemToUpdate__', item);
    console.log('textToUpdate__', text);
    if (!(text || '').trim || !get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    let statusId =
      selected == 1
        ? get(route, 'params.item.public_note', '')
        : selected == 2
        ? privateNoteId
        : '';
    let result = await UpdatePersonalContentBlock(
      statusId,
      get(item, 'id', ''),
      text,
      token_,
    );
    if (get(result, 'data._id', '')) {
      searchNotes_();
      TOAST_('Existing note updated successfully.', 'success', 3000);
    }
  };

  return (
    <View style={{backgroundColor: Colors.primary, flex: 1}}>
      {useFouced && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}
      <NoteSearchHeader
        leftTitle={''}
        secondIcon={true}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        onPressSecondIcon={fetchSearch}
        isDeviderShown={true}
        onTextSubmit={updateTextSubmit}
        secondIconSrc={
          <MagnifyingGlass
            color={Colors.white}
            size={20}
            weight={'bold'}
            style={{marginEnd: AutoScaledFont(20)}}
          />
        }
        backHidden={false}
        iconTint={Colors.white}
        deviderHeight={0.5}
      />

      <View
        style={{
          flex: 1,
          marginHorizontal: AutoScaledFont(10),
          marginTop: AutoScaledFont(15),
          marginBottom: AutoScaledFont(20),
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(5),
          }}>
          <NotesTabsOptionsSearch
            warningTitle={Constants.yourSubscriptionHasExpired}
            onfirstPress={() => setselected(1)}
            onSecondPress={() => setselected(2)}
            onThirdPress={() => setselected(3)}
            selected={selected}
          />

          <View
            style={[
              styles.mediumdDevider,
              {height: AutoScaledFont(0.5)},
            ]}></View>

          {selected == 1 && (
            <FlatList
              data={notes}
              renderItem={({item, index}) => (
                <NotesCardPublicSearch
                  item={item}
                  finalIndex={index == (notes || []).length - 1}
                  SetCurrentItem={() => SetCurrentItem(item)}
                />
              )}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              style={{
                paddingBottom: AutoScaledFont(200),
                marginBottom: AutoScaledFont(10),
              }}
              onContentSizeChange={() => {
                if (scrollViewRef?.current && notes?.length > 0) {
                  scrollViewRef.current.scrollToEnd({animated: true});
                }
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
                      {`Searching inside ${get(
                        route,
                        'params.item.name',
                        '',
                      )}'s notes`}
                    </Text>
                  )}
                </View>
              }
            />
          )}

          {selected == 2 && (
            <FlatList
              data={privateNotes}
              renderItem={({item, index}) => (
                <NotesCardPublicSearch
                  item={item}
                  finalIndex={index == (notes || []).length - 1}
                  SetCurrentItem={() => SetCurrentItem(item)}
                />
              )}
              keyExtractor={item => get(item, '_id', '')}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              style={{
                paddingBottom: AutoScaledFont(200),
                marginBottom: AutoScaledFont(10),
              }}
              onContentSizeChange={() => {
                if (scrollViewRef?.current && notes?.length > 0) {
                  scrollViewRef.current.scrollToEnd({animated: true});
                }
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
                      {`Searching inside ${get(
                        route,
                        'params.item.name',
                        '',
                      )}'s notes`}
                    </Text>
                  )}
                </View>
              }
            />
          )}
        </View>

        {/* <TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: AutoScaledFont(0.8),
              paddingHorizontal: AutoScaledFont(20),
              paddingVertical: AutoScaledFont(18),
              borderRadius: AutoScaledFont(10),
              borderColor: Colors.gray,
              borderStyle: 'dashed',
              backgroundColor: Colors.primary,
              marginHorizontal: AutoScaledFont(30),
              marginBottom: AutoScaledFont(10),
            }}>
            <TouchableOpacity onPress={() => setshowModalUpdate(true)}>
              <NotePencil
                size={20}
                color={Colors.white}
                style={{marginHorizontal: AutoScaledFont(15)}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setshowModalUpdate(true)}
              style={{flex: 1}}>
              <Text
                style={{
                  flex: 1,
                  color: Colors.whiteAlabaster,
                  fontFamily: 'poppins-Regular',
                  fontSize: AutoScaledFont(20),
                }}>
                {Constants.noteHere}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setshowModalUpdate(true);
                isListening ? stopListening() : startListening();
              }}>
              <Microphone
                size={20}
                color={Colors.white}
                style={{marginStart: AutoScaledFont(15)}}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity> */}
      </View>

      {showModal && (
        <MyNotesModal
          isVisible={showModal}
          onClosePress={() => setshowModal(false)}
          item={currentNote}
          onTextSubmit={updateTextSubmit_}
          deleteNoteSubmit={deleteNoteSubmit}
        />
      )}

      {/* {showModalUpdate && (
        <UpdateNotesModal
          isVisible={showModalUpdate}
          onClosePress={() => setshowModalUpdate(false)}
          onTextSubmit={handleTextSubmit}
          noteAvailable={text}
          onPressListening={startListening}
          onPressStopListening={stopListening}
          isListening={isListening}
        />
      )} */}
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
