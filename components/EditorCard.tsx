import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditorCardProps {
    width: number;
    height: number;
    topSectionHeight: number;
    middleSectionHeight: number;
    bottomSectionHeight: number;
    onPressModel: () => void;
    onPressOutfit: () => void;
    onPressTryOn: () => void;
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
}: EditorCardProps) {
    return (
        <View style={[styles.card, { width, height }]}>
            {/* Section 1: Large Square - Add Model Placeholder */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
                <TouchableOpacity
                    style={[styles.topSection, { height: topSectionHeight - 32 }]}
                    onPress={onPressModel}
                >
                    <MaterialIcons name="add" size={40} color="#BF360C" />
                    <Text style={styles.placeholderText}>Select Model</Text>
                </TouchableOpacity>
            </View>

            {/* Section 2: Middle Rectangle with small cards */}
            <View style={[styles.middleSection, { height: middleSectionHeight }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.middleScrollContent}>
                    {/* Add Outfit Placeholder */}
                    <TouchableOpacity
                        style={[styles.smallCard, styles.addSmallCard]}
                        onPress={onPressOutfit}
                    >
                        <MaterialIcons name="add" size={24} color="#BF360C" />
                        <Text style={styles.addSmallCardText}>Add Clothes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Section 3: Bottom Button */}
            <View style={[styles.bottomSection, { height: bottomSectionHeight }]}>
                <TouchableOpacity style={styles.actionButton} onPress={onPressTryOn}>
                    <Text style={styles.actionButtonText}>Try it on</Text>
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
        borderColor: '#FFAB91',
        shadowColor: '#BF360C',
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
        borderColor: '#FFAB91',
        borderStyle: 'dashed',
        borderRadius: 12, // Rounded corners
        width: '100%',
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#BF360C',
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
        backgroundColor: '#FBE9E7',
        borderWidth: 1,
        borderColor: '#FFAB91',
    },
    addSmallCard: {
        backgroundColor: '#FDFBF7',
        borderColor: '#FFAB91',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    addSmallCardText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#BF360C',
        textAlign: 'center',
    },
    bottomSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 0,
        justifyContent: 'center',
    },
    actionButton: {
        backgroundColor: '#D84315',
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
});
