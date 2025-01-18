import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import Modal from 'react-native-modal';
import { Constants } from '../../constants/Constants';


interface DeleteConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPressNo?: () => void;
  onPressYes: () => void;
  backdropOpacity?: number;
  loading?: boolean;
}

const DeleteConfirmationModal = (props: DeleteConfirmationModalProps) => {
  let {
    isVisible = false,
    onClose,
    backdropOpacity = 0.6,
    onPressNo,
    onPressYes,
  } = props;


  return (
    <Modal isVisible={isVisible} backdropOpacity={backdropOpacity}>
      <View
        style={{
          height: AutoScaledFont(220),
          borderRadius: AutoScaledFont(20),
          justifyContent: 'center',
          backgroundColor: Colors.white,
        }}>
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <View>
            <Text style={{ textAlign: 'center' }}>
              <Text style={styles.headerTwo}>
                {Constants.areYouSureWantToLogout}
              </Text>
              <Text style={styles.logoutText}>
                {Constants.areYouSureWantToDelete}
              </Text>
            </Text>

            <View
              style={{
                marginTop: AutoScaledFont(20),
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Pressable onPress={onClose}>
                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(50),
                    paddingVertical: AutoScaledFont(10),
                    backgroundColor: Colors.lighterGray,
                    alignSelf: 'center',
                    borderRadius: AutoScaledFont(10),
                    marginHorizontal: AutoScaledFont(10),
                  }}>
                  <Text style={styles.buttonText}>{Constants.no}</Text>
                </View>
              </Pressable>
              <Pressable onPress={onPressYes}>
                <View
                  style={{
                    paddingHorizontal: AutoScaledFont(50),
                    paddingVertical: AutoScaledFont(10),
                    backgroundColor: Colors.secondary,
                    alignSelf: 'center',
                    borderRadius: AutoScaledFont(10),
                    marginHorizontal: AutoScaledFont(10),
                  }}>
                  <Text style={[styles.buttonText, { color: Colors.primary }]}>
                    {Constants.yes}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;

const styles = StyleSheet.create({
  container: {},
  logo_: {
    height: AutoScaledFont(70),
    width: AutoScaledFont(70),
    marginBottom: AutoScaledFont(30),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerTwo: {
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Medium',
    color: Colors.red,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    textAlign: 'center',
  },
  headerThree: {
    fontSize: AutoScaledFont(16),
    marginTop: AutoScaledFont(5),
    fontFamily: 'Poppins-regular',
    color: Colors.primary,
    textAlign: 'center',
  },
  grayedText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(15),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.gray,
  },
  orText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(16),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginHorizontal: AutoScaledFont(2),
    color: Colors.gray,
  },
  bluedText: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(15),
    marginStart: AutoScaledFont(5),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.originalBlue,
  },
});
