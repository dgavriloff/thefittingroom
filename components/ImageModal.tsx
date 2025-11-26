import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageModalProps {
    visible: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export default function ImageModal({ visible, imageUrl, onClose }: ImageModalProps) {
    const translateY = useSharedValue(0);

    const resetModal = () => {
        translateY.value = 0;
    };

    const handleClose = () => {
        onClose();
        // Reset after a delay to ensure it's hidden
        setTimeout(resetModal, 300);
    };

    const pan = Gesture.Pan()
        .onChange((event) => {
            if (event.translationY > 0) {
                translateY.value = event.translationY;
            }
        })
        .onFinalize((event) => {
            if (event.translationY > 100) {
                translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
                    runOnJS(handleClose)();
                });
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [0, 200],
            [1, 0.5],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY: translateY.value }],
            opacity: opacity,
        };
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [0, SCREEN_HEIGHT / 2],
            [0.9, 0],
            Extrapolation.CLAMP
        );

        return {
            backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        };
    });

    if (!imageUrl) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View style={[styles.container, backgroundStyle]}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <MaterialIcons name="close" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                    <GestureDetector gesture={pan}>
                        <Animated.View style={[styles.imageContainer, animatedStyle]}>
                            <Animated.Image
                                source={{ uri: imageUrl }}
                                style={styles.image}
                            />
                        </Animated.View>
                    </GestureDetector>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 48,
        right: 24,
        zIndex: 1,
        padding: 8,
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
});
