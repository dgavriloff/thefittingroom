import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedCardProps {
    width: number;
    height: number;
    topSectionHeight: number;
    middleSectionHeight: number;
    loading?: boolean;
    modelImage?: string;
    clothesImages?: string[];
    resultImage?: string;
    onPressModel?: never;
    onPressOutfit?: never;
}

export default function FeedCard({
    width,
    height,
    topSectionHeight,
    middleSectionHeight,
    loading = false,
    modelImage,
    clothesImages = [],
    resultImage,
}: FeedCardProps) {
    const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

    return (
        <View style={[styles.card, { width, height }]}>
            {/* Section 1: Large Square - Model or Result */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
                <View style={[styles.topSection, { height: topSectionHeight - 32 }, (activeTab === 'input' ? modelImage : resultImage) ? { borderWidth: 0 } : {}]}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#000000" />
                    ) : activeTab === 'input' ? (
                        modelImage ? (
                            <Image source={{ uri: modelImage }} style={styles.modelImage} />
                        ) : (
                            <MaterialIcons name="person" size={40} color="#000000" />
                        )
                    ) : (
                        resultImage ? (
                            <Image source={{ uri: resultImage }} style={styles.modelImage} />
                        ) : (
                            <Text style={styles.placeholderText}>result pending...</Text>
                        )
                    )}
                </View>
            </View>

            {/* Section 2: Middle Rectangle - Clothes or Actions */}
            <View style={[styles.middleSection, { height: middleSectionHeight }]}>
                {activeTab === 'input' ? (
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
                ) : (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionIcon}>
                            <MaterialIcons name="file-download" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon}>
                            <MaterialIcons name="share" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon}>
                            <MaterialIcons name="edit" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon}>
                            <MaterialIcons name="delete" size={28} color="#000000" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Navigation Slider */}
            <View style={styles.sliderContainer}>
                <TouchableOpacity
                    style={[styles.sliderButton, activeTab === 'input' && styles.activeSliderButton]}
                    onPress={() => setActiveTab('input')}
                >
                    <Text style={[styles.sliderText, activeTab === 'input' && styles.activeSliderText]}>input</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.sliderButton, activeTab === 'result' && styles.activeSliderButton]}
                    onPress={() => setActiveTab('result')}
                >
                    <Text style={[styles.sliderText, activeTab === 'result' && styles.activeSliderText]}>result</Text>
                </TouchableOpacity>
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
    sliderContainer: {
        flexDirection: 'row',
        backgroundColor: '#FDFBF7',
        margin: 16,
        marginTop: 0,
        borderRadius: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    sliderButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeSliderButton: {
        backgroundColor: '#000000',
    },
    sliderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    activeSliderText: {
        color: '#FFFFFF',
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
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        width: '100%',
        height: '100%',
    },
    actionIcon: {
        padding: 8,
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
