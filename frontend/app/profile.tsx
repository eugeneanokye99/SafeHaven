import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { fetchUserById } from '../services/api';

const ProfileScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUserById(userId);
        setProfileUser(user);
      } catch (error) {
        console.error('Error fetching user: ', error);
      }
    };

    getUser();
  }, [userId]);


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (!profileUser) {
    return <Text style={{flex: 1}}>Loading...</Text>;
  }

  const imageSource = profileUser?.profileImage ? { uri: profileUser.profileImage } : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <FontAwesome6
          name="bars"
          size={30}
          color="black"
          style={styles.bars}
          onPress={toggleDrawer}
        />
      </View>

      {isDrawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("./(tabs)")}
          >
            <Entypo name="home" size={24} color="black" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("../settings")}
          >
            <Ionicons name="settings-sharp" size={24} color="black" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("../logout")}
          >
            <MaterialIcons name="logout" size={24} color="black" />
            <Text style={styles.drawerItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.mainContainer}>
        {imageSource && (
          <Image
            style={styles.profileImage}
            source={imageSource}
          />
        )}
        <Text style={styles.userName}>{profileUser?.name}</Text>
        <Text style={styles.userDetails}>{profileUser?.email}</Text>
        <Text style={styles.userDetails}>{profileUser?.phone}</Text>
        <Text style={styles.userDetails}>{profileUser?.address}</Text>
        <Text style={styles.userDetails}>{profileUser?.location?.latitude}</Text>
        <Text style={styles.userDetails}>{profileUser?.location?.longitude}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => console.log('Link button pressed')}>
            <Text style={styles.buttonText}><Feather name="link" size={20} color="white" /> Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => console.log('Chat button pressed')}>
            <Text style={styles.buttonText}><Ionicons name="chatbox" size={20} color="white" /> Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  topbar: {
    backgroundColor: '#fff',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    marginRight: 10,
  },
  bars: {
    marginLeft: 10,
  },
  drawer: {
    position: 'absolute',
    zIndex: 1,
    top: 60,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerItemText: {
    fontSize: 20,
    marginLeft: 10,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  }
});

export default ProfileScreen;
