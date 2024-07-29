import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationPopup = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
    height: 50,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotificationPopup;
