import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from 'react-native';

interface FeedCardProps {
    width: number;
    height: number;
    topSectionHeight: number;
    middleSectionHeight: number;
    loading?: boolean;
    modelImage?: string;
    clothesImages?: string[];
    onPressModel?: never;
    onPressOutfit?: never;
}

export default function FeedCard({
    width,
    height,
    topSectionHeight,
    middleSectionHeight,
    loading,
    modelImage,
    clothesImages = [],
}: FeedCardProps) {
    return (
        <View style={[styles.card, { width, height }]}>
            {/* Section 1: Large Square - Add Model Placeholder */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
                <View style={[styles.topSection, { height: topSectionHeight - 32 }, modelImage ? { borderWidth: 0 } : {}]}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#000000" />
                    ) : modelImage ? (
                        <Image source={{ uri: modelImage }} style={styles.modelImage} />
                    ) : (
                        <MaterialIcons name="person" size={40} color="#000000" />
                    )}
                </View>
            </View>

            {/* Section 2: Middle Rectangle with small cards */}
            <View style={[styles.middleSection, { height: middleSectionHeight }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.middleScrollContent}>
                    {clothesImages.map((uri, index) => (
                        <View key={index} style={[styles.smallCard, { borderWidth: 0, overflow: 'hidden' }]}>
                            <Image source={{ uri }} style={styles.modelImage} />
                        </View>
                    ))}
                    {!loading && clothesImages.length === 0 && (
                        <View style={[styles.smallCard, styles.placeholderCard]}>
                            <MaterialIcons name="checkroom" size={24} color="#000000" />
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    topSection: {
        backgroundColor: '#FDFBF7',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1, // Full border
        borderColor: '#000000',
        borderStyle: 'dashed',
        borderRadius: 12, // Rounded corners
        width: '100%',
        overflow: 'hidden',
    },
    modelImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    middleSection: {
        justifyContent: 'center',
    },
    middleScrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 12,
    },
    smallCard: {
        width: 160,
        height: 160,
        borderRadius: 8,
        backgroundColor: '#FDFBF7',
        borderWidth: 1,
        borderColor: '#000000',
    },
    addSmallCard: {
        backgroundColor: '#FDFBF7',
        borderColor: '#000000',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    addSmallCardText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    placeholderCard: {
        backgroundColor: '#FDFBF7',
        borderColor: '#000000',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
