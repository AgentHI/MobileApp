import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {Calendar, CaretDown} from 'phosphor-react-native';
import DatePicker from 'react-native-date-picker';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import AppButton from '../../components/AppButton';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-notifications';
import { get } from 'lodash';
import { CreateReminder } from '../../services/ReminderService';
import { TOAST_ } from '../../config/Utils';

const Reminders = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [fTime, setFTime] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [loading_, setLoading_] = React.useState<boolean>(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const token_ = useSelector(state => state.user.piData.token || {});



  useEffect(() => {
    console.log('token_', token_);
    const date_ = new Date(date).toISOString().split('T')[0];
    console.log(date_);
    console.log('formatted_date', date_);
    const startTime_ = new Date(time).toISOString().split('T')[1];
    console.log('formatted_startTime_', date_ + 'T' + startTime_);
    setFTime(date_ + 'T' + startTime_);
  }, [time, date]);


  const onPressCreateMeeting = async() => {
    if (
      !fTime.toString().trim() ||
      !description.toString().trim()
    ) {
      Toast.show(Constants.AllFieldsWarningMessage);
      return;
    }

    setLoading_(true);

    let AppointmentObj = {
      twin_id: get(agentData,'atwin._id',''),
      trigger_time:fTime,
      description: description,
    };

    let result = await CreateReminder(AppointmentObj,token_)
    setLoading_(false);

    if(get(result,'data[0]._id','')){
      TOAST_(Constants.ReminderCreated,'success',3000);
      navigation.goBack()
    }else{
      TOAST_(Constants.errorWhileCreatingReminder,'warning');
    }
    console.log('CreateAppointment_result___',result);
  };


  return (
    <View style={{backgroundColor: Colors.white, flex: 1}}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={1}
        bgcolor={Colors.white}
      />

      <TwoIconsHeader
        leftTitle={Constants.reminders}
        secondIcon={false}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={false}

      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{Constants.Date}</Text>
        <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
          <View style={styles.inputContainer}>
            <Text style={{color: '#000'}}>{date.toLocaleDateString()}</Text>
            <Calendar size={22} />
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

        <Text style={styles.label}>{Constants.Time}</Text>
        <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
          <View style={styles.inputContainer}>
            <Text style={{color: '#000'}}>
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <CaretDown size={22} />
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="time"
          open={openTimePicker}
          date={time}
          onConfirm={selectedTime => {
            setOpenTimePicker(false);
            setTime(selectedTime);
          }}
          onCancel={() => setOpenTimePicker(false)}
        />

        <Text style={styles.label}>{Constants.Description}</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Meeting with John Milton"
          placeholderTextColor={Colors.gray}
          multiline={true}
          numberOfLines={4}
        />

        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{Constants.SetReminder}</Text>
        </TouchableOpacity> */}

        <AppButton
          onPressContinue={() => onPressCreateMeeting()}
          gradientColor={Colors.secondaryGradient}
          textColor={Colors.primary}
          loading={loading_}
          buttonWidth={'90%'}
          buttonTitle={Constants.CreateNewReminder}
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
    fontWeight: '500',
    marginBottom: 5,
    color: '#666666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: Colors.black,
    backgroundColor: '#fff',
    flex: 1,
  },
  descriptionInput: {
    height: 100,
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
});

export default Reminders;
