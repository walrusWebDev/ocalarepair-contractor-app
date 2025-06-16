import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Lead } from '@/types/Lead';
import { MapPin, Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Wrench, Zap, Droplets, Paintbrush, Chrome as Home, Wind, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

// Mock data - in a real app, this would come from your API
const mockLeads: Lead[] = [
  {
    id: '1',
    jobType: 'Kitchen Faucet Repair',
    category: 'Plumbing',
    location: 'SE Ocala',
    urgency: 'Urgent',
    dateRequested: '2024-01-15T14:30:00Z',
    description: 'Kitchen faucet has been dripping constantly for 2 days. Water pressure seems low and the handle is loose.',
    resident: {
      name: 'Sarah Johnson',
      phone: '(352) 555-0198',
      email: 'sarah.johnson@email.com',
      address: '1234 Oak Street, Ocala, FL 34471'
    },
    budget: '$150-300',
    timing: 'ASAP - urgent repair needed',
    status: 'new'
  },
  {
    id: '2',
    jobType: 'Outlet Installation',
    category: 'Electrical',
    location: 'Historic Downtown',
    urgency: 'Flexible',
    dateRequested: '2024-01-15T12:15:00Z',
    description: 'Need to install 3 new outlets in home office. Looking for licensed electrician.',
    resident: {
      name: 'Mike Davis',
      phone: '(352) 555-0167',
      email: 'mike.davis@email.com',
      address: '5678 Pine Avenue, Ocala, FL 34475'
    },
    budget: '$200-400',
    timing: 'Within next week',
    status: 'new'
  },
  {
    id: '3',
    jobType: 'Drywall Patch',
    category: 'Drywall',
    location: 'NW Ocala',
    urgency: 'Flexible',
    dateRequested: '2024-01-15T10:45:00Z',
    description: 'Small hole in living room wall from furniture move. Need professional patch and paint match.',
    resident: {
      name: 'Lisa Rodriguez',
      phone: '(352) 555-0143',
      email: 'lisa.rodriguez@email.com',
      address: '9012 Maple Drive, Ocala, FL 34482'
    },
    budget: '$75-150',
    timing: 'Flexible timing',
    status: 'viewed'
  }
];

export default function LeadsScreen() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [refreshing, setRefreshing] = useState(false);

  const getCategoryIcon = (category: Lead['category']) => {
    const iconProps = { size: 18, color: '#FFFFFF' };
    switch (category) {
      case 'Plumbing': return <Droplets {...iconProps} />;
      case 'Electrical': return <Zap {...iconProps} />;
      case 'Drywall': return <Home {...iconProps} />;
      case 'Painting': return <Paintbrush {...iconProps} />;
      case 'HVAC': return <Wind {...iconProps} />;
      case 'Roofing': return <Home {...iconProps} />;
      default: return <Wrench {...iconProps} />;
    }
  };

  const getCategoryColor = (category: Lead['category']) => {
    switch (category) {
      case 'Plumbing': return '#3B82F6';
      case 'Electrical': return '#F59E0B';
      case 'Drywall': return '#8B5CF6';
      case 'Painting': return '#EC4899';
      case 'HVAC': return '#06B6D4';
      case 'Roofing': return '#84CC16';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'new': return <AlertCircle size={16} color="#EF4444" />;
      case 'viewed': return <Clock size={16} color="#F59E0B" />;
      case 'contacted': return <CheckCircle size={16} color="#10B981" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLeadPress = (lead: Lead) => {
    // Update lead status to viewed
    setLeads(prev => prev.map(l => 
      l.id === lead.id ? { ...l, status: 'viewed' } : l
    ));
    
    router.push(`/lead/${lead.id}`);
  };

  const renderLead = ({ item }: { item: Lead }) => (
    <TouchableOpacity
      style={styles.leadCard}
      onPress={() => handleLeadPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.leadHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
          {getCategoryIcon(item.category)}
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
        </View>
      </View>
      
      <Text style={styles.jobTitle}>{item.jobType}</Text>
      
      <View style={styles.leadDetails}>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color="#64748B" />
          <Text style={styles.detailText}>{formatDate(item.dateRequested)}</Text>
        </View>
      </View>
      
      <View style={styles.urgencyContainer}>
        <View style={[
          styles.urgencyBadge,
          item.urgency === 'Urgent' ? styles.urgentBadge : styles.flexibleBadge
        ]}>
          <Text style={[
            styles.urgencyText,
            item.urgency === 'Urgent' ? styles.urgentText : styles.flexibleText
          ]}>
            {item.urgency}
          </Text>
        </View>
        <Text style={styles.budget}>{item.budget}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name || 'Contractor'}</Text>
        <Text style={styles.subtitle}>New leads available</Text>
      </View>
      
      <FlatList
        data={leads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
    padding: 20,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusContainer: {
    padding: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  leadDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
  },
  flexibleBadge: {
    backgroundColor: '#F0F9FF',
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgentText: {
    color: '#DC2626',
  },
  flexibleText: {
    color: '#0284C7',
  },
  budget: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});