import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import { Constants } from '../../constants/Constants';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

interface AiAssistModalProps {
  isVisible: boolean;
  onClosePress: () => void;
  userName?:string
}

const AiAssistModal = (props: AiAssistModalProps) => {
  let {
    isVisible = false,
    onClosePress,
    userName=''
  } = props;

  const piData = useSelector(
    (state: any) => state.piData || {},
  )


  React.useEffect(()=>{
    console.log('piData__',piData);
  },[])
  

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      onBackdropPress={onClosePress}>
      <View
        style={{
          height: '55%',
          marginTop: 'auto',
          marginHorizontal: AutoScaledFont(-25),
          marginBottom: AutoScaledFont(-25),
          borderTopStartRadius: AutoScaledFont(20),
          borderTopEndRadius: AutoScaledFont(20),
          backgroundColor: Colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
        }}>
            <View
          style={{
            height: AutoScaledFont(4),
            backgroundColor: Colors.headerThreeColor,
            marginTop: AutoScaledFont(15),
            width: AutoScaledFont(80),
            alignSelf: 'center',
          }}></View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
            flex: 1,
            paddingHorizontal:AutoScaledFont(30)
          }}>
          <View style={styles.selectionView}>
            {/* <Text style={styles.headerOne}>
              {Constants.yourSubscriptionHasExpired}
            </Text> */}
            <Text style={styles.headerTwo}>{Constants.hello}{`${userName}. `}
              {Constants.howICanHelp}
            </Text>

          </View>


        </View>

        <View
          style={{
            justifyContent: 'center',
          }}>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={onClosePress} style={{flex: 1}}>
              <View style={styles.selectedStyle}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: true ? Colors.black : Colors.originalBlue,
                    },
                  ]}>
                  {Constants.close}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AiAssistModal;

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
  changePictureView: {
    marginVertical: AutoScaledFont(10),
    borderWidth: 0.5,
    borderColor: Colors.primaryBlue,
    borderRadius: AutoScaledFont(5),
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
