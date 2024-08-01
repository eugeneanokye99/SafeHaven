import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Switch,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Drawer from "@/components/Drawer";

const Settings = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const router = useRouter();

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    const initialSettings = [
        { id: '1', title: 'Location Tracking', enabled: true},
        { id: '2', title: 'Call Filtering', enabled: true},
        { id: '3', title: 'Body Status Monitoring', enabled: true },
        { id: '4', title: 'Body Status Monitoring', enabled: true },
        { id: '5', title: 'Fall Detection', enabled: true },
        { id: '6', title: 'Blood Pressure Limit', enabled: true },
       
    ];

    const [settings, setSettings] = useState(initialSettings);

    const toggleSwitch = (id: string) => {
        setSettings(prevSettings => 
            prevSettings.map(setting => 
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    const Item = ({ id, title, enabled }: { id: string, title: string, enabled: boolean }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
            <Switch
                onValueChange={() => toggleSwitch(id)}
                value={enabled}
            />
        </View>
    );

   const ListHeaderComponent = () => (
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
      </View>
  );   


    return (
        <SafeAreaView style={styles.container}>
            <Drawer />

            <FlatList   
                data={settings}
                renderItem={({ item }) => <Item id={item.id} title={item.title} enabled={item.enabled} />}
                keyExtractor={item => item.id}
                ListHeaderComponent={ListHeaderComponent}
            />
            
        </SafeAreaView>
    );
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    header: {
      padding: 20,
      backgroundColor: "#f4f4f4",
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
  },
});
