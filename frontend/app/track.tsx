import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps';
import Map from './(tabs)/map';

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Map />
    </SafeAreaView>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:StatusBar.currentHeight
  },
})