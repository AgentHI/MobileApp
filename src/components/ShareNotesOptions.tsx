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
import { debounce, get } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { DotsThree, MagnifyingGlass, Microphone, NotePencil } from 'phosphor-react-native';
import { useSelector } from 'react-redux';
import Voice, { SpeechErrorEvent } from '@react-native-voice/voice';
import { AutoScaledFont } from '../config/Size';
import { Colors } from '../constants/Colors';
import UpdateNotesModal from './Modal/UpdateNotesModal';
import MyNotesModal from './Modal/MyNotesModal';
import { TOAST_ } from '../config/Utils';
import { ShareSmartNotesWithClient } from '../services/ClientService';
import { AddPersonalContentBlock, DeletePersonalContentBlock, FetchSmartNotes, UpdatePersonalContentBlock } from '../services/NotesService';

interface ShareNotesOptionsProps {
  item: any;
  onActionComplete: () => void;
}

export const SmartNotesOptions = ({
  item, onActionComplete
}: ShareNotesOptionsProps) => {
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

      const nextPage = smartNotesPage + 1;

      let recentNotes = await FetchSmartNotes(
        get(agentData, 'smartNote._id', ''),
        token_,
        nextPage,
      );

      const newNotes = get(recentNotes, 'data', []);
      if (newNotes?.length === 0) {
        setIsLoadmore(false);
      } else {
        setSmartNotesPage(nextPage);
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
    <>
      <TouchableOpacity onPress={SetCurrentItem}>
        <DotsThree
          color={Colors.black}
          size={24}
          weight={'regular'}
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>

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
    </>
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


{/* <TouchableOpacity onPress={SetCurrentItem}>
<DotsThree
  color={Colors.black}
  size={24}
  weight={'regular'}
  style={{opacity: opacity}}
/>
</TouchableOpacity> */}