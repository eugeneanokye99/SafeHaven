import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { fetchUserById, LinkUser } from '../services/api';
import { useUser } from "./UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { user } = useUser();
  const [isLinked, setIsLinked] = useState(false);

  const handleLink = async () => {
    try {
      const data = await LinkUser(user?.id, userId);
      
      if (data !== null) {
        setIsLinked(true);
        await AsyncStorage.setItem(`isLinked-${userId}`, 'true');
      } else {
        console.error('Unable to link with user');
        Alert.alert('Unable to link with user');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Link failed:', errorMessage);
      Alert.alert('Link Failed', errorMessage);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await fetchUserById(userId);
        setProfileUser(user);
      } catch (error) {
        console.error('Error fetching user: ', error);
      }
    };

    const checkLinkStatus = async () => {
      try {
        const linkedStatus = await AsyncStorage.getItem(`isLinked-${userId}`);
        if (linkedStatus === 'true') {
          setIsLinked(true);
        }
      } catch (error) {
        console.error('Error checking link status: ', error);
      }
    };

    getUser();
    checkLinkStatus();

  }, [userId]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (!profileUser) {
    return <Text style={{ flex: 1 }}>Loading...</Text>;
  }

  const imageSource = profileUser?.profileImage ? { uri: profileUser.profileImage } : null;

  const handleChatButtonPress = () => {
    router.push({
      pathname: '/chatscreen',
      params: { currentUserId: user?.id, otherUserId: userId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <FontAwesome
          name="bars"
          size={30}
          color="black"
          style={styles.bars}
          onPress={toggleDrawer}
        />
        <Text style={styles.topbarTitle}>Profile</Text>
        <FontAwesome
          name="bell"
          size={30}
          color="black"
          style={styles.bellIcon}
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
        <Text style={styles.userBio}>
          I am a available
        </Text>
        {user?.id === profileUser?.id ? (
          <Text style={styles.myProfileText}>My Profile</Text>
        ) : (
          <View style={styles.buttonContainer}>
            {isLinked ? (
              <Text style={styles.linkedText}><Feather name="link" size={30} color="black" /> Linked</Text>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLink}>
                <Text style={styles.buttonText}><Feather name="link" size={20} color="white" /> Link</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={handleChatButtonPress}>
              <Text style={styles.buttonText}><Ionicons name="chatbox" size={20} color="white" /> Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  topbar: {
    backgroundColor: '#fff',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bellIcon: {
    marginRight: 10,
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
    textAlign: 'center',
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  myProfileText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
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
  linkedText: {
    fontSize: 18,
    color: 'black',
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default ProfileScreen;
