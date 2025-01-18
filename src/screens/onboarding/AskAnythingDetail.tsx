import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoScaledFont, getDeviceWidth } from '../../config/Size';
import { Colors } from '../../constants/Colors';
import AppStatusBar from '../../components/AppStatusBar';
import { Constants } from '../../constants/Constants';
import { get } from 'lodash';
import { Routes } from '../../fonts/routers/Routes';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/HomeHeader';
import LottieView from 'lottie-react-native';
import { BellSimple, Calendar, Users } from 'phosphor-react-native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { useSelector } from 'react-redux';
import { FetchQueryDetail } from '../../services/AskAnythingService';
import LinearGradient from 'react-native-linear-gradient';

interface IAskAnythingDetail {
  "header": string;
  "points": string[],
  "footer": string
}

export const AskAnythingDetail = ({ route }: any) => {
  const navigation = useNavigation();
  const [details, setDetails] = useState<IAskAnythingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const [error, setError] = useState('');

  const getAskAnythingDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await FetchQueryDetail(get(agentData, 'agent._id', ''), route.params.item._id, get(agentData, 'agent.accessToken'))
      console.log(data);

      setDetails(data.data.response)
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }

  }

  useFocusEffect(
    useCallback(() => {
      getAskAnythingDetail();
    }, []),
  );

  return (
    <View style={{ backgroundColor: Colors.primary, flex: 1, }}>
      <AppStatusBar
        hidden={false}
        translucent={false}
        STYLES_={2}
        bgcolor={Colors.primary}
      />
      <TwoIconsHeader
        leftTitle={Constants.AskAnything}
        secondIcon={false}
        titleColor={Colors.white}
        iconTint={Colors.white}
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={false}
      />

      <View
        style={[{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
        }, styles.mainView]}>
        {
          loading ? (
            <ActivityIndicator
              size={'small'}
              color={Colors.white} style={{ marginTop: AutoScaledFont(150) }}></ActivityIndicator>
          ) : (
            details ? (
              <>
                <View style={[styles.cardContainer]}>
                  {/* <Text style={styles.queryHeader}>{route.params.item.query}</Text> */}
                  <Text style={styles.queryHeader}>{details.header}</Text>
                  <View style={{ marginTop: AutoScaledFont(10) }}>
                    <Text style={styles.queryText}>Points:</Text>
                    <FlatList
                      data={details.points}
                      renderItem={({ item }) => <LinearGradient
                        colors={Colors.aiQuestionBackgroundGradient}
                        useAngle={true}
                        angle={90}
                        style={styles.gradientContainer}>
                        <Text style={styles.queryText}>• {item}</Text>
                      </LinearGradient>
                      }
                      keyExtractor={item => item}
                      scrollEnabled={true}
                    />
                  </View>
                  <View style={{ marginTop: AutoScaledFont(10) }}>
                    <Text style={styles.queryText}>Footer:</Text>
                    <LinearGradient
                      colors={Colors.aliceBlueWithGrayGradient}
                      useAngle={true}
                      angle={90}
                      style={styles.gradientContainer}>
                      <Text style={styles.queryText}>{details.footer}</Text>
                    </LinearGradient>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.noQueries}>
                {Constants.noNoDetailsForQuery}
              </Text>
            )
          )
        }
      </View >
    </View >
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: AutoScaledFont(26),
    color: Colors.secondaryLightIcons,
    fontFamily: 'Poppins-Regular',
  },
  mainView: {
    marginTop: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
  },
  cardContainer: {
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(15),
    marginStart: AutoScaledFont(10),
    marginVertical: AutoScaledFont(10),
    borderRadius: AutoScaledFont(10),
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
  },
  gradientContainer: {
    padding: AutoScaledFont(5),
    borderRadius: AutoScaledFont(7),
  },
  queryHeader: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  queryText: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(12),
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
  },
  noQueries: {
    fontSize: AutoScaledFont(21),
    marginTop: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
});
