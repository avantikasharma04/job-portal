import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Button, Searchbar, Chip, IconButton, Avatar, Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/services/firebaseConfig";

const Stack = createStackNavigator();

type RootStackParamList = {
  WorkerBrowse: undefined;
  WorkerDetails: { worker: WorkerType };
  ContactWorker: { worker: WorkerType };
};

type WorkerBrowseProps = {
  navigation: StackNavigationProp<RootStackParamList, 'WorkerBrowse'>;
  route: RouteProp<RootStackParamList, 'WorkerBrowse'>;
};

type WorkerType = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  skills: string[];
  experience: string;
  rating: number;
  availability: string;
  hourlyRate: string;
  bio: string;
};

// Worker categories for filtering
const workerCategories = [
  { id: 1, title: 'Maid', icon: 'broom' },
  { id: 2, title: 'Cook', icon: 'food' },
  { id: 3, title: 'Driver', icon: 'car' },
  { id: 4, title: 'Gardener', icon: 'flower' },
  { id: 5, title: 'Nanny', icon: 'human-baby-changing-table' },
  { id: 6, title: 'Handyman', icon: 'hammer' },
];

// Sample location data for filtering
const locations = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Chennai' },
  { id: 5, name: 'Hyderabad' },
];

// Sample worker data (in a real app, this would come from Firestore)
const sampleWorkers: WorkerType[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    location: 'Mumbai',
    skills: ['Cleaning', 'Cooking', 'Laundry'],
    experience: '5 years',
    rating: 4.8,
    availability: 'Full-time',
    hourlyRate: '₹150/hour',
    bio: 'Experienced house help with expertise in cleaning, cooking, and laundry. I have worked with 5 families in Mumbai over the last 5 years.'
  },
  {
    id: '2',
    name: 'Rahul Verma',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    location: 'Delhi',
    skills: ['Driving', 'Errands'],
    experience: '7 years',
    rating: 4.9,
    availability: 'Part-time',
    hourlyRate: '₹200/hour',
    bio: 'Professional driver with a clean record. Experienced in both city driving and long trips. Available for daily commutes or occasional rides.'
  },
  {
    id: '3',
    name: 'Meena Patel',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    location: 'Bangalore',
    skills: ['Childcare', 'Teaching', 'Cooking'],
    experience: '4 years',
    rating: 4.7,
    availability: 'Full-time',
    hourlyRate: '₹180/hour',
    bio: 'Qualified nanny with early childhood education background. Good with kids of all ages, can help with homework and meal preparation.'
  },
  {
    id: '4',
    name: 'Sanjay Kumar',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    location: 'Mumbai',
    skills: ['Gardening', 'Landscaping'],
    experience: '8 years',
    rating: 4.6,
    availability: 'Weekends',
    hourlyRate: '₹250/hour',
    bio: 'Experienced gardener who can help maintain your plants and garden. Specialized in native plants and sustainable gardening practices.'
  },
  {
    id: '5',
    name: 'Anita Desai',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    location: 'Chennai',
    skills: ['Cleaning', 'Elderly Care'],
    experience: '6 years',
    rating: 4.9,
    availability: 'Full-time',
    hourlyRate: '₹170/hour',
    bio: 'Specialized in elder care and household cleaning. Patient, compassionate and detail-oriented. Certified in basic elderly care.'
  },
  {
    id: '6',
    name: 'Vikram Singh',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    location: 'Hyderabad',
    skills: ['Repairs', 'Plumbing', 'Electrical'],
    experience: '10 years',
    rating: 4.8,
    availability: 'On-call',
    hourlyRate: '₹300/hour',
    bio: 'Handyman with experience in household repairs, plumbing, and electrical work. Can fix most household issues efficiently.'
  },
];

