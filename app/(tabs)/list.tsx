import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { Appbar, Card, Title, Button, Searchbar, Chip, IconButton, Avatar, Divider, Badge } from 'react-native-paper';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../src/services/firebaseConfig";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type JobType = {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  requirements: string;
  employerId?: string;
  description?: string;
  company?: string;
  postedDate?: string;
  applicantCount?: number;
};

const jobCategories = [
  { id: 1, title: 'Maid', icon: 'broom' },
  { id: 2, title: 'Cook', icon: 'food' },
  { id: 3, title: 'Driver', icon: 'car' },
  { id: 4, title: 'Nanny', icon: 'human-baby-changing-table' },
  { id: 5, title: 'Gardener', icon: 'flower' },
];

const locations = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Chennai' },
  { id: 5, name: 'Hyderabad' },
];

// Sample job postings with Indian names and details
const sampleJobs: JobType[] = [
  {
    id: '1',
    title: 'House Maid',
    location: 'Mumbai',
    salary: '₹10,000/month',
    type: 'Full-time',
    requirements: 'Experience in cleaning, cooking, and laundry',
    description: 'Looking for an experienced house maid for a busy family in Mumbai.',
    company: 'Sharma Family',
    postedDate: '3 days ago',
    applicantCount: 5,
  },
  {
    id: '2',
    title: 'Cook',
    location: 'Delhi',
    salary: '₹12,000/month',
    type: 'Part-time',
    requirements: 'Expert in Indian cuisine and dietary restrictions',
    description: 'We need a skilled cook to prepare healthy meals in Delhi.',
    company: 'Verma Home',
    postedDate: '1 day ago',
    applicantCount: 8,
  },
  {
    id: '3',
    title: 'Driver',
    location: 'Bangalore',
    salary: '₹15,000/month',
    type: 'Full-time',
    requirements: 'Clean driving record and knowledge of local routes',
    description: 'Reliable driver required for daily commute in Bangalore.',
    company: 'Kumar Transport',
    postedDate: '5 days ago',
    applicantCount: 3,
  },
  {
    id: '4',
    title: 'Nanny',
    location: 'Chennai',
    salary: '₹9,000/month',
    type: 'Full-time',
    requirements: 'Experience in childcare and early childhood education',
    description: 'Looking for a nurturing nanny for a family in Chennai.',
    company: 'Desai Household',
    postedDate: '2 days ago',
    applicantCount: 6,
  },
  {
    id: '5',
    title: 'Gardener',
    location: 'Hyderabad',
    salary: '₹8,000/month',
    type: 'Part-time',
    requirements: 'Skilled in garden maintenance and landscaping',
    description: 'Experienced gardener needed for a private estate in Hyderabad.',
    company: 'Singh Estate',
    postedDate: '4 days ago',
    applicantCount: 4,
  },
];

