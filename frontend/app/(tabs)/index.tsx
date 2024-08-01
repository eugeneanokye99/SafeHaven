import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../UserContext";
import { fetchLinkedUsers, searchUsers } from '../../services/api';
import Drawer from "@/components/Drawer";

const Home = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [linkedUsers, setLinkedUsers] = useState([]); // State for linked users
  const router = useRouter();
  const { user } = useUser();
  const imageSource = user?.profileImage ? { uri: user.profileImage } : null;

  useEffect(() => {
    if (user?.id) {
 
      fetchLinkedUsersData();
    }
  }, [user]);
  const fetchLinkedUsersData = async () => {
    try {
      const results = await fetchLinkedUsers(user?.id);
      setLinkedUsers(results || []); // Set linked users data
      console.log (results)
    } catch (error) {
      console.error('Error fetching linked users: ', error);
    }
  };

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

  const handleUserPress = (userId) => {
    router.push(`../profile?userId=${userId}`);
  };

  

  const categories = [
    { id: 1, name: "Connectivity", icon: "handshake-o" },
    { id: 2, name: "Protection", icon: "shield" },
    { id: 3, name: "Tracking", icon: "location-arrow" },
    { id: 4, name: "Other", icon: "ellipsis-h" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Drawer />

        <View style={styles.banner}>
          <Text style={styles.bannerText}>Welcome to Your Health Companion</Text>
          <Text style={styles.bannerSubText}>Supporting your health and wellness every step of the way</Text>
          <TouchableOpacity style={styles.getStartedButton}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
      </View>

        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={24} color="black" style={styles.searchIcon} />
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categories}>
            {categories.map((category) => (
              <View key={category.id} style={styles.category}>
                <FontAwesome name={category.icon} size={24} color="black" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Users</Text>
          <FlatList
            horizontal
            data={linkedUsers}
            keyExtractor={(user) => user._id.toString()}
            renderItem={({item: user}) => (
              <TouchableOpacity onPress={() => handleUserPress(user._id)}>
                <View style={styles.doctorCard}>
                  <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                  <Text style={styles.user}>{user.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

            
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  banner: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  bannerSubText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 10,
  },
  getStartedButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  getStartedText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  category: {
    alignItems: "center",
  },
  categoryText: {
    marginTop: 5,
    fontSize: 16,
  },
  doctorCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: 150,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  user: {
    fontSize: 16,
    fontWeight: "bold",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#888",
  },
});
