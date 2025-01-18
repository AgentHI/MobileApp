import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { Calendar, Check } from 'phosphor-react-native';
import DatePicker from 'react-native-date-picker';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { AutoScaledFont } from '../../config/Size';
import { debounce, get } from 'lodash';
import UserCard from '../../components/UserCard';
import { SearchClients } from '../../services/ClientService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyUserCard from '../../components/EmptyUserCard';
import SelectedMailsCard from '../../components/SelectedMailsCard';
import AppButton from '../../components/AppButton';
import { Colors } from '../../constants/Colors';
import { Toast } from 'react-native-toast-notifications';
import { CreateAppointment, FetchAppointmentSlots } from '../../services/AppointmentService';
import { useSelector } from 'react-redux';
import { GetParsedTime, TOAST_ } from '../../config/Utils';
import { format } from "date-fns";

const CreateNewMeeting = () => {
  const navigation = useNavigation();
  const [meetingType, setMeetingType] = useState('online');
  const [title, setTitle] = useState('');
  const [clientName, setclientName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [searchList, setsearchList] = React.useState<any>([]);
  const [selectedMails, setselectedMails] = React.useState<any>([]);
  const [showFlatlist, setshowFlatlist] = React.useState<any>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loading_, setLoading_] = React.useState<boolean>(false);
  const [showEmptyCard, setshowEmptyCard] = React.useState<boolean>(false);
  const [slots, setSlots] = useState<{
    day: string;
    slots: [string, string][];
  }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<[string, string] | null>(null);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});

  const handleCheckboxPress = (type: string) => {
    setMeetingType(type);
  };

  useEffect(() => {
    console.log('clientName__', clientName);
    if ((clientName || '').length > 3) {
      fetchaPI();
      setshowFlatlist(true);
    } else {
      setshowEmptyCard(false);
      setsearchList([]);
      setshowFlatlist(false);
    }
  }, [clientName]);

  useEffect(() => {
    setSelectedTime(null);
    setSelectedSlot(null);
  }, [date]);

  const fetchSlots = async () => {
    try {
      const id = get(agentData, 'atwin._id', '');
      const accessToken = get(agentData, 'agent.accessToken', '');
      const res = await FetchAppointmentSlots(id, accessToken);
      
      setSlots(res?.slots ?? []);
    } catch (error) {
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSlots();
      return () => { };
    }, [])
  );

  const fetchClient = async () => {
    setsearchList([]);
    setLoading(true);
    const jsonValue = await AsyncStorage.getItem('@user_data');
    let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log('userData__', userData);
    let result = await SearchClients(clientName, get(userData, 'token', ''));
    setsearchList(get(result, 'data', []));
    console.log('SearchClients___length', get(result, 'data', [])?.length == 0);
    if (get(result, 'data', [])?.length == 0) {
      setshowEmptyCard(true);
    }

    setLoading(false);
  };

  const fetchaPI = debounce(fetchClient, 2000);

  const selectClient = (item: any) => {
    // console.log('selectClient__',item);

    const exists = selectedMails.some(item_ => item_._id === item?._id);

    console.log('exists', exists);

    setselectedMails(exists ? selectedMails : [...selectedMails, item]);
  };

  const removeFromArray = (idToRemove: any) => {
    console.log('RemoveFromArray', idToRemove);

    setselectedMails(prevArray =>
      prevArray.filter(item => item._id !== idToRemove),
    );
  };

  const onPressCreateMeeting = async () => {
    if (
      !selectedMails.length ||
      !title.toString().trim() ||
      !description.toString().trim() ||
      !selectedSlot
    ) {
      Toast.show(Constants.AllFieldsWarningMessage);
      return;
    }

    setLoading_(true);

    const startTime = new Date(
      `${format(date, "yyyy-MM-dd")}T${selectedSlot[0]}`,
    ).toISOString();
    const endTime = new Date(
      `${format(date, "yyyy-MM-dd")}T${selectedSlot[1]}`,
    ).toISOString();

    let AppointmentObj = {
      twin_id: get(agentData, 'atwin._id', ''),
      start_time: startTime,
      end_time: endTime,
      attendees_email: selectedMails?.map(item => item.email),
      title: title,
      description: description,
      meeting_type: meetingType == 'online' ? 'online' : 'face-to-face',
    };

    let result = await CreateAppointment(AppointmentObj, token_)
    setLoading_(false);

    if (get(result, 'success', '')) {
      TOAST_(Constants.AppointmentCreated, 'success', 3000);
      navigation.goBack()
    } else {
      TOAST_(Constants.errorWhileCreatingAppointment, 'warning');
    }
    console.log('CreateAppointment_result___', result);
  };

  const renderSlots = () => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const daySlots = slots.find((slot) => slot.day === formattedDate)?.slots || [];    

    return (
      <View style={styles.slotsList}>
        {daySlots.length > 0 ? (
          <>
            {daySlots.map((slot, index) => {
              const time = `${GetParsedTime(`${formattedDate}T${slot[0]}`)} - ${GetParsedTime(
                `${formattedDate}T${slot[1]}`
              )}`;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={[
                    styles.slotsButton,
                    selectedTime === time && styles.activeSlots,
                  ]}
                  onPress={() => {
                    setSelectedTime(time);
                    setSelectedSlot(slot);
                  }}
                >
                  <Text style={styles.label}>{time}</Text>
                </TouchableOpacity>
              );
            })}
            {daySlots.length % 2 !== 0 && <View style={styles.slotsEmpty}></View>}
          </>
        ) : (
          <Text style={styles.noSlotsError}>{Constants.NoSlotsAvailable}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={1}
        bgcolor={Colors.white}
      />
      {/* <CreateMeetingHeader
        topic={Constants.gladToSeeYou}
        searchTitle={Constants.gladToSeeYou}
        onPressSecondIcon={() => {}}
        onPressFirstIcon={() => navigation.goBack()}
      /> */}

      <TwoIconsHeader
        leftTitle={Constants.CreateNewMeeting}
        secondIcon={false}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={false}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.label}>{Constants.searchClient}{selectedMails.length}</Text> */}
        <TextInput
          style={styles.input}
          placeholder={Constants.searchClient}
          placeholderTextColor={Colors.gray}
          value={clientName}
          autoFocus={true}
          onChangeText={setclientName}
        />

        <FlatList
          data={selectedMails}
          renderItem={({ item }) => (
            <SelectedMailsCard
              item={item}
              onPressDelete={() => removeFromArray(get(item, '_id', ''))}
            />
          )}
          keyExtractor={item => get(item, '_id', '')}
          style={{ marginBottom: selectedMails.length ? AutoScaledFont(20) : 0 }}
          scrollEnabled={false}
          numColumns={2}
        />

        {showFlatlist && (
          <FlatList
            data={searchList}
            renderItem={({ item }) => (
              <UserCard
                item={item}
                onPress={() => selectClient(item)}
                isSelected={selectedMails.some(
                  item_ => item_._id === item?._id,
                )}
              />
            )}
            keyExtractor={item => get(item, '_id', '')}
            style={{ marginBottom: showFlatlist ? AutoScaledFont(20) : 0 }}
            scrollEnabled={false}
            ListEmptyComponent={
              <View>
                {loading ? (
                  <ActivityIndicator
                    size={'small'}
                    color={Colors.primary}></ActivityIndicator>
                ) : (
                  <View>{showEmptyCard && <EmptyUserCard />}</View>
                )}
              </View>
            }
          //  numColumns={2}
          />
        )}

        {/* <Text style={styles.label}>{Constants.Title}</Text> */}
        <TextInput
          style={styles.input}
          placeholder={Constants.meetingTitle}
          placeholderTextColor={Colors.gray}
          value={title}
          onChangeText={setTitle}
        />

        {/* <Text style={styles.label}>{Constants.Date}</Text> */}
        <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
          <View style={styles.inputContainer}>
            <Text style={{ color: '#000' }}>{date.toLocaleDateString()}</Text>
            <Calendar size={20} />
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openDatePicker}
          date={date}
          onConfirm={selectedDate => {
            setOpenDatePicker(false);
            setDate(selectedDate);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

        <View style={styles.slotsContainer}>
          <Text style={styles.label}>{Constants.AvailableSlots}</Text>
          {renderSlots()}
        </View>

        <Text style={styles.label}>{Constants.MeetingType}</Text>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                meetingType === 'person' && styles.checked,
              ]}
              onPress={() => handleCheckboxPress('person')}>
              {meetingType === 'person' && <Check color="#fff" size={20} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCheckboxPress('person')}>
              <Text style={styles.optionText}>{Constants.PersonToPerson}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                meetingType === 'online' && styles.checked,
              ]}
              onPress={() => handleCheckboxPress('online')}>
              {meetingType === 'online' && <Check color="#fff" size={20} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCheckboxPress('online')}>
              <Text style={styles.optionText}>{Constants.Online}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>{Constants.Description}</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder={Constants.Description}
          placeholderTextColor={Colors.gray}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />

        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{Constants.CreateNewMeeting}</Text>
        </TouchableOpacity> */}

        <AppButton
          onPressContinue={() => onPressCreateMeeting()}
          gradientColor={Colors.secondaryGradient}
          textColor={Colors.primary}
          loading={loading_}
          buttonWidth={'90%'}
          buttonTitle={Constants.CreateNewMeeting}
        />


      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'medium',
    marginBottom: 5,
    color: '#666666',
  },
  noSlotsError: {
    fontSize: 14,
    fontWeight: 'medium',
    marginBottom: 5,
    color: '#666666',
    textAlign: 'center',
    flex: 1
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: Colors.black,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
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
  },
  timeBox: {
    width: '48%',
  },
  slotsContainer: {
    marginBottom: 10,
  },
  slotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'space-between',
  },
  slotsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    flex: 1,
    flexBasis: '33%',
  },
  slotsEmpty: {
    flex: 1,
    flexBasis: '33%',
  },
  activeSlots: {
    backgroundColor: '#8FC9CB',
    borderWidth: 0
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#2B3D4E',
    borderColor: '#2B3D4E',
  },
  optionText: {
    fontSize: 14,
    color: '#4d4d4d',
  },
  button: {
    backgroundColor: '#8FC9CB',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#2B3D4E',
    fontWeight: '500',
  },
  headerText: {
    fontSize: AutoScaledFont(21),
    color: Colors.secondaryLightIcons,
    textAlign: 'left',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
});

export default CreateNewMeeting;
