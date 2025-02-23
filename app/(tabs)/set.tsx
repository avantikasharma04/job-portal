import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  List, 
  Switch, 
  Text, 
  Button, 
  Divider,
  Portal,
  Dialog,
  RadioButton,
  Provider as PaperProvider
} from 'react-native-paper';
import * as Speech from 'expo-speech';

const SettingsScreen = ({ navigation }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [languageDialog, setLanguageDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Function to speak text
  const speakText = (text) => {
    if (voiceEnabled) {
      Speech.speak(text, {
        language: selectedLanguage === 'english' ? 'en-US' : 'hi-IN',
      });
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
        </View>

        <List.Section>
          {/* Voice Assistant */}
          <List.Item
            title="Voice Assistant"
            description="Enable voice feedback"
            left={() => <List.Icon icon="microphone" />}
            right={() => (
              <Switch
                value={voiceEnabled}
                onValueChange={(value) => {
                  setVoiceEnabled(value);
                  speakText(value ? 'Voice assistant enabled' : 'Voice assistant disabled');
                }}
              />
            )}
          />
          <Divider style={styles.divider} />

          {/* Notifications */}
          <List.Item
            title="Notifications"
            description="Receive job updates"
            left={() => <List.Icon icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  setNotifications(value);
                  speakText(value ? 'Notifications enabled' : 'Notifications disabled');
                }}
              />
            )}
          />
          <Divider style={styles.divider} />

          {/* Language Selection */}
          <List.Item
            title="Language"
            description={`Current: ${selectedLanguage === 'english' ? 'English' : 'Hindi'}`}
            left={() => <List.Icon icon="translate" />}
            onPress={() => setLanguageDialog(true)}
            style={styles.listItem}
          />
        </List.Section>

        {/* Help Button */}
        <View style={styles.helpButton}>
          <Button 
            mode="contained" 
            icon="help-circle"
            onPress={() => {
              speakText('Opening help section');
              navigation.navigate('Help');
            }}
          >
            Need Help?
          </Button>
        </View>

        {/* Language Selection Dialog */}
        <Portal>
          <Dialog
            visible={languageDialog}
            onDismiss={() => setLanguageDialog(false)}
          >
            <Dialog.Title>Select Language</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group
                onValueChange={(value) => {
                  setSelectedLanguage(value);
                  setLanguageDialog(false);
                  speakText(`Language changed to ${value === 'english' ? 'English' : 'Hindi'}`);
                }}
                value={selectedLanguage}
              >
                <RadioButton.Item label="English" value="english" />
                <RadioButton.Item label="Hindi" value="hindi" />
              </RadioButton.Group>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  header: {
    padding: 16,
    backgroundColor: '#0D47A1', // Dark blue
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  helpButton: {
    padding: 16,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#1976D2', // Medium blue
    borderRadius: 8,
  },
  listItem: {
    backgroundColor: '#BBDEFB', // Light blue
    marginVertical: 4,
    borderRadius: 8,
    padding: 10,
  },
  divider: {
    backgroundColor: '#64B5F6', // Medium blue for subtle contrast
    height: 1,
  },
});

export default SettingsScreen;
