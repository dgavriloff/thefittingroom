import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const STORAGE_KEY = '@outfits';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { width } = useWindowDimensions();
  const cardWidth = (width - 32 - 16) / 2;

  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveImages(images);
    }
  }, [images, loading]);

  const loadImages = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const loadedImages = JSON.parse(jsonValue);
        // Reset selection on load
        const resetImages = loadedImages.map((img: any) => ({ ...img, selected: false }));
        setImages(resetImages);
      } else {
        // Initial dummy data - Copy to FileSystem
        const seedDefaults = async () => {
          const defaults = [
            {
              id: 'default-pink-slacks',
              asset: require('@/assets/images/default-clothes/pink-slacks.jpg'),
              filename: 'default-pink-slacks.jpg'
            },
            {
              id: 'default-tweed-jacket',
              asset: require('@/assets/images/default-clothes/tweed-jacket.jpg'),
              filename: 'default-tweed-jacket.jpg'
            },
            {
              id: 'default-image',
              asset: require('@/assets/images/default-clothes/image.png'),
              filename: 'default-image.png'
            },
            {
              id: 'default-screenshot',
              asset: require('@/assets/images/default-clothes/Screenshot 2025-11-26 142716.png'),
              filename: 'default-screenshot.png'
            },
          ];

          const newImages = [];

          for (const item of defaults) {
            try {
              const assetUri = Image.resolveAssetSource(item.asset).uri;
              const targetUri = `${FileSystem.documentDirectory}${item.filename}`;

              // Check if file exists, if not copy it
              const fileInfo = await FileSystem.getInfoAsync(targetUri);
              if (!fileInfo.exists) {
                await FileSystem.downloadAsync(assetUri, targetUri);
              }

              newImages.push({
                id: item.id,
                url: targetUri,
                selected: false,
              });
            } catch (e) {
              console.error(`Failed to seed default ${item.id}`, e);
            }
          }

          setImages(newImages);
          saveImages(newImages);
        };

        await seedDefaults();
      }
    } catch (e) {
      console.error('Failed to load images', e);
    } finally {
      setLoading(false);
    }
  };

  const saveImages = async (value: any[]) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save images', e);
    }
  };

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'images',
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Library permission is required to select photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsMultipleSelection: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          id: Date.now().toString() + Math.random().toString(), // Ensure unique ID
          url: asset.uri,
          selected: false,
        }));
        setImages((prev) => [...newImages, ...prev]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleAddPress = () => {
    Alert.alert(
      'Add Photo',
      'Choose a photo source',
      [
        {
          text: 'Camera',
          onPress: () => pickImage(true),
        },
        {
          text: 'Library',
          onPress: () => pickImage(false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSelect = (id: string) => {
    if (isEditing) return;
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, selected: !img.selected } : img))
    );
  };

  const handleConfirm = async () => {
    try {
      const selectedItems = images.filter((img) => img.selected).map((img) => ({ id: img.id, url: img.url }));
      if (selectedItems.length > 0) {
        const jsonValue = await AsyncStorage.getItem('@active_clothes');
        const currentActive = jsonValue != null ? JSON.parse(jsonValue) : [];
        // Avoid duplicates if needed, or just append. Assuming append for now but filtering by ID is safer.
        const newActive = [...currentActive, ...selectedItems.filter((item: any) => !currentActive.some((ca: any) => ca.id === item.id))];
        await AsyncStorage.setItem('@active_clothes', JSON.stringify(newActive));
      }
      router.back();
    } catch (e) {
      console.error('Failed to save active clothes', e);
    }
  };

  const hasSelection = images.some((img) => img.selected);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>my clothes</Text>
          <Text style={styles.subtitle}>select photo(s) of clothes to try on</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <MaterialIcons name={isEditing ? "close" : "edit"} size={28} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} disabled={!hasSelection}>
            <MaterialIcons name="check-circle" size={32} color={hasSelection ? "#10B981" : "#E5E5E5"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        <Animated.View layout={Layout.springify()} style={{ width: cardWidth }}>
          <TouchableOpacity style={[styles.card, styles.addCard, { width: '100%' }]} onPress={handleAddPress}>
            <View style={styles.addIconContainer}>
              <MaterialIcons name="add" size={32} color="#000000" />
            </View>
            <Text style={styles.addText}>add new</Text>
          </TouchableOpacity>
        </Animated.View>

        {images.map((image) => (
          <Animated.View
            key={image.id}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout.springify()}
            style={[styles.card, image.selected && styles.selectedCard, { width: cardWidth }]}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelect(image.id)}>
              <Image source={{ uri: image.url }} style={styles.image} />
              {image.selected && (
                <View style={styles.checkIconContainer}>
                  <MaterialIcons name="check" size={18} color="#FDFBF7" />
                </View>
              )}
            </TouchableOpacity>
            {isEditing && (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.deleteButton}>
                <TouchableOpacity
                  style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => handleDelete(image.id)}
                >
                  <MaterialIcons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingTop: 50, // Added padding for status bar since header is hidden
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  card: {
    // width is now set dynamically
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  addCard: {
    backgroundColor: 'rgba(253, 251, 247, 0.5)',
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    backgroundColor: '#F7B8C4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
