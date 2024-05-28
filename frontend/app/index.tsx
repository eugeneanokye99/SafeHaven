import React, { useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../services/api';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  
  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Something went wrong');
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text>Logo</Text>
      </View>
      <Text style={styles.title}>Welcome Back!</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={{textAlign: 'center',}}>Don't have an account?
        <TouchableOpacity  onPress={() => router.push('/signup')}>
          <Text style={{color: '#007BFF', top: 3, marginLeft: 3,}}>Register here</Text>
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
