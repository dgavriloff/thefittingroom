import { MaterialIcons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabThreeScreen() {
  const { width } = useWindowDimensions();
  // Calculate card width for full width with padding
  const cardWidth = width - 32;

  // Section dimensions
  const topSectionHeight = cardWidth; // Square top section (minus padding handled in render)
  const middleSectionHeight = 200; // Bigger middle section
  const bottomSectionHeight = 80;

  const cardHeight = topSectionHeight + middleSectionHeight + bottomSectionHeight;
  const gap = 24;

  // Dummy data for the cards
  const items = Array.from({ length: 10 }).map((_, i) => ({ id: i.toString(), title: `Post ${i + 1}` }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Edit', 'Edit feature coming soon!')}>
          <MaterialIcons name="edit" size={24} color="#5C2B34" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        snapToInterval={cardHeight + gap}
        decelerationRate="fast"
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.id} style={[styles.card, { width: cardWidth, height: cardHeight }]}>
            {/* Section 1: Large Square - Add Model Placeholder */}
            <View style={{ padding: 16 }}>
              <TouchableOpacity
                style={[styles.topSection, { height: topSectionHeight - 32 }]}
                onPress={() => Alert.alert('Select Model', 'Choose a model for this post')}
              >
                <MaterialIcons name="add" size={40} color="#5C2B34" />
                <Text style={styles.placeholderText}>Select Model</Text>
              </TouchableOpacity>
            </View>

            {/* Section 2: Middle Rectangle with small cards */}
            <View style={[styles.middleSection, { height: middleSectionHeight }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.middleScrollContent}>
                {/* Add Outfit Placeholder */}
                <TouchableOpacity
                  style={[styles.smallCard, styles.addSmallCard]}
                  onPress={() => Alert.alert('Choose Outfit', 'Select an outfit to add')}
                >
                  <MaterialIcons name="add" size={24} color="#5C2B34" />
                  <Text style={styles.addSmallCardText}>Add Clothes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Section 3: Bottom Button */}
            <View style={[styles.bottomSection, { height: bottomSectionHeight }]}>
              <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Try it on', `Trying on ${item.title}`)}>
                <Text style={styles.actionButtonText}>Try it on</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F8',
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
    flexDirection: 'column',
    padding: 16,
    gap: 24,
    paddingBottom: 50,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FBCFE8',
    shadowColor: '#5C2B34',
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
    backgroundColor: '#FFF7F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Full border
    borderColor: '#FBCFE8',
    borderStyle: 'dashed',
    borderRadius: 12, // Rounded corners
    width: '100%',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C2B34',
  },
  middleSection: {
    justifyContent: 'center',
    // paddingVertical removed to fix spacing issues
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
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addSmallCard: {
    backgroundColor: '#FFF7F8',
    borderColor: '#FBCFE8',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Add gap for icon and text
  },
  addSmallCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C2B34',
    textAlign: 'center',
  },
  bottomSection: {
    padding: 16,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#F7B8C4',
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
