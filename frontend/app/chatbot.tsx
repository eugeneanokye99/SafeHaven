import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { sendMessageToBot, fetchBotMessages } from '../services/api';
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useUser } from "./UserContext";
import { AntDesign } from '@expo/vector-icons';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [typingEffect, setTypingEffect] = useState("");
  const route = useRoute();
  const router = useRouter();
  const { userId } = route.params;
  const { user } = useUser();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const messagesData = await fetchBotMessages(userId);
        const formattedMessages = messagesData.map((msg) => ({
          id: msg._id,
          text: msg.message,
          sender: msg.sender === userId ? user?.name : "bot",
        }));
        setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [userId]);

  const displayTypingEffect = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      setTypingEffect(text.slice(0, index + 1));
      index += 1;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { id: Date.now().toString(), text: input, sender: user?.name };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      const botReply = await sendMessageToBot(userId, input);
      displayTypingEffect(botReply.reply);
      setTimeout(() => {
        const botMessage = { id: Date.now().toString(), text: botReply.reply, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setTypingEffect("");
      }, botReply.reply.length * 40);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.sender === "bot" ? styles.botMessage : styles.userMessage]}>
      <Text style={styles.messageText}>{item.sender === "bot" && item.text === typingEffect ? typingEffect : item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}><AntDesign name="arrowleft" size={34} color="black" /></Text>
          </TouchableOpacity>
          <Image source={require('../assets/images/img.jpg')} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>SafeHaven Bot</Text>
          </View>
        </View>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  message: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  botMessage: {
    backgroundColor: "gray",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#000000",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#000",
    borderRadius: 5,
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
});
