import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICINES_KEY = 'medikarp_medicines';

export const saveMedicines = async (medicines) => {
  try {
    await AsyncStorage.setItem(MEDICINES_KEY, JSON.stringify(medicines));
  } catch (e) {
    console.error('Error saving medicines:', e);
  }
};

export const loadMedicines = async () => {
  try {
    const data = await AsyncStorage.getItem(MEDICINES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading medicines:', e);
    return [];
  }
};
