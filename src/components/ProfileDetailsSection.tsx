import {
  View,
  Text,
  TouchableOpacity,
  ColorValue,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import {ArrowLeft, NotePencil} from 'phosphor-react-native';
import {Colors} from '../constants/Colors';
import {AutoScaledFont, getPrimaryButtonHeight} from '../config/Size';
import {ReactNode} from 'react';
import {Constants} from '../constants/Constants';

interface ProfileDetailsSectionProps {
  firstName?: string;
  lastName?: string;
  mobNo?: string;
  countryCode?: string;
  email?: string;
  occupation?: string;
  attachments?: string;
  time_zone?: string;
}

const ProfileDetailsSection = ({
  firstName,
  lastName,
  mobNo,
  countryCode,
  email,
  occupation,
  attachments,
  time_zone
}: ProfileDetailsSectionProps) => {
  return (
    <View>
      <Text style={styles.header}>{Constants.profileDetails}</Text>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.firstName}</Text>
        <Text style={styles.rightText}>{firstName}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.lastName}</Text>
        <Text style={styles.rightText}>{lastName}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.mobileNo}</Text>
        <Text style={styles.rightText}>{mobNo}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.countryCode}</Text>
        <Text style={styles.rightText}>{countryCode}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.email}</Text>
        <Text style={styles.rightText}>{email}</Text>
      </View>

      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.occupation}</Text>
        <Text style={styles.rightText}>{occupation}</Text>
      </View>
      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.Certificates}</Text>
        <Text style={styles.rightText}>{attachments}</Text>
      </View>
      <View style={styles.singleView}>
        <Text style={styles.title}>{Constants.time_zone}</Text>
        <Text style={styles.rightText}>{time_zone}</Text>
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
    marginHorizontal: AutoScaledFont(20),
    marginBottom: AutoScaledFont(10),
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

export default ProfileDetailsSection;
