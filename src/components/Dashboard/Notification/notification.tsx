import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import HeaderComponent from '../header/header';

const NotificationScreen = () => {
  const notificationData = [
    { id: '1', title: 'Some one likes you', subtitle: 'This is the first notification.', isRead: false, userImage: require('../../../assets/images/screenImage1.png') },
    { id: '2', title: 'Some one likes you', subtitle: 'This is the second notification.', isRead: false, userImage: require('../../../assets/images/screenImage2.png') },
    { id: '3', title: 'Some one likes you', subtitle: 'This is the third notification.', isRead: false, userImage: require('../../../assets/images/screenImage1.png') },
    // Add more data as needed
  ];

  const handleMarkAsRead = (id:any) => {
    // Implement logic to mark the notification as read
    console.log(`Mark as Read clicked for notification with id ${id}`);
  };

  const handleView = (id:any) => {
    // Implement logic to navigate to the detailed view of the notification
    console.log(`View clicked for notification with id ${id}`);
  };

  const renderNotificationItem = ({ item }:any) => (
    <View style={styles.notificationItem}>
      <Image source={item.userImage} style={styles.userImage} />
      <View style={styles.notificationText}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      {!item.isRead && (
        <TouchableOpacity onPress={() => handleMarkAsRead(item.id)}>
          <Text style={styles.actionButton}>Mark as Read</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => handleView(item.id)}>
        <Text style={styles.actionButton}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderComponent title="Notification" icon={true} />
      <FlatList
        data={notificationData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: "#BB2CBB",
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    color: '#BB2CBB',
    marginLeft: 10,
  },
});

export default NotificationScreen;
