import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Users, BellSimple } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { Constants } from '../../constants/Constants';
import { Routes } from '../../fonts/routers/Routes';
import { AutoScaledFont } from '../../config/Size';

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
}


const BottomModal = ({ isVisible, onClose }:BottomModalProps) => {
    const navigation = useNavigation()


const createNewMeet=()=>{
  onClose(); 
  setTimeout(() => {
    navigation.navigate(Routes.CreateNewMeeting)
    
  }, 50);
}

const createNewReminder=()=>{
  onClose(); 
  setTimeout(() => {
    navigation.navigate(Routes.Reminders)
  }, 50);
}

  return (
    <Modal transparent={true} visible={isVisible} animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.bottomSheet}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity  onPress={()=>createNewMeet()}  style={styles.createButton}>
            <Users size={32} color="#4F4F4F" />
            <Text style={styles.buttonText}>{Constants.CreateNewMeeting}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => createNewReminder()} style={styles.createButton}>
            <BellSimple size={32} color="#4F4F4F" />
            <Text style={styles.buttonText}>{Constants.CreateReminder}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0000007F',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#f2f3f4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    marginTop: AutoScaledFont(10),
    fontSize: AutoScaledFont(16),
    fontFamily: 'Poppins-Medium',
    lineHeight: 24,
    fontWeight: '500',
    color: '#4F4F4F',
  },
});

export default BottomModal;
