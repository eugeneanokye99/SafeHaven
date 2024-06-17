// ActivityLogScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const ActivityLogScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={styles.activityDetails}>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={activities}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  activityDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  activityDescription: {
    fontSize: 18,
  },
  activityTimestamp: {
    fontSize: 14,
    color: '#999',
  },
});

export default ActivityLogScreen;
