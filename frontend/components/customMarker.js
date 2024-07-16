import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ coordinate, title, image }) => {
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.marker}>
        <Image source={image} style={styles.image} />
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    marginTop: 4,
    fontSize: 12,
    color: '#000',
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 4,
  },
});

export default CustomMarker;