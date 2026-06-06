import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { loadMedicines, saveMedicines } from '../utils/storage';
import { scheduleReminder, cancelReminder } from '../utils/notifications';

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
};

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function AddMedicineScreen({ navigation, route }) {
  const editing = route.params?.medicine || null;

  const [name,   setName]   = useState(editing?.name   || '');
  const [dosage, setDosage] = useState(editing?.dosage || '');
  const [notes,  setNotes]  = useState(editing?.notes  || '');
  const [hour,   setHour]   = useState(editing ? Number(editing.time.split(':')[0]) : 8);
  const [minute, setMinute] = useState(editing ? Number(editing.time.split(':')[1]) : 0);
  const [saving, setSaving] = useState(false);

  const adjustHour   = (d) => setHour((h)   => (h + d + 24) % 24);
  const adjustMinute = (d) => setMinute((m)  => (m + d + 60) % 60);

  const ampm        = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the medicine name.');
      return;
    }
    setSaving(true);
    try {
      const medicines = await loadMedicines();
      const timeStr   = `${pad(hour)}:${pad(minute)}`;

      if (editing) {
        await cancelReminder(editing.notificationId);
        const updated = { ...editing, name: name.trim(), dosage: dosage.trim(), notes: notes.trim(), time: timeStr };
        updated.notificationId = await scheduleReminder(updated);
        await saveMedicines(medicines.map((m) => (m.id === editing.id ? updated : m)));
      } else {
        const newMed = {
          id: Date.now().toString(),
          name: name.trim(),
          dosage: dosage.trim(),
          notes: notes.trim(),
          time: timeStr,
          createdAt: new Date().toISOString(),
        };
        newMed.notificationId = await scheduleReminder(newMed);
        await saveMedicines([...medicines, newMed]);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Could not save. Please try again.');
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>

          <Text style={styles.screenTitle}>
            {editing ? '✏️  Edit Medicine' : '➕  New Medicine'}
          </Text>

          {/* ── Fields ──────────────────────────────────────────────── */}
          <Text style={styles.label}>Medicine Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Metformin, Aspirin..."
            placeholderTextColor="#BBBBBB"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>Dosage (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500mg, 1 tablet..."
            placeholderTextColor="#BBBBBB"
            value={dosage}
            onChangeText={setDosage}
            returnKeyType="next"
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="e.g. Take after meals..."
            placeholderTextColor="#BBBBBB"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          {/* ── Time picker ─────────────────────────────────────────── */}
          <Text style={styles.label}>Reminder Time</Text>
          <View style={styles.timePicker}>

            {/* Hours */}
            <View style={styles.timeColumn}>
              <TouchableOpacity style={styles.arrow} onPress={() => adjustHour(1)}>
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{pad(displayHour)}</Text>
              <TouchableOpacity style={styles.arrow} onPress={() => adjustHour(-1)}>
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.timeSep}>:</Text>

            {/* Minutes */}
            <View style={styles.timeColumn}>
              <TouchableOpacity style={styles.arrow} onPress={() => adjustMinute(5)}>
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{pad(minute)}</Text>
              <TouchableOpacity style={styles.arrow} onPress={() => adjustMinute(-5)}>
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* AM/PM */}
            <View style={styles.timeColumn}>
              <TouchableOpacity style={styles.ampmBtn} onPress={() => setHour((h) => (h + 12) % 24)}>
                <Text style={styles.ampmText}>{ampm}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.timeHint}>
            🔔  Reminder fires daily at {pad(displayHour)}:{pad(minute)} {ampm}
          </Text>

          {/* ── Save button ─────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving...' : editing ? '✓  Update Medicine' : '✓  Add Reminder'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
  scroll:    { padding: 20, paddingBottom: 48 },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: C.dark,
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: C.charcoal,
    marginBottom: 8,
    marginTop: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: C.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: C.dark,
    borderWidth: 1.5,
    borderColor: C.greyLight,
  },
  notesInput: { height: 90, textAlignVertical: 'top' },

  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.greyLight,
    justifyContent: 'center',
    gap: 8,
  },
  timeColumn: { alignItems: 'center', minWidth: 60 },
  arrow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: C.orangeDim,
    borderRadius: 10,
    marginVertical: 4,
  },
  arrowText:  { fontSize: 18, color: C.orange, fontWeight: 'bold' },
  timeValue:  { fontSize: 38, fontWeight: 'bold', color: C.dark, marginVertical: 4 },
  timeSep:    { fontSize: 38, fontWeight: 'bold', color: C.dark, paddingBottom: 4 },
  ampmBtn: {
    backgroundColor: C.orange,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  ampmText:  { fontSize: 20, fontWeight: 'bold', color: C.white },
  timeHint:  { fontSize: 14, color: C.grey, textAlign: 'center', marginTop: 14 },

  saveBtn: {
    marginTop: 36,
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
  saveBtnDisabled: { opacity: 0.55 },
  saveBtnText: { color: C.white, fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
});
