import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>About</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="close" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.appName}>the fitting room</Text>
                <Text style={styles.version}>Version 1.0.0</Text>
                <Text style={styles.description}>
                    Your personal AI stylist. Try on clothes virtually and explore new looks with the power of generative AI.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Credits</Text>
                    <Text style={styles.text}>Designed and developed by dgavriloff.</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
    },
    content: {
        gap: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    version: {
        fontSize: 16,
        color: '#666666',
    },
    description: {
        fontSize: 18,
        color: '#000000',
        lineHeight: 26,
    },
    section: {
        marginTop: 40,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#000000',
    },
});
