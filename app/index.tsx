import EditorCard from '@/components/EditorCard';
import FeedCard from '@/components/FeedCard';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function TabThreeScreen() {
  const { width } = useWindowDimensions();
  // Calculate card width for full width with padding
  const cardWidth = width - 32;

  // Section dimensions
  const topSectionHeight = cardWidth; // Square top section (minus padding handled in render)
  const middleSectionHeight = 200; // Bigger middle section
  const bottomSectionHeight = 64; // Further reduced height

  // Heights for different card types
  const editorCardHeight = topSectionHeight + middleSectionHeight + bottomSectionHeight - 16; // Adjust for removed padding
  const feedCardHeight = topSectionHeight + middleSectionHeight - 16 + 16; // Adjust for removed padding + extra padding at bottom since no button

  const gap = 24;

  // Dummy data for the cards
  const items = Array.from({ length: 10 }).map((_, i) => ({ id: i.toString(), title: `Post ${i + 1}` }));

  // Calculate snap offsets
  const snapOffsets = items.map((_, index) => {
    if (index === 0) {
      return 0;
    }
    // First card is EditorCard, rest are FeedCards
    // Offset = (Height of first card + gap) + (index - 1) * (Height of subsequent cards + gap)
    return (editorCardHeight + gap) + (index - 1) * (feedCardHeight + gap);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Edit', 'Edit feature coming soon!')}>
          <MaterialIcons name="edit" size={24} color="#BF360C" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => {
          if (index === 0) {
            return (
              <EditorCard
                key={item.id}
                width={cardWidth}
                height={editorCardHeight}
                topSectionHeight={topSectionHeight}
                middleSectionHeight={middleSectionHeight}
                bottomSectionHeight={bottomSectionHeight}
                onPressModel={() => router.push('/base-pictures')}
                onPressOutfit={() => router.push('/clothes')}
                onPressTryOn={() => Alert.alert('Try it on', `Trying on ${item.title}`)}
              />
            );
          } else {
            return (
              <FeedCard
                key={item.id}
                width={cardWidth}
                height={feedCardHeight}
                topSectionHeight={topSectionHeight}
                middleSectionHeight={middleSectionHeight}

              />
            );
          }
        })}
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
    flexDirection: 'column',
    padding: 16,
    gap: 24,
    paddingBottom: 50,
  },
});