const WorkerBrowse = ({ navigation }: WorkerBrowseProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [workers, setWorkers] = useState<WorkerType[]>(sampleWorkers);
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerType[]>(sampleWorkers);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerType | null>(null);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  // Uncomment this if connecting to Firestore
  /*
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "workers"));
      const workerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkerType[];

      setWorkers(workerList);
      setFilteredWorkers(workerList);
      console.log("✅ Workers Fetched Successfully:", workerList);
    } catch (error) {
      console.error("❌ Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };
  */

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterWorkers(query, selectedCategory, selectedLocation);
  };

  const filterWorkers = (query: string, categoryId: number | null, locationId: number | null) => {
    let filtered = [...workers];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(query.toLowerCase()) ||
          worker.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // Filter by category/skill
    if (categoryId) {
      const categoryTitle = workerCategories.find((cat) => cat.id === categoryId)?.title.toLowerCase();
      filtered = filtered.filter((worker) =>
        worker.skills.some(skill => skill.toLowerCase().includes(categoryTitle || ''))
      );
    }
    
    // Filter by location
    if (locationId) {
      const locationName = locations.find((loc) => loc.id === locationId)?.name;
      filtered = filtered.filter((worker) => worker.location === locationName);
    }
    
    setFilteredWorkers(filtered);
  };

  const toggleLocationFilter = () => {
    setShowLocationFilter(!showLocationFilter);
  };

  const handleSelectWorker = (worker: WorkerType) => {
    setSelectedWorker(worker);
  };

  const handleContactWorker = () => {
    if (selectedWorker) {
      // In a real app, navigate to contact screen or show a form
      alert(`Contact request sent to ${selectedWorker.name}!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Appbar.Header style={styles.navbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Browse Workers" titleStyle={styles.navbarTitle} />
        <Appbar.Action icon="tune" onPress={toggleLocationFilter} />
      </Appbar.Header>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search by name or skill..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {workerCategories.map((category) => (
          <Chip
            key={category.id}
            icon={category.icon}
            selected={selectedCategory === category.id}
            onPress={() => {
              const newCategory = selectedCategory === category.id ? null : category.id;
              setSelectedCategory(newCategory);
              filterWorkers(searchQuery, newCategory, selectedLocation);
            }}
            style={styles.categoryChip}
            selectedColor="#FFFFFF"
          >
            {category.title}
          </Chip>
        ))}
      </ScrollView>

      {/* Location Filter (Toggleable) */}
      {showLocationFilter && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {locations.map((location) => (
            <Chip
              key={location.id}
              icon="map-marker"
              selected={selectedLocation === location.id}
              onPress={() => {
                const newLocation = selectedLocation === location.id ? null : location.id;
                setSelectedLocation(newLocation);
                filterWorkers(searchQuery, selectedCategory, newLocation);
              }}
              style={styles.locationChip}
              selectedColor="#FFFFFF"
            >
              {location.name}
            </Chip>
          ))}
        </ScrollView>
      )}

      <View style={styles.contentContainer}>
        {/* Workers List */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#6200EE" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredWorkers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectWorker(item)}>
                  <Card 
                    style={[
                      styles.workerCard, 
                      selectedWorker?.id === item.id ? styles.selectedCard : null
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.cardHeader}>
                        <Avatar.Image size={50} source={{ uri: item.avatar }} />
                        <View style={styles.nameContainer}>
                          <Title>{item.name}</Title>
                          <View style={styles.ratingContainer}>
                            <IconButton icon="star" size={16} color="#FFC107" style={styles.ratingIcon} />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.listItem}>
                        <IconButton icon="map-marker" size={20} color="#1976D2" />
                        <Text style={styles.listText}>{item.location}</Text>
                      </View>
                      
                      <View style={styles.listItem}>
                        <IconButton icon="briefcase" size={20} color="#1976D2" />
                        <Text style={styles.listText}>{item.experience}</Text>
                      </View>
                      
                      <View style={styles.skillsContainer}>
                        {item.skills.map((skill, index) => (
                          <Chip key={index} style={styles.skillChip}>
                            {skill}
                          </Chip>
                        ))}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        
        {/* Worker Details Panel */}
        {selectedWorker && (
          <View style={styles.detailsPanel}>
            <View style={styles.detailsHeader}>
              <Avatar.Image size={80} source={{ uri: selectedWorker.avatar }} />
              <View style={styles.detailsNameContainer}>
                <Title style={styles.detailsName}>{selectedWorker.name}</Title>
                <View style={styles.ratingContainer}>
                  <IconButton icon="star" size={18} color="#FFC107" style={styles.ratingIcon} />
                  <Text style={styles.detailsRating}>{selectedWorker.rating}</Text>
                </View>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <ScrollView style={styles.detailsScrollView}>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.detailsItem}>
                  <IconButton icon="map-marker" size={24} color="#1976D2" />
                  <Text style={styles.detailsText}>{selectedWorker.location}</Text>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Experience</Text>
                <View style={styles.detailsItem}>
                  <IconButton icon="briefcase" size={24} color="#1976D2" />
                  <Text style={styles.detailsText}>{selectedWorker.experience}</Text>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Availability</Text>
                <View style={styles.detailsItem}>
                  <IconButton icon="calendar" size={24} color="#1976D2" />
                  <Text style={styles.detailsText}>{selectedWorker.availability}</Text>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Rate</Text>
                <View style={styles.detailsItem}>
                  <IconButton icon="currency-inr" size={24} color="#1976D2" />
                  <Text style={styles.detailsText}>{selectedWorker.hourlyRate}</Text>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.detailsSkillsContainer}>
                  {selectedWorker.skills.map((skill, index) => (
                    <Chip key={index} style={styles.detailsSkillChip}>
                      {skill}
                    </Chip>
                  ))}
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.bioText}>{selectedWorker.bio}</Text>
              </View>
            </ScrollView>
            
            <Button 
              mode="contained" 
              icon="email" 
              onPress={handleContactWorker}
              style={styles.contactButton}
              labelStyle={styles.contactButtonLabel}
            >
              Contact {selectedWorker.name}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light Blue Background to match your reference
  },
  navbar: {
    backgroundColor: '#0D47A1', // Dark Blue Navbar to match your reference
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
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#64B5F6', // Medium Blue for Chips
    borderRadius: 20,
  },
  locationChip: {
    marginRight: 8,
    backgroundColor: '#81C784', // Green for location chips
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  workerCard: {
    marginBottom: 10,
    elevation: 2,
    backgroundColor: '#90CAF9', // Light Blue for Cards
    borderRadius: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#1565C0', // Highlight selected card
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameContainer: {
    marginLeft: 10,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    margin: 0,
    padding: 0,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  listText: {
    fontSize: 14,
    color: '#0D47A1', // Dark Blue Text
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  skillChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#BBDEFB',
    height: 28,
  },
  detailsPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#BBDEFB',
    padding: 15,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsNameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  detailsRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  divider: {
    backgroundColor: '#BBDEFB',
    height: 1,
    marginVertical: 10,
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1976D2',
  },
  detailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#333333',
  },
  detailsSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  detailsSkillChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
    marginLeft: 10,
  },
  contactButton: {
    marginTop: 15,
    backgroundColor: '#1565C0', // Deep Blue for Button
    paddingVertical: 5,
  },
  contactButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// const WorkerBrowseScreen = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen 
//         name="WorkerBrowse" 
//         component={WorkerBrowse} 
//         options={{ headerShown: false }} 
//       />
//     </Stack.Navigator>
//   );
// };

export default WorkerBrowse;