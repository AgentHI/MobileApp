import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { debounce, get } from 'lodash';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BellSimpleRinging,
  Binoculars,
  CalendarCheck,
  CalendarDots,
  CalendarPlus,
  CalendarX,
  Envelope,
  Lightning,
  Link,
  Microphone,
  Notepad,
  Prohibit,
  ShareFat,
} from 'phosphor-react-native';
import { useSelector } from 'react-redux';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import LottieView from 'lottie-react-native';
import Voice, { SpeechErrorEvent } from '@react-native-voice/voice';
import { GetIntent, HandleIntentApi } from '../../services/SmartAssistServices';
import { RequestMicrophonePermission, TOAST_ } from '../../config/Utils';
import Tts from 'react-native-tts';
import SmartAssistGuide from '../../components/Modal/SmartAssistGuide';
import { Routes } from '../../fonts/routers/Routes';

let opacity = 0.8;

const actions = [
  {
    id: 1,
    text: 'Meeting Booking',
    brief: 'Book a new meeting with your preferred time and attendees.',
    examples: ['Schedule a meeting for tomorrow at 3 PM.', 'Book a client call.'],
    icon: (
      <CalendarPlus
        size={22}
        color={Colors.behanceColor}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 2,
    text: 'Reschedule Meeting',
    brief: 'Change the time or date of an existing meeting.',
    examples: ['Reschedule team sync to 5 PM.', 'Postpone the client call.'],
    icon: (
      <CalendarCheck
        size={22}
        color={Colors.originalBlue}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 3,
    text: 'Cancel Meeting',
    brief: 'Cancel an upcoming or ongoing meeting.',
    examples: ['Cancel my 4 PM meeting.', 'Cancel the weekly sync.'],
    icon: (
      <CalendarX size={22} color={Colors.red} style={{ opacity: opacity }} />
    ),
  },
  {
    id: 4,
    text: 'Ask Anything',
    brief: 'Get quick answers to your queries.',
    examples: ['What is the weather today?', 'What’s on my calendar?'],
    icon: (
      <Lightning
        size={22}
        color={Colors.behanceColor}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 5,
    text: 'Set Reminder',
    brief: 'Set a notification for important tasks or events.',
    examples: ['Remind me to call at 5 PM.', 'Set a reminder for groceries.'],
    icon: (
      <BellSimpleRinging
        size={22}
        color={Colors.originalBlue}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 6,
    text: 'Not Available',
    brief: 'Mark yourself as unavailable for meetings or events.',
    examples: ['Set my status to busy.', 'Mark me unavailable for the day.'],
    icon: (
      <Prohibit
        size={22}
        color={Colors.red}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 7,
    text: 'Available',
    brief: 'Mark yourself as available for meetings or events.',
    examples: ['Set my status to free.', 'Mark me available for calls.'],
    icon: (
      <CalendarDots
        size={22}
        color={Colors.behanceColor}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 8,
    text: 'My Notes',
    brief: 'Access and manage your saved notes.',
    examples: ['Show my recent notes.', 'What are my meeting notes?'],
    icon: (
      <Notepad
        size={22}
        color={Colors.originalBlue}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 9,
    text: 'Search',
    brief: 'Find specific information quickly.',
    examples: ['Search for my meeting with John.', 'Find notes about project X.'],
    icon: (
      <Binoculars
        size={22}
        color={Colors.shiningBlue}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 10,
    text: 'Share Notes',
    brief: 'Share your notes with others effortlessly.',
    examples: ['Send my notes to the team.', 'Share project notes with Alex.'],
    icon: (
      <ShareFat
        size={22}
        color={Colors.behanceColor}
        style={{ opacity: opacity }}
      />
    ),
  },
  {
    id: 11,
    text: 'Share Calendar',
    brief: 'Share your calendar or availability with others.',
    examples: ['Share my calendar with the team.', 'Send my availability for next week.'],
    icon: (
      <Link
        size={22}
        color={Colors.originalBlue}
        style={{ opacity: opacity }}
      />
    ),
  },
];


export const SmartAssist = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchNote, setsearchNote] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [preActions, setpreActions] = React.useState<any>([]);
  const [myNotesId, setMyNotesId] = React.useState<any>('');
  const token_ = useSelector(state => state.user.piData.token || {});
  const agentData = useSelector(state => state.user.agentData || {});

  const [text, settext] = React.useState<any>('');
  const [intentText, setintentText] = React.useState<any>('');
  const [isListening, setIsListening] = useState(false);
  const [hideAll, sethideAll] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setshowModal] = React.useState<boolean>(false);
  const [feature, setFeature] = useState<typeof actions[0] | null>(null);

  const animation = useRef(new Animated.Value(0))?.current;

  const animatedValues = useRef(
    actions?.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (isFocused) {
      setIsListening(false);
      animatedValues.forEach(anim => anim.setValue(0));

      // Start animations
      Animated.stagger(
        100,
        animatedValues.map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }

    sethideAll(false);
    settext('');
    setintentText('');
  }, [isFocused, animatedValues]);

  React.useEffect(() => {
    setpreActions(actions);
    getUserData();
  }, []);

  useEffect(() => {
    if (text) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [text]);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('userData__', userData);

      return userData;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  const updateTextSubmit = (text: string) => {
    setsearchNote(text);
  };


  const onPressItem = (item: typeof actions[0]) => {
    setFeature(item);
    setshowModal(true);
    // TOAST_('Speak your command to the AI Agent by clicking the Mic below.', 'success', 2500, 'center')
  };

  const searchNotes_ = async () => {
    if (!searchNote?.trim()) {
      return;
    }
    setLoading(true);
    Keyboard.dismiss();

    console.log('myNotesId__', myNotesId);

    let data = {
      smartNoteId: myNotesId,
      query: searchNote?.trim(),
    };

    try {
      // let result = await OverAllSearch_(data, token_);
      // console.log('result____', result);
      // setnotes(get(result, 'results', []));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchSearch = debounce(searchNotes_, 500);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // stopListening();
    if (isListening) {
      setintentText('');
    }
    isListening ? startListening() : stopListening();

    if (isListening && !hideAll) {
      console.log('sethideAll_____true');

      sethideAll(true);
    }
  }, [isListening]);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechResults = event => {
    console.log('Speech results:', event?.value[0]);
    settext(event?.value[0]);

    GetIntentFromApi(event?.value[0]);
  };

  let GetIntentFromApi = async (intentText: string) => {
    setLoading(true);
    setintentText('Analzing Information...');
    speakText('Analzing Information');

    try {
      let result = await GetIntent(intentText, token_);
      console.log('result____', result);
      
      if (get(result, 'data.intent', '')) {
        if(get(result, 'data.intent', '').toLowerCase() === 'search'){
          navigation.navigate(Routes.OverAllSearch, { item: result });
        }
        setintentText(
          prevText => `${prevText}\nIntent detected. Handling user Intent...`,
        );
        let result_ = await HandleIntentApi(
          get(agentData, 'agent._id', ''),
          get(result, 'data', {}),
          token_,
        );

        if (get(result_, 'message', '')) {
          TOAST_(get(result_, 'message', ''), 'success', 3000, 'center');
          setintentText(
            prevText => `${prevText}\n${get(result_, 'message', '')}`,
          );
          speakText(get(result_, 'message', ''));
        }
      } else {
        setintentText(
          'No intent detected. Please try again with different command',
        );
        speakText('No intent detected. Please try again with different command');

      }
    } catch (error) {
      setintentText('API failed please fix it');
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
    try {
      Tts.speak(text);
    } catch (error) { }
  };

  const onSpeechPartialResults = event => {
    settext('');
    settext(event?.value);

    console.log('Partial Speech results:', event?.value);
    // settext(prevText => `${prevText} ${event?.value[event?.value.length - 1]}`);
  };

  const onSpeechEnd = async () => {
    console.log('Speech ended');
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
      setIsListening(true);
      await Voice.start('en-IN', { partialResults: true });
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

  const handleModalClose = () => {
    setshowModal(false);
    setFeature(null);
  }

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)}>

        <Animated.View
          style={[
            styles.item,
            {
              opacity: animatedValues[index], // Fade-in effect
              transform: [
                {
                  translateY: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0], // Slide-in effect
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.cardContainer}>
            {item?.icon}
            <Text style={styles.userName}>{item?.text}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

    );
  };

  return (
    <Animated.View style={{ backgroundColor: Colors.primary, flex: 1 }}>
      {isFocused && (
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />
      )}

      <TwoIconsHeader
        // leftTitle={Constants.SmartAssist}
        leftTitle={!hideAll ? 'Check how Smart Assist helps you' : ''}
        secondIcon={false}
        titleColor={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={false}
        backHidden={true}
        deviderHeight={0.5}
      />

      <View
        style={{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
        }}>
        <View
          style={{
            flex: 1,
          }}>
          {!hideAll && (
            <FlatList
              data={preActions}
              renderItem={renderItem}
              keyExtractor={item => get(item, 'id', '')}
              scrollEnabled={true}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{
                alignContent: 'center',
                alignSelf: 'center',
              }}
            />
          )}

          {text && (
            <Animated.Text style={[styles.commandText, animatedStyle]}>
              {text}
            </Animated.Text>
          )}

          {intentText && (
            <Animated.Text style={[styles.intentTextS_]}>
              {intentText}
            </Animated.Text>
          )}

          {loading && (
            <ActivityIndicator
              size={'small'}
              color={Colors.white}
              style={{ marginTop: AutoScaledFont(50) }}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() => (!loading ? setIsListening(!isListening) : {})}>
          <View
            style={{
              marginBottom: AutoScaledFont(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LottieView
              style={[
                styles.referateAiAnimation,
                { height: AutoScaledFont(150), width: AutoScaledFont(150) },
              ]}
              source={require('../../animations/record_line.json')}
              autoPlay={true}
              loop={true}
              speed={isListening ? 1 : 0}
            />

            <Microphone
              size={32}
              color={Colors.white}
              style={{
                opacity: opacity,
                marginTop: -AutoScaledFont(20),
                marginBottom: AutoScaledFont(10),
              }}
            />
            <Text
              style={[
                styles.userName,
                { color: Colors.white, opacity: opacity, marginStart: 0 },
              ]}>
              {isListening ? 'Recording...' : 'Press the icon to execute a command'}
            </Text>
            {
              error && <Text
                style={[
                  styles.userName,
                  { color: Colors.white, opacity: opacity, marginStart: 0 },
                ]}>
                Error: {error}
              </Text>
            }
          </View>
        </TouchableOpacity>
      </View>

      <SmartAssistGuide isVisible={showModal} onClosePress={handleModalClose} action={feature} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(26),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  item: {
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(12),
    marginHorizontal: AutoScaledFont(5),
    marginTop: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    flexDirection: 'row',
    minWidth: AutoScaledFont(180),
    justifyContent: 'center',
    backgroundColor: Colors.whiteAlabaster,
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  referateAiAnimation: {
    alignSelf: 'center',
  },
  userName: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  commandText: {
    fontSize: AutoScaledFont(20),
    marginEnd: AutoScaledFont(20),
    marginStart: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
    borderWidth: AutoScaledFont(0.5),
    justifyContent: 'center',
    paddingHorizontal: AutoScaledFont(20),
    paddingVertical: AutoScaledFont(10),
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    alignContent: 'center',
    borderRadius: AutoScaledFont(10),
    borderColor: Colors.lighterGray,
  },
  intentTextS_: {
    fontSize: AutoScaledFont(20),
    marginEnd: AutoScaledFont(50),
    marginStart: AutoScaledFont(20),
    marginTop: AutoScaledFont(50),
    color: Colors.darkGreenHex,
    borderWidth: AutoScaledFont(0.5),
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(15),
    backgroundColor: Colors.white,
    borderColor: Colors.lighterGray,
    borderRadius: AutoScaledFont(10),
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
});
