import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, TextInput, Button, Title } from 'react-native-paper';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra',
    experience: '5 years',
    skills: 'Cooking, Cleaning, Child Care',
    languages: 'Hindi, English, Marathi',
    availability: 'Full Time',
    expectedSalary: '₹15,000/month',
  });

  const handleInputChange = (key, value) => {
    setProfileData({ ...profileData, [key]: value });
  };

  const handleVoiceInput = (text) => {
    if (text.toLowerCase().includes('edit')) setIsEditing(true);
    if (text.toLowerCase().includes('save')) setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
        
      <View style={styles.header}>
      <View style={styles.header}>
          <text>My Profile</text>
        </View>
          
        <Avatar.Image size={80}  source={{ uri: 'https://img.freepik.com/free-photo/professional-cleaning-service-person-using-vacuum-cleaner-office_23-2150520594.jpg?semt=ais_hybrid' }} 
            />
        <Title>{profileData.name}</Title>
      </View>

      <View style={styles.section}>
        <TextInput
          label="Name"
          value={profileData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Phone"
          value={profileData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Address"
          value={profileData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          disabled={!isEditing}
          style={styles.input}
        />
         <TextInput
          label="experience"
          value={profileData.experience}
          onChangeText={(text) => handleInputChange('experience', text)}
          disabled={!isEditing}
          style={styles.input}
        />
         <TextInput
          label="skills"
          value={profileData.skills}
          onChangeText={(text) => handleInputChange('skills', text)}
          disabled={!isEditing}
          style={styles.input}
        />
         <TextInput
          label="languages"
          value={profileData.languages}
          onChangeText={(text) => handleInputChange('languages', text)}
          disabled={!isEditing}
          style={styles.input}
        />
         <TextInput
          label="availability"
          value={profileData.availability}
          onChangeText={(text) => handleInputChange('availability', text)}
          disabled={!isEditing}
          style={styles.input}
        />
         <TextInput
          label="expectedSalary"
          value={profileData.expectedSalary}
          onChangeText={(text) => handleInputChange('expectedSalary', text)}
          disabled={!isEditing}
          style={styles.input}
        />
      </View>

      <Button mode="contained" onPress={() => setIsEditing(!isEditing)} style={styles.button}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text:{},
  container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
  header: { alignItems: 'center', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  input: { marginBottom: 10 },
  button: { marginTop: 16 },
});
