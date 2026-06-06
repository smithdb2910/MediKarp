import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { loadMedicines, saveMedicines } from '../utils/storage';
import { cancelReminder } from '../utils/notifications';

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  orange:      '#FF6B2B',
  orangeLight: '#FF8C55',
  orangeDim:   '#FFF0E8',
  dark:        '#1A1A1A',
  charcoal:    '#2D2D2D',
  grey:        '#6B6B6B',
  greyLight:   '#E8E8E8',
  white:       '#FFFFFF',
  offWhite:    '#F7F7F7',
  red:         '#E53935',
  redDim:      '#FDECEA',
};

function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function HomeScreen({ navigation }) {
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async () => {
    const data = await loadMedicines();
    setMedicines(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMedicines);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (medicine) => {
    Alert.alert(
      'Remove Medicine',
      `Remove "${medicine.name}" and its reminder?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await cancelReminder(medicine.notificationId);
            const updated = medicines.filter((m) => m.id !== medicine.id);
            await saveMedicines(updated);
            setMedicines(updated);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* orange left accent bar */}
      <View style={styles.cardAccent} />
      <View style={styles.cardLeft}>
        <Text style={styles.medicineName}>{item.name}</Text>
        {item.dosage ? <Text style={styles.dosage}>{item.dosage}</Text> : null}
        <Text style={styles.time}>⏰  {formatTime(item.time)}</Text>
        {item.notes ? <Text style={styles.notes}>📝  {item.notes}</Text> : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddMedicine', { medicine: item })}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={C.dark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🐟 MediKarp</Text>
          <Text style={styles.headerSub}>Your daily medicine tracker</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{medicines.length}</Text>
          <Text style={styles.headerBadgeLabel}>active</Text>
        </View>
      </View>

      {medicines.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🐟</Text>
          <Text style={styles.emptyTitle}>No medicines yet</Text>
          <Text style={styles.emptyText}>
            MediKarp is ready to help! Tap below to add your first medicine reminder.
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedicine', { medicine: null })}
      >
        <Text style={styles.addButtonText}>＋  Add Medicine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },

  header: {
    backgroundColor: C.dark,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: C.white },
  headerSub:   { fontSize: 14, color: '#AAAAAA', marginTop: 2 },
  headerBadge: {
    backgroundColor: C.orange,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerBadgeText:  { fontSize: 22, fontWeight: 'bold', color: C.white },
  headerBadgeLabel: { fontSize: 11, color: C.white, opacity: 0.85 },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon:  { fontSize: 72, marginBottom: 18 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: C.dark, marginBottom: 10 },
  emptyText:  { fontSize: 16, color: C.grey, textAlign: 'center', lineHeight: 24 },

  list: { padding: 16, paddingBottom: 110 },

  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
  },
  cardAccent: { width: 5, backgroundColor: C.orange },
  cardLeft: { flex: 1, padding: 16 },
  medicineName: { fontSize: 20, fontWeight: 'bold', color: C.dark, marginBottom: 4 },
  dosage:       { fontSize: 15, color: C.grey, marginBottom: 4 },
  time:         { fontSize: 16, color: C.orange, fontWeight: '700', marginBottom: 2 },
  notes:        { fontSize: 13, color: '#999', marginTop: 4 },

  cardActions: { alignItems: 'center', justifyContent: 'center', paddingRight: 14, gap: 8 },
  editBtn: {
    backgroundColor: C.orangeDim,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editBtnText:  { color: C.orange, fontSize: 14, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: C.redDim,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  deleteBtnText: { color: C.red, fontSize: 16, fontWeight: 'bold' },

  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: C.orange,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: C.orange,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  addButtonText: { color: C.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
});
