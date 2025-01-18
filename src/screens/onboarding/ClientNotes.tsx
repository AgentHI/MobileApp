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
import { get } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { MagnifyingGlass, Microphone, NotePencil } from 'phosphor-react-native';
import { useSelector } from 'react-redux';
import NotesCard from '../../components/NotesCard';
import {
  AddPersonalContentBlock,
  AddPrivateContentBlock,
  AddPublicContentBlock,
  DeletePersonalContentBlock,
  FetchSummaryNotes,
  GetPrivateClientNotes,
  GetPublicClientNotes,
  UpdatePersonalContentBlock,
} from '../../services/NotesService';
import { CheckAgentViaEmail } from '../../services/AgentServices';
import MyNotesModal from '../../components/Modal/MyNotesModal';
import UpdateNotesModal from '../../components/Modal/UpdateNotesModal';
import { RequestMicrophonePermission, TOAST_, TrimmedText } from '../../config/Utils';
import Voice, { SpeechErrorEvent } from '@react-native-voice/voice';
import NotesTabsOptions from '../../components/NotesTabOption';
import NotesCardPublic from '../../components/NotesCardPublic';
import SummaryCard from '../../components/SummaryCard';
import { Routes } from '../../fonts/routers/Routes';

export interface VoiceError {
  errorCode: number | string;
  errorMessage: string;
}

