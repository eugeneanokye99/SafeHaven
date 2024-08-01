import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Switch,
  FlatList,
  Slider, // Import Slider for font size adjustment
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import Drawer from "@/components/Drawer";
import * as Brightness from 'expo-brightness'; // Import for screen brightness control


const Settings = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [fontSize, setFontSize] = useState(16); // Default font size
    const [brightness, setBrightness] = useState(1); // Default brightness (1 is full brightness)
    const router = useRouter();

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);
    };

    const initialSettings = [
        { id: '1', title: 'Location Tracking', enabled: true },
        // Include other settings as needed
    ];

    const [settings, setSettings] = useState(initialSettings);

    const toggleSwitch = (id: string) => {
        setSettings(prevSettings => 
            prevSettings.map(setting => 
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    const updateBrightness = async (value: number) => {
        setBrightness(value);
        await ScreenBrightness.setBrightnessAsync(value); // Update screen brightness
    };

    const Item = ({ id, title, enabled }: { id: string, title: string, enabled: boolean }) => (
        <View style={styles.item}>
            <Text style={[styles.title, { fontSize }]}>
                {title}
            </Text>
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

            <View style={styles.controlContainer}>
                <Text style={styles.controlLabel}>Font Size</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={12}
                    maximumValue={30}
                    value={fontSize}
                    onValueChange={(value) => setFontSize(value)}
                    step={1}
                />
                <Text style={styles.controlValue}>{Math.round(fontSize)}</Text>
                
                <Text style={styles.controlLabel}>Screen Brightness</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={brightness}
                    onValueChange={(value) => updateBrightness(value)}
                    step={0.01}
                />
                <Text style={styles.controlValue}>{(brightness * 100).toFixed(0)}%</Text>
            </View>
            
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
    controlContainer: {
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    controlLabel: {
        fontSize: 18,
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    controlValue: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
