import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { AutoScaledFont } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { get, set } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import {
  Calendar,
  DotsThreeVertical,
  NotePencil,
} from 'phosphor-react-native';
import AppButton from '../../components/AppButton';
import {
  UpdateUnavailability,
  FetchAgentViaEmail,
} from '../../services/AgentServices';
import { Toast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { updatePiData } from '../../redux/piDataSlice';
import DatePicker from 'react-native-date-picker';
import { combineDateAndTime, formatDateISO } from '../../config/Utils';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';
import LinearGradient from 'react-native-linear-gradient';

interface IBreak {
  "start_time": string;
  "end_time": string;
  "_id": string;
}

export const EditUnavailability = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation();

  const [userToken, setuserToken] = React.useState<string>('');
  const [twinId, settwinId] = useState('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [breaks, setBreaks] = React.useState<IBreak[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [delteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentBreak, setCurrentBreak] = useState<IBreak | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | ''>(new Date());
  const [endDate, setEndDate] = useState<Date | ''>(new Date());
  const [startTime, setStartTime] = useState<Date | ''>(new Date());
  const [endTime, setEndTime] = useState<Date | ''>(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;

      let agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));

      if (get(agentData, 'agent._id', '')) {
        settwinId(get(agentData, 'atwin._id', ''));
        dispatch(updatePiData(userData))
      }
      setuserToken(get(userData, 'token', ''));

      setBreaks(get(agentData, 'atwin.availability.breaks', []));
      return userData;
    } catch (e) {
      console.error('Error retrieving user data', e);
    }
  };

  React.useEffect(() => {
    getUserData();
  }, []);

  const onSaveAndContinue = async () => {
    let agentObj = {
      availability: {
        breaks: breaks.map(({ _id, start_time, end_time }) => {
          if (parseFloat(_id).toString() === _id) {
            return {
              start_time: formatDateISO(new Date(start_time)),
              end_time: formatDateISO(new Date(end_time)),
            };
          }
          return {
            _id,
            start_time: formatDateISO(new Date(start_time)),
            end_time: formatDateISO(new Date(end_time)),
          };
        }),
      },
    };

    if (!twinId) {
      Toast.show(Constants.agentIdError);
      return;
    }

    setLoading(true);

    await UpdateUnavailability(agentObj, userToken, twinId);
    setLoading(false);
  };

  const handleAddBreak = () => {
    if (startTime && endTime && startDate && endDate) {
      const newBreak = {
        start_time: combineDateAndTime(startDate, startTime),
        end_time: combineDateAndTime(endDate, endTime),
        _id: Math.random().toString(),
      };
      setBreaks([...breaks, newBreak]);
      resetModal();
    } else {
      Toast.show('Start and End time are required.');
    }
  };

  const handleEditBreak = () => {
    if (currentBreak && startTime && endTime && startDate && endDate) {
      const updatedBreaks = breaks.map(b =>
        b._id === currentBreak._id ? {
          ...b, start_time: combineDateAndTime(startDate, startTime),
          end_time: combineDateAndTime(endDate, endTime),
        } : b
      );
      setBreaks(updatedBreaks);
      resetModal();
    } else {
      Toast.show('Start and End time are required.');
    }
  };

  const handleDeleteBreak = () => {
    const updatedBreaks = breaks.filter(b => b._id !== currentBreak?._id);
    setBreaks(updatedBreaks);
    resetModal();
  };

  const resetModal = () => {
    setModalVisible(false);
    setDeleteModalVisible(false);
    setCurrentBreak(null);
  };

  const openModal = (breakItem?: IBreak) => {
    if (breakItem) {
      setCurrentBreak(breakItem);
      setStartDate(new Date(breakItem.start_time));
      setEndDate(new Date(breakItem.end_time));
      setStartTime(new Date(breakItem.start_time));
      setEndTime(new Date(breakItem.end_time));
    } else {
      setStartDate(new Date());
      setEndDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
    }
    setModalVisible(true);
  };

  const openDeleteModal = (breakItem?: IBreak) => {
    if (breakItem) {
      setCurrentBreak(breakItem);
    }
    setDeleteModalVisible(true);
  }

  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('en-US', {
  //     day: '2-digit',
  //     month: 'short',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //   });
  // };

  const formatDate = (date: string) => {
    console.log('date', date);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })

    return formatter.format(new Date(date))
  }

  const toggleDropdown = (id: string | null) => {
    setDropdownVisible(prev => (prev === id ? null : id));
  };

  const handleOutsidePress = () => {
    if (dropdownVisible) setDropdownVisible(null);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={{ backgroundColor: Colors.primary, flex: 1 }}>
        <AppStatusBar
          hidden={false}
          translucent={false}
          STYLES_={2}
          bgcolor={Colors.primary}
        />

        <TwoIconsHeader
          leftTitle={Constants.updateUnavailability}
          secondIconSrc={<NotePencil size={26} color={Colors.originalBlue} />}
          secondIcon={false}
          onPressSecondIcon={() => { }}
          onPress={() => navigation.goBack()}
          titleColor={Colors.white}
          iconTint={Colors.white}
          isDeviderShown={true}
        />

        <View
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(50),
            marginTop: AutoScaledFont(30),
            marginHorizontal: AutoScaledFont(30),
          }}>
          <View style={{ marginVertical: AutoScaledFont(10), flex: 1, gap: 5 }}>
            <TouchableOpacity onPress={() => openModal()}>
              <LinearGradient
                colors={Colors.secondaryGradient}
                useAngle={true}
                angle={90}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>{Constants.addBreak}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <FlatList
              data={breaks}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.breakItem}>
                  <Text style={styles.label}>Start: {formatDate(item.start_time)}</Text>
                  <Text style={styles.label}>End: {formatDate(item.end_time)}</Text>
                  <TouchableOpacity
                    onPress={() => toggleDropdown(item._id)}
                    style={styles.dotsMenu}>
                    <Text style={[styles.label, { fontSize: 20 }]}>
                      <DotsThreeVertical
                        color={Colors.jetBlack}
                        size={22}
                        weight={'bold'}
                        style={{ alignSelf: 'center' }}
                      />
                    </Text>
                  </TouchableOpacity>
                  {dropdownVisible === item._id && (
                    <View style={styles.dropdown}>
                      <TouchableOpacity style={styles.dropdownButton} onPress={() => openModal(item)}>
                        <Text style={styles.editButton}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.dropdownButton} onPress={() => openDeleteModal(item)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
          <AppButton
            onPressContinue={() => onSaveAndContinue()}
            gradientColor={Colors.secondaryGradient}
            textColor={Colors.primary}
            loading={loading}
            buttonWidth={'90%'}
            buttonTitle={Constants.save}
          />
        </View>

        <Modal
          isVisible={modalVisible}
          backdropOpacity={0.6}>
          <View style={styles.modalView}>
            <View style={styles.timeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.label}>{Constants.To}</Text>
                <TouchableOpacity onPress={() => setOpenStartDatePicker(true)}>
                  <View style={styles.inputContainer}>
                    <Text style={{ color: '#000' }}>{new Date(startDate).toLocaleDateString()}</Text>
                    <Calendar size={20} />
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={openStartDatePicker}
                  date={new Date(startDate)}
                  onConfirm={selectedDate => {
                    setOpenStartDatePicker(false);
                    setStartDate(selectedDate);
                  }}
                  onCancel={() => setOpenStartDatePicker(false)}
                />
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.label}></Text>
                <TouchableOpacity onPress={() => setOpenStartTimePicker(true)}>
                  <View style={styles.inputContainer}>
                    <Text style={{ color: '#000' }}>
                      {new Date(startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="time"
                  open={openStartTimePicker}
                  date={new Date(startTime)}
                  onConfirm={selectedTime => {
                    setOpenStartTimePicker(false);
                    setStartTime(selectedTime);
                  }}
                  onCancel={() => setOpenStartTimePicker(false)}
                />
              </View>
            </View>
            <View style={styles.timeContainer}>
              <View style={styles.timeBox}>
                <Text style={styles.label}>{Constants.From}</Text>
                <TouchableOpacity onPress={() => setOpenEndDatePicker(true)}>
                  <View style={styles.inputContainer}>
                    <Text style={{ color: '#000' }}>{new Date(endDate).toLocaleDateString()}</Text>
                    <Calendar size={20} />
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={openEndDatePicker}
                  date={new Date(endDate)}
                  onConfirm={selectedDate => {
                    setOpenEndDatePicker(false);
                    setEndDate(selectedDate);
                  }}
                  onCancel={() => setOpenEndDatePicker(false)}
                />
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.label}></Text>
                <TouchableOpacity onPress={() => setOpenEndTimePicker(true)}>
                  <View style={styles.inputContainer}>
                    <Text style={{ color: '#000' }}>
                      {new Date(endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="time"
                  open={openEndTimePicker}
                  date={new Date(endTime)}
                  onConfirm={selectedTime => {
                    setOpenEndTimePicker(false);
                    setEndTime(selectedTime);
                  }}
                  onCancel={() => setOpenEndTimePicker(false)}
                />
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={resetModal} style={[styles.modalButton, { backgroundColor: Colors.lighterGray }]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={currentBreak ? handleEditBreak : handleAddBreak} style={[styles.modalButton, { backgroundColor: Colors.secondary }]}>
                <Text style={[styles.buttonText, { color: Colors.primary }]}>{currentBreak ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <DeleteConfirmationModal isVisible={delteModalVisible} onClose={resetModal} onPressYes={handleDeleteBreak} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  breakItem: {
    paddingHorizontal: AutoScaledFont(15),
    paddingVertical: AutoScaledFont(22),
    marginVertical: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    // borderWidth: AutoScaledFont(0.5),
    backgroundColor: Colors.white,
    // borderColor: Colors.lighterGray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: AutoScaledFont(10),
  },
  editButton: {
    color: Colors.originalBlue,
  },
  deleteButton: {
    color: Colors.red,
  },
  addButton: {
    alignSelf: 'flex-end',
    padding: AutoScaledFont(10),
    borderRadius: AutoScaledFont(8),
  },
  addButtonText: {
    color: Colors.primary,
    fontFamily: 'Roboto-Medium'
  },
  modalView: {
    width: '90%',
    margin: 'auto',
    borderRadius: AutoScaledFont(20),
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: Colors.white,
    padding: AutoScaledFont(10),
    marginVertical: AutoScaledFont(10),
    borderRadius: AutoScaledFont(8),
    width: '80%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingHorizontal: AutoScaledFont(50),
    paddingVertical: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
  },
  buttonText: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    textAlign: 'center',
  },
  dotsMenu: {
    position: 'absolute',
    right: AutoScaledFont(10),
    top: AutoScaledFont(10),
    padding: AutoScaledFont(10),
  },
  dropdown: {
    position: 'absolute',
    right: AutoScaledFont(10),
    top: AutoScaledFont(30),
    backgroundColor: Colors.white,
    borderRadius: AutoScaledFont(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: AutoScaledFont(5),
    elevation: 5,
    zIndex: 100
  },
  dropdownButton: {
    paddingVertical: AutoScaledFont(5),
    paddingHorizontal: AutoScaledFont(10),
    width: AutoScaledFont(100),
  },
  label: {
    fontSize: 14,
    fontWeight: 'medium',
    marginBottom: 5,
    color: Colors.jetBlack,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8
  },
  timeBox: {
    width: '48%',
  },
});