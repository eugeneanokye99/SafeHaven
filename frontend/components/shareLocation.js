import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const ShareLocation = ({ locationId }) => {
  const [userId, setUserId] = useState('');

  const shareLocation = async () => {
    try {
      const response = await fetch('http://localhost:3001/map/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      Alert.alert('Error', 'An error occurred while sharing the location.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter User ID to share with"
        value={userId}
        onChangeText={setUserId}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Share Location" onPress={shareLocation} />
    </View>
  );
};

export default ShareLocation;
