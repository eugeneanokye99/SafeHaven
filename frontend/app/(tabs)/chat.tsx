import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import { fetchChats } from '../../services/api';
import Drawer from '@/components/Drawer';

const ChatListScreen = () => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const router = useRouter();


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
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => router.push({ pathname: '/chatscreen', params: { currentUserId: user?.id, otherUserId: item._id } })}
    >
      <Image source={{ uri: item.profileImage }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
        <Text style={styles.chatLastSeen}>Last seen: {item.lastSeen}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}><Entypo name="chat" size={24} color={'black'}/> Chats</Text>
      <TouchableOpacity 
        style={styles.chatItem} 
        onPress={() => router.push({ pathname: '../chatbot', params: { userId: user?.id } })}
      >
        <Image source={require('../../assets/images/img.jpg')} style={styles.avatar} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>SafeHaven Chatbot</Text>
            <Text style={styles.chatPin}><AntDesign name="pushpin" size={24} color="red" /></Text>
          </View>
          <Text style={styles.chatMessage}>Tap to chat</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.newChatButton} 
        onPress={() => router.push({ pathname: '/newchat', params: { userId: user?.id } })}
      >
        <AntDesign name="pluscircle" size={50} color="#007bff" />
      </TouchableOpacity>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Chats</Text>
        <FlatList
          data={chats}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      </View>
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
  chatLastSeen: {
    fontSize: 12,
    color: '#aaa',
  },
   newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
