import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async () => {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('medikarp', {
      name: 'MediKarp Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }

  return finalStatus === 'granted';
};

export const scheduleReminder = async (medicine) => {
  // Cancel existing notification for this medicine first
  if (medicine.notificationId) {
    await cancelReminder(medicine.notificationId);
  }

  const [hour, minute] = medicine.time.split(':').map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '💊 Medicine Reminder',
      body: `Time to take ${medicine.name}${medicine.dosage ? ` — ${medicine.dosage}` : ''}`,
      sound: 'default',
      channelId: 'medikarp',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });

  return id;
};

export const cancelReminder = async (notificationId) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    // ignore
  }
};
