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
                onValueChange={() => {
                  setVoiceEnabled(!voiceEnabled);
                  speakText(voiceEnabled ? 'Voice assistant disabled' : 'Voice assistant enabled');
                }}
              />
            )}
          />
          <Divider />

          {/* Notifications */}
          <List.Item
            title="Notifications"
            description="Receive job updates"
            left={() => <List.Icon icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={() => setNotifications(!notifications)}
              />
            )}
          />
          <Divider />

          {/* Language Selection */}
          <List.Item
            title="Language"
            description={`Current: ${selectedLanguage === 'english' ? 'English' : 'Hindi'}`}
            left={() => <List.Icon icon="translate" />}
            onPress={() => setLanguageDialog(true)}
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
                  speakText(`Language changed to ${value}`);
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'#0070e8',
  },
  helpButton: {
    padding: 16,
    marginTop: 20,
  },
  
 
});

export default SettingsScreen;
