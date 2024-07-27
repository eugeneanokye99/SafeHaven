import React, { useState, useRef, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser, AuthResponse } from '../services/api';
import { useUser } from './UserContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const { user } = useUser();
  const welcomeOpacity = useRef(new Animated.Value(0)).current; // Animation state
  const [showWelcome, setShowWelcome] = useState(false); // Welcome visibility state

  const handleLogin = async () => {
    setLoading(true); // Show loading indicator
    try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to proceed.');
          setLoading(false); // Hide loading indicator
          return;
        }
      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const data = await loginUser(email, password, latitude, longitude);
      
      // Check if the login was successful

      if (data !== null) {

        const userData = { 
          name: data.user.name, 
          profileImage: data.user.profileImage, 
          dob: data.user.dob, 
          phone: data.user.phone, 
          id: data.user.id, 
          email: data.user.email, 
          address: data.user.address,
          location: { latitude, longitude }
        };
  
        setUser(userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        router.push('/(tabs)');

      } else {
        console.error('Invalid credentials. Please try again.');
        Alert.alert('Invalid Credentials', 'Please check your email and password and try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Login failed:', errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.image}
            source={require("../assets/images/img.jpg")}
          />
        </View>
        <Text style={styles.title}>Sign In To Your Account.</Text>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity style={styles.rememberMeButton}>
            <Text style={styles.rememberMeText}>Remember For 30 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don't have an account?
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign In With Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Sign In With Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f8fc',
    paddingTop: 70,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    color: '#888',
  },
  forgotPasswordText: {
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signupText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  signupLink: {
    color: '#007BFF',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialButtonText: {
    color: '#333',
  },
});
