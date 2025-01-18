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
import { debounce, get } from 'lodash';
import { Routes } from '../../fonts/routers/Routes';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeader from '../../components/HomeHeader';
import LottieView from 'lottie-react-native';
import { BellSimple, Calendar, Users } from 'phosphor-react-native';
import TwoIconsHeader from '../../components/TwoIconsHeader';
import { useSelector } from 'react-redux';
import { FetchAskAnythingHistory } from '../../services/AskAnythingService';

export const AskAnything = () => {
  const navigation = useNavigation();
  const [askAnythingHistory, setAskAnythingHistory] = useState<{ _id: string, query: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const agentData = useSelector(state => state.user.agentData || {});
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [historyEndReached, setHistoryEndReached] = useState(false);

  const getAskAnythingHistory = async () => {
    if (historyEndReached) return;
    setLoading(true);
    setError('');
    try {
      const data = await FetchAskAnythingHistory(get(agentData, 'agent._id', ''), get(agentData, 'agent.accessToken'), page)
      console.log("FetchAskAnythingHistory", data);
      if (data.data.history.length == 0) {
        setHistoryEndReached(true);
      } else {
        setPage(page + 1);
      }
      setAskAnythingHistory([...askAnythingHistory, ...data.data.history]);
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setHistoryEndReached(false);
      getAskAnythingHistory();
    }, []),
  );
  const debouncedLoadMore = debounce(getAskAnythingHistory, 300);

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
        onPress={() => navigation.goBack()}
        isDeviderShown={true}
        backHidden={true}
        deviderHeight={0.5}
      />

      <View
        style={[{
          flex: 1,
          paddingBottom: AutoScaledFont(50),
        }, styles.mainView]}>
        <FlatList
          data={askAnythingHistory}
          renderItem={({ item }) => <TouchableOpacity
            onPress={() => navigation.navigate(Routes.AskAnythingDetail, { item: item })}
            style={styles.queryButton}
          >
            <Text style={styles.queryText}>{item.query}</Text>
          </TouchableOpacity>
          }
          keyExtractor={item => get(item, '_id', '')}
          scrollEnabled={true}
          onEndReached={debouncedLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View>
              {loading ? (
                <ActivityIndicator
                  size={'small'}
                  color={Colors.white} style={{ marginTop: AutoScaledFont(150) }}></ActivityIndicator>
              ) : (
                <Text style={styles.noQueries}>
                  {error ? error : Constants.noHistoryAvailable}
                </Text>
              )}
            </View>
          }
        />
      </View>
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
  referateAiAnimation: {
    alignSelf: 'center',
    marginTop: -AutoScaledFont(20),
    opacity: 0.5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    borderTopWidth: AutoScaledFont(0.5),
    borderRightWidth: AutoScaledFont(0.5),
    borderLeftWidth: AutoScaledFont(0.5),
    marginHorizontal: AutoScaledFont(20),
    marginBottom: AutoScaledFont(30),
    borderRadius: AutoScaledFont(10),
    paddingHorizontal: AutoScaledFont(10),
    paddingVertical: AutoScaledFont(25),
    borderColor: Colors.gray,
    backgroundColor: Colors.primary,
    alignSelf: 'center',

    // Shadow properties for iOS
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,

    // Shadow properties for Android
    elevation: 10,
  },
  innerView: {
    flexDirection: 'row',
  },
  buttonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    minWidth: AutoScaledFont(130),
    maxWidth: AutoScaledFont(180),
    marginHorizontal: AutoScaledFont(5),
    backgroundColor: Colors.lighterGray,
    padding: AutoScaledFont(20),
    borderRadius: AutoScaledFont(10),
    shadowColor: Colors.lighterGray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    marginTop: AutoScaledFont(5),
    fontSize: AutoScaledFont(15),
    fontFamily: 'Poppins-Medium',
    color: Colors.primary,
    textAlign: 'center',
  },
  headerLine: {
    marginTop: AutoScaledFont(5),
    marginBottom: AutoScaledFont(10),
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-SemiBold',
    color: Colors.white,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#f2f3f4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  queryButton: {
    flexDirection: 'row',
    borderWidth: AutoScaledFont(0.5),
    borderColor: Colors.lighterGray,
    borderRadius: AutoScaledFont(10),
    marginVertical: AutoScaledFont(8),
    padding: AutoScaledFont(10)
  },
  queryText: {
    fontSize: AutoScaledFont(18),
    marginStart: AutoScaledFont(12),
    color: Colors.white,
    flex: 1,
    fontFamily: 'Poppins-Medium',
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
