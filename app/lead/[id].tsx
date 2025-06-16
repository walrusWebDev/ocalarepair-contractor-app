import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Lead } from '@/types/Lead';
import { X, MapPin, Clock, DollarSign, User, Phone, Mail, Calendar, Wrench, Zap, Droplets, Paintbrush, Chrome as Home, Wind } from 'lucide-react-native';

// Mock data - in a real app, this would be fetched based on the lead ID
const mockLeads: Lead[] = [
  {
    id: '1',
    jobType: 'Kitchen Faucet Repair',
    category: 'Plumbing',
    location: 'SE Ocala',
    urgency: 'Urgent',
    dateRequested: '2024-01-15T14:30:00Z',
    description: 'Kitchen faucet has been dripping constantly for 2 days. Water pressure seems low and the handle is loose. The drip is getting worse and I\'m worried about water damage. Looking for a qualified plumber who can come out as soon as possible.',
    resident: {
      name: 'Sarah Johnson',
      phone: '(352) 555-0198',
      email: 'sarah.johnson@email.com',
      address: '1234 Oak Street, Ocala, FL 34471'
    },
    budget: '$150-300',
    timing: 'ASAP - urgent repair needed',
    status: 'viewed'
  },
  {
    id: '2',
    jobType: 'Outlet Installation',
    category: 'Electrical',
    location: 'Historic Downtown',
    urgency: 'Flexible',
    dateRequested: '2024-01-15T12:15:00Z',
    description: 'Need to install 3 new outlets in home office. Looking for licensed electrician. The office currently doesn\'t have enough outlets for all equipment. Need GFCI outlets installed properly.',
    resident: {
      name: 'Mike Davis',
      phone: '(352) 555-0167',
      email: 'mike.davis@email.com',
      address: '5678 Pine Avenue, Ocala, FL 34475'
    },
    budget: '$200-400',
    timing: 'Within next week',
    status: 'viewed'
  },
  {
    id: '3',
    jobType: 'Drywall Patch',
    category: 'Drywall',
    location: 'NW Ocala',
    urgency: 'Flexible',
    dateRequested: '2024-01-15T10:45:00Z',
    description: 'Small hole in living room wall from furniture move. Need professional patch and paint match. The hole is about 2 inches in diameter. Wall has a textured finish that needs to be matched.',
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

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    // In a real app, fetch lead data from API using the ID
    const foundLead = mockLeads.find(l => l.id === id);
    setLead(foundLead || null);
  }, [id]);

  if (!lead) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lead not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getCategoryIcon = (category: Lead['category']) => {
    const iconProps = { size: 24, color: '#FFFFFF' };
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCall = () => {
    const phoneNumber = lead.resident.phone.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${lead.resident.email}`);
  };

  const handleDirections = () => {
    const address = encodeURIComponent(lead.resident.address);
    Linking.openURL(`https://maps.google.com/?q=${address}`);
  };

  const InfoCard = ({ 
    icon, 
    title, 
    content, 
    onPress, 
    buttonText 
  }: {
    icon: React.ReactNode;
    title: string;
    content: string;
    onPress?: () => void;
    buttonText?: string;
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <View style={styles.infoIcon}>
          {icon}
        </View>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoContent}>{content}</Text>
      {onPress && buttonText && (
        <TouchableOpacity style={styles.infoButton} onPress={onPress}>
          <Text style={styles.infoButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(lead.category) }]}>
            {getCategoryIcon(lead.category)}
            <Text style={styles.categoryText}>{lead.category}</Text>
          </View>
          
          <Text style={styles.jobTitle}>{lead.jobType}</Text>
          
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.metaText}>{lead.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.metaText}>{formatDate(lead.dateRequested)}</Text>
            </View>
          </View>
          
          <View style={styles.urgencyContainer}>
            <View style={[
              styles.urgencyBadge,
              lead.urgency === 'Urgent' ? styles.urgentBadge : styles.flexibleBadge
            ]}>
              <Text style={[
                styles.urgencyText,
                lead.urgency === 'Urgent' ? styles.urgentText : styles.flexibleText
              ]}>
                {lead.urgency}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{lead.description}</Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resident Contact</Text>
          
          <InfoCard
            icon={<User size={20} color="#2563EB" />}
            title="Resident Name"
            content={lead.resident.name}
          />
          
          <InfoCard
            icon={<Phone size={20} color="#059669" />}
            title="Phone Number"
            content={lead.resident.phone}
            onPress={handleCall}
            buttonText="Call Now"
          />
          
          <InfoCard
            icon={<Mail size={20} color="#7C3AED" />}
            title="Email Address"
            content={lead.resident.email}
            onPress={handleEmail}
            buttonText="Send Email"
          />
          
          <InfoCard
            icon={<MapPin size={20} color="#DC2626" />}
            title="Address"
            content={lead.resident.address}
            onPress={handleDirections}
            buttonText="Get Directions"
          />
        </View>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          
          <InfoCard
            icon={<DollarSign size={20} color="#059669" />}
            title="Budget Range"
            content={lead.budget}
          />
          
          <InfoCard
            icon={<Calendar size={20} color="#F59E0B" />}
            title="Timing"
            content={lead.timing}
          />
        </View>

        {/* Action Note */}
        <View style={styles.actionNote}>
          <Text style={styles.actionNoteTitle}>Next Steps</Text>
          <Text style={styles.actionNoteText}>
            Contact the resident directly using the information provided above. 
            This app is for lead information only - all communication and work 
            arrangements happen between you and the resident.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  jobHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  jobMeta: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  urgencyContainer: {
    flexDirection: 'row',
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
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  infoContent: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  infoButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionNote: {
    backgroundColor: '#EFF6FF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  actionNoteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  actionNoteText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});