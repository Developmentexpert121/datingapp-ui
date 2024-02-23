import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import HeaderComponent from '../header/header';
import {useAppDispatch, useAppSelector} from '../../../store/store';
import {getNotifications} from '../../../store/Auth/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserId = async () => {
  try {
    const userId: any = await AsyncStorage.getItem('userId');

    if (userId !== null) {
      console.log(JSON.parse(userId));
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
  const allNotifications: any = useAppSelector(
    (state: any) => state?.Auth?.data?.allNotifications,
  );

  useEffect(() => {
    const getId = async () => {
      const userId = await getUserId();
      dispatch(getNotifications(userId));
    };

    getId();
  }, []);

  const handleMarkAsRead = (id: any) => {
    // Implement logic to mark the notification as read
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
    return (
      <View style={styles.notificationItem}>
        <View style={{alignSelf: 'flex-start'}}>
          <Image source={{uri: user.profilePic}} style={styles.userImage} />
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
              <Text style={styles.title}>{user.name}</Text>
              <Text style={styles.subtitle}>
                {item.type === 'like' && 'Has liked your profile'}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {!user?.isRead && (
                <TouchableOpacity onPress={() => handleMarkAsRead(user._id)}>
                  <Text style={styles.actionButton}>Mark as Read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleView(user._id)}>
                <Text style={styles.actionButton}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={{fontFamily: 'Sansation_Bold'}}>
              {getTimeAgo(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Notifications" icon={true} />
      <FlatList
        data={allNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    alignSelf: 'flex-start',
    fontFamily: 'Sansation_Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    flexWrap: 'nowrap',
    alignSelf: 'flex-start',
    fontFamily: 'Sansation_Regular',
  },
  actionButton: {
    fontFamily: 'Sansation_Bold',
    color: '#AC25AC',
    marginRight: 20,
  },
});

export default NotificationScreen;
