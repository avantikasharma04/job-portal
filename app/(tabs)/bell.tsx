import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons
import { router } from 'expo-router';

const InboxScreen = ({ navigation }) => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      category: 'Job Alert',
      description: 'New arrivals in a soft spring palette.',
    },
    {
      id: 2,
      category: 'Job has been found',
      description: 'Floral prints, lace and matching sets.',
    },
    {
      id: 3,
      category: 'Preppy edit',
      description: 'A new spring arrival of fresh blue tones.',
    },
    
  ];

  // Handle notification press
  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification);
    // Navigate to specific screen based on notification
    // navigation.navigate('NotificationDetail', { notification });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inbox</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <View key={notification.id}>
            <TouchableOpacity 
              style={styles.notificationItem}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationContent}>
                <View style={styles.dotContainer}>
                  <View style={styles.dot} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.category}>{notification.category}</Text>
                  <Text style={styles.description}>{notification.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  placeholder: {
    width: 24, // Same width as back button for centering
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d81b60', // Red dot color
  },
  textContainer: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4, 
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 16,
  },
});

export default InboxScreen;