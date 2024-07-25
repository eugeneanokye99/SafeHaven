import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import io from 'socket.io-client';
import Toast from 'react-native-toast-message';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = io("http://172.20.10.2:3000");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    // Register with socket.io server
    socket.on('connect', () => {
      socket.emit('register', 'user_id_here'); // Replace with actual user ID
    });

    // Listen for notifications
    socket.on('notification', (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);

      // Show toast notification
      Toast.show({
        type: 'success', // 'info', 'error' etc
        position: 'top',
        text1: data.title,
        text2: data.content,
        visibilityTime: 4000, // duration in ms
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const Item = ({ title, content, time, status }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: (status) => status === 'Warning' ? 'red' : 'blue',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
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
