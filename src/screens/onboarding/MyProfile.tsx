import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {get} from 'lodash';
import {Routes} from '../../fonts/routers/Routes';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import {NotePencil} from 'phosphor-react-native';
import FastImage from 'react-native-fast-image';
import ProfileDetailsSection from '../../components/ProfileDetailsSection';
import CalenderDetailsSection from '../../components/CalenderDetails';
import {FetchAgentViaEmail} from '../../services/AgentServices';
import ShimmerLoader from '../../components/Modal/ShimmerLoader';

export const MyProfile = () => {
  const [piData, setpiData] = React.useState<any>({});
  const [userName, setUserName] = React.useState<string>('Agent Hi');
  const [userPic, setuserPic] = React.useState<string>('Agent Hi');
  const [dataLoading, setdataLoading] = React.useState<boolean>(true);
  const navigation = useNavigation();
  //  const userPic = 'https://fastly.picsum.photos/id/143/200/300.jpg?hmac=LXGdX9PiyshH-j3_aFp9tazDDPkI0CDtwP-Q4EXBSoA'
  //  const userPic = ''

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      let userData = jsonValue != null ? JSON.parse(jsonValue) : null;
      // console.log('userData__', userData);

      let agentData = await FetchAgentViaEmail(get(userData, 'user.email', ''));
      // console.log('FetchAgentViaEmail', agentData);

      setpiData(agentData);
      setuserPic(get(userData, 'user.photo', ''));
      setUserName(
        get(agentData, 'agent.first_name', '') +
          ' ' +
          get(agentData, 'agent.last_name', ''),
      );

      setdataLoading(false);
    } catch (e) {
      setdataLoading(false);
      console.error('Error retrieving user data', e);
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
        leftTitle={Constants.myProfile}
        secondIconSrc={<NotePencil size={26} color={Colors.originalBlue} />}
        secondIcon={true}
        onPressSecondIcon={() => {
          navigation.navigate(Routes.EditProfileDetails);
        }}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
      />

      {dataLoading ? (
        <ShimmerLoader isVisible={true} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingBottom: AutoScaledFont(20),
          }}>
          <View
            style={{
              flex: 1,
              paddingBottom: AutoScaledFont(50),
              marginTop: AutoScaledFont(30),
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              {userPic ? (
                <FastImage
                  source={{uri: userPic}}
                  style={styles.userPic}></FastImage>
              ) : (
                <View
                  style={{
                    height: AutoScaledFont(150),
                    width: AutoScaledFont(150),
                    borderRadius: AutoScaledFont(75),
                    borderColor: Colors.secondary,
                    borderWidth: AutoScaledFont(4),
                    justifyContent: 'center',
                    backgroundColor: Colors.lighterGray,
                  }}>
                  <Text
                    style={{
                      fontSize: AutoScaledFont(40),
                      color: Colors.black,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    {(userName || 'AH')?.substring(0, 2)?.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.userNameText}>{userName}</Text>
            {get(piData, 'atwin.brief_summary', '') && (
              <Text style={styles.aboutTitle}>{Constants.about}</Text>
            )}

            {get(piData, 'atwin.brief_summary', '') && (
              <Text style={styles.bioText}>
                {get(piData, 'atwin.brief_summary', '')}
              </Text>
            )}
            <ProfileDetailsSection
              firstName={get(piData, 'agent.first_name', '')}
              lastName={get(piData, 'agent.last_name', '')}
              mobNo={get(piData, 'agent.mobile_number', '')}
              countryCode={get(piData, 'agent.country_code', '')}
              email={get(piData, 'agent.email', '')}
              occupation={get(piData, 'agent.occupation', '-')}
              attachments={get(piData, 'agent.attachments', '-')}
              time_zone={get(piData, 'agent.time_zone', '-')}
            />

            {/* <CalenderDetailsSection
            AvailableDates={
              get(piData, 'atwin.availability.working_hours', [])?.length +
              ' days'
            }
            EachDayHours={
              get(
                piData,
                'atwin.availability.working_hours[0].start_time',
                '',
              ) +
              ' - ' +
              get(piData, 'atwin.availability.working_hours[0].end_time', '')
            }
            Exception={get(
              piData,
              'atwin.availability.working_hours[0].Exception',
              '-',
            )}
          /> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userNameText: {
    fontSize: AutoScaledFont(26),
    marginTop: AutoScaledFont(10),
    marginBottom: AutoScaledFont(5),
    color: Colors.originalBlue,
    fontFamily: 'Poppins-Medium',
  },
  bioText: {
    fontSize: AutoScaledFont(20),
    marginHorizontal: AutoScaledFont(20),
    marginVertical: AutoScaledFont(5),
    color: Colors.black,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
  },
  aboutTitle: {
    fontSize: AutoScaledFont(22),
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },
  userPic: {
    height: AutoScaledFont(150),
    width: AutoScaledFont(150),
    borderRadius: AutoScaledFont(75),
    borderColor: Colors.secondary,
    borderWidth: AutoScaledFont(4),
    alignSelf: 'center',
    backgroundColor: Colors.charcole,
  },
});
