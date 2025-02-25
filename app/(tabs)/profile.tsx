import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { Avatar, TextInput, Button, Title, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra',
    languages: 'Hindi, English, Marathi',
    availability: 'Full Time',
    expectedSalary: '₹15,000/month',
  });
  const [image, setImage] = useState('https://img.freepik.com/free-photo/professional-cleaning-service-person-using-vacuum-cleaner-office_23-2150520594.jpg?semt=ais_hybrid');
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setProfileData({ ...profileData, [key]: value });
  };

  const handleVoiceInput = (text: string) => {
    if (text.toLowerCase().includes('edit')) setIsEditing(true);
    if (text.toLowerCase().includes('save')) setIsEditing(false);
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      
      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
      setShowImageOptions(false);
    } catch (e) {
      const error = e as Error;
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permission explicitly
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
      if (!cameraPermission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        return;
      }
  
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
      
      setShowImageOptions(false);
    } catch (e) {
      Alert.alert('Error', `Failed to take photo: ${(e as Error).message}`);
      console.error('Error taking photo:', e);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Employee Profile</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => isEditing && setShowImageOptions(true)} 
          disabled={!isEditing}
          style={styles.avatarContainer}
        >
          <Avatar.Image 
            size={80} 
            source={{ uri: image }} 
          />
          {isEditing && (
            <View style={styles.editImageBadge}>
              <Text style={styles.editImageText}>Edit</Text>
            </View>
          )}
        </TouchableOpacity>
        
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
          label="Languages"
          value={profileData.languages}
          onChangeText={(text) => handleInputChange('languages', text)}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Availability"
          value={profileData.availability}
          onChangeText={(text) => handleInputChange('availability', text)}
          disabled={!isEditing}
          style={styles.input}
        />
        <TextInput
          label="Expected Salary"
          value={profileData.expectedSalary}
          onChangeText={(text) => handleInputChange('expectedSalary', text)}
          disabled={!isEditing}
          style={styles.input}
        />
      </View>

      <Button mode="contained" onPress={() => setIsEditing(!isEditing)} style={styles.button}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>

      {/* Image Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImageOptions}
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            
            <Button 
              icon="camera" 
              mode="outlined" 
              onPress={takePhoto}
              style={styles.modalButton}
            >
              Take a Photo
            </Button>
            
            <Button 
              icon="image" 
              mode="outlined" 
              onPress={pickImage}
              style={styles.modalButton}
            >
              Choose from Gallery
            </Button>
            
            <Button 
              onPress={() => setShowImageOptions(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
  header: { alignItems: 'center', marginBottom: 20 },
  headerTitle: { width: '100%', alignItems: 'center', marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  input: { marginBottom: 10 },
  button: { marginTop: 16 },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 4,
  },
  editImageText: { color: 'white', fontSize: 10 },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    marginBottom: 10,
  },
});