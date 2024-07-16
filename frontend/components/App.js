import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import ShareLocation from './components/shareLocation'; // Import the ShareLocation component


const App = () => {
  const [location, setLocation] = useState(null);

  // Example function to get location from device
  const getLocation = async () => {
    try {
      // Assume you have a function to get location
      const coords = await getDeviceLocation();
      setLocation(coords);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const saveLocation = async () => {
    try {
      const response = await fetch('http://172.20.10.3:3000/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'exampleUserId', // Replace with actual user ID
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'An error occurred while saving the location.');
    }
  };

  return (
    <View>
      <Text>Current Location: {location ? `${location.latitude}, ${location.longitude}` : 'Fetching...'}</Text>
      <Button title="Save Location" onPress={saveLocation} />
      {location && <ShareLocation locationId={location._id} />} {/* Integrate ShareLocation component */}
    </View>
  );
};

export default App;
