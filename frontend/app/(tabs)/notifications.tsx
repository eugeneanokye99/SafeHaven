import React, { useState } from "react";
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
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const Settings = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const router = useRouter();

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    const DATA = [
        {
          id: '1',
          title: 'Warning!!!!!!!!!',
          content: "ueheiheihiehiehiehiehheihiehieeheheieh",
          time: '2:00am',
          status: '1',
        },
        {
          id: '2',
          title: 'Warning!!!!!!!!!',
          content: "ueheiheihiehiehiehiehheihiehieeheheieh",
          time: '2:00am',
          status: '1',
        },
        {
          id: '3',
          title: 'Warning!!!!!!!!!',
          content: "ueheiheihiehiehiehiehheihiehieeheheieh",
          time: '2:00am',
          status: '1',
        },
        {
          id: '4',
          title: 'Warning!!!!!!!!!',
          content: "ueheiheihiehiehiehiehheihiehieeheheieh",
          time: '2:00am',
          status: '1',
        },
    ];
      
    type ItemProps = {
      title: string,
      content: string,
      time:  string,
      status: string
    };
    
    const Item = ({title, content, status, time}: ItemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{content}</Text>
        <Text style={styles.title}>{time}</Text>
        <Text style={styles.title}>{status}</Text>
    </View>
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
          <Text style={styles.username}>Eugene</Text>
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

      <Text style={{textAlign: 'center', margin: 10, fontSize: 40,}}>Notifications</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item title={item.title} content={item.content} time={item.time} status={item.status} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    title: {
        fontSize: 22,
    },
    topbar: {
        backgroundColor: "#fff",
        height: 60,
        justifyContent: "center",
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
})