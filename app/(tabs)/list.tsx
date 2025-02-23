import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Appbar, Card, Title, Button, Searchbar, Chip, List, IconButton } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import JobPortalForm from './form';

type RootStackParamList = {
  ListPage: undefined;
  JobDetails: { job: any };
};

type ListPageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ListPage'>;
  route: RouteProp<RootStackParamList, 'ListPage'>;
};

const jobCategories = [
  { id: 1, title: 'Maid', icon: 'broom' },
  { id: 2, title: 'Cook', icon: 'food' },
  { id: 3, title: 'Driver', icon: 'car' },
  { id: 4, title: 'Nanny', icon: 'human-baby-changing-table' },
  { id: 5, title: 'Gardener', icon: 'flower' },
];

const sampleJobs = [
  {
    id: 1,
    title: 'Maid Required',
    location: 'Andheri West',
    salary: '₹15,000/month',
    type: 'Full Time',
    requirements: 'Cooking, Cleaning, 2 years experience',
  },
  {
    id: 2,
    title: 'Cook Needed',
    location: 'Bandra East',
    salary: '₹18,000/month',
    type: 'Part Time',
    requirements: 'Veg & Non-veg cooking, 3 years experience',
  },
  {
    id: 3,
    title: 'Driver Required',
    location: 'Thane West',
    salary: '₹15,000/month',
    type: 'Full Time',
    requirements: 'Valid drivers license, experience for 1 year, should be able to drive both manual and automatic cars',
  },
{ id: 4, title: 'Cook Needed', location: 'Bandra East', salary: '₹18,000/month', type: 'Part Time', requirements: 'Veg & Non-veg cooking, 3 years experience' },
{ id: 5, title: 'Home Chef', location: 'Powai', salary: '₹20,000/month', type: 'Full Time', requirements: 'North & South Indian cuisine, 5 years experience' },
{ id: 6, title: 'Tiffin Service Cook', location: 'Andheri', salary: '₹25,000/month', type: 'Full Time', requirements: 'Bulk cooking, Packaging, 3 years experience' },
{ id: 7, title: 'Personal Chef', location: 'Juhu', salary: '₹30,000/month', type: 'Full Time', requirements: 'Healthy diet meals, Experience in gourmet cooking' },
{ id: 15, title: 'Breakfast Cook', location: 'Thane', salary: '₹12,000/month', type: 'Part Time', requirements: 'South Indian breakfast dishes, 2 years experience' },
{ id: 16, title: 'Restaurant Cook', location: 'Malad', salary: '₹28,000/month', type: 'Full Time', requirements: 'Fast food, Chinese cuisine, 5+ years experience' },
{ id: 17, title: 'Live-in Cook', location: 'Kandivali', salary: '₹35,000/month', type: 'Full Time', requirements: 'Multi-cuisine, Must stay at residence' },
{ id: 18, title: 'Weekend Chef', location: 'Borivali', salary: '₹10,000/weekend', type: 'Part Time', requirements: 'Italian & Continental cuisine' },
{ id: 19, title: 'Dietary Cook', location: 'Chembur', salary: '₹22,000/month', type: 'Full Time', requirements: 'Specialized in diabetic and keto meals' },
{ id: 20, title: 'Cooking Assistant', location: 'Goregaon', salary: '₹15,000/month', type: 'Full Time', requirements: 'Chopping, Preparing ingredients, No experience needed' },

{ id: 21, title: 'Personal Driver', location: 'Bandra West', salary: '₹20,000/month', type: 'Full Time', requirements: '4-wheeler license, 3 years experience' },
{ id: 22, title: 'Cab Driver', location: 'Andheri', salary: '₹25,000/month', type: 'Full Time', requirements: 'Valid license, Uber/Ola experience preferred' },
{ id: 23, title: 'Family Chauffeur', location: 'Juhu', salary: '₹30,000/month', type: 'Full Time', requirements: 'Luxury car experience, 5 years experience' },
{ id: 24, title: 'School Van Driver', location: 'Kandivali', salary: '₹22,000/month', type: 'Full Time', requirements: 'Yellow badge license, Clean driving record' },
{ id: 25, title: 'Truck Driver', location: 'Thane', salary: '₹40,000/month', type: 'Full Time', requirements: 'Heavy vehicle license, Highway driving experience' },
{ id: 26, title: 'Delivery Driver', location: 'Malad', salary: '₹18,000/month', type: 'Full Time', requirements: 'Two-wheeler license, Own vehicle preferred' },
{ id: 27, title: 'Night Shift Driver', location: 'Borivali', salary: '₹28,000/month', type: 'Full Time', requirements: 'Taxi experience, Night shift availability' },
{ id: 28, title: 'Bus Driver', location: 'Powai', salary: '₹35,000/month', type: 'Full Time', requirements: 'Commercial license, 5+ years experience' },
{ id: 29, title: 'Courier Driver', location: 'Chembur', salary: '₹20,000/month', type: 'Full Time', requirements: 'Fast-paced delivery, Good navigation skills' },
{ id: 30, title: 'Luxury Car Chauffeur', location: 'Goregaon', salary: '₹45,000/month', type: 'Full Time', requirements: 'BMW/Mercedes driving experience, Well-groomed' },

{ id: 31, title: 'Nanny for Toddler', location: 'Bandra', salary: '₹25,000/month', type: 'Full Time', requirements: 'Childcare experience, Basic first aid' },
{ id: 32, title: 'Live-in Nanny', location: 'Andheri', salary: '₹30,000/month', type: 'Full Time', requirements: 'Infant care, Night shift availability' },
{ id: 33, title: 'Part-time Babysitter', location: 'Juhu', salary: '₹15,000/month', type: 'Part Time', requirements: 'Evening shift, Fun-loving personality' },
{ id: 34, title: 'Special Needs Nanny', location: 'Kandivali', salary: '₹40,000/month', type: 'Full Time', requirements: 'Experience with autism, Patience required' },
{ id: 35, title: 'Bilingual Nanny', location: 'Thane', salary: '₹28,000/month', type: 'Full Time', requirements: 'Fluent in English & Hindi, Teaching skills' },

{ id: 41, title: 'Home Gardener', location: 'Bandra', salary: '₹15,000/month', type: 'Part Time', requirements: 'Plant care, watering' },
{ id: 42, title: 'Garden Designer', location: 'Andheri', salary: '₹35,000/month', type: 'Full Time', requirements: 'Landscape planning, 5 years experience' },
{ id: 43, title: 'Lawn Maintenance Worker', location: 'Juhu', salary: '₹18,000/month', type: 'Full Time', requirements: 'Lawn mowing, trimming' },
{ id: 44, title: 'Plant Nursery Worker', location: 'Kandivali', salary: '₹22,000/month', type: 'Full Time', requirements: 'Potting, watering, soil management' },
{ id: 45, title: 'Farm Assistant', location: 'Thane', salary: '₹25,000/month', type: 'Full Time', requirements: 'Crop planting, irrigation knowledge' },

];

const ListPage = ({ navigation }: ListPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedCategory);
  };

  const filterJobs = (query: string, categoryId: number | null) => {
    let filtered = [...sampleJobs];
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

              <Button mode="contained" onPress={() => navigation.navigate('JobPortalForm', { job: item })} style={styles.applyButton}>
                Apply Now
              </Button>
            </Card.Content>
          </Card>
        )}
      />
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
    padding: 10,
    marginBottom: 10,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#64B5F6', // Medium Blue for Chips
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
export default ListPage;
