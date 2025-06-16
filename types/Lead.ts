export interface Lead {
  id: string;
  jobType: string;
  category: 'Plumbing' | 'Electrical' | 'Drywall' | 'Painting' | 'Roofing' | 'HVAC' | 'Other';
  location: string;
  urgency: 'Urgent' | 'Flexible';
  dateRequested: string;
  description: string;
  resident: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  budget: string;
  timing: string;
  status: 'new' | 'viewed' | 'contacted';
}