import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {getNotifications, handleNotificationRead} from '../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader/Loader';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      return JSON.parse(userId);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const NotificationScreen = () => {
  const dispatch: any = useAppDispatch();
  const allUsers: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allUsers,
  );
  const profileData: any = useAppSelector(
    (state: any) => state?.Auth?.data?.profileData,
  );
  const allNotifications: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allNotifications,
  );

  const [allNotificationsPresent, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getId = async () => {
      const userId = await getUserId();
      dispatch(getNotifications({userId: profileData?._id}))
        .unwrap()
        .then((response: any) => {
          setAllNotifications(response.newNotifications);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };
    getId();
  }, []);

  const handleMarkAsRead = (id: any) => {
    dispatch(handleNotificationRead(id)).then(() => {
      setAllNotifications((prevNotifications: any) =>
        prevNotifications.filter(
          (notification: any) => notification._id !== id,
        ),
      );
    });
  };

  const handleView = (id: any) => {
    // Implement logic to navigate to the detailed view of the notification
  };

  const getTimeAgo = (timestamp: string) => {
    const timeNow = new Date();
    const timeSent = new Date(timestamp);
    const differenceInSeconds = Math.floor(
      (timeNow.getTime() - timeSent.getTime()) / 1000,
    );

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} sec ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} mins ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hrs ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} days ago`;
    } else if (differenceInSeconds < 2592000) {
      const weeks = Math.floor(differenceInSeconds / 604800);
      return `${weeks} weeks ago`;
    } else if (differenceInSeconds < 31536000) {
      const months = Math.floor(differenceInSeconds / 2592000);
      return `${months} months ago`;
    } else {
      const years = Math.floor(differenceInSeconds / 31536000);
      return `${years} years ago`;
    }
  };

  const renderNotificationItem = ({item}: any) => {
    const user = allUsers.find((u: any) => u._id === item.senderUserId);
    console.log('.........cdfsf', user?.profilePic);
    return (
      <View style={styles.notificationItem}>
        <View style={{alignSelf: 'flex-start'}}>
          <Image
            source={{uri: user?.profilePic?.split(',')[0]}}
            style={styles.userImage}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{rowGap: 10, marginBottom: 6}}>
            <View style={styles.notificationText}>
              <Text style={styles.title}>{user?.name}</Text>
              <Text style={styles.subtitle}>
                {item.type === 'like' && 'Has liked your profile'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {!user?.isRead && (
                <TouchableOpacity onPress={() => handleMarkAsRead(item._id)}>
                  <Text style={styles.actionButton}>Mark as Read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleView(user?._id)}>
                <Text style={styles.actionButton}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={{fontFamily: 'Sansation-Bold'}}>
              {getTimeAgo(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Loader />
        </View>
      ) : allNotificationsPresent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no Notifications!</Text>
        </View>
      ) : (
        <FlatList
          data={allNotificationsPresent}
          renderItem={renderNotificationItem}
          keyExtractor={(item: any) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  emptyText: {
    fontFamily: 'Sansation-Bold',
    fontSize: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',
    marginVertical: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 20,
    marginTop: 6,
  },
  notificationText: {
    flex: 1,
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
    rowGap: 6,
  },
  title: {
    color: 'black',
    fontSize: 16,
    alignSelf: 'flex-start',
    fontFamily: 'Sansation-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
    fontFamily: 'Sansation-Regular',
  },
  actionButton: {
    fontFamily: 'Sansation-Bold',
    color: '#AC25AC',
    marginRight: 20,
  },
});

export default NotificationScreen;
