import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
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


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <View>
      {/* <View style={styles.topbar}>

        <View style={styles.userContainer}>
          <Text style={styles.username}>{user?.name}</Text>
          {imageSource && <Image style={styles.image} source={imageSource} />}
        </View>
      </View> */}

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
            onPress={() => router.push("Settings")}
          >
            <Ionicons name="settings-sharp" size={24} color="black" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("Logout")}
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
    position: "absolute",
    zIndex: 999,
    top: 60,
    left: 0,
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
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
