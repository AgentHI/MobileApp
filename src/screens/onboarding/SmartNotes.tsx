import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont, getDeviceHeight } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { debounce, get } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { MagnifyingGlass, Microphone, NotePencil } from 'phosphor-react-native';
import { useSelector } from 'react-redux';
import NotesCard from '../../components/NotesCard';
import {
  AddPersonalContentBlock,
  DeletePersonalContentBlock,
  FetchSmartNotes,
  UpdatePersonalContentBlock,
} from '../../services/NotesService';
import { CheckAgentViaEmail } from '../../services/AgentServices';
import MyNotesModal from '../../components/Modal/MyNotesModal';
import UpdateNotesModal from '../../components/Modal/UpdateNotesModal';
import { RequestMicrophonePermission, TOAST_ } from '../../config/Utils';
import Voice, { SpeechErrorEvent } from '@react-native-voice/voice';
import { Routes } from '../../fonts/routers/Routes';
import { ShareSmartNotesWithClient } from '../../services/ClientService';

export const SmartNotes = () => {
  const [piData, setpiData] = React.useState<any>({});
  const navigation = useNavigation();
  const useFouced = useIsFocused();
  const [notes, setnotes] = React.useState<any>([]);
  const [currentNote, setcurrentNote] = React.useState<any>({});
  const [text, settext] = React.useState<any>('');
  const [finalText, setFinalText] = useState('');
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [showModalUpdate, setshowModalUpdate] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const scrollViewRef = React.useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [recordMode, setrecordMode] = useState(false);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const [smartNotesPage, setSmartNotesPage] = useState(1);
  const [notesTotal, setnotesTotal] = useState(0);
  const [error, setError] = useState('');

  React.useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (!showModalUpdate) {
      stopListening();
    }
  }, [showModalUpdate]);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechResults = event => {
    console.log('Speech results:', event?.value[0]);
    settext(event?.value[0]);
  };

  const onSpeechEnd = async () => {
    console.log('Speech ended');
    setFinalText(text);
    setIsListening(false);
  };

  const onSpeechError = (error: SpeechErrorEvent) => {
    
    console.log('Speeaaaaaaaaaaaaaaaaaach error:', error);
    console.log('Speech error:', error);
    if (error.error?.code !== '5') {
      setError(error.error?.message ?? 'Something went wrong please contact support team.')
    }
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      console.log('Starting listening');
      settext('');
      setError('');
      setFinalText('');
      setIsListening(true);
      await Voice.start('en-IN');
    } catch (error) {
      console.log('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      console.log('Stopping listening');
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.log('Error stopping voice recognition:', error);
    }
  };

  const restartListening = async () => {
    try {
      console.log('restartListening');
      await Voice.stop();
      await Voice.start('en-IN');
    } catch (error) {
      console.log('Error restarting voice recognition:', error);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current && notes.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [notes]);

  const getUserData = async () => {
    try {
      setLoading(true);
      setnotes([])
      setnotesTotal(0)
      try {
        let recentNotes = await FetchSmartNotes(
          get(agentData, 'smartNote._id', ''),
          token_,
          1,
        );
        if (get(recentNotes, 'data', [])) {
          setnotes(get(recentNotes, 'data', []));
          setnotesTotal(get(recentNotes, 'total', 0))
          setIsLoadmore(true);
        }
        setLoading(false);
        setSmartNotesPage((prev) => prev + 1);
      } catch (error) { }
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const Loadmore = async () => {
    if (!isLoadmore || loading) {
      return;
    }
    console.log('smartNotesPage_____', smartNotesPage);

    try {
      setLoading(true);

      console.log("AGENTDATA", agentData);
      

      let recentNotes = await FetchSmartNotes(
        get(agentData, 'smartNote._id', ''),
        token_,
        smartNotesPage,
      );

      const newNotes = get(recentNotes, 'data', []);
      if (newNotes?.length === 0) {
        setIsLoadmore(false);
      } else {
        setSmartNotesPage((prev) => prev + 1);
      }

      setnotes(prevNotes => {
        const existingIds = new Set(prevNotes.map(note => note?._id));
        const filteredNotes = newNotes.filter(
          note => !existingIds.has(note?._id),
        );
        return [...prevNotes, ...filteredNotes];
      });

      setLoading(false);
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const debouncedLoadMore = debounce(Loadmore, 300);

  const CreateNote = async (text: string) => {
    if (!(text || '').trim || !get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    const formData = new FormData();
    formData.append('type', 'text');
    formData.append('text', text);
    formData.append('notes_type', 'AGENT_NOTES');
    formData.append('authorId', get(agentData, 'agent._id', ''));
    formData.append('authorRole', 'agent');
    let result = await AddPersonalContentBlock(
      get(agentData, 'smartNote._id', ''),
      formData,
      token_,
    );
    if (get(result, 'data._id', '')) {
      getUserData();
      TOAST_('New note created', 'success', 3000);
    }
  };

  const UpdateNote = async (text: string, item: any) => {
    console.log('itemToUpdate__', item);
    console.log('textToUpdate__', text);
    if (!(text || '').trim || !get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    let result = await UpdatePersonalContentBlock(
      get(agentData, 'smartNote._id', ''),
      get(item, 'uuid', ''),
      text,
      token_,
    );
    if (get(result, 'data._id', '')) {
      getUserData();
      TOAST_('Existing note updated successfully.', 'success', 3000);
    }
  };

  const deleteNote = async (item: any) => {
    console.log('itemToUpdate__', item);
    console.log('textToUpdate__', text);
    if (!get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    let result = await DeletePersonalContentBlock(
      get(agentData, 'smartNote._id', ''),
      get(item, 'uuid', ''),
      token_,
    );
    if (get(result, 'status', '') == 'success') {
      getUserData();
      TOAST_('Note deleted successfully.', 'danger', 3000);
    }
  };

  const shareNote = async (item: any) => {
    
    if (!get(agentData, 'agent._id', '') || loading) {
      return;
    }
    Keyboard?.dismiss();
    
    let result = await ShareSmartNotesWithClient(
      get(item, '_id', ''),
      token_,
    );
    console.log("result", result);
    
    if (get(result, 'status', '') == 'success') {
      getUserData();
      TOAST_('Note shared successfully.', 'success', 3000);
    }
  };

  const handleTextSubmit = (text: any) => {
    CreateNote(text);
  };

  const updateTextSubmit = (text: any, item: any) => {
    UpdateNote(text, item);
  };

  const deleteNoteSubmit = (item: any) => {
    deleteNote(item);
  };

  const shareNoteSubmit = (item: any) => {
    shareNote(item);
  };

  const SetCurrentItem = async (item: any) => {
    setcurrentNote(item);
    setshowModal(true);
  };
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
      <TwoIconsHeader
        // leftTitle={Constants.myNotes}
        leftTitle=
        {notesTotal ? `${Constants.myNotes}  : ${(notes || [])?.length} - ${notesTotal}` : Constants.myNotes}
        secondIcon={true}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={true}
        deviderHeight={0.5}
        onPressSecondIcon={() =>
          navigation.navigate(Routes.MyNotesSearch, {
            privateNoteId: get(agentData, 'smartNote._id', ''),
          })
        }
        secondIconSrc={
          <MagnifyingGlass
            color={Colors.white}
            size={20}
            weight={'bold'}
            style={{ marginEnd: AutoScaledFont(20) }}
          />
        }
      />

      <View
        style={{
          flex: 1,
          margin: AutoScaledFont(10),
          marginBottom: AutoScaledFont(20),
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(5),
          }}>
          <FlatList
            data={notes}
            renderItem={({ item, index }) => (
              <NotesCard
                item={item}
                finalIndex={index == (notes || []).length - 1}
                SetCurrentItem={() => SetCurrentItem(item)}
              />
            )}
            keyExtractor={item => get(item, '_id', '')}
            onEndReached={debouncedLoadMore}
            onEndReachedThreshold={0.5}
            inverted
            // onScroll={({nativeEvent}) => {
            //   if (nativeEvent.contentOffset.y <= 50 && !loading) {
            //     debouncedLoadMore();
            //   }
            // }}
            // scrollEventThrottle={16}
            style={{
              // paddingBottom: AutoScaledFont(200),
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
                    {Constants.noNotesAvailable}
                  </Text>
                )}
              </View>
            }
          />
        </View>

        <TouchableOpacity>
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

              marginHorizontal: AutoScaledFont(20),
            }}>
            <TouchableOpacity onPress={() => setshowModalUpdate(true)}>
              <NotePencil
                size={20}
                color={Colors.white}
                style={{ marginHorizontal: AutoScaledFont(15) }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setshowModalUpdate(true)}
              style={{ flex: 1 }}>
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
                style={{ marginStart: AutoScaledFont(15) }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {showModal && (
        <MyNotesModal
          isVisible={showModal}
          onClosePress={() => setshowModal(false)}
          item={currentNote}
          onTextSubmit={updateTextSubmit}
          deleteNoteSubmit={deleteNoteSubmit}
          shareNoteSubmit={shareNoteSubmit}
        />
      )}

      {/* {showModalUpdate && (
        <UpdateNotesModal
          isVisible={showModalUpdate}
          onClosePress={() => setshowModalUpdate(false)}
          onTextSubmit={handleTextSubmit}
        />
      )} */}

      {showModalUpdate && (
        <UpdateNotesModal
          isVisible={showModalUpdate}
          onClosePress={() => setshowModalUpdate(false)}
          onTextSubmit={handleTextSubmit}
          noteAvailable={text}
          onPressListening={startListening}
          onPressStopListening={stopListening}
          isListening={isListening}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(22),
    marginTop: AutoScaledFont(50),
    marginHorizontal: AutoScaledFont(30),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
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
