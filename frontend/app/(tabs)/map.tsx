import { StyleSheet, Text, SafeAreaView, View, StatusBar } from 'react-native'
import React from 'react'
import Map from '@/components/Map';

const Track = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Map />
    </SafeAreaView>
  )
}

export default Track

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:StatusBar.currentHeight
  },
})
