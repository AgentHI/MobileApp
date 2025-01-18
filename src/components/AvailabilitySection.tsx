import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { AutoScaledFont } from '../config/Size';
import { Constants } from '../constants/Constants';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../fonts/routers/Routes';

interface AvailabilitySectionProps {
  AvailableDates?: string;
  EachDayHours?: string;
  Exception?: string;
  color?: string;
}

const AvailabilitySection = ({
  AvailableDates,
  EachDayHours,
  Exception,
  color = Colors.black,
}: AvailabilitySectionProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={[styles.header, { color: color }]}>{''}</Text>

      <View style={styles.singleView}>
        <Text style={[styles.title, { color: color }]}>
          {Constants.AvailableDates}
        </Text>
        <Text style={[styles.rightText, { color: color }]}>{AvailableDates}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={[styles.title, { color: color }]}>
          {Constants.EachDayHours}
        </Text>
        <Text style={[styles.rightText, { color: color }]}>{EachDayHours}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.EditProfileHome)
          }>
          <View style={styles.buttonView}>
            <Text style={[styles.buttonText, { textAlign: 'center' }]}>
              {Constants.updateAvailability}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.EditUnavailability)
          }>
          <View style={styles.buttonView}>
            <Text style={[styles.buttonText, { textAlign: 'center' }]}>
              {Constants.updateUnavailability}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'center',
  },
  header: {
    marginTop: AutoScaledFont(0),
    marginBottom: AutoScaledFont(1),
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Regular',
    paddingEnd: AutoScaledFont(20),
    color: Colors.black,
    flex: 1,
  },
  rightText: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(10),
    fontFamily: 'Poppins-Medium',
    flex: 1.5,
    alignSelf: 'flex-start',
    // backgroundColor:'red',
    textAlign: 'left',
    color: Colors.black,
  },
  singleView: {
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: AutoScaledFont(12),
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginHorizontal: AutoScaledFont(12),
    marginTop: AutoScaledFont(10),
    gap: AutoScaledFont(10),
  },
  buttonView: {
    marginTop: AutoScaledFont(5),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
    alignSelf: 'center',
    marginBottom: AutoScaledFont(10),
  },
  buttonText: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    margin: AutoScaledFont(8),
    color: Colors.black,
  },
});

export default AvailabilitySection;
