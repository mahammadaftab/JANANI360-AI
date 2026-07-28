export interface GovernmentFacility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'DISTRICT_HOSPITAL' | 'ANGANWADI' | 'VACCINATION_CENTER' | 'BLOOD_BANK' | 'DIAGNOSTIC_LAB';
  typeLabel: string;
  district: string;
  taluk: string;
  villageOrLocality: string;
  address: string;
  pincode: string;
  contactPhone: string;
  helpline: string;
  emergency24x7: boolean;
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
  distanceKm?: number;
  availableHelpdesks: string[];
  operatingHours: string;
}

export const OFFICIAL_GOVERNMENT_FACILITIES: GovernmentFacility[] = [
  {
    id: 'FAC-PHC-VARTHUR-01',
    name: 'Varthur Primary Health Centre (PHC)',
    type: 'PHC',
    typeLabel: 'Government Primary Health Centre',
    district: 'Bengaluru Urban',
    taluk: 'Mahadevapura',
    villageOrLocality: 'Varthur Main Road',
    address: 'Near Varthur Police Station, Varthur Main Rd, Bengaluru, Karnataka 560087',
    pincode: '560087',
    contactPhone: '+91 80 2845 2200',
    helpline: '104',
    emergency24x7: true,
    geoCoordinates: { latitude: 12.9389, longitude: 77.7499 },
    availableHelpdesks: ['PMMVY Registration Desk', 'JSY Cash Counter', 'JSSK Free Delivery & Diagnostics Desk', 'UIP Vaccination Booth', 'eSanjeevani Kiosk'],
    operatingHours: '24x7 Emergency & Maternity; OPD 9:00 AM - 4:30 PM'
  },
  {
    id: 'FAC-AWC-VARTHUR-02',
    name: 'Varthur Anganwadi Centre Sector 4 (WCD)',
    type: 'ANGANWADI',
    typeLabel: 'Government Anganwadi Centre',
    district: 'Bengaluru Urban',
    taluk: 'Mahadevapura',
    villageOrLocality: 'Varthur Lake Road',
    address: 'Sector 4, Near Government Primary School, Varthur, Bengaluru 560087',
    pincode: '560087',
    contactPhone: '+91 94808 22104',
    helpline: '14408',
    emergency24x7: false,
    geoCoordinates: { latitude: 12.9405, longitude: 77.7450 },
    availableHelpdesks: ['POSHAN Abhiyaan Take Home Ration (THR) Hub', 'PMMVY Form 1-A Assistance', 'Bhagyalakshmi Registration Desk'],
    operatingHours: 'Monday - Saturday: 9:00 AM - 4:00 PM'
  },
  {
    id: 'FAC-CHC-SHIGGAON-03',
    name: 'Shiggaon Community Health Centre (CHC)',
    type: 'CHC',
    typeLabel: 'Government Community Health Centre & First Referral Unit (FRU)',
    district: 'Haveri',
    taluk: 'Shiggaon',
    villageOrLocality: 'Shiggaon Town',
    address: 'PB Road, Near Bus Stand, Shiggaon, Haveri District, Karnataka 581205',
    pincode: '581205',
    contactPhone: '+91 8378 255102',
    helpline: '108',
    emergency24x7: true,
    geoCoordinates: { latitude: 14.9961, longitude: 75.2285 },
    availableHelpdesks: ['JSY & JSSK 100% Free Service Desk', 'RBSK Early Intervention Corner', 'KMC Lounge for LBW Babies', 'UIP Cold Chain Point'],
    operatingHours: '24x7 Emergency & Casualty; OPD 9:00 AM - 4:00 PM'
  },
  {
    id: 'FAC-AWC-SHIGGAON-04',
    name: 'Shiggaon Anganwadi Centre 12 (ICDS)',
    type: 'ANGANWADI',
    typeLabel: 'Government ICDS Anganwadi Centre',
    district: 'Haveri',
    taluk: 'Shiggaon',
    villageOrLocality: 'Agri Sector Ward 3',
    address: 'Near Gram Panchayat Office, Shiggaon Agri Sector, Haveri 581205',
    pincode: '581205',
    contactPhone: '+91 98452 11098',
    helpline: '14408',
    emergency24x7: false,
    geoCoordinates: { latitude: 14.9980, longitude: 75.2300 },
    availableHelpdesks: ['PMMVY Registration Desk', 'POSHAN Mathru Purna Meal Spot', 'Growth Monitoring Center'],
    operatingHours: 'Monday - Saturday: 9:00 AM - 4:00 PM'
  },
  {
    id: 'FAC-HOSP-KCGEN-05',
    name: 'KC General District Hospital',
    type: 'DISTRICT_HOSPITAL',
    typeLabel: 'Government District Hospital & Super-Specialty Maternity Center',
    district: 'Bengaluru Urban',
    taluk: 'North Zone',
    villageOrLocality: 'Malleshwaram',
    address: '5th Cross Rd, Malleshwaram, Bengaluru, Karnataka 560003',
    pincode: '560003',
    contactPhone: '+91 80 2334 1771',
    helpline: '108',
    emergency24x7: true,
    geoCoordinates: { latitude: 13.0012, longitude: 77.5710 },
    availableHelpdesks: ['RBSK District Early Intervention Centre (DEIC)', 'SNCU & KMC Center', 'JSSK 24x7 Free Blood & Diagnostics', 'ABHA Kiosk'],
    operatingHours: '24x7 Emergency & Inpatient Services'
  },
  {
    id: 'FAC-DIGITAL-ESANJ-06',
    name: 'eSanjeevani 24x7 National Tele-Pediatric Portal Desk',
    type: 'DIAGNOSTIC_LAB',
    typeLabel: 'National Digital Tele-Consultation Node',
    district: 'Statewide Karnataka & National',
    taluk: 'Digital Portal',
    villageOrLocality: 'Online Portal (MoHFW)',
    address: 'CDAC Tele-Medicine Nodal Center, Govt of India',
    pincode: '560001',
    contactPhone: '104 (Toll-Free Health Line)',
    helpline: '104',
    emergency24x7: true,
    geoCoordinates: { latitude: 12.9716, longitude: 77.5946 },
    availableHelpdesks: ['Free Video Doctor Consultation', 'Instant e-Prescription Generation', 'Digital Vaccine Advice'],
    operatingHours: '24 Hours / 7 Days Online Access'
  }
];
