import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
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
      const data = registerUser(name, email, password)
      router.push('/');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text>Logo</Text>
      </View>
      <Text style={{fontSize: 30,  textAlign: 'center', marginBottom: 35,}}>Create an account</Text>
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
      <Text style={{textAlign: 'center',}}>Already have an account?
        <TouchableOpacity  onPress={() => router.push('/')}>
          <Text style={{color: '#007BFF', top: 3, marginLeft: 3,}}>Login</Text>
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
    marginTop:StatusBar.currentHeight
  },
  title: {
    fontSize: 44,
    marginBottom: 24,
    textAlign: 'center',
  },
  si_title: {
    fontSize: 35,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 50,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 0,
  }
});
