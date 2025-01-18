import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {Colors} from '../constants/Colors';
import {AutoScaledFont} from '../config/Size';
import {Constants} from '../constants/Constants';

interface CalenderDetailsSectionProps {
  AvailableDates?: string;
  EachDayHours?: string;
  Exception?: string;
  color?: string;

}

const CalenderDetailsSection = ({
  AvailableDates,
  EachDayHours,
  Exception,
  color=Colors.black

}: CalenderDetailsSectionProps) => {
  return (
    <View>
      <Text style={[styles.header,{color:color}]}>{Constants.calenderDetails}</Text>

      <View style={styles.singleView}>
        <Text style={[styles.title,{color:color}]}>{Constants.AvailableDates}</Text>
        <Text style={[styles.rightText,{color:color}]}>{AvailableDates}</Text>
      </View>

      <View style={styles.singleView}>
      <Text style={[styles.title,{color:color}]}>{Constants.EachDayHours}</Text>
      <Text style={[styles.rightText,{color:color}]}>{EachDayHours}</Text>
      </View>

      <View style={styles.singleView}>
      <Text style={[styles.title,{color:color}]}>{Constants.Exception}</Text>
      <Text style={[styles.rightText,{color:color}]}>{Exception}</Text>
      </View>

      <View style={styles.singleView}>
      <Text style={[styles.title,{color:color}]}>{Constants.supportedDocuments}</Text>
      <Text style={[styles.rightText,{color:color}]}>{Exception}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: 'center',
  },
  header: {
    alignSelf: 'flex-start',
    fontSize: AutoScaledFont(22),
    fontFamily: 'Poppins-Medium',
    marginTop: AutoScaledFont(30),
    marginBottom: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
    color: Colors.black,
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
    marginHorizontal: AutoScaledFont(20),
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(10),
  },
});

export default CalenderDetailsSection;
