import { MaterialIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditorCardProps {
    width: number;
    height: number;
    topSectionHeight: number;
    middleSectionHeight: number;
    bottomSectionHeight: number;
    onPressModel: () => void;
    onPressOutfit: () => void;
    onPressTryOn: () => void;
    selectedModelImage?: string | null;
    selectedClothes?: { id: string; url: string }[];
    onRemoveModel: () => void;
    onRemoveClothes: (id: string) => void;
}

export default function EditorCard({
    width,
    height,
    topSectionHeight,
    middleSectionHeight,
    bottomSectionHeight,
    onPressModel,
    onPressOutfit,
    onPressTryOn,
    selectedModelImage,
    selectedClothes = [],
    onRemoveModel,
    onRemoveClothes,
}: EditorCardProps) {
    return (
        <View style={[styles.card, { width, height }]}>
            {/* Section 1: Large Square - Add Model Placeholder */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={[styles.topSection, { height: topSectionHeight - 32 }, selectedModelImage ? { borderWidth: 0 } : {}]}
                    onPress={onPressModel}
                    activeOpacity={selectedModelImage ? 1 : 0.2}
                >
                    {selectedModelImage ? (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Image source={{ uri: selectedModelImage }} style={styles.modelImage} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemoveModel()}
                            >
                                <MaterialIcons name="close" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <MaterialIcons name="add" size={40} color="#000000" />
                            <Text style={styles.placeholderText}>select model</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Section 2: Middle Rectangle with small cards */}
            <View style={[styles.middleSection, { height: middleSectionHeight }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.middleScrollContent}>
                    {selectedClothes.map((item, index) => (
                        <View key={item.id} style={[styles.smallCard, { borderWidth: 0, overflow: 'hidden' }]}>
                            <Image source={{ uri: item.url }} style={styles.modelImage} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemoveClothes(item.id)}
                            >
                                <MaterialIcons name="close" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {/* Add Outfit Placeholder */}
                    <TouchableOpacity
                        style={[styles.smallCard, styles.addSmallCard]}
                        onPress={onPressOutfit}
                    >
                        <MaterialIcons name="add" size={24} color="#000000" />
                        <Text style={styles.addSmallCardText}>add clothes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Section 3: Bottom Button */}
            <View style={[styles.bottomSection, { height: bottomSectionHeight }]}>
                <TouchableOpacity style={styles.actionButton} onPress={onPressTryOn}>
                    <Text style={styles.actionButtonText}>try it on!</Text>
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
    topSection: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1, // Full border
        borderColor: '#000000',
        borderStyle: 'dashed',
        borderRadius: 12, // Rounded corners
        width: '100%',
        overflow: 'hidden', // Ensure image stays within bounds
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
    bottomSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 0,
        justifyContent: 'center',
    },
    actionButton: {
        backgroundColor: '#000000',
        borderRadius: 12,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
});
