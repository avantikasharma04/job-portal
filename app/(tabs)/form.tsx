import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface, Portal, Modal, Provider as PaperProvider } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

type FormFields = 'name' | 'age' | 'experience' | 'preferredWork' | 'languages' | 'location' | 'availability' | 'expectedSalary';

const JobPortalForm = () => {
  const [formData, setFormData] = useState<Record<FormFields, string>>({
    name: '',
    age: '',
    experience: '',
    preferredWork: '',
    languages: '',
    location: '',
    availability: '',
    expectedSalary: ''
  });

  const [activeField, setActiveField] = useState<FormFields | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fieldLabels: Record<FormFields, string> = {
    name: 'Your Name',
    age: 'Age',
    experience: 'Work Experience',
    preferredWork: 'Preferred Work',
    languages: 'Languages',
    location: 'Work Location',
    availability: 'Availability',
    expectedSalary: 'Expected Salary'
  };

  const startListening = async (field: FormFields) => {
    setActiveField(field);
    setIsListening(true);
    console.log('Started listening for', field);
  };

  const stopListening = () => {
    setIsListening(false);
    setActiveField(null);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const readFieldHelp = async (field: FormFields) => {
    const helpText = `Please speak your ${fieldLabels[field]} after the beep`;
    await Speech.speak(helpText, {
      language: 'en-US',
      rate: 0.8,
    });
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.formCard}>
          <Text style={styles.title}>Job Application</Text>

          {(Object.keys(formData) as FormFields[]).map((field) => (
            <View key={field} style={styles.fieldContainer}>
              <Text style={styles.label}>{fieldLabels[field]}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={formData[field]}
                  onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                  style={styles.input}
                  mode="outlined"
                  dense
                />
                <TouchableOpacity onPress={() => startListening(field)} style={styles.voiceButton}>
                  <MaterialIcons
                    name={isListening && activeField === field ? "mic" : "mic-none"}
                    size={24}
                    color={isListening && activeField === field ? "#6200ee" : "#666"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => readFieldHelp(field)} style={styles.helpButton}>
                  <MaterialIcons name="help-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            Submit
          </Button>
        </Surface>

        <Portal>
          <Modal visible={isListening} onDismiss={stopListening} contentContainerStyle={styles.modal}>
            <Text style={styles.modalText}>Listening...</Text>
            <Button onPress={stopListening}>Stop</Button>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    padding: 16,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  voiceButton: {
    padding: 8,
    marginLeft: 8,
  },
  helpButton: {
    padding: 8,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default JobPortalForm;
