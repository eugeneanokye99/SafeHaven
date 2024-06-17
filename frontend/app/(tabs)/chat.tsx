import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import { fetchChats } from '../../services/api';

const ChatListScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const router = useRouter();
  const imageSource = user?.profileImage ? { uri: user.profileImage } : null;


  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatData = await fetchChats(user?.id);
        setChats(chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChatData();
  }, [user?.id]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() =>    router.push({ pathname: '/chatscreen', params: { currentUserId: user?.id, otherUserId: item._id },})}>
      <Image source={{ uri: item.profileImage }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

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

      <TouchableOpacity style={styles.chatItem} onPress={() => router.push({pathname: '../chatbot', params: { userId: user?.id} })}>
        <Image source={require('../../assets/images/img.jpg')} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>SafeHaven Chatbot</Text>
            <Text style={styles.chatPin}><AntDesign name="pushpin" size={24} color="red" /></Text>
          </View>
          <Text style={styles.chatMessage}>Tap to chat</Text>
        </View>
      </TouchableOpacity>
      <FlatList
        data={chats}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 999,
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 14,
    color: '#999',
  },
  chatPin: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  chatMessage: {
    fontSize: 16,
    color: '#666',
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
  userIcon: {
    borderRadius: 999,
    borderWidth: 2,
    padding: 8,
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
});

export default ChatListScreen;
