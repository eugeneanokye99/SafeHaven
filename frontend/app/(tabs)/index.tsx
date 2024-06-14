import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, StatusBar, Image, TextInput, TouchableOpacity,} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../UserContext';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const tips = [
  "Remember to lock your doors and windows before going to bed.",
  "Stay hydrated! Drink at least 8 glasses of water a day.",
  "Exercise regularly to maintain your health.",
  "Keep emergency contacts updated in your phone.",
  "Take your medications on time.",
  "Keep your home well-lit to prevent falls.",
  "Eat a balanced diet with plenty of fruits and vegetables."
];

const Home = () => {
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();
  const imageSource = user?.profileImage ? { uri: user.profileImage } : null;
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const fadeAnim = useSharedValue(1);
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fadeAnim.value = withTiming(0, { duration: 500, easing: Easing.linear }, () => {
  //       const nextTip = tips[Math.floor(Math.random() * tips.length)];
  //       setCurrentTip(nextTip);
  //       fadeAnim.value = withTiming(1, { duration: 500, easing: Easing.linear });
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: fadeAnim.value,
  //   };
  // });

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
          <View>
          {imageSource && (
            <Image
              style={styles.image}
              source={imageSource}
            />
          )}
          </View>
        </View>
      </View>

    {/* Drawer Content */}
    {isDrawerOpen && (
      <View style={styles.drawer}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => router.push("../profile")}
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



      {/* <Animated.View style={[styles.tipContainer, animatedStyle]}>
        <Text style={styles.tipText}>{currentTip}</Text>
      </Animated.View> */}

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
  // tipContainer: {
  //   padding: 20,
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  // },
  // tipText: {
  //   fontSize: 18,
  //   color: '#333',
  // },
});
