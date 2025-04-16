// InboxScreen.jsx (or InboxScreen.tsx)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getRecommendedJobsForUser } from '../../src/services/jobMatching';
import { useAuth } from '../../src/context/AuthContext';

const InboxScreen = () => {
  // State to hold personalized notifications
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth(); // Assume 'user.uid' is available

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.uid) {
        // Get recommended jobs based on the user's profile from Firebase
        const recommendedJobs = await getRecommendedJobsForUser(user.uid);

        // Transform the job data into notification objects
        const formattedNotifications = recommendedJobs.map((job) => ({
          id: job.id,
          category: 'Job Alert',
          description: `We found a match: ${job.title} (${(job.matchScore * 100).toFixed(2)}% match)`,
        }));
        setNotifications(formattedNotifications);
      }
    };

    fetchNotifications();
  }, [user]);

  // Handler for notification taps
  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification);
    // Navigate to a screen for job details or notifications details if desired:
    // router.push(`/jobDetail/${notification.id}`);
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
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {notifications.length ? (
          notifications.map((notification) => (
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
          ))
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No notifications at the moment.</Text>
          </View>
        )}
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
    width: 24,
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
    backgroundColor: '#d81b60',
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
  noData: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
  },
});

export default InboxScreen;
