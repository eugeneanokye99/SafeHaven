import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, FlatList, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { fetchMessages, sendMessage, fetchUserById } from '../services/api';
import io from "socket.io-client";

const ChatScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { currentUserId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://172.20.10.2:8080", {
      transports: ["websocket"],
      upgrade: false
    });

    socket.on('connect', () => {
      console.log('Connected to the server');
      socket.emit('register', currentUserId);
    });
  
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(socket);

    socket.emit('register', currentUserId);

    socket.on('init', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userData = await fetchUserById(otherUserId);
        setOtherUser(userData);
        const messagesData = await fetchMessages(currentUserId, otherUserId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [currentUserId, otherUserId]);

  const handleSend = async () => {
    try {
      const newMessage = await sendMessage(currentUserId, otherUserId, messageText);
      setMessages([...messages, newMessage]);
      setMessageText("");

      // Emit the message to the socket server
      if (socket) {
        socket.emit('message', newMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {otherUser && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>{"< Back"}</Text>
            </TouchableOpacity>
            <Image source={{ uri: otherUser.profileImage }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <Text style={[styles.userStatus, { color: otherUser.isOnline ? "green" : "red" }]}>
                {otherUser.isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
        )}
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={item.from === currentUserId ? styles.sentMessage : styles.receivedMessage}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          inverted  // Invert the FlatList to display latest messages at the bottom
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", 
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    color: "#007BFF",
    fontSize: 18,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userStatus: {
    fontSize: 14,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%", 
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "gray", 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%", 
  },
  messageText: {
    fontSize: 16,
    color: "#ffffff", 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#ffffff", // Set input background color
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007BFF", // Set send button background color
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "#ffffff", // Set send button text color
    fontSize: 16,
  },
});

export default ChatScreen;
