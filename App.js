import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'স্বাগতম Meetwoyou-তে!', sender: 'System' },
  ]);
  const [inputText, setInputText] = useState('');

  // লগইন ফাংশন
  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
    } else {
      alert('ইমেইল ও পাসওয়ার্ড দিন');
    }
  };

  // মেসেজ পাঠানো
  const sendMessage = () => {
    if (inputText.trim().length > 0) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: inputText, sender: 'You' },
      ]);
      setInputText('');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <Text style={styles.logo}>Meetwoyou</Text>

          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // চ্যাট স্ক্রিন
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.chatContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#00d2ff" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meetwoyou Chat</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'You' ? styles.userMessage : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrapper}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00d2ff',
    marginBottom: 50,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#00d2ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#aaa',
    marginTop: 20,
    fontSize: 15,
  },

  // Chat Screen Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    height: 60,
    backgroundColor: '#00d2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#00d2ff',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e1e1e',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputWrapper: {
    backgroundColor: '#121212',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00d2ff',
    width: 70,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
