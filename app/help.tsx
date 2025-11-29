import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
    const handleContactSupport = () => {
        Linking.openURL('mailto:denis.gavriloff@gmail.com');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Help & Support</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="close" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How to use</Text>
                    <Text style={styles.text}>
                        1. Select a model from your "my models" list or add a new one.
                    </Text>
                    <Text style={styles.text}>
                        2. Add clothes by selecting them or taking a photo.
                    </Text>
                    <Text style={styles.text}>
                        3. Press "try it on!" to generate your new look.
                    </Text>
                    <Text style={styles.text}>
                        4. Use the "Pro Mode" in settings for higher quality results.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FAQ</Text>
                    <View style={styles.faqItem}>
                        <Text style={styles.question}>Is my data safe?</Text>
                        <Text style={styles.answer}>Yes, your photos are processed securely and are stored locally on your device.</Text>
                    </View>
                    <View style={styles.faqItem}>
                        <Text style={styles.question}>How do I delete a model?</Text>
                        <Text style={styles.answer}>Go to "my models", tap the pencil, and select the model you want to delete.</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
                    <MaterialIcons name="email" size={24} color="#FFFFFF" />
                    <Text style={styles.contactButtonText}>Contact Support</Text>
                </TouchableOpacity>
            </ScrollView>
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
        marginBottom: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
    },
    content: {
        gap: 30,
        paddingBottom: 40,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: '#000000',
        lineHeight: 24,
    },
    faqItem: {
        gap: 4,
        marginBottom: 10,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    answer: {
        fontSize: 16,
        color: '#444444',
        lineHeight: 22,
    },
    contactButton: {
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10,
        marginTop: 20,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
