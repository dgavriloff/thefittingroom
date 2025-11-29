import ImageModal from '@/components/ImageModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeedCardProps {
    width: number;
    height: number;
    topSectionHeight: number;
    middleSectionHeight: number;
    loading?: boolean;
    modelImage?: string;
    clothesImages?: string[];
    resultImage?: string;
    initialTab?: 'input' | 'result';
    onEdit?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    onShare?: () => void;
    onPressModel?: never;
    onPressOutfit?: never;
    estimatedDuration?: number;
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
    initialTab = 'input',
    estimatedDuration = 10000, // Default 10s
    onEdit,
    onDelete,
    onDownload,
    onShare,
}: FeedCardProps) {
    const [activeTab, setActiveTab] = useState<'input' | 'result'>(initialTab);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('visualizing...');

    useEffect(() => {
        if (loading) {
            setProgress(0);

            // Randomize loading message
            const messages = ['visualizing...', 'fitting clothes...', 'trying on clothes...'];
            setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);

            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) return 95; // Cap at 95% until done

                    // Non-linear progress:
                    // Base increment for linear progress
                    const baseIncrement = 100 / (estimatedDuration / 100);

                    // Random factor between 0.1 and 3.0
                    // This makes it sometimes slow (0.1x) and sometimes fast (3x)
                    const randomFactor = Math.random() * 2.9 + 0.1;

                    return prev + baseIncrement * randomFactor;
                });
            }, 100);

            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [loading, estimatedDuration]);

    const handleImagePress = (uri: string) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    return (
        <View style={[styles.card, { width, height }]}>
            <ImageModal
                visible={modalVisible}
                imageUrl={selectedImage}
                onClose={() => setModalVisible(false)}
            />
            {/* Section 1: Large Square - Model or Result */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
                <View style={[styles.topSection, { height: topSectionHeight - 32 }, (activeTab === 'input' ? modelImage : resultImage) ? { borderWidth: 0 } : {}]}>
                    {activeTab === 'input' ? (
                        modelImage ? (
                            <TouchableOpacity onPress={() => handleImagePress(modelImage)} style={{ width: '100%', height: '100%' }} activeOpacity={1}>
                                <Image source={{ uri: modelImage }} style={styles.modelImage} />
                            </TouchableOpacity>
                        ) : (
                            <MaterialIcons name="person" size={40} color="#000000" />
                        )
                    ) : (
                        loading ? (
                            <View style={{ alignItems: 'center', gap: 10, width: '80%' }}>
                                <Text style={styles.progressText}>{loadingMessage} {Math.round(progress)}%</Text>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                                </View>
                            </View>
                        ) : resultImage ? (
                            <TouchableOpacity onPress={() => handleImagePress(resultImage)} style={{ width: '100%', height: '100%' }} activeOpacity={1}>
                                <Image source={{ uri: resultImage }} style={styles.modelImage} />
                            </TouchableOpacity>
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
                                <TouchableOpacity onPress={() => handleImagePress(uri)} style={{ width: '100%', height: '100%' }} activeOpacity={1}>
                                    <Image source={{ uri }} style={styles.modelImage} />
                                </TouchableOpacity>
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
                        <TouchableOpacity style={styles.actionIcon} onPress={onDownload}>
                            <MaterialIcons name="file-download" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon} onPress={onShare}>
                            <MaterialIcons name="share" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon} onPress={onEdit}>
                            <MaterialIcons name="edit" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon} onPress={onDelete}>
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
        backgroundColor: '#FFFFFF',
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
        resizeMode: 'contain',
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
        gap: 16,
        width: '100%',
        height: '100%',
    },
    actionIcon: {
        padding: 12,
        backgroundColor: '#FDFBF7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    smallCard: {
        width: 160,
        height: 160,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
    },
    addSmallCard: {
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#000000',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});
