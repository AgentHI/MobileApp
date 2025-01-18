import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {AutoScaledFont} from '../config/Size';
import {Colors} from '../constants/Colors';
import {Constants} from '../constants/Constants';
import {get} from 'lodash';
import {Plus} from 'phosphor-react-native';
import BottomModal from './Modal/BottomSheetModal';
import UserCardHome from './UserCardHome';

interface ClientListProps {
  warningMessageClick: () => void;
  addClientPress: () => void;
  LoadMoreClients_: () => Promise<void>;
    clientList: any;
}

const ClientList = ({
  warningMessageClick,
  addClientPress,
  LoadMoreClients_,
  clientList,
}: ClientListProps) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // const dummyData = [
  //   {
  //     id: "1a2b3c",
  //     name: "John Doe",
  //     availabilityTimeRange: "9:00 AM - 5:00 PM",
  //     contactNumber: "+1234567890",
  //     postedAgo: "2h ago"
  //   },
  //   {
  //     id: "2b3c4d",
  //     name: "Jane Smith",
  //     availabilityTimeRange: "10:00 AM - 6:00 PM",
  //     contactNumber: "+0987654321",
  //     postedAgo: "6h ago"
  //   },
  //   {
  //     id: "3c4d5e",
  //     name: "Michael Brown",
  //     availabilityTimeRange: "8:00 AM - 4:00 PM",
  //     contactNumber: "+1122334455",
  //     postedAgo: "1d ago"
  //   },
  //   {
  //     id: "4d5e6f",
  //     name: "Emily Davis",
  //     availabilityTimeRange: "11:00 AM - 7:00 PM",
  //     contactNumber: "+9988776655",
  //     postedAgo: "30m ago"
  //   },
  //   {
  //     id: "5e6f7g",
  //     name: "Chris Johnson",
  //     availabilityTimeRange: "7:00 AM - 3:00 PM",
  //     contactNumber: "+2233445566",
  //     postedAgo: "15h ago"
  //   },
  //   {
  //     id: "6f7g8h",
  //     name: "Olivia Williams",
  //     availabilityTimeRange: "12:00 PM - 8:00 PM",
  //     contactNumber: "+3344556677",
  //     postedAgo: "45m ago"
  //   },
  //   {
  //     id: "7g8h9i",
  //     name: "Liam Wilson",
  //     availabilityTimeRange: "6:00 AM - 2:00 PM",
  //     contactNumber: "+6677889900",
  //     postedAgo: "3h ago"
  //   },
  //   {
  //     id: "8h9i0j",
  //     name: "Sophia Martinez",
  //     availabilityTimeRange: "2:00 PM - 10:00 PM",
  //     contactNumber: "+4455667788",
  //     postedAgo: "8h ago"
  //   },
  //   {
  //     id: "9i0j1k",
  //     name: "James Anderson",
  //     availabilityTimeRange: "5:00 PM - 1:00 AM",
  //     contactNumber: "+7788990011",
  //     postedAgo: "20m ago"
  //   },
  //   {
  //     id: "0j1k2l",
  //     name: "Isabella Taylor",
  //     availabilityTimeRange: "4:00 AM - 12:00 PM",
  //     contactNumber: "+8899001122",
  //     postedAgo: "12h ago"
  //   }
  // ];


  const handleLoadMore = async () => {
    if (true) {
      setLoadingMore(true);
      await LoadMoreClients_();
      setLoadingMore(false);
    }
  };


  return (
    <View style={[styles.mainView]}>
      <View
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignContent: 'center',
        }}>
        <Text style={styles.subtitle}>{Constants.client}</Text>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={addClientPress}>
            <View style={{flexDirection: 'row'}}>
              <Plus size={20} color={Colors.white} style={{opacity: 0.8}} />

              <Text style={styles.title}>{Constants.add}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={clientList}
        renderItem={({item}) => (
          <UserCardHome item={item} onPress={() => {}} showAdd={false} />
        )}
        keyExtractor={item => get(item, '_id', '')}
        onEndReached={handleLoadMore}
        scrollEnabled={false}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : null
        }
        ListEmptyComponent={
          <View>
              <Text style={styles.headerText}>
                {Constants.noNewClient}
              </Text>
          </View>
        }
      />

      <BottomModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: AutoScaledFont(18),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    width: AutoScaledFont(60),
    textAlign: 'center',
    opacity: 0.8,
  },
  headerText: {
    fontSize: AutoScaledFont(21),
    marginTop: AutoScaledFont(50),
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  subtitle: {
    marginStart: AutoScaledFont(16),
    fontSize: AutoScaledFont(20),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
    flex: 1,
    opacity: 0.8,
  },
  mainView: {
    marginTop: AutoScaledFont(10),
    marginHorizontal: AutoScaledFont(20),
  },
});

export default ClientList;
