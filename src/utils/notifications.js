// VaultCraft Notification & Reminder Engine

const NOTIF_SETTINGS_KEY = 'vaultcraft_notifications_v1';

export const DEFAULT_NOTIF_SETTINGS = {
  enabled: false,
  reminderTime: '20:00', // 8:00 PM
  frequency: 'daily', // 'daily', 'weekly'
  weeklyDay: 1, // Monday
  sound: true
};

export function getNotificationSettings() {
  try {
    const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_NOTIF_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return DEFAULT_NOTIF_SETTINGS;
}

export function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default', 'granted', 'denied'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function sendLocalNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    // If service worker is active, use it for mobile support (especially iOS PWA)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          icon: 'icon-192.svg',
          badge: 'icon-192.svg',
          vibrate: [200, 100, 200],
          tag: 'savings-reminder',
          renotify: true,
          ...options
        });
      });
      return true;
    }

    // Fallback to desktop window Notification
    new Notification(title, {
      icon: 'icon-192.svg',
      tag: 'savings-reminder',
      ...options
    });
    return true;
  } catch (e) {
    console.error('Failed to trigger notification:', e);
    return false;
  }
}

/**
 * Checks if an installment is due today or pending
 */
export function checkDueInstallments(challenges) {
  if (!Array.isArray(challenges)) return [];
  const todayStr = new Date().toISOString().split('T')[0];
  const dueItems = [];

  challenges.forEach(ch => {
    ch.items.forEach(it => {
      if (!it.saved) {
        if (it.dueDate === todayStr || (!it.dueDate && !ch.items.some(x => x.saved && x.id === it.id))) {
          dueItems.push({
            goalId: ch.id,
            goalTitle: ch.title,
            currency: ch.currency || '₹',
            itemId: it.id,
            label: it.label,
            amount: it.amount,
            dueDate: it.dueDate
          });
        }
      }
    });
  });

  return dueItems;
}
