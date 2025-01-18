import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {Microphone, XCircle} from 'phosphor-react-native';
import LottieView from 'lottie-react-native';

interface AiAssistModalProps {
  isVisible: boolean;
  onClosePress: () => void;
  userName?: string;
  noteAvailable?: string;
  isListening?: boolean;
  onTextSubmit: (text: string) => void;
  onPressListening?: () => void;
  onPressStopListening?: () => void;
}

const UpdateNotesModal = (props: AiAssistModalProps) => {
  let {
    isVisible = false,
    onClosePress,
    userName = '',
    onTextSubmit,
    onPressListening,
    isListening,
    noteAvailable = '',
    onPressStopListening
  } = props;
  const [text, settext] = React.useState<string>(noteAvailable);
  const textInputRef = React.useRef(null);

  React.useEffect(() => {
    settext(noteAvailable);
  }, [noteAvailable]);

  const handleSave = () => {
    if (onTextSubmit) {
      onTextSubmit(text);
    }
    onClosePress();
  };


  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (textInputRef.current && !isListening) {
        textInputRef.current.focus();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      onBackdropPress={onClosePress}>
      <View
        style={{
          height: '75%',
          marginTop: 'auto',
          marginHorizontal: AutoScaledFont(-25),
          marginBottom: AutoScaledFont(-25),
          borderTopStartRadius: AutoScaledFont(20),
          borderTopEndRadius: AutoScaledFont(20),
          backgroundColor: Colors.white,
        }}>
        <View
          style={{
            height: AutoScaledFont(4),
            backgroundColor: Colors.headerThreeColor,
            marginTop: AutoScaledFont(15),
            width: AutoScaledFont(80),
            alignSelf: 'center',
          }}></View>

        <ScrollView>
          <View
            style={{
              flex: 1,
              marginTop: AutoScaledFont(20),
            }}>
            {isListening && (
              <LottieView
                style={[
                  styles.referateAiAnimation,
                  {height: AutoScaledFont(150), width: AutoScaledFont(150)},
                ]}
                source={require('../../animations/record_line.json')}
                autoPlay={true}
                loop={true}
                speed={1}
              />
            )}

            <TextInput
              style={styles.userName}
              ref={textInputRef}
              placeholderTextColor={Colors.gray}
              placeholder={
                isListening
                  ? 'Recording is in progress...'
                  : 'Start your note ...'
              }
              value={text}
              multiline={true}
              editable={true}
              onChangeText={settext}
            />
          </View>
        </ScrollView>

        <View
          style={{
            justifyContent: 'center',
          }}>
          <View
            style={{
              borderTopWidth: AutoScaledFont(0.5),
              borderColor: Colors.gray,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: AutoScaledFont(20),
                alignSelf: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              {!isListening && (
                <TouchableOpacity onPress={onPressListening}>
                  <Microphone
                    color={Colors.black}
                    size={22}
                    weight={'regular'}
                    style={{opacity: 1}}
                  />
                </TouchableOpacity>
              )}

              {!isListening && (
                <TouchableOpacity onPress={handleSave}>
                  <View
                    style={{
                      paddingHorizontal: AutoScaledFont(40),
                      paddingVertical: AutoScaledFont(10),
                      alignSelf: 'center',
                      backgroundColor: 'green',
                      marginHorizontal: AutoScaledFont(100),
                      borderRadius: AutoScaledFont(10),
                    }}>
                    <Text style={[styles.userName, {color: Colors.white}]}>
                      {'Save'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

{isListening && (
                <TouchableOpacity onPress={onPressStopListening}>
                  <View
                    style={{
                      paddingHorizontal: AutoScaledFont(40),
                      paddingVertical: AutoScaledFont(10),
                      alignSelf: 'center',
                      backgroundColor: Colors.crimsonRed,
                      marginHorizontal: AutoScaledFont(100),
                      borderRadius: AutoScaledFont(10),
                    }}>
                    <Text style={[styles.userName, {color: Colors.white}]}>
                      {'Stop Recording'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={onClosePress}>
                <XCircle
                  color={Colors.black}
                  size={22}
                  weight={'regular'}
                  style={{opacity: 1}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateNotesModal;

const styles = StyleSheet.create({
  container: {},
  xampusIdQr: {
    color: Colors.primaryBlue,
    fontFamily: 'Roboto-Regular',
    fontSize: AutoScaledFont(18),
    marginTop: AutoScaledFont(10),
  },
  changePicture: {
    color: Colors.primaryBlue,
    fontFamily: 'Poppins-medium',
    fontSize: AutoScaledFont(16),
    marginVertical: AutoScaledFont(10),
  },
  referateAiAnimation: {
    alignSelf: 'center',
    marginTop: -AutoScaledFont(20),
  },
  changePictureView: {
    marginVertical: AutoScaledFont(10),
    borderWidth: 0.5,
    borderColor: Colors.primaryBlue,
    borderRadius: AutoScaledFont(5),
  },
  userName: {
    fontSize: AutoScaledFont(18),
    marginHorizontal: AutoScaledFont(20),
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  headerTwo: {
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Regular',
    color: Colors.black,
  },
  headerOne: {
    fontSize: AutoScaledFont(20),
    marginBottom: AutoScaledFont(10),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.shiningBlue,
  },

  closeIconView: {
    height: AutoScaledFont(40),
    width: AutoScaledFont(40),
    borderWidth: 0.5,
    marginTop: AutoScaledFont(10),
    borderColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: AutoScaledFont(20),
  },
  closeIcon: {
    height: AutoScaledFont(25),
    width: AutoScaledFont(25),
    tintColor: Colors.primaryBlue,
  },
  selectedStyle: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.aliceBlue,
    justifyContent: 'center',
    width: '100%',
    paddingVertical: AutoScaledFont(20),
    paddingHorizontal: AutoScaledFont(30),
  },
  title: {
    fontSize: AutoScaledFont(18),
    color: Colors.primaryBlue,
    fontFamily: 'Poppins-Medium',
  },
  selectionView: {
    borderRadius: AutoScaledFont(10),
    marginBottom: AutoScaledFont(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
