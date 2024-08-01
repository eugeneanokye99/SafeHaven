import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomMarker from './customMarker';
import ShareLocation from './shareLocation'; // Import the ShareLocation component
import { useUser } from "../app/UserContext";
import API_URL from '../services/api'


const Map = () => {
  const initialLocation = {
    latitude: 5.6037,
    longitude: -0.1870,
  };

  const [myLocation, setMyLocation] = useState(null);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef(null);
  const user = useUser();

  useEffect(() => {
    _getLocation();
    if (user.user.id) {
      fetchSharedLocations(user.user.id); // Fetch shared locations when component mounts and userId is available
    } 
    console.log(user.user.id)
  }, [user]);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchSharedLocations = async (userId) => {
    try {
      console.log(userId)
      const response = await fetch(`${API_URL}/map/shared-locations?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Shared Locations:', data);

      // Update state with fetched locations
      setSharedLocations(data);
    } catch (error) {
      console.error('Error fetching shared locations:', error);
      Alert.alert('Error', 'Failed to fetch shared locations.');
    }
  };

  const focusOnLocation = () => {
    if (myLocation) {
      const newRegion = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
      >
        {/* {myLocation && (
          <>
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              title='My current location'
              description='I am here'
            />
              <CustomMarker
                coordinate={{
                  latitude: myLocation.latitude,
                  longitude: myLocation.longitude,
                }}
                title='My current location'
              />
          </>
        )} */}

        {/* Loop through sharedLocations and display markers */}
        {sharedLocations.map((location, index) => (
          <>
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description='Shared by someone'
          />
            <CustomMarker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title= {location.name}
            />
            </>
        ))}
      </MapView>

      {/* Button to focus on my location */}
      <View style={styles.buttonContainer}>
        <Button title='Get Location' onPress={focusOnLocation} />
      </View>

      {/* ShareLocation component */}
      <ShareLocation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Map;
