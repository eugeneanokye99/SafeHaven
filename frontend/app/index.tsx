import React, { useState, useRef, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser, AuthResponse } from '../services/api';
import { useUser } from './UserContext';
import * as Location from 'expo-location';

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
      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const data = await loginUser(email, password, latitude, longitude);
      
      // Check if the login was successful
      if (data !== null) {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
      
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to proceed.');
          setLoading(false); // Hide loading indicator
          return;
        }

        setUser({ 
          name: data.user.name, 
          profileImage: data.user.profileImage, 
          dob: data.user.dob, 
          phone: data.user.phone, 
          id: data.user.id, 
          email: data.user.email, 
          address: data.user.address,
          location: { latitude, longitude }
        });

        // Set welcome visibility to true
        setShowWelcome(true);

        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          // Redirect to home after animation
          setTimeout(() => {
            router.push('/(tabs)');
          }, 1000);
        });
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
        {showWelcome && (
          <Animated.View style={[styles.welcomeContainer, { opacity: welcomeOpacity }]}>
            <Text style={styles.welcomeText}>Welcome!, {user?.name}</Text>
          </Animated.View>
        )}
        <View style={styles.logoContainer}>
          <Image
            style={styles.image}
            source={require("../assets/images/img.jpg")}
          />
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
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.signupText}>
          Don't have an account?
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Register here</Text>
          </TouchableOpacity>
        </Text>
      </KeyboardAvoidingView>
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
    fontSize: 44,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    fontSize: 20,
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
    fontSize: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    marginTop: 50,
    borderRadius: 999,
    width: 150,
    height: 150,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  signupText: {
    textAlign: 'center',
  },
  signupLink: {
    color: '#007BFF',
    top: 3,
    marginLeft: 3,
  },
  welcomeContainer: {
    position: 'absolute',
    display: 'none',
    top: '7%',
    left: '12%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
    backgroundColor: '#eee',
    height: '100%',
    width: '107%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