const JobListings = ({ navigation }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  // Use sampleJobs as initial state instead of empty array
  const [jobs, setJobs] = useState<JobType[]>(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>(sampleJobs);
  // Set loading to false since we're using sample data
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Uncomment below if you want to fetch from Firestore
  /*
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
        description: doc.data().description || 'Looking for an experienced professional to join our team.',
        company: doc.data().company || 'Private Employer',
        postedDate: doc.data().postedDate || '2 days ago',
        applicantCount: doc.data().applicantCount || Math.floor(Math.random() * 20),
      })) as JobType[];

      setJobs(jobList);
      setFilteredJobs(jobList);
      setLoading(false);
      console.log("✅ Jobs Fetched Successfully:", jobList);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      setLoading(false);
    }
  };
  */

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedCategory, selectedLocation);
  };

  const filterJobs = (query: string, categoryId: number | null, locationId: number | null) => {
    let filtered = [...jobs];
    
    if (query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase()) ||
          job.requirements.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (categoryId) {
      const categoryTitle = jobCategories.find((cat) => cat.id === categoryId)?.title.toLowerCase() || '';
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(categoryTitle)
      );
    }
    
    if (locationId) {
      const locationName = locations.find(loc => loc.id === locationId)?.name;
      filtered = filtered.filter(job => job.location === locationName);
    }
    
    setFilteredJobs(filtered);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLocation(null);
    setSearchQuery('');
    setFilteredJobs(jobs);
  };

  const handleApplyJob = (job: JobType) => {
    router.push("/form");
  };

  const handleSaveJob = (job: JobType) => {
    alert(`Job saved!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0D47A1" barStyle="light-content" />
      
      <Appbar.Header style={styles.navbar}>
        <Appbar.BackAction color="#FFFFFF" onPress={() => navigation?.goBack()} />
        <Appbar.Content title="Job Listings" titleStyle={styles.navbarTitle} />
        <Appbar.Action icon="tune" color="#FFFFFF" onPress={toggleFilters} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by job title, location, or requirements..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#0D47A1"
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
            Clear
          </Button>
        )}
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {jobCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                const newCategory = selectedCategory === category.id ? null : category.id;
                setSelectedCategory(newCategory);
                filterJobs(searchQuery, newCategory, selectedLocation);
              }}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.selectedCategoryCard
              ]}
            >
              <IconButton 
                icon={category.icon} 
                size={24} 
                color={selectedCategory === category.id ? "#FFFFFF" : "#0D47A1"} 
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
                  filterJobs(searchQuery, selectedCategory, newLocation);
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
            <ActivityIndicator size="large" color="#0D47A1" />
            <Text style={styles.loaderText}>Loading job opportunities...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <IconButton icon="alert-circle-outline" size={48} color="#9E9E9E" />
            <Text style={styles.noResultsText}>No jobs found matching your criteria</Text>
            <Button mode="outlined" onPress={clearFilters} style={styles.resetButton}>
              Reset Filters
            </Button>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </Text>
          
            <FlatList
              data={filteredJobs}
              keyExtractor={item => item.id}
              style={styles.jobsList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Card style={styles.jobCard} elevation={2}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.titleContainer}>
                        <Title style={styles.jobTitle}>{item.title}</Title>
                        <Text style={styles.companyText}>{item.company}</Text>
                        <Text style={styles.postedDateText}>{item.postedDate}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <IconButton icon="map-marker" size={18} color="#0D47A1" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.location}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <IconButton icon="clock-outline" size={18} color="#0D47A1" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.type}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.requirementsContainer}>
                      <View style={styles.detailItem}>
                        <IconButton icon="star" size={18} color="#0D47A1" style={styles.detailIcon} />
                        <Text style={styles.requirementsText} numberOfLines={1} ellipsizeMode="tail">
                          {item.requirements}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.cardFooter}>
                      <View style={styles.detailItem}>
                        <IconButton icon="currency-inr" size={18} color="#0D47A1" style={styles.detailIcon} />
                        <Text style={styles.salaryText}>{item.salary}</Text>
                      </View>
                      <Chip style={styles.applicantsChip} textStyle={styles.applicantsText}>
                        {item.applicantCount} applicants
                      </Chip>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <View style={styles.jobCardButtons}>
                      <Button 
                        mode="contained" 
                        icon="check-circle" 
                        onPress={() => handleApplyJob(item)}
                        style={styles.applyButton}
                        labelStyle={styles.buttonLabel}
                      >
                        Apply Now
                      </Button>
                      <Button 
                        mode="outlined" 
                        icon="bookmark" 
                        onPress={() => handleSaveJob(item)}
                        style={styles.saveButton}
                        labelStyle={styles.outlinedButtonLabel}
                      >
                        Save Job
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  navbar: {
    backgroundColor: '#0D47A1',
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
    backgroundColor: '#E3F2FD',
    width: 90,
    height: 90,
  },
  selectedCategoryCard: {
    backgroundColor: '#0D47A1',
  },
  categoryIcon: {
    margin: 0,
  },
  categoryText: {
    marginTop: 4,
    color: '#0D47A1',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 25,
    height: 36,
  },
  selectedLocationChip: {
    backgroundColor: '#0D47A1',
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
    color: '#0D47A1',
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
    borderColor: '#0D47A1',
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
  jobsList: {
    flex: 1,
  },
  jobCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    color: '#212121',
    fontWeight: 'bold',
  },
  companyText: {
    fontSize: 14,
    color: '#424242',
    marginTop: 2,
  },
  postedDateText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
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
  requirementsContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  salaryText: {
    fontWeight: 'bold',
    color: '#0D47A1',
    fontSize: 16,
  },
  applicantsChip: {
    backgroundColor: '#E8F5E9',
    height: 24,
  },
  applicantsText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: 16,
  },
  jobCardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0D47A1',
    borderRadius: 8,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#0D47A1',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  outlinedButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D47A1',
    paddingVertical: 2,
  },
});

export default JobListings;
