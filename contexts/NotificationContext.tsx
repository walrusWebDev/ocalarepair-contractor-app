import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: NotificationSettings) => void;
  requestPermissions: () => Promise<boolean>;
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      return true;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      return false;
    }
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    // In a real app, this would sync with the server
  };

  return (
    <NotificationContext.Provider value={{
      settings,
      updateSettings,
      requestPermissions
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}