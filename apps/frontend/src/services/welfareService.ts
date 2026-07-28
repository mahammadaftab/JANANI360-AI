import api from './api';

export interface GovernmentScheme {
  id: string;
  officialSchemeCode: string;
  nameEn: string;
  nameKn: string;
  nameHi: string;
  departmentEn: string;
  departmentKn: string;
  category: 'MATERNAL_FINANCIAL' | 'INFANT_HEALTHCARE' | 'NUTRITION_ICDS' | 'IMMUNIZATION' | 'TELEMEDICINE_DIGITAL' | 'GIRL_CHILD_WELFARE' | 'SPECIAL_CARE';
  purposeEn: string;
  purposeKn: string;
  cashBenefitAmount?: number;
  financialBenefitDetailsEn?: string;
  financialBenefitDetailsKn?: string;
  freeServicesEn: string[];
  eligibilityRulesDescriptionEn: string;
  eligibilityRulesDescriptionKn: string;
  requiredDocumentsEn: string[];
  requiredDocumentsKn: string[];
  applicationProcessEn: string[];
  applicationProcessKn: string[];
  officialWebsite: string;
  helplineNumber: string;
  lastUpdatedDate: string;
  verificationSource: string;
  nodalOfficerDesk: string;
}

export interface SchemeEvaluationResult {
  scheme: GovernmentScheme;
  status: 'ELIGIBLE' | 'ALREADY_AVAILED' | 'UPCOMING' | 'NOT_ELIGIBLE';
  statusLabelEn: string;
  statusLabelKn: string;
  matchScore: number;
  eligibilityRationaleEn: string;
  eligibilityRationaleKn: string;
  nextActionStepEn: string;
  nextActionStepKn: string;
  unavailedAmount?: number;
}

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

export interface AiAdviceResponse {
  summary: string;
  totalEligibleCount: number;
  totalCashAvailable: number;
  freeHealthcareCount: number;
  immediateActionStep: string;
  topRecommendedSchemes: Array<{
    schemeCode: string;
    schemeName: string;
    purpose: string;
    cashBenefit?: number;
    whyEligible: string;
    nextStep: string;
    officialPortal: string;
    helpline: string;
    requiredDocs: string[];
  }>;
  verificationNotice: string;
}

export const welfareService = {
  getSchemes: async (params?: { category?: string; state?: string; search?: string }) => {
    try {
      const res = await api.get('/welfare/schemes', { params });
      return res.data;
    } catch (err) {
      console.warn('⚠️ Falling back to direct API evaluation for schemes');
      throw err;
    }
  },

  evaluateEligibility: async (profileInput: any) => {
    try {
      const res = await api.post('/welfare/evaluate-eligibility', profileInput);
      return res.data;
    } catch (err) {
      console.warn('⚠️ API error in evaluateEligibility, handling fallback');
      throw err;
    }
  },

  getNearbyFacilities: async (params?: { district?: string; taluk?: string; type?: string }) => {
    try {
      const res = await api.get('/welfare/nearby-facilities', { params });
      return res.data;
    } catch (err) {
      console.warn('⚠️ API error in getNearbyFacilities');
      throw err;
    }
  },

  getAiAdvice: async (profile: any, lang: string = 'en') => {
    try {
      const res = await api.post('/welfare/ai-advisor', { profile, lang });
      return res.data;
    } catch (err) {
      console.warn('⚠️ API error in getAiAdvice');
      throw err;
    }
  },

  syncOfflineEvents: async (events: any[]) => {
    try {
      const res = await api.post('/welfare/sync-offline', { offlineEvents: events });
      return res.data;
    } catch (err) {
      console.warn('⚠️ Offline sync deferred');
      throw err;
    }
  }
};