export const ClientNotes = ({ route }: any) => {
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
  const [loading, setLoading] = React.useState<boolean>(true);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});
  const scrollViewRef = React.useRef(null);
  const scrollViewRef1 = React.useRef(null);
  const scrollViewRef2 = React.useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [selected, setselected] = React.useState<number>(1);
  const [error, setError] = useState('')

  React.useEffect(() => {
    console.log('Routes__', route.params.item);
    getUserData();
  }, []);

  React.useEffect(() => {
    console.log('selected____', selected);
  }, [selected]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechResults = event => {
    console.log('Speech results:', event?.value[0]);
    settext(event?.value[0]);
  };

  const onSpeechEnd = async () => {
    console.log('Speech ended');
    // setFinalText(text);
    setIsListening(false);
  };

  const onSpeechError = (error: SpeechErrorEvent) => {
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
      // setFinalText('');
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

  useEffect(() => {
    if (scrollViewRef.current && notes?.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [notes]);

  useEffect(() => {
    if (scrollViewRef1.current && privateNotes?.length > 0) {
      scrollViewRef1.current.scrollToEnd({ animated: true });
    }
  }, [privateNotes]);

  useEffect(() => {
    if (scrollViewRef2.current && summaryNotes?.length > 0) {
      scrollViewRef2.current.scrollToEnd({ animated: true });
    }
  }, [summaryNotes]);

  const getUserData = async () => {
    try {
      setLoading(true);
      if (!get(route, 'params.item.public_note', '') || !token_) {
        setLoading(false);
        return;
      }

      let clientNotesList = await GetPublicClientNotes(
        get(route, 'params.item.public_note', ''),
        token_,
      );

      setnotes(get(clientNotesList, 'data.contentBlocks', []));


      console.log(
        'setprivateNoteId_____',
        get(clientNotesList, 'data.private_note', ''),
      );
      setprivateNoteId(get(clientNotesList, 'data.private_note', ''));
      setprivateNoteId(get(clientNotesList, 'data.private_note', ''));


      if (get(clientNotesList, 'data.private_note', '')) {
        let clientPrivateList = await GetPrivateClientNotes(
          get(clientNotesList, 'data.private_note', ''),
          token_,
        );
        console.log('clientPrivateList___', clientPrivateList);
        setprivateNotes(get(clientPrivateList, 'data.contentBlocks', []));

      }


      if (get(clientNotesList, 'data.summary_note', '')) {
        let summaryNotesList = await FetchSummaryNotes(
          get(clientNotesList, 'data.summary_note', ''),
          token_,
        );
        console.log('summaryNotesList____', summaryNotesList);
        setsummaryNotes(get(summaryNotesList, 'data.contentBlocks', []));
        // console.log('parsedData___', get(summaryNotesList, 'data.contentBlocks[0].text', ''));


      }

      // setnotes(get(clientNotesList, 'data.contentBlocks', []));






      setLoading(false);
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

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
    let result = await AddPublicContentBlock(
      get(route, 'params.item.public_note', ''),
      formData,
      token_,
    );
    if (get(result, 'data._id', '')) {
      getUserData();
      TOAST_('New note created', 'success', 3000);
    }

    settext('');
  };

  const CreatePrivateNote = async (text: string) => {
    console.log('CreatePrivateNote__');

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
    let result = await AddPrivateContentBlock(
      // get(route, 'params.item.public_note', ''),
      privateNoteId,
      formData,
      token_,
    );

    console.log('AddPrivateContentBlockResult___', result);

    if (get(result, 'data._id', '')) {
      getUserData();
      TOAST_('New note created', 'success', 3000);
    }
    settext('');
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
    let statusId =
      selected == 1
        ? get(route, 'params.item.public_note', '')
        : selected == 2
          ? privateNoteId
          : '';
    let result = await DeletePersonalContentBlock(
      statusId,
      get(item, 'uuid', ''),
      token_,
    );
    if (get(result, 'status', '') == 'success') {
      getUserData();
      TOAST_('Note deleted successfully.', 'danger', 3000);
    }
  };

  const handleTextSubmit = (text: any) => {
    if (selected == 1) {
      CreateNote(text);
    } else if (selected == 2) {
      CreatePrivateNote(text);
    }
  };

  const updateTextSubmit = (text: any, item: any) => {
    UpdateNote(text, item);
  };

  const deleteNoteSubmit = (item: any) => {
    deleteNote(item);
  };

  const SetCurrentItem = async (item: any) => {
    console.log('SetCurrentItem', get(item, 'authorRole', '') === 'agent');

    setcurrentNote(item);

    if (get(item, 'authorRole', '') === 'agent') {
      setshowModal(true);
    }
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
        leftTitle={TrimmedText(get(route, 'params.item.name', ''), 24)}
        secondIcon={true}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        onPressSecondIcon={() => navigation.navigate(Routes.NotesSearch, { item: get(route, 'params.item', ''), selected, privateNoteId })}
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
      />

      <View
        style={{
          flex: 1,
          marginHorizontal: AutoScaledFont(10),
          marginTop: AutoScaledFont(10),
          marginBottom: AutoScaledFont(20),
        }}>
        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(5),
          }}>
          <NotesTabsOptions
            warningTitle={Constants.yourSubscriptionHasExpired}
            onfirstPress={() => setselected(1)}
            onSecondPress={() => setselected(2)}
            onThirdPress={() => setselected(3)}
            selected={selected}
          />

          {selected == 1 && (
            <FlatList
              data={notes}
              renderItem={({ item, index }) => (
                <NotesCardPublic
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
                  scrollViewRef.current.scrollToEnd({ animated: true });
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
                      {Constants.noNotesAvailable}
                    </Text>
                  )}
                </View>
              }
            />
          )}

          {selected == 2 && (
            <FlatList
              data={privateNotes}
              renderItem={({ item, index }) => (
                <NotesCard
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
                  scrollViewRef.current.scrollToEnd({ animated: true });
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
                      {Constants.noNotesAvailable}
                    </Text>
                  )}
                </View>
              }
            />
          )}

          {selected == 3 && (
            <FlatList
              data={summaryNotes}
              renderItem={({ item, index }) => (
                <SummaryCard
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
                  scrollViewRef.current.scrollToEnd({ animated: true });
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
                      {Constants.noNotesAvailable}
                    </Text>
                  )}
                </View>
              }
            />
          )}
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
              marginHorizontal: AutoScaledFont(30),
              marginBottom: AutoScaledFont(10),
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
        />
      )}

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
