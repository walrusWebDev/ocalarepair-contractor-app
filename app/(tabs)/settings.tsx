import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { User, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Mail, MessageSquare } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useNotifications();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const toggleNotification = (type: keyof typeof settings) => {
    updateSettings({
      ...settings,
      [type]: !settings[type],
    });
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true, 
    rightElement 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && onPress && (
          <ChevronRight size={20} color="#94A3B8" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'C'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'Contractor'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'contractor@example.com'}</Text>
                <Text style={styles.userSpecialties}>
                  {user?.specialties?.join(', ') || 'General Contractor'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingItem
              icon={<Bell size={22} color="#2563EB" />}
              title="Push Notifications"
              subtitle="Get instant alerts for new leads"
              showChevron={false}
              rightElement={
                <Switch
                  value={settings.pushEnabled}
                  onValueChange={() => toggleNotification('pushEnabled')}
                  trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  thumbColor={settings.pushEnabled ? '#2563EB' : '#9CA3AF'}
                />
              }
            />
            <SettingItem
              icon={<Mail size={22} color="#059669" />}
              title="Email Notifications"
              subtitle="Receive lead summaries via email"
              showChevron={false}
              rightElement={
                <Switch
                  value={settings.emailEnabled}
                  onValueChange={() => toggleNotification('emailEnabled')}
                  trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                  thumbColor={settings.emailEnabled ? '#059669' : '#9CA3AF'}
                />
              }
            />
            <SettingItem
              icon={<MessageSquare size={22} color="#7C3AED" />}
              title="SMS Notifications"
              subtitle="Get text alerts for urgent leads"
              showChevron={false}
              rightElement={
                <Switch
                  value={settings.smsEnabled}
                  onValueChange={() => toggleNotification('smsEnabled')}
                  trackColor={{ false: '#E5E7EB', true: '#EDE9FE' }}
                  thumbColor={settings.smsEnabled ? '#7C3AED' : '#9CA3AF'}
                />
              }
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingItem
              icon={<User size={22} color="#64748B" />}
              title="Profile Settings"
              subtitle="Update your information"
              onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in a future update')}
            />
            <SettingItem
              icon={<Shield size={22} color="#64748B" />}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available in a future update')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingItem
              icon={<HelpCircle size={22} color="#64748B" />}
              title="Help & Support"
              subtitle="Get help or contact support"
              onPress={() => Alert.alert('Support', 'For support, please contact us at:\n\nsupport@ocalarepair.com\n(352) 555-0100')}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={22} color="#DC2626" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  userSpecialties: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
});