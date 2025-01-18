import React from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import {AutoScaledFont} from '../../config/Size';
import {Colors} from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import {Constants} from '../../constants/Constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import SettingsSections from '../../components/SettingsSections';
import {
  Headset,
  Monitor,
  ShieldWarning,
  SignOut,
  Video,
} from 'phosphor-react-native';
import LogoutModal from '../../components/Modal/LogoutModal';
import {GetBuildNumber} from '../../config/Utils';
import TwoIconsHeader from '../../components/TwoIconsHeader';

GoogleSignin.configure({
  webClientId: '',
  // androidClientId: '',
  iosClientId: '',
  scopes: ['profile', 'email'],
});

export const Settings = () => {
  const [logoutModal, setlogoutModal] = React.useState<boolean>(false);
  const navigation = useNavigation();

  const OpneUrl = (url: string) => {
    Linking.openURL(url);
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
        leftTitle={Constants.settings}
        onPress={() => navigation.goBack()}
        backHidden={false}
      />

      <View
        style={{
          backgroundColor: Colors.white,
          marginTop: AutoScaledFont(10),
        }}>
        <SettingsSections
          name={Constants.aboutUs}
          onpressSection={() => OpneUrl(Constants.URLS.AboutUs)}
          icon={
            <Image
              source={require('../../images/logo.png')}
              resizeMode="contain"
              style={{height: AutoScaledFont(30), width: AutoScaledFont(30)}}
            />
          }
        />
        <SettingsSections
          name={Constants.privacy}
          onpressSection={() => OpneUrl(Constants.URLS.PrivacyPolicy)}
          icon={<ShieldWarning size={28} />}
        />

        <SettingsSections
          name={Constants.contact}
          onpressSection={() => OpneUrl(Constants.URLS.ContactUrl)}
          icon={<Headset size={28} />}
        />
        <SettingsSections
          name={Constants.howDoesItWorks_}
          onpressSection={() => OpneUrl(Constants.URLS.YoutubePlaylist)}
          icon={<Video size={28} />}
        />
        <SettingsSections
          name={Constants.logout}
          onpressSection={() => setlogoutModal(true)}
          showBottomLine={true}
          icon={<SignOut size={28} color={Colors.red} />}
        />

        <SettingsSections
          name={Constants.softwareVersion + ` ${GetBuildNumber()}`}
          onpressSection={() => {}}
          showBottomLine={false}
          icon={<Monitor size={28} />}
        />
      </View>

      <LogoutModal
        isVisible={logoutModal}
        onClose={() => setlogoutModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  appIcon: {
    width: AutoScaledFont(250),
    height: AutoScaledFont(250),
    // borderRadius: AutoScaledFont(10),
    // marginBottom: AutoScaledFont(50),
    alignSelf: 'center',
    position: 'absolute',
  },
  craftedText: {
    alignSelf: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: AutoScaledFont(24),
  },
});
