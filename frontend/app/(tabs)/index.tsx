import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../UserContext';

const Home = () => {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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
        <View style={styles.userContainer}>
          <Text style={styles.username}>{user?.name}</Text>
          <View style={styles.userIcon}>
            <FontAwesome name="user" size={30} color="black" />
          </View>
        </View>
      </View>

      {/* Drawer Content */}
      {isDrawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("../settings")}
          >
            <Text style={styles.drawerItemText}>
            <Ionicons name="settings-sharp" size={24} color="black" />
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => router.push("/")}
          >
            <Text style={styles.drawerItemText}>
            <MaterialIcons name="logout" size={24} color="black" />
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <Image
        style={styles.image}
        source={require("../../assets/images/img.jpg")}
      /> */}

      <View>
        <FontAwesome
          name="search"
          size={24}
          color="black"
          style={styles.search}
        />
        <TextInput
          placeholder="Search Friends"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  topbar: {
    backgroundColor: "#fff",
    height: 60,
    justifyContent: "center",
  },
  image: {
    height: "50%",
    width: "100%",
  },
  input: {
    alignSelf: "center",
    height: 50,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 8,
    borderRadius: 50,
    fontSize: 20,
    paddingLeft: 50,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    width: 180,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  search: {
    position: "absolute",
    top: 30,
    left: 60,
  },
  userContainer: {
    position: "absolute",
    right: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    marginRight: 10,
  },
  userIcon: {
    borderRadius: 999,
    borderWidth: 2,
    padding: 8,
    paddingHorizontal: 13,
  },
  bars: {
    marginLeft: 10,
  },
  drawer: {
    position: "absolute",
    zIndex: 1,
    top: 80,
    left: 0,
    width: "80%",
    height: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  drawerItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  drawerItemText: {
    fontSize: 20,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  drawerIcons: {
    marginRight: 10,
  },
});
