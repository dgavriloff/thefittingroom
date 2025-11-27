import EditorCard from '@/components/EditorCard';
import FeedCard from '@/components/FeedCard';
import { AspectRatio, generateImage } from '@/services/gemini';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { router, useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { FadeOut, interpolate, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function TabThreeScreen() {
  const { width, height } = useWindowDimensions();
  // Calculate card width for full width with padding
  const cardWidth = width - 32;
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedModelImage, setSelectedModelImage] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<{ id: string; url: string }[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [feedLoaded, setFeedLoaded] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [isProMode, setIsProMode] = useState(false);

  // Sidebar State
  const sidebarOpen = useSharedValue(0);
  const SIDEBAR_WIDTH = 250;

  const handleToggleSidebar = () => {
    sidebarOpen.value = withTiming(sidebarOpen.value === 0 ? 1 : 0, { duration: 300 });
  };

  const mainContentStyle = useAnimatedStyle(() => {
    const translateX = interpolate(sidebarOpen.value, [0, 1], [0, -SIDEBAR_WIDTH]);
    return {
      transform: [{ translateX }],
    };
  });

  const sidebarStyle = useAnimatedStyle(() => {
    const translateX = interpolate(sidebarOpen.value, [0, 1], [width, width - SIDEBAR_WIDTH]);
    return {
      transform: [{ translateX }],
    };
  });

  useEffect(() => {
    const loadFeedItems = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@feed_items');
        if (jsonValue != null) {
          const items = JSON.parse(jsonValue);
          // Sanitize loading state
          const sanitizedItems = items.map((item: any) => ({ ...item, loading: false }));
          setFeedItems(sanitizedItems);
        }
      } catch (e) {
        console.error('Failed to load feed items', e);
      } finally {
        setFeedLoaded(true);
      }
    };
    loadFeedItems();

    // Load Pro Mode setting
    const loadProMode = async () => {
      try {
        const value = await AsyncStorage.getItem('@pro_mode');
        if (value !== null) {
          setIsProMode(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to load pro mode', e);
      }
    };
    loadProMode();
  }, []);

  useEffect(() => {
    if (feedLoaded) {
      const saveFeedItems = async () => {
        try {
          await AsyncStorage.setItem('@feed_items', JSON.stringify(feedItems));
        } catch (e) {
          console.error('Failed to save feed items', e);
        }
      };
      saveFeedItems();
    }
  }, [feedItems, feedLoaded]);

  useFocusEffect(
    useCallback(() => {
      const loadSelectedModel = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@models');
          if (jsonValue != null) {
            const models = JSON.parse(jsonValue);
            const selected = models.find((m: any) => m.selected);
            setSelectedModelImage(selected ? selected.url : null);
          }
        } catch (e) {
          console.error('Failed to load selected model', e);
        }
      };
      const loadSelectedClothes = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@active_clothes');
          if (jsonValue != null) {
            const activeClothes = JSON.parse(jsonValue);
            setSelectedClothes(activeClothes);
          }
        } catch (e) {
          console.error('Failed to load selected clothes', e);
        }
      };
      loadSelectedModel();
      loadSelectedClothes();
    }, [])
  );

  const handleRemoveModel = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@models');
      if (jsonValue != null) {
        const models = JSON.parse(jsonValue);
        const newModels = models.map((m: any) => ({ ...m, selected: false }));
        await AsyncStorage.setItem('@models', JSON.stringify(newModels));
        setSelectedModelImage(null);
      }
    } catch (e) {
      console.error('Failed to remove model', e);
    }
  };

  const handleRemoveClothes = async (id: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem('@active_clothes');
      if (jsonValue != null) {
        const activeClothes = JSON.parse(jsonValue);
        const newActiveClothes = activeClothes.filter((item: any) => item.id !== id);
        await AsyncStorage.setItem('@active_clothes', JSON.stringify(newActiveClothes));
        setSelectedClothes(newActiveClothes);
      }
    } catch (e) {
      console.error('Failed to remove clothes', e);
    }
  };

  // Section dimensions
  const topSectionHeight = cardWidth; // Square top section (minus padding handled in render)
  const middleSectionHeight = 200; // Bigger middle section
  const bottomSectionHeight = 64; // Further reduced height

  // Heights for different card types
  const editorCardHeight = topSectionHeight + middleSectionHeight + bottomSectionHeight - 16; // Adjust for removed padding
  const feedCardHeight = topSectionHeight + middleSectionHeight - 16 + 16 + 50; // Adjust for removed padding + extra padding at bottom + slider height
  const gap = 24;

  // Calculate bottom spacer to allow the last card to be snapped to top
  // We want to be able to scroll enough so that the last card is at the top of the viewport.
  // Viewport height is roughly screen height - header height (approx 80) - top padding (50).
  // Let's be safe and use screen height - feedCardHeight - 100.
  const bottomSpacerHeight = Math.max(0, height - feedCardHeight - 150);

  // Calculate snap offsets
  const snapOffsets = [0, ...feedItems.map((_, index) => {
    // Offset = (Height of first card + gap) + (index) * (Height of subsequent cards + gap)
    return (editorCardHeight + gap) + index * (feedCardHeight + gap);
  })];

  const handleTryOn = async () => {
    if (!selectedModelImage || selectedClothes.length === 0) {
      Alert.alert('Incomplete', 'Please select a model and at least one item of clothing.');
      return;
    }

    const newId = Date.now().toString();
    const newItem = {
      id: newId,
      title: 'New Try On',
      modelImage: selectedModelImage,
      clothesImages: selectedClothes.map(c => c.url),
      loading: true,
      initialTab: 'result',
    };

    setFeedItems(prev => [newItem, ...prev]);

    // Clear editor
    // await AsyncStorage.removeItem('@models'); // DO NOT DELETE MODELS
    await AsyncStorage.removeItem('@active_clothes');

    // We need to update the underlying data for models to deselect them
    try {
      const jsonValue = await AsyncStorage.getItem('@models');
      if (jsonValue != null) {
        const models = JSON.parse(jsonValue);
        const newModels = models.map((m: any) => ({ ...m, selected: false }));
        await AsyncStorage.setItem('@models', JSON.stringify(newModels));
      }
    } catch (e) {
      console.error('Failed to clear model selection', e);
    }

    setSelectedModelImage(null);
    setSelectedClothes([]);

    // Scroll to the new item (index 1, which is the first feed item)
    // We need a slight delay to allow the layout to update
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: editorCardHeight + gap, animated: true });
    }, 100);

    // Call Gemini Service
    try {
      const prompt = `You are an expert virtual try-on AI. You will be given a 'model image' and 'garment image(s)'. Your task is to create a new photorealistic image where the person from the 'model image' is wearing the clothing from the 'garment image(s)'.

**Crucial Rules:**
1.  **Complete Garment Replacement:** You MUST completely REMOVE and REPLACE the clothing item(s) worn by the person in the 'model image' with the new garment. No part of the original clothing (e.g., collars, sleeves, patterns) should be visible in the final image.
2.  **Preserve the Model:** The person's face, hair, body shape, and pose from the 'model image' MUST remain unchanged.
3.  **Preserve the Background:** The entire background from the 'model image' MUST be preserved perfectly.
4.  **Apply the Garment:** Realistically fit the new garment onto the person. It should adapt to their pose with natural folds, shadows, and lighting consistent with the original scene.
5.  **Output:** Return ONLY the final, edited image with the full body, shoes to head, shown.`
      const images = [selectedModelImage, ...selectedClothes.map(c => c.url)];

      // Calculate Aspect Ratio
      let aspectRatio: AspectRatio = "1:1";
      if (selectedModelImage) {
        try {
          const { width, height } = await new Promise<{ width: number, height: number }>((resolve, reject) => {
            Image.getSize(selectedModelImage, (width, height) => resolve({ width, height }), reject);
          });
          const ratio = width / height;

          if (ratio > 1.5) aspectRatio = "16:9";
          else if (ratio > 1.15) aspectRatio = "4:3";
          else if (ratio > 0.85) aspectRatio = "1:1";
          else if (ratio > 0.65) aspectRatio = "3:4";
          else aspectRatio = "9:16";

          console.log(`Detected ratio: ${ratio}, using: ${aspectRatio}`);
        } catch (e) {
          console.warn("Failed to get image size", e);
        }
      }

      const modelName = isProMode ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      const result = await generateImage(prompt, images, aspectRatio, modelName);


      setFeedItems(prev => prev.map(item => item.id === newId ? {
        ...item,
        loading: false,
        resultImage: result.imageUrl
      } : item));
    } catch (error) {
      Alert.alert("Error", "Failed to generate image. Please try again.");
      setFeedItems(prev => prev.map(item => item.id === newId ? { ...item, loading: false } : item));
    }
  };

  const handleEdit = async (item: any) => {
    if (!item.modelImage) return;

    // 1. Set Original Model Image as Selected Model
    setSelectedModelImage(item.modelImage);

    // 2. Set Clothes
    // Reconstruct clothes objects from URLs. We'll generate temporary IDs.
    const clothes = item.clothesImages.map((url: string) => ({
      id: Date.now().toString() + Math.random().toString(), // Unique ID
      url: url
    }));
    setSelectedClothes(clothes);

    // 3. Update Persistence
    try {
      // Update active clothes
      await AsyncStorage.setItem('@active_clothes', JSON.stringify(clothes));

      // We don't necessarily need to save the "result model" to the persistent @models list 
      // unless we want it to show up in the "My Models" screen. 
      // For now, let's just keep it in the editor state. 
      // If we wanted to persist it as a selected model, we'd need to add it to @models.
      // Let's deselect all persistent models to reflect that we are using a temporary one.
      const jsonValue = await AsyncStorage.getItem('@models');
      if (jsonValue != null) {
        let models = JSON.parse(jsonValue);

        // Check if model exists
        const existingIndex = models.findIndex((m: any) => m.url === item.modelImage);

        if (existingIndex >= 0) {
          // Select existing
          models = models.map((m: any, index: number) => ({
            ...m,
            selected: index === existingIndex
          }));
        } else {
          // Add new and select
          const newModel = {
            id: Date.now().toString(),
            url: item.modelImage,
            selected: true
          };
          models = models.map((m: any) => ({ ...m, selected: false }));
          models.unshift(newModel);
        }

        await AsyncStorage.setItem('@models', JSON.stringify(models));
      }

    } catch (e) {
      console.error('Failed to update persistence for edit', e);
    }

    // 4. Scroll to Top
    scrollToTop();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setFeedItems(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const handleDownload = async (item: any) => {
    if (!item.resultImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Please grant permission to save images.");
        return;
      }

      const filename = FileSystem.documentDirectory + `fitting-room-${item.id}.png`;
      // If it's a data URI, we need to write it to a file first
      if (item.resultImage.startsWith('data:')) {
        const base64Code = item.resultImage.split('data:image/png;base64,')[1];
        await FileSystem.writeAsStringAsync(filename, base64Code, { encoding: FileSystem.EncodingType.Base64 });
        await MediaLibrary.saveToLibraryAsync(filename);
        Alert.alert("Saved", "Image saved to your gallery!");
      } else {
        // If it's already a file URI or remote URL (though we mostly have data URIs here)
        // For remote, we'd need downloadAsync. For now assuming data URI from Gemini.
        await MediaLibrary.saveToLibraryAsync(item.resultImage);
        Alert.alert("Saved", "Image saved to your gallery!");
      }
    } catch (error) {
      console.error("Download failed:", error);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShare = async (item: any) => {
    if (!item.resultImage) return;

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      const filename = FileSystem.documentDirectory + `my_outfit.png`;
      if (item.resultImage.startsWith('data:')) {
        const base64Code = item.resultImage.split('data:image/png;base64,')[1];
        await FileSystem.writeAsStringAsync(filename, base64Code, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(filename);
      } else {
        await Sharing.shareAsync(item.resultImage);
      }
    } catch (error) {
      console.error("Share failed:", error);
      Alert.alert("Error", "Failed to share image.");
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTopButton(offsetY > editorCardHeight / 2);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[{ flex: 1, paddingTop: 50 }, mainContentStyle]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>the fitting room</Text>
          </View>
          <TouchableOpacity onPress={handleToggleSidebar}>
            <MaterialIcons name="menu" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToOffsets={snapOffsets}
          snapToAlignment="start"
          snapToEnd={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <EditorCard
            key="editor"
            width={cardWidth}
            height={editorCardHeight}
            topSectionHeight={topSectionHeight}
            middleSectionHeight={middleSectionHeight}
            bottomSectionHeight={bottomSectionHeight}
            onPressModel={() => router.push('/base-pictures')}
            onPressOutfit={() => router.push('/clothes')}
            onPressTryOn={handleTryOn}
            selectedModelImage={selectedModelImage}
            selectedClothes={selectedClothes}
            onRemoveModel={handleRemoveModel}
            onRemoveClothes={handleRemoveClothes}
          />
          {feedItems.map((item) => (
            <Animated.View
              key={item.id}
              exiting={FadeOut}
              layout={LinearTransition.springify()}
            >
              <FeedCard
                width={cardWidth}
                height={feedCardHeight}
                topSectionHeight={topSectionHeight}
                middleSectionHeight={middleSectionHeight}
                loading={item.loading}
                modelImage={item.modelImage}
                clothesImages={item.clothesImages}
                resultImage={item.resultImage}
                initialTab={item.initialTab}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item.id)}
                onDownload={() => handleDownload(item)}
                onShare={() => handleShare(item)}
              />
            </Animated.View>
          ))}
          <View style={{ height: bottomSpacerHeight }} />
        </ScrollView>

      </Animated.View>

      <Animated.View style={[styles.sidebar, { height }, sidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Settings</Text>
          <TouchableOpacity onPress={handleToggleSidebar}>
            <MaterialIcons name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebarContent}>
          <View style={styles.sidebarItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <MaterialIcons name="flash-on" size={24} color="#000000" />
              <Text style={styles.sidebarItemText}>Pro Mode</Text>
            </View>
            <Switch
              value={isProMode}
              onValueChange={async (value) => {
                setIsProMode(value);
                try {
                  await AsyncStorage.setItem('@pro_mode', JSON.stringify(value));
                } catch (e) {
                  console.error('Failed to save pro mode', e);
                }
              }}
              trackColor={{ false: '#767577', true: '#000000' }}
              thumbColor={isProMode ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Info', 'Version 1.0.0')}>
            <MaterialIcons name="info-outline" size={24} color="#000000" />
            <Text style={styles.sidebarItemText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Help', 'Contact support')}>
            <MaterialIcons name="help-outline" size={24} color="#000000" />
            <Text style={styles.sidebarItemText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingTop: 0, // Moved to mainContent
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0, // Will be translated
    width: 250,
    backgroundColor: '#FDFBF7',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    paddingTop: 66,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  sidebarContent: {
    flex: 1,
    gap: 20,
    paddingBottom: 40,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarItemText: {
    fontSize: 18,
    color: '#000000',
  },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
    display: 'none',
  },
  grid: {
    flexDirection: 'column',
    padding: 16,
    gap: 24,
    paddingBottom: 50,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  floatingButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
