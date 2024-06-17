import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, FlatList, StatusBar, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchMessages, sendMessage, fetchUserById } from '../services/api';

const ChatScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { currentUserId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [otherUser, setOtherUser] = useState(null);

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
            <Text style={styles.userStatus}>{otherUser.isOnline ? "Online" : "Offline"}</Text>
          </View>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={item.from === currentUserId ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
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
        color: "green",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
      },
      sentMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#dcf8c6",
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      },
      receivedMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      },
});

export default ChatScreen;
