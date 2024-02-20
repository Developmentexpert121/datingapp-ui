import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import HeaderComponent from '../header/header';

const NotificationScreen = () => {
  const notificationData = [
    {
      id: '1',
      title: 'Some one likes you',
      subtitle:
        'It is a long established fact that a reader will be distracted by the readable',
      isRead: false,
      userImage: require('../../../assets/images/screenImage1.png'),
      timeAgo: '1d',
    },
    {
      id: '2',
      title: 'Some one likes you',
      subtitle:
        'It is a long established fact that a reader will be distracted by the readable',
      isRead: false,
      userImage: require('../../../assets/images/screenImage2.png'),
      timeAgo: '2d',
    },
    {
      id: '3',
      title: 'Some one likes you',
      subtitle: 'It is a long established fact that a reader ',
      isRead: false,
      userImage: require('../../../assets/images/screenImage1.png'),
      timeAgo: '1w',
    },
    // Add more data as needed
  ];

  const handleMarkAsRead = (id: any) => {
    // Implement logic to mark the notification as read
  };

  const handleView = (id: any) => {
    // Implement logic to navigate to the detailed view of the notification
  };

  const renderNotificationItem = ({item}: any) => (
    <View style={styles.notificationItem}>
      <View style={{alignSelf: 'flex-start'}}>
        <Image source={item.userImage} style={styles.userImage} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{rowGap: 10, marginBottom: 6, width: '80%'}}>
          <View style={styles.notificationText}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {!item.isRead && (
              <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
                <Text style={styles.actionButton}>Mark as Read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleView(item.id)}>
              <Text style={styles.actionButton}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontFamily: 'Sansation_Bold'}}>{item.timeAgo}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent title="Notifications" icon={true} />
      <FlatList
        data={notificationData}
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
