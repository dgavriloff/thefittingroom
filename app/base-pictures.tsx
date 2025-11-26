import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

const STORAGE_KEY = '@models';

export default function TabOneScreen() {
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
        setImages(JSON.parse(jsonValue));
      } else {
        // Initial dummy data
        setImages([]);
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
          allowsEditing: true,
          aspect: [3, 4],
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Base Pictures</Text>
          <Text style={styles.subtitle}>Select a picture to build your outfit on.</Text>
        </View>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons name={isEditing ? "close" : "edit"} size={24} color="#BF360C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        <Animated.View layout={Layout.springify()} style={{ width: cardWidth }}>
          <TouchableOpacity style={[styles.card, styles.addCard, { width: '100%' }]} onPress={handleAddPress}>
            <View style={styles.addIconContainer}>
              <MaterialIcons name="add" size={32} color="#BF360C" />
            </View>
            <Text style={styles.addText}>Add New</Text>
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
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
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
    color: '#BF360C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E64A19',
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
    borderColor: '#FFAB91',
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
    color: '#BF360C',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#D84315',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D84315',
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
});
