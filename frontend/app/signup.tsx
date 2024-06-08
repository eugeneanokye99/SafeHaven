import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/api';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSignup = async () => {
    try {
      const data = await registerUser(name, email, password);
      if (data !== null) {
        // Registration successful, proceed to the next page
        router.push('/');
      } else {
        // User already exists, display an error message
        console.error('User already exists. Please use a different email address.');
        Alert.alert('Signup Failed', 'User already exists. Please use a different email address.');
      }
    } catch (error) {
      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Signup failed:', errorMessage);
      Alert.alert('Signup Failed', errorMessage);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text>Logo</Text>
      </View>
      <Text style={styles.title}>Create an account</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        Already have an account?
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 35,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 0,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 10,
  },
  loginLink: {
    color: '#007BFF',
    marginLeft: 3,
  },
});
