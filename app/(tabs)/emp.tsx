import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, TextInput, Button, Title } from 'react-native-paper';
import job from './job';
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from 'expo-router';

const Stack = createStackNavigator();


const emp= ()=> {
    const navigation=useNavigation()
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Radhika Jain',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra',
    languages: 'Hindi, English, Marathi',
    availability: 'Full Time',
  
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
          <text>Employer Profile</text>
        </View>
          
        <Avatar.Image size={80}  source={{ uri: 'https://info.recruitics.com/hubfs/Employer_profile_pt_1.jpg' }} 
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
         
      </View>

      <Button mode="contained" onPress={() => setIsEditing(!isEditing)} style={styles.button}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>


      <Button 
          mode="contained" 
          onPress={() => navigation.navigate('job')} 
          style={styles.button}
        >
          Post job
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

const Profile1 = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="emp" component={emp} options={{ headerShown: false }} />
        <Stack.Screen name="job" component={job} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  };
   export default Profile1;
  
