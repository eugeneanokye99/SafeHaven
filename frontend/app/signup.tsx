import React, { useState } from 'react';
import { Text, ActivityIndicator, TextInput, View, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [savedImageUri, setSavedImageUri] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true); // Show loading indicator
    try {
      const data = await registerUser(name, email, password, address, dob, phone, profileImage);
      if (data !== null) {
        router.push('/');
      } else {
        Alert.alert('Signup Failed', 'User already exists. Please use a different email address.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Signup failed:', errorMessage);
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your media library.');
      return;
    }
  
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      // Get the URI of the selected image
      const sourceUri = result.assets[0].uri;
  
      try {
        const fileInfo = await FileSystem.getInfoAsync(sourceUri);
        const formData = new FormData();
        formData.append('file', {
          uri: sourceUri,
          name: fileInfo.uri.split('/').pop(),
          type: 'image/jpeg',
        });
  
        // Upload the image to your server
        const response = await axios.post('http://172.20.10.3:3000/api/auth/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.data.success) {
          const serverImageUrl = response.data.url;
          setProfileImage(serverImageUrl);
        } else {
          Alert.alert('Error', 'Failed to upload the image');
        }
      } catch (error) {
        console.error('Error uploading the image:', error);
        Alert.alert('Error', 'Failed to upload the image');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.image}
              source={require("../assets/images/img.jpg")}
            />
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
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          <TextInput
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={dob}
            onChangeText={setDob}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>Pick a profile picture</Text>
          </TouchableOpacity>
          {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.loginText}>
            Already have an account?
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.loginLink}> Login</Text>
            </TouchableOpacity>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f8fc',
    paddingTop: 40,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
  imagePicker: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePickerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
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
  loginText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  loginLink: {
    color: '#007BFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

