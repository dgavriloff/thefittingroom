import EditorCard from '@/components/EditorCard';
import FeedCard from '@/components/FeedCard';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function TabThreeScreen() {
  const { width, height } = useWindowDimensions();
  // Calculate card width for full width with padding
  const cardWidth = width - 32;
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedModelImage, setSelectedModelImage] = useState<string | null>(null);
  const [selectedClothes, setSelectedClothes] = useState<{ id: string; url: string }[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [feedLoaded, setFeedLoaded] = useState(false);

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
  const feedCardHeight = topSectionHeight + middleSectionHeight - 16 + 16; // Adjust for removed padding + extra padding at bottom since no button
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

    // Simulate processing
    setTimeout(() => {
      setFeedItems(prev => prev.map(item => item.id === newId ? { ...item, loading: false } : item));
    }, 20);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>your fitting room</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Settings', 'Settings coming soon!')}>
          <MaterialIcons name="settings" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.grid}
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
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
          <FeedCard
            key={item.id}
            width={cardWidth}
            height={feedCardHeight}
            topSectionHeight={topSectionHeight}
            middleSectionHeight={middleSectionHeight}
            loading={item.loading}
            modelImage={item.modelImage}
            clothesImages={item.clothesImages}
          />
        ))}
        <View style={{ height: bottomSpacerHeight }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingTop: 50,
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
});
