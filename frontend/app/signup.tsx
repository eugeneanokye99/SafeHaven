import React, { useState } from 'react';
import { Text, ActivityIndicator, TextInput, View, Button, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      const fileName = sourceUri.split('/').pop();
      const destinationUri = `${FileSystem.documentDirectory}${fileName}`
      try {
        await FileSystem.copyAsync({
          from: sourceUri,
          to: destinationUri,
        });
        setProfileImage(destinationUri);
        setSavedImageUri(destinationUri);
      } catch (error) {
        console.error('Error saving the image:', error);
        Alert.alert('Error', 'Failed to save the image');
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
        {/* <Text style={styles.logoText}>App Logo</Text> */}
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
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
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
    justifyContent: 'center',
    padding: 16,
    marginTop: StatusBar.currentHeight,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
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
  loginText: {
    textAlign: 'center',
    marginTop: 10,
  },
  loginLink: {
    color: '#007BFF',
    marginLeft: 3,
  },
  image: {
    marginTop: -10,
    borderRadius: 999,
    width: 150,
    height: 150,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
