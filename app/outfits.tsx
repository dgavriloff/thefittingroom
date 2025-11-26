import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        setImages(JSON.parse(jsonValue));
      } else {
        // Initial dummy data
        setImages([
          {
            id: '1',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGi-H0yawJ1DrRhM9DwMCYuSiawKnx4wjG6XkjGLGPdTI8lb_lnInrCpb6ELiCUCU3QZt9EMe-dwCl2I4mHsPyq_TRqE6cqlSUlZEebwVD76c1RCdEdFVbXl0CJnp6_9rm4Wv_sGUIS_rIUyMBzUbfGeVJrwx3NodQ1XlYiUZMq8VUJIOEm7a-cx5vLNRwyweEVIPxx3Sg3ZKrhwC6vNFItvY9ID4eji1KtDaXXNTz1duhjQZRcsaq-86dp1ftTCRwsQizMldtQwI',
            selected: true,
          },
          {
            id: '2',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbTgQ3Ajl-IBlGzigmw_kyfXWDqNzD41gDIymY0BpDNQOXEeSR7G4ENMbjEgGrN4wzmyE2NWWKzky8965YRzMbEgZl903w_vY5ro4TerExDIk2OkLFgz5kOqmT9KNfMBR6ejh5-ZVMGfBP6UaaQ6ozhWMsXbf-ifQyGMztt7kn6vIHx55EGRmQnx0XH_Lc3OI3s4liMnmp0fug8AvoNuxMXijnDBwVfoy-A95mtLAprWNKBr_CMF9LFFWaB1pAotU3lanJWkykt4I',
          },
          {
            id: '3',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALxN7vYutWLeAA5axhF43XnBKbX9dEgTTI8WBv8705HjbpAAVWohZcq97_UalGrRIEPsgfa4AcceMwKD06ONA0whCHmcjkNtq1GJKBp6TLNCw3zHmLGBDT0nPA6KFekLkwYGUpheKrD-fTFzo1fnXAcG3vY5z4T90O4bgczHAGCeHz6BNECWI6vLdJgq8ZZikwS_o7maNIxIbBf69H9wk_BZ5aaLS17PX5f8IE2r9pyEVntUBGCWdFPkov6Wr2msOFGy6wUlXvSk8',
          },
          {
            id: '4',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHUDpS8c_mqme41wSF7cEvq5xQHqQRx4QJrWZ6cxF07zkZR1VxjtmElf4LJx6-PsE-Z0ZkeH0fNONxeahDIllcE5NptSvw3PuS4Dw5ccCJrmtC30_UvyhUW2sAlJIgqag_u7j_ZF_YKDXy2R6Ww8YOXvyDO4T9Zb8HqwXXjTylygyEb9q_m9dPpGv1Lb_kB_46ij0B0Iu2q_2KfGq3ZF0d4Ah9uCuDK2At90U7RgtkCCqyAuEjvh4pCX1-gWlGPweJUg6AyT81yPM',
          },
          {
            id: '5',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDUZeGsCxoA-tE_U6LaiFk1--HpSuXB2qhdLwu8NqKkD3-KgeAzYSJgytGFUv87VwsLv_geKsQLolYuzhFo0XlHaLu-OzqU06WNBrvCDqnBVgMFAL9iDznSz4KdW7fGgHWHrWPU6qtP8D3if16qU2bH6q11AQHVQT5B81dxtkEcre-1K5z2TOjZkbvrqJiGYbBobFAlnpsEXvZFsz73l6zrKSpy4kF1NMXAh59PRPTNsaBMB5LRaRe0AaseILy4Arkz0hHfBqj0s',
          },
        ]);
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

  const handleSelect = (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, selected: !img.selected } : img))
    );
  };

  const hasSelection = images.some((img) => img.selected);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color="#5C2B34" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>My Outfits</Text>
          <Text style={styles.subtitle}>Select an outfit to view or edit.</Text>
        </View>
        <TouchableOpacity onPress={() => hasSelection && router.back()}>
          <MaterialIcons name="check-circle" size={28} color={hasSelection ? "#10B981" : "#D1D5DB"} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        <Animated.View layout={Layout.springify()} style={{ width: cardWidth }}>
          <TouchableOpacity style={[styles.card, styles.addCard, { width: '100%' }]} onPress={handleAddPress}>
            <View style={styles.addIconContainer}>
              <MaterialIcons name="add" size={32} color="#5C2B34" />
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
            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelect(image.id)}>
              <Image source={{ uri: image.url }} style={styles.image} />
              {image.selected && (
                <View style={styles.checkIconContainer}>
                  <MaterialIcons name="check" size={18} color="#5C2B34" />
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
    backgroundColor: '#FFF7F8',
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
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: 'rgba(255, 247, 248, 0.5)',
    borderWidth: 2,
    borderColor: '#FBCFE8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F7B8C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#F7B8C4',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F7B8C4',
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
