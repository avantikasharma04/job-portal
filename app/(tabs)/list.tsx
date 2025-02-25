import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, Card, Title, Button, Searchbar, Chip, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import JobPortalForm from './form';
import { createStackNavigator } from "@react-navigation/stack";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/services/firebaseConfig";
import { auth } from "../../src/services/firebaseConfig";

const Stack = createStackNavigator();

type RootStackParamList = {
  ListPage: undefined;
  JobDetails: { job: any };
  JobPortalForm: { job: JobType };
};

type ListPageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ListPage'>;
  route: RouteProp<RootStackParamList, 'ListPage'>;
};

type JobType = {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  requirements: string;
};

const jobCategories = [
  { id: 1, title: 'Maid', icon: 'broom' },
  { id: 2, title: 'Cook', icon: 'food' },
  { id: 3, title: 'Driver', icon: 'car' },
  { id: 4, title: 'Nanny', icon: 'human-baby-changing-table' },
  { id: 5, title: 'Gardener', icon: 'flower' },
];

const ListPage = ({ navigation }: ListPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobListings();
  }, []);

  // Fetch Jobs from Firestore
  const fetchJobListings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobListings"));
      const jobList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JobType[];

      setJobs(jobList);
      setFilteredJobs(jobList);
      setLoading(false);
      console.log("✅ Jobs Fetched Successfully:", jobList);
      
      // Simple verification logging
      console.log("===== JOB LISTINGS VERIFICATION =====");
      console.log(`Total jobs found: ${jobList.length}`);
      
      // Check if current user has posted any jobs
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userJobs = jobList.filter(job => job.employerId === currentUser.uid);
        console.log(`Jobs posted by current user (${currentUser.uid}): ${userJobs.length}`);
        
        if (userJobs.length > 0) {
          console.log("User's job titles:");
          userJobs.forEach((job, index) => {
            console.log(`${index + 1}. ${job.title} (ID: ${job.id})`);
          });
        }
      }
      
      console.log("====================================");
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedCategory);
  };

  const filterJobs = (query: string, categoryId: number | null) => {
    let filtered = [...jobs];
    if (query) {
      filtered = filtered.filter(
        (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (categoryId) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(
          jobCategories.find((cat) => cat.id === categoryId)?.title.toLowerCase() || ''
        )
      );
    }
    setFilteredJobs(filtered);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Appbar.Header style={styles.navbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Listings" titleStyle={styles.navbarTitle} />
        <Appbar.Action icon="cog" onPress={() => console.log('Settings Pressed')} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search jobs..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        right={(props) => (
          <IconButton
            {...props}
            icon="microphone"
            onPress={() => {
              console.log('Microphone pressed');
            }}
          />
        )}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {jobCategories.map((category) => (
          <Chip
            key={category.id}
            icon={category.icon}
            selected={selectedCategory === category.id}
            onPress={() => {
              const newCategory = selectedCategory === category.id ? null : category.id;
              setSelectedCategory(newCategory);
              filterJobs(searchQuery, newCategory);
            }}
            style={styles.categoryChip}
          >
            {category.title}
          </Chip>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.jobCard}>
              <Card.Content>
                <Title>{item.title}</Title>

                <View style={styles.listItem}>
                  <IconButton icon="map-marker" size={20} />
                  <Text style={styles.listText}>{item.location}</Text> 
                </View>

                <View style={styles.listItem}>
                  <IconButton icon="clock-outline" size={20} />
                  <Text style={styles.listText}>{item.type}</Text>
                </View>

                <View style={styles.listItem}>
                  <IconButton icon="star" size={20} />
                  <Text style={styles.listText}>{item.requirements}</Text>
                </View>

                <View style={styles.listItem}>
                  <IconButton icon="currency-inr" size={20} />
                  <Text style={styles.listText}>{item.salary}</Text>
                </View>

                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('JobPortalForm', { job: item })} 
                  style={styles.applyButton}
                >
                  Apply Now
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light Blue Background
    paddingBottom: 10,
  },
  navbar: {
    backgroundColor: '#0D47A1', // Dark Blue Navbar
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchbar: {
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 2,
    backgroundColor: '#BBDEFB', // Lighter Blue for Searchbar
    borderRadius: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 10,
  },
  categoryChip: {
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#64B5F6', // Medium Blue for Chips
    borderRadius: 20,
    alignSelf: 'center',
  },
  jobCard: {
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#90CAF9', // Light Blue for Cards
    borderRadius: 10,
    padding: 10,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#1565C0', // Deep Blue for Button
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  listText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#0D47A1', // Dark Blue Text
    fontWeight: '500',
  },
});

const ListScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListPage" component={ListPage} options={{ headerShown: false }} />
      <Stack.Screen name="JobPortalForm" component={JobPortalForm} />
    </Stack.Navigator>
  );
};

export default ListScreen;