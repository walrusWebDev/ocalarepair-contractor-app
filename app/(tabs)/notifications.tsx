import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Bell, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'new_lead' | 'system' | 'reminder';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Available',
    message: 'Kitchen Faucet Repair in SE Ocala - Urgent',
    timestamp: '2024-01-15T14:30:00Z',
    type: 'new_lead',
    read: false,
  },
  {
    id: '2',
    title: 'New Lead Available',
    message: 'Outlet Installation in Historic Downtown',
    timestamp: '2024-01-15T12:15:00Z',
    type: 'new_lead',
    read: true,
  },
  {
    id: '3',
    title: 'System Update',
    message: 'App updated with improved notification features',
    timestamp: '2024-01-14T09:00:00Z',
    type: 'system',
    read: true,
  },
  {
    id: '4',
    title: 'Weekly Reminder',
    message: 'Update your availability status',
    timestamp: '2024-01-14T08:00:00Z',
    type: 'reminder',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'new_lead': return <Bell {...iconProps} color="#2563EB" />;
      case 'system': return <AlertTriangle {...iconProps} color="#F59E0B" />;
      case 'reminder': return <Clock {...iconProps} color="#64748B" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          {getNotificationIcon(item.type)}
        </View>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        {!item.read && <View style={styles.readIndicator} />}
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You'll see new lead alerts and updates here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#1E293B',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  readIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});