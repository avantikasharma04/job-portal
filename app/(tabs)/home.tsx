import React from 'react';
import { View, ScrollView, Text, Image, TextInput, StyleSheet, Dimensions,Button } from 'react-native';
import { Appbar, Card, BottomNavigation, IconButton, Surface, List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ListPage from './list'
import Profile from './profile';
import SettingsScreen from './set';
import { createStackNavigator } from "@react-navigation/stack"
import Bell from './bell';
import { useNavigation, useRouter } from 'expo-router';

const router = useRouter()

const { width } = Dimensions.get('window');
const Stack = createStackNavigator();

const HomeScreen = () => {
  const navigation=useNavigation()

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'jobs', title: 'Jobs', icon: 'briefcase' },
    { key: 'profile', title: 'Profile', icon: 'account' },
    { key: 'more', title: 'More', icon: 'dots-horizontal' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeContent />, 
    jobs: () => < ListPage />, 
    profile: () => < Profile/>, 
    more: () => <SettingsScreen />, 
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content 
          title="Kaam.com" onPress={() => router.push("/home")}
          titleStyle={styles.headerTitle}
          subtitle="Find Your Dream Job"
        />
        <Appbar.Action icon="bell" onPress={() => router.push("bell")} />
      </Appbar.Header>
      
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bottomNav}
        activeColor="#1e88e5"
      />
    </View>
  );
};

const PlaceholderScreen = ({ title }) => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.placeholderText}>{title}</Text>
  </View>
);

const HomeContent = () => {
  const steps = [
    { title: 'Create Profile', icon: 'account-edit', description: 'Set up your profile with your basic information, skills and experience ' },
    { title: 'Browse Jobs', icon: 'magnify', description: 'Explore thousands of opportunities matching your expertise' },
    { title: 'Apply & Connect', icon: 'handshake', description: 'Apply to positions and connect with employers directly' },
  ];

  const successStories = [
    { name: 'Sarita Shetty', role: 'Toddler nanny', company: 'working for 2+ years with us' },
    { name: 'Neelam Pandey', role: 'Part-Time Cook', company: 'Working for 4+ years' },
    { name: 'Ashish Bhagat', role: 'Gardener', company: 'Working for 1+ years' },
    { name: 'Ravi dube', role: 'Mathematics teacher', company: 'Working for 4+ years' },
  ];

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <Surface style={styles.searchBar}>
          <IconButton icon="magnify" size={24} />
          <TextInput 
            placeholder="Search jobs, locations..." 
            style={styles.searchInput}
            placeholderTextColor="#666"
          />
          <IconButton icon="microphone" size={24} color="#ffffff"/>
        </Surface>
      </View>

      <Card style={styles.bannerCard}>
        
          <Text style={styles.bannerTitle}>Find Your Perfect Job Match</Text>
          <Text style={styles.bannerSubtitle}>Thousands of opportunities await</Text>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-photo/professional-cleaning-service-person-using-vacuum-cleaner-office_23-2150520594.jpg?semt=ais_hybrid' }} 
            style={styles.bannerImage}
          />
          </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        {steps.map((step, index) => (
          <Card key={index} style={styles.stepCard}>
            <Card.Content style={styles.stepContent}>
              <IconButton icon={step.icon} size={32}  />
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Success Stories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          {successStories.map((story, index) => (
            <Card key={index} style={styles.successCard}>
              <Card.Content>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: 'https://housebeautiful.cdnds.net/17/39/2048x1024/landscape-1506429633-woman-cleaning-oven.jpg' }} 
                    style={styles.avatar} 
                  />
                </View>
                <Text style={styles.storyName}>{story.name}</Text>
                <Text style={styles.storyRole}>{story.role}</Text>
                <Text style={styles.storyCompany}>{story.company}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Kaam.com</Text>
        <Text style={styles.footerText}>Your Career Partner</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  bottomNav: {
    backgroundColor: '#fff',
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  bannerCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#efefef',
  },
  bannerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0070e8',
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 24,
    color: '#55B0FF',
    opacity: 0.9,
    margin: 8,
    alignSelf:'center',
  },
  bannerImage: {
    width:  500,
    height: 500,
    margin: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  stepCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#009bff',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    flex: 1,
    marginLeft: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepDescription: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  storiesContainer: {
    paddingRight: 8,
  },
  successCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#efefef',
  },
  storyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  storyRole: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  storyCompany: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1e88e5',
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#1e88e5',
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 20,
    color: '#666',
  },
});



export default HomeScreen;