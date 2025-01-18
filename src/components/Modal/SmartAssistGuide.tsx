import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import { Microphone } from 'phosphor-react-native';

interface SmartAssistGuideProps {
  isVisible: boolean;
  onClosePress: () => void;
  action: any;
}

const SmartAssistGuide = ({
  isVisible = false,
  onClosePress,
  action,
}: SmartAssistGuideProps) => {

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
          {
            action && <View style={styles.container}>
              <View style={styles.header}>
                {action.icon}
                <Text style={styles.title}>{action.text}</Text>
              </View>
              <Text style={styles.brief}>{action.brief}</Text>
              <Text style={styles.subtitle}>Examples:</Text>
              {action.examples.map((example: string, index: number) => (
                <Text key={index} style={styles.example}>
                  • {example}
                </Text>
              ))}
              <View style={styles.micButton}>
                <Microphone size={22} color={Colors.originalBlue} />
                <Text style={styles.micText}>Click on Mic and convey your command to smart assist</Text>
              </View>
            </View>
          }
        </ScrollView>

        <View
          style={{
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SmartAssistGuide;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
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
  selectionView: {
    borderRadius: AutoScaledFont(10),
    marginBottom: AutoScaledFont(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: AutoScaledFont(20),
    borderTopWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
  },
  closeText: {
    fontSize: AutoScaledFont(16),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10
  },
  title: {
    fontSize: AutoScaledFont(20),
    color: Colors.primaryBlue,
    fontFamily: 'Poppins-Medium',
  },
  brief: {
    fontSize: AutoScaledFont(16),
    color: '#555555',
    marginBottom: AutoScaledFont(10),
  },
  subtitle: {
    fontSize: AutoScaledFont(20),
    fontWeight: '600',
    color: '#333333',
    marginTop: AutoScaledFont(10),
    marginBottom: AutoScaledFont(6)
  },
  example: {
    fontSize: AutoScaledFont(16),
    color: '#666666',
    marginLeft: AutoScaledFont(14),
    marginVertical: AutoScaledFont(2),
  },
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  micText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.originalBlue,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
