import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { Appbar, Card, Title, Button, Searchbar, Chip, IconButton, Avatar, Divider, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../../src/services/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import WorkerService from '../../src/services/workerService';

const workerCategories = [
  { id: 1, title: 'Maid', icon: 'broom' },
  { id: 2, title: 'Cook', icon: 'food' },
  { id: 3, title: 'Driver', icon: 'car' },
  { id: 4, title: 'Gardener', icon: 'flower' },
  { id: 5, title: 'Nanny', icon: 'human-baby-changing-table' },
  { id: 6, title: 'Handyman', icon: 'hammer' },
];

const locations = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Chennai' },
  { id: 5, name: 'Hyderabad' },
];

export type WorkerType = {
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
  language?: string; // Added language field
};

// Fallback sample data in case Firestore has no data
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
    bio: 'Experienced house help with expertise in cleaning, cooking, and laundry. Worked with 5 families in Mumbai over the last 5 years.',
    language: 'English'
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
    bio: 'Professional driver with a clean record. Experienced in both city driving and long trips.',
    language: 'Hindi'
  },
  // ... other sample workers
];

const Workers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workers data from Firestore on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const result = await WorkerService.getWorkerProfiles();
      
      if (result.success && result.workers.length > 0) {
        // Map worker data to your component's expected format
        const workerList = result.workers.map(data => ({
          id: data.id,
          name: data.name || 'Unknown',
          avatar: data.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg',
          location: data.location || 'Unknown',
          skills: data.skills || [],
          experience: data.experience || 'New',
          rating: data.rating || 0,
          availability: data.availability || 'Not specified',
          hourlyRate: data.hourlyRate || '₹0/hour',
          bio: data.bio || 'No information provided',
          language: data.language || 'English'
        }));
        
        console.log("Workers fetched successfully:", workerList);
        setWorkers(workerList);
        setFilteredWorkers(workerList);
      } else {
        console.log("No workers found in database, using sample data");
        setWorkers(sampleWorkers);
        setFilteredWorkers(sampleWorkers);
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setError("Failed to load workers. Please try again later.");
      // Fallback to sample data if error occurs
      setWorkers(sampleWorkers);
      setFilteredWorkers(sampleWorkers);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterWorkers(query, selectedCategory, selectedLocation);
  };

  const filterWorkers = (query, categoryId, locationId) => {
    let filtered = [...workers];
    
    if (query) {
      filtered = filtered.filter(
        worker =>
          worker.name.toLowerCase().includes(query.toLowerCase()) ||
          worker.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (categoryId) {
      const categoryTitle = workerCategories.find(cat => cat.id === categoryId)?.title.toLowerCase();
      filtered = filtered.filter(worker =>
        worker.skills.some(skill => skill.toLowerCase().includes(categoryTitle || ''))
      );
    }
    
    if (locationId) {
      const locationName = locations.find(loc => loc.id === locationId)?.name;
      filtered = filtered.filter(worker => worker.location === locationName);
    }
    
    setFilteredWorkers(filtered);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLocation(null);
    setSearchQuery('');
    setFilteredWorkers(workers);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handleContactWorker = () => {
    if (selectedWorker) {
      // In a real app, you would navigate to a chat or contact screen
      alert(`Contact request sent to ${selectedWorker.name}!`);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <IconButton key={i} icon="star" size={16} color="#FFB300" style={styles.starIcon} />;
          } else if (i === fullStars && hasHalfStar) {
            return <IconButton key={i} icon="star-half" size={16} color="#FFB300" style={styles.starIcon} />;
          } else {
            return <IconButton key={i} icon="star-outline" size={16} color="#FFB300" style={styles.starIcon} />;
          }
        })}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1A237E" barStyle="light-content" />
      
      <Appbar.Header style={styles.navbar}>
        <Appbar.BackAction color="#FFFFFF" onPress={() => navigation?.goBack()} />
        <Appbar.Content title="Find Workers" titleStyle={styles.navbarTitle} />
        <Appbar.Action icon="tune" color="#FFFFFF" onPress={toggleFilters} />
        <Appbar.Action icon="refresh" color="#FFFFFF" onPress={fetchWorkers} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, skill or location..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#3F51B5"
          placeholderTextColor="#9E9E9E"
          clearButtonMode="while-editing"
        />
        {(selectedCategory !== null || selectedLocation !== null) && (
          <Button 
            icon="filter-remove" 
            mode="text" 
            onPress={clearFilters}
            color="#F44336"
            style={styles.clearButton}
          >
            Clear Filters
          </Button>
        )}
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {workerCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                const newCategory = selectedCategory === category.id ? null : category.id;
                setSelectedCategory(newCategory);
                filterWorkers(searchQuery, newCategory, selectedLocation);
              }}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.selectedCategoryCard
              ]}
            >
              <IconButton 
                icon={category.icon} 
                size={24} 
                color={selectedCategory === category.id ? "#FFFFFF" : "#3F51B5"} 
                style={styles.categoryIcon} 
              />
              <Text style={[
                styles.categoryText, 
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter by Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationsContainer}>
            {locations.map(location => (
              <Chip
                key={location.id}
                icon="map-marker"
                selected={selectedLocation === location.id}
                onPress={() => {
                  const newLocation = selectedLocation === location.id ? null : location.id;
                  setSelectedLocation(newLocation);
                  filterWorkers(searchQuery, selectedCategory, newLocation);
                }}
                style={[styles.locationChip, selectedLocation === location.id && styles.selectedLocationChip]}
                selectedColor="#FFFFFF"
              >
                {location.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3F51B5" />
            <Text style={styles.loaderText}>Finding the best workers for you...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <IconButton icon="alert-circle-outline" size={48} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <Button 
              mode="contained" 
              onPress={fetchWorkers} 
              style={styles.retryButton}
              color="#3F51B5"
            >
              Retry
            </Button>
          </View>
        ) : filteredWorkers.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <IconButton icon="alert-circle-outline" size={48} color="#9E9E9E" />
            <Text style={styles.noResultsText}>No workers found matching your criteria</Text>
            <Button mode="outlined" onPress={clearFilters} style={styles.resetButton}>
              Reset Filters
            </Button>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              Found {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''}
            </Text>
          
            <View style={styles.workersLayout}>
              <FlatList
                data={filteredWorkers}
                keyExtractor={item => item.id}
                style={styles.workersList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectWorker(item)}>
                    <Card 
                      style={[
                        styles.workerCard, 
                        selectedWorker?.id === item.id && styles.selectedCard
                      ]}
                      elevation={2}
                    >
                      <Card.Content>
                        <View style={styles.cardHeader}>
                          <Avatar.Image 
                            size={60} 
                            source={{ uri: item.avatar }} 
                            style={styles.avatar}
                          />
                          <View style={styles.nameContainer}>
                            <Title style={styles.workerName}>{item.name}</Title>
                            <View style={styles.languageChipContainer}>
                              <Chip 
                                icon="translate" 
                                style={styles.languageChip}
                                textStyle={styles.languageChipText}
                              >
                                {item.language || 'Unknown'}
                              </Chip>
                            </View>
                            {renderStars(item.rating)}
                          </View>
                        </View>
                        
                        <View style={styles.detailsRow}>
                          <View style={styles.detailItem}>
                            <IconButton icon="map-marker" size={18} color="#3F51B5" style={styles.detailIcon} />
                            <Text style={styles.detailText}>{item.location}</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <IconButton icon="briefcase" size={18} color="#3F51B5" style={styles.detailIcon} />
                            <Text style={styles.detailText}>{item.experience}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.skillsContainer}>
                          {item.skills.slice(0, 3).map((skill, index) => (
                            <Chip 
                              key={index} 
                              style={styles.skillChip}
                              textStyle={styles.skillChipText}
                            >
                              {skill}
                            </Chip>
                          ))}
                          {item.skills.length > 3 && (
                            <Badge style={styles.moreBadge} size={20}>
                              +{item.skills.length - 3}
                            </Badge>
                          )}
                        </View>
                        
                        <View style={styles.cardFooter}>
                          <Text style={styles.rateText}>{item.hourlyRate}</Text>
                          <Chip 
                            style={styles.availabilityChip}
                            textStyle={styles.availabilityText}
                          >
                            {item.availability}
                          </Chip>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                )}
              />
              
              {selectedWorker && (
                <View style={styles.detailsPanel}>
                  <ScrollView style={styles.detailsScrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.detailsHeader}>
                      <Avatar.Image size={90} source={{ uri: selectedWorker.avatar }} style={styles.detailsAvatar} />
                      <View style={styles.detailsNameContainer}>
                        <Title style={styles.detailsName}>{selectedWorker.name}</Title>
                        <Chip 
                          icon="translate" 
                          style={styles.detailsLanguageChip}
                          textStyle={styles.detailsLanguageText}
                        >
                          {selectedWorker.language || 'Unknown'}
                        </Chip>
                        {renderStars(selectedWorker.rating)}
                        <Chip 
                          icon="check-circle" 
                          style={styles.verifiedChip}
                          textStyle={styles.verifiedText}
                        >
                          Verified
                        </Chip>
                      </View>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>Location</Text>
                      <View style={styles.detailsItem}>
                        <IconButton icon="map-marker" size={24} color="#3F51B5" />
                        <Text style={styles.detailsText}>{selectedWorker.location}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        <View style={styles.detailsItem}>
                          <IconButton icon="briefcase" size={24} color="#3F51B5" />
                          <Text style={styles.detailsText}>{selectedWorker.experience}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Rate</Text>
                        <View style={styles.detailsItem}>
                          <IconButton icon="currency-inr" size={24} color="#3F51B5" />
                          <Text style={styles.detailsText}>{selectedWorker.hourlyRate}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>Availability</Text>
                      <View style={styles.detailsItem}>
                        <IconButton icon="calendar" size={24} color="#3F51B5" />
                        <Text style={styles.detailsText}>{selectedWorker.availability}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>Skills</Text>
                      <View style={styles.detailsSkillsContainer}>
                        {selectedWorker.skills.map((skill, index) => (
                          <Chip 
                            key={index} 
                            style={styles.detailsSkillChip}
                            textStyle={styles.detailsSkillText}
                          >
                            {skill}
                          </Chip>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>About</Text>
                      <Card style={styles.bioCard}>
                        <Card.Content>
                          <Text style={styles.bioText}>{selectedWorker.bio}</Text>
                        </Card.Content>
                      </Card>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                      <Button 
                        mode="contained" 
                        icon="message-text" 
                        onPress={handleContactWorker}
                        style={styles.messageButton}
                        labelStyle={styles.buttonLabel}
                      >
                        Message
                      </Button>
                      <Button 
                        mode="outlined" 
                        icon="phone" 
                        onPress={() => alert(`Calling ${selectedWorker.name}...`)}
                        style={styles.callButton}
                        labelStyle={styles.outlinedButtonLabel}
                      >
                        Call
                      </Button>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  navbar: {
    backgroundColor: '#3F51B5',
    elevation: 4,
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 45,
  },
  clearButton: {
    marginLeft: 8,
  },
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    elevation: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
    width: 90,
    height: 90,
  },
  selectedCategoryCard: {
    backgroundColor: '#3F51B5',
  },
  categoryIcon: {
    margin: 0,
  },
  categoryText: {
    marginTop: 4,
    color: '#3F51B5',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 8,
  },
  locationsContainer: {
    flexDirection: 'row',
  },
  locationChip: {
    marginRight: 8,
    backgroundColor: '#E8EAF6',
    borderRadius: 25,
    height: 36,
  },
  selectedLocationChip: {
    backgroundColor: '#3F51B5',
  },
  contentContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3F51B5',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#616161',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 16,
    borderColor: '#3F51B5',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
  },
  workersLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  workersList: {
    flex: 1,
  },
  workerCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3F51B5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#E8EAF6',
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    color: '#212121',
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  starIcon: {
    margin: 0,
    padding: 0,
    width: 18,
    height: 18,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    margin: 0,
    padding: 0,
  },
  detailText: {
    fontSize: 14,
    color: '#424242',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
  },
  skillChip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#E8EAF6',
    height: 28,
  },
  skillChipText: {
    fontSize: 12,
    color: '#3F51B5',
  },
  moreBadge: {
    backgroundColor: '#C5CAE9',
    color: '#3F51B5',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rateText: {
    fontWeight: 'bold',
    color: '#3F51B5',
    fontSize: 16,
  },
  availabilityChip: {
    backgroundColor: '#E8F5E9',
    height: 24,
  },
  availabilityText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  detailsPanel: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  detailsScrollView: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailsAvatar: {
    backgroundColor: '#E8EAF6',
  },
  detailsNameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  detailsName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  verifiedChip: {
    marginTop: 8,
    width: 100,
    backgroundColor: '#E8F5E9',
    height: 24,
  },
  verifiedText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  detailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#212121',
  },
  detailsSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailsSkillChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8EAF6',
  },
  detailsSkillText: {
    color: '#3F51B5',
  },
  bioCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    elevation: 0,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#3F51B5',
    borderRadius: 8,
    marginRight: 8,
  },
  callButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#3F51B5',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  outlinedButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3F51B5',
    paddingVertical: 2,
  },
});

export default Workers;