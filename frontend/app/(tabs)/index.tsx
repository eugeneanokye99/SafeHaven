import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../UserContext";
import { searchUsers } from '../../services/api';

const safetyTips = [
  "Stay active and maintain a healthy diet.",
  "Keep a list of emergency contacts.",
  "Install grab bars in the bathroom.",
  "Stay hydrated and avoid dehydration.",
  "Keep your home well-lit to avoid falls.",
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();
  const imageSource = user?.profileImage ? { uri: user.profileImage } : null;
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const tipIndex = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (search.length > 0) {
      const fetchResults = async () => {
        try {
          const results = await searchUsers(search);
          setSearchResults(results);
        } catch (error) {
          console.error('Error fetching search results: ', error);
        }
      };
      fetchResults();
    } else {
      setSearchResults([]);
    }
  }, [search]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence(
        safetyTips.map((_, index) =>
          Animated.timing(tipIndex, {
            toValue: index + 1,
            duration: 5000, // Change duration to 5000 milliseconds (5 seconds)
            useNativeDriver: true,
          })
        )
      )
    ).start();
  }, []);
  

  const handleUserPress = (userId) => {
    router.push(`../profile?userId=${userId}`);
  };

  const currentTipIndex = tipIndex.interpolate({
    inputRange: safetyTips.map((_, index) => index),
    outputRange: safetyTips.map((_, index) => index),
    extrapolate: "clamp",
  });

  const currentTipOpacity = tipIndex.interpolate({
    inputRange: safetyTips.map((_, index) => index),
    outputRange: safetyTips.map(() => 1),
    extrapolate: "clamp",
  });

  const getCurrentTip = () => {
    const index = Math.round(currentTipIndex.__getValue());
    return safetyTips[index];
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
          {imageSource && <Image style={styles.image} source={imageSource} />}
        </View>
      </View>
      {isDrawerOpen && (
        <View style={styles.drawer}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleUserPress(user?.id)}
          >
            <Entypo name="users" size={24} color="black" />
            <Text style={styles.drawerItemText}>Profile</Text>
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
      <View>
        <FontAwesome name="search" size={24} color="black" style={styles.search} />
        <TextInput
          placeholder="Search Friends"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item._id)}>
              <View style={styles.searchResult}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.safetyTipsContainer}>
        <Animated.Text style={[styles.safetyTip, { opacity: currentTipOpacity }]}>
          {getCurrentTip()}
        </Animated.Text>
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
  image: {
    height: 50,
    width: 50,
    borderRadius: 999,
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
  search: {
    position: "absolute",
    top: 30,
    left: 60,
  },
  topbar: {
    backgroundColor: "#fff",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    marginRight: 10,
  },
  bars: {
    marginLeft: 10,
  },
  drawer: {
    position: "absolute",
    zIndex: 1,
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
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  safetyTipsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  safetyTip: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
