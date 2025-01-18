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
import {Calendar, CaretDown, TrashSimple} from 'phosphor-react-native';
import DatePicker from 'react-native-date-picker';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import AppButton from '../../components/AppButton';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-notifications';
import { get } from 'lodash';
import { TOAST_ } from '../../config/Utils';
import { CreateReminder, DeleteReminder } from '../../services/ReminderService';
import { AutoScaledFont } from '../../config/Size';
import DeleteConfirmationModal from '../../components/Modal/DeleteConfirmationModal';
import { DeleteClient } from '../../services/ClientService';

const EditReminders = ({route}:any) => {
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
  const [showModal, setshowModal] = React.useState<boolean>(false);


  console.log('EditRemindersParams___', get(route,'params.item',''));


  useEffect(() => {
    setDescription(get(route,'params.item.description',''))
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


  const onPressDeleteReminder = async () => {
    setshowModal(false);
    let result = await DeleteReminder(get(route, 'params.item._id'), token_);
    if (get(result, 'status', '')==200) {
      TOAST_(Constants.ClientDeleted, 'danger', 3000);
      navigation.goBack();
    } else {
      TOAST_(Constants.errorWhileDeletingClient, 'warning');
    }
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
        leftTitle={Constants.Editreminders}
        secondIcon={true}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={false}
        onPressSecondIcon={() => setshowModal(true)}
        secondIconSrc={
          <TrashSimple
            size={22}
            color={Colors.red}
            style={{marginEnd: AutoScaledFont(5), opacity: 0.9}}
          />
        }

      />

      <Text style={{
        margin:AutoScaledFont(20),
        fontFamily:'Poppins-Medium',
        color:Colors.red,
        textAlign:'center'
      }}>
        {'Editing functionality is not available. You can delete this one and create new one'}
      </Text>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{Constants.Date}</Text>
        <TouchableOpacity onPress={() => setOpenDatePicker(true) }disabled={true}>
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
        <TouchableOpacity onPress={() => setOpenTimePicker(true)} disabled={true}>
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
          // open={openTimePicker}
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
          editable={false}
          numberOfLines={4}
        />

        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{Constants.SetReminder}</Text>
        </TouchableOpacity> */}

        <AppButton
          onPressContinue={() => {}}
          gradientColor={Colors.secondaryGradient}
          textColor={Colors.primary}
          loading={loading_}
          buttonWidth={'90%'}
          buttonTitle={Constants.Editreminders}
        />
      </ScrollView>

      <DeleteConfirmationModal
        isVisible={showModal}
        onClose={() => setshowModal(false)}
        onPressYes={() => onPressDeleteReminder()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    opacity:0.3,
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

export default EditReminders;
