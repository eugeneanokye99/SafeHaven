import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../app/UserContext';
import { useRouter } from 'expo-router';



const Drawer = () => {
    const { user } = useUser();
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const imageSource = user?.profileImage ? { uri: user.profileImage } : null;

    const handleLogout = () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => router.push('/') }
        ],
        { cancelable: false }
      );
    };


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={{zIndex: 1}}>
      <View style={styles.header}>
      <FontAwesome6
          name="bars"
          size={30}
          color="black"
          style={styles.bars}
          onPress={toggleDrawer}
        />
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          {imageSource && <Image style={styles.profileImage} source={imageSource} />}
        </View>

      {isDrawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("../settings")}
          >
            <Ionicons name="settings-sharp" size={24} color="black" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="black" />
            <Text style={styles.drawerItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  bars: {
    marginLeft: 10,
  },
  drawer: {
    position: 'absolute',
    top: 95,
    left: 0,
    width: "80%",
    height: "1000%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  drawerItemText: {
    fontSize: 20,
    marginLeft: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 999,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
