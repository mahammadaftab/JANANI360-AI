export interface EligibilityCriteria {
  minAgeMonths?: number;
  maxAgeMonths?: number;
  pregnancyStage?: 'PREGNANT' | 'POSTPARTUM' | 'INFANT' | 'CHILD_UP_TO_6_YRS' | 'ANY';
  maxBirthWeightKg?: number;
  incomeCategory?: ('BPL' | 'APL' | 'SC_ST' | 'NFSA_CARD' | 'ALL')[];
  parityLimit?: number; // e.g. 1st live birth or 2nd girl child
  institutionalDeliveryOnly?: boolean;
  state?: string;
}

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
  eligibilityCriteria: EligibilityCriteria;
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

export const OFFICIAL_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'GOV-SCH-PMMVY-01',
    officialSchemeCode: 'PMMVY-2.0-MOWCD',
    nameEn: 'Pradhan Mantri Matru Vandana Yojana (PMMVY 2.0)',
    nameKn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (PMMVY)',
    nameHi: 'प्रधानमंत्री मातृ वंदना योजना',
    departmentEn: 'Ministry of Women and Child Development (MoWCD), Govt of India & Dept of Women & Child Development Karnataka',
    departmentKn: 'ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ ಹಾಗೂ ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    category: 'MATERNAL_FINANCIAL',
    purposeEn: 'Provides direct cash transfer incentives for pregnant women and lactating mothers for health seeking behavior, partial compensation for wage loss, and nutritional support.',
    purposeKn: 'ಗರ್ಭಿಣಿಯರು ಮತ್ತು ತಾಯಂದಿರಿಗೆ ಆರ್ಥಿಕ ನೆರವು, ಅಪೌಷ್ಟಿಕತೆ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಪೌಷ್ಟಿಕ ಆಹಾರಕ್ಕಾಗಿ ನೇರ ನಗದು ವರ್ಗಾವಣೆ ನೀಡುತ್ತದೆ.',
    cashBenefitAmount: 5000,
    financialBenefitDetailsEn: '₹5,000 in 2 installments for 1st live child (₹3,000 upon ANC registration within 6 months, ₹2,000 after child birth registration & 1st cycle of immunizations). Additional ₹6,000 incentive for 2nd child if child is a girl.',
    financialBenefitDetailsKn: 'ಮೊದಲ ಮಗುವಿಗೆ ₹5,000 (2 ಕಂತುಗಳಲ್ಲಿ). ಎರಡನೇ ಮಗು ಹೆಣ್ಣು ಮಗುವಾಗಿದ್ದಲ್ಲಿ ₹6,000 ಪ್ರೋತ್ಸಾಹಧನ.',
    freeServicesEn: ['Free ANC Registration & MCP Card', 'Counseling at Anganwadi', 'Direct Bank Transfer (DBT) to Aadhaar-linked Bank Account'],
    eligibilityCriteria: {
      pregnancyStage: 'ANY',
      incomeCategory: ['BPL', 'SC_ST', 'NFSA_CARD'],
      parityLimit: 2,
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'Pregnant & Lactating Mothers belonging to socially/economically disadvantaged categories (BPL, SC/ST, MGNREGA Job Card holders, Farmers under PM-KISAN, ESI/EPFO non-salaried). Must register before 560 days from LMP.',
    eligibilityRulesDescriptionKn: 'BPL ಕಾರ್ಡ್‌ದಾರರು, SC/ST, ಇ ಶ್ರಮ್ ಕಾರ್ಡ್‌ದಾರರು ಹಾಗೂ ಸಣ್ಣ ರೈತ ಕುಟುಂಬಗಳ ತಾಯಂದಿರು ಅರ್ಹರು.',
    requiredDocumentsEn: [
      'Mother-Child Protection (MCP) Card / RCH ID',
      'Aadhaar Card of Mother and Husband',
      'Aadhaar-seeded Bank Account / IPPB Account details',
      'Birth Certificate of Child (for 2nd installment)',
      'BPL Ration Card / SC-ST Certificate / PM-KISAN ID'
    ],
    requiredDocumentsKn: [
      'ತಾಯಿ ಕಾರ್ಡ್ (MCP Card / RCH ID)',
      'ತಾಯಿ ಮತ್ತು ಪತಿಯ ಆಧಾರ್ ಕಾರ್ಡ್',
      'ಆಧಾರ್ ಜೋಡಣೆಯಾದ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್',
      'ಮಗುವಿನ ಜನನ ಪ್ರಮಾಣ ಪತ್ರ',
      'BPL ಪಡಿತರ ಚೀಟಿ'
    ],
    applicationProcessEn: [
      'Visit nearest Anganwadi Centre (AWC) or Primary Health Centre (PHC).',
      'Fill Form 1-A with local Anganwadi Worker (AWW) or ASHA worker.',
      'Authenticate Aadhaar and upload documents on official portal pmmvy.wcd.gov.in.',
      'Receive direct credit into bank account within 30 days of verification.'
    ],
    applicationProcessKn: [
      'ಹತ್ತಿರದ ಅಂಗನವಾಡಿ ಕೇಂದ್ರ ಅಥವಾ PHC ಗೆ ಭೇಟಿ ನೀಡಿ.',
      'ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆ (AWW) ಮೂಲಕ ಅರ್ಜಿ ನಮೂನೆ ಸಲ್ಲಿಸಿ.',
      'pmmvy.wcd.gov.in ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಆಧಾರ್ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ.'
    ],
    officialWebsite: 'https://pmmvy.wcd.gov.in',
    helplineNumber: '14408',
    lastUpdatedDate: '2026-06-01',
    verificationSource: 'MoWCD PMMVY Scheme Guidelines 2026 Notification & Karnataka WCD Portal',
    nodalOfficerDesk: 'Child Development Project Officer (CDPO) & Local Anganwadi Worker'
  },
  {
    id: 'GOV-SCH-JSY-02',
    officialSchemeCode: 'JSY-NHM-MOHFW',
    nameEn: 'Janani Suraksha Yojana (JSY)',
    nameKn: 'ಜನನಿ ಸುರಕ್ಷಾ ಯೋಜನೆ (JSY)',
    nameHi: 'जननी सुरक्षा योजना',
    departmentEn: 'National Health Mission (NHM), Ministry of Health & Family Welfare (MoHFW), Govt of India',
    departmentKn: 'ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಅಭಿಯಾನ (NHM), ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ',
    category: 'MATERNAL_FINANCIAL',
    purposeEn: 'A safe motherhood intervention promoting institutional delivery among poor pregnant women to reduce maternal and neonatal mortality.',
    purposeKn: 'ಬಡ ಗರ್ಭಿಣಿಯರಿಗೆ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸುರಕ್ಷಿತ ಹೆರಿಗೆ ಉತ್ತೇಜಿಸಲು ಹಾಗೂ ತಾಯಿ-ಮಗುವಿನ ಮರಣ ಪ್ರಮಾಣ ತಗ್ಗಿಸಲು ನಗದು ಸಹಾಯ ಧನ.',
    cashBenefitAmount: 1400,
    financialBenefitDetailsEn: '₹1,400 for Rural BPL/SC/ST mothers in Karnataka upon institutional delivery at PHC/CHC/Govt Hospital. ₹700 for Urban BPL mothers. Plus ₹600 incentive for ASHA worker.',
    financialBenefitDetailsKn: 'ಗ್ರಾಮೀಣ BPL ತಾಯಂದಿರಿಗೆ ₹1,400 ಮತ್ತು ನಗರ ಪ್ರದೇಶದ BPL ತಾಯಂದಿರಿಗೆ ₹700 ನೇರ ನಗದು ಸೌಲಭ್ಯ.',
    freeServicesEn: ['Free Institutional Delivery', 'Free Transport to Health Facility', 'Postnatal Care Support'],
    eligibilityCriteria: {
      pregnancyStage: 'POSTPARTUM',
      incomeCategory: ['BPL', 'SC_ST'],
      institutionalDeliveryOnly: true,
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'BPL/SC/ST Pregnant women delivering in Government Hospitals, PHCs, CHCs or accredited private hospitals.',
    eligibilityRulesDescriptionKn: 'ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಹೆರಿಗೆಯಾಗುವ BPL/SC/ST ತಾಯಂದಿರು.',
    requiredDocumentsEn: [
      'RCH ID / MCP Card',
      'BPL Ration Card / Caste Certificate',
      'Discharge Summary from Government Hospital',
      'Aadhaar Linked Bank Passbook'
    ],
    requiredDocumentsKn: [
      'RCH ID / ತಾಯಿ ಕಾರ್ಡ್',
      'BPL ಪಡಿತರ ಚೀಟಿ / ಜಾತಿ ಪ್ರಮಾಣ ಪತ್ರ',
      'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯ ಡಿಸ್ಚಾರ್ಜ್ ಕಾರ್ಡ್',
      'ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್'
    ],
    applicationProcessEn: [
      'Get registered with ASHA worker during pregnancy.',
      'Opt for institutional delivery at PHC / Taluk Hospital / District Hospital.',
      'Hospital Medical Officer generates JSY payment voucher at discharge.',
      'Amount credited via Direct Benefit Transfer (DBT).'
    ],
    applicationProcessKn: [
      'ಆಶಾ ಕಾರ್ಯಕರ್ತರ ಬಳಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಿ.',
      'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಹೆರಿಗೆ ಪೂರ್ಣಗೊಳಿಸಿ, ಡಿಸ್ಚಾರ್ಜ್ ಸಮಯದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
    ],
    officialWebsite: 'https://nhm.gov.in/index1.php?sublink_id=841&level_1_id=140',
    helplineNumber: '104',
    lastUpdatedDate: '2026-05-15',
    verificationSource: 'National Health Mission (NHM) JSY Operational Guidelines',
    nodalOfficerDesk: 'PHC Medical Officer & District Health Officer (DHO)'
  },
  {
    id: 'GOV-SCH-JSSK-03',
    officialSchemeCode: 'JSSK-ZERO-COST-NHM',
    nameEn: 'Janani Shishu Suraksha Karyakram (JSSK)',
    nameKn: 'ಜನನಿ ಶಿಶು ಸುರಕ್ಷಾ ಕಾರ್ಯಕ್ರಮ (JSSK 100% ಉಚಿತ)',
    nameHi: 'जननी शिशु सुरक्षा कार्यक्रम',
    departmentEn: 'National Health Mission (NHM) & Health & Family Welfare Dept Karnataka',
    departmentKn: 'ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಅಭಿಯಾನ ಹಾಗೂ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಇಲಾಖೆ',
    category: 'INFANT_HEALTHCARE',
    purposeEn: 'Guarantees 100% cashless & free healthcare services to pregnant women and sick infants up to 1 year of age in all public health institutions, with ZERO out-of-pocket expenditure.',
    purposeKn: 'ಗರ್ಭಿಣಿಯರಿಗೆ ಹಾಗೂ 1 ವರ್ಷದವರೆಗಿನ ಅಸ್ವಸ್ಥ ನವಜಾತ ಶಿಶುಗಳಿಗೆ ಸಂಪೂರ್ಣ ಉಚಿತ ಚಿಕಿತ್ಸೆ, ಉಚಿತ ಔಷಧಿ, ಉಚಿತ ರಕ್ತ ಮತ್ತು ಉಚಿತ ವಾಹನ ಸೌಲಭ್ಯ.',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: '100% Free Entitlement: Zero user charges, free drugs & consumables, free diagnostic tests, free blood, free diet during admission, and free 108/104 ambulance transport (home-to-facility, inter-facility transfer, and drop back home).',
    financialBenefitDetailsKn: 'ನೂರು ಪ್ರತಿಶತ ಉಚಿತ: ಆಸ್ಪತ್ರೆ ಶುಲ್ಕ, ರಕ್ತ, ರಕ್ತ ಪರೀಕ್ಷೆ, ಔಷಧಿಗಳು, ಊಟ ಮತ್ತು 108 ಆಂಬುಲೆನ್ಸ್ ಉಚಿತ.',
    freeServicesEn: [
      'Free Normal / Caesarean Delivery Services',
      'Free Medicines & Consumables',
      'Free Diagnostics (Ultrasound, Blood, Urine, X-Ray)',
      'Free Blood Transfusion',
      'Free Diet (up to 3 days for normal, 7 days for C-Section)',
      'Free Transport (Home to Facility, Referral & Drop Back)',
      'Free Treatment for Sick Infants up to 1 Year (NICU/SNCU admission)'
    ],
    eligibilityCriteria: {
      pregnancyStage: 'ANY',
      minAgeMonths: 0,
      maxAgeMonths: 12,
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'Universal entitlement for ALL pregnant women and ALL sick infants (0-1 year) attending any Public Health Facility (PHC, CHC, District Hospital, Medical College). No income limit or BPL requirement.',
    eligibilityRulesDescriptionKn: 'ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು ಮತ್ತು 0-1 ವರ್ಷದ ಎಲ್ಲಾ ನವಜಾತ ಶಿಶುಗಳಿಗೆ ಉಚಿತ (BPL ಪರಿಮಿತಿ ಇಲ್ಲ).',
    requiredDocumentsEn: [
      'MCP Card / RCH ID / Hospital Registration Slip',
      'Any Government ID Proof (Aadhaar / Voter ID)'
    ],
    requiredDocumentsKn: [
      'ತಾಯಿ ಕಾರ್ಡ್ / RCH ID',
      'ಯಾವುದೇ ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿ'
    ],
    applicationProcessEn: [
      'No application required beforehand.',
      'Walk into any Government Hospital, PHC, or CHC.',
      'Show RCH ID / MCP Card at admission counter.',
      'Call 108 or 104 for free emergency ambulance transport.'
    ],
    applicationProcessKn: [
      'ಯಾವುದೇ ಮುಂಗಡ ಅರ್ಜಿ ಅಗತ್ಯವಿಲ್ಲ. ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಉಚಿತ ಸೇವೆಯನ್ನು ಪಡೆಯಿರಿ. ಉಚಿತ ಆಂಬುಲೆನ್ಸ್‌ಗೆ 108 ಗೆ ಕರೆ ಮಾಡಿ.'
    ],
    officialWebsite: 'https://nhm.gov.in/index1.php?sublink_id=842&level_1_id=140',
    helplineNumber: '104',
    lastUpdatedDate: '2026-06-10',
    verificationSource: 'MoHFW JSSK Universal Entitlement Directives',
    nodalOfficerDesk: 'Public Health Facility Medical Superintendent / Casualty Officer'
  },
  {
    id: 'GOV-SCH-RBSK-04',
    officialSchemeCode: 'RBSK-4DS-NHM',
    nameEn: 'Rashtriya Bal Swasthya Karyakram (RBSK - Child Health Screening)',
    nameKn: 'ರಾಷ್ಟ್ರೀಯ ಬಾಲ ಸ್ವಾಸ್ಥ್ಯ ಕಾರ್ಯಕ್ರಮ (RBSK 4Ds ಪರೀಕ್ಷೆ)',
    nameHi: 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम',
    departmentEn: 'Ministry of Health & Family Welfare (MoHFW) & Directorate of Health Services Karnataka',
    departmentKn: 'ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ ಹಾಗೂ ಕರ್ನಾಟಕ ಆರೋಗ್ಯ ಇಲಾಖೆ',
    category: 'SPECIAL_CARE',
    purposeEn: 'Child health screening and early intervention services covering 4Ds: Defects at birth, Diseases, Deficiencies, and Development delays including disabilities from age 0 to 18 years.',
    purposeKn: '0 ದಿಂದ 18 ವರ್ಷದ ಮಕ್ಕಳಲ್ಲಿ ಹುಟ್ಟು ನ್ಯೂನತೆಗಳು, ರೋಗಗಳು, ಅಪೌಷ್ಟಿಕತೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ವಿಳಂಬ (4Ds) ಉಚಿತ ತಪಾಸಣೆ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ.',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: 'Free tertiary surgery and management for 30 selected health conditions (e.g. Congenital Heart Disease, Clubfoot, Cleft Lip/Palate, Congenital Cataract, Hearing Impairment, Neural Tube Defects) at empanelled super-specialty hospitals.',
    financialBenefitDetailsKn: 'ಉಚಿತ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮತ್ತು ಸೂಪರ್ ಸ್ಪೆಷಾಲಿಟಿ ಆಸ್ಪತ್ರೆ ಉಚಿತ ಚಿಕಿತ್ಸೆ (ಹೃದಯ ಸಂಬಂಧಿ ರೋಗಗಳು, ಸೀಳು ತುಟಿ, ಶ್ರವಣ ದೋಷ).',
    freeServicesEn: [
      'Mobile Health Team Screening at Anganwadi & Schools',
      'Free Referral & Management at District Early Intervention Centre (DEIC)',
      'Free Congenital Heart Surgery',
      'Free Clubfoot Ponseti Management',
      'Free Hearing Aids & Cochlear Implant Assistance'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 216, // 18 years
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'All newborn babies born at public health facilities, children aged 6 weeks to 6 years registered at Anganwadis, and school children aged 6 to 18 years.',
    eligibilityRulesDescriptionKn: '0 ದಿಂದ 18 ವರ್ಷದ ಎಲ್ಲಾ ಮಕ್ಕಳು ಉಚಿತ ಚಿಕಿತ್ಸೆಗೆ ಅರ್ಹರು.',
    requiredDocumentsEn: [
      'RBSK Mobile Health Team Referral Slip / DEIC Card',
      'Child RCH ID / Birth Certificate',
      'Aadhaar / Parent Identification'
    ],
    requiredDocumentsKn: [
      'RBSK ಮೊಬೈಲ್ ತಂಡದ ರೆಫರಲ್ ಶೀಟ್',
      'RCH ID / ಮಗುವಿನ ಗುರುತಿನ ಚೀಟಿ'
    ],
    applicationProcessEn: [
      'RBSK Mobile Health Teams visit Anganwadi Centres twice a year.',
      'Child is screened for 30 specified health conditions.',
      'If diagnosed, child is referred to District Early Intervention Centre (DEIC) at District Hospital.',
      'All surgeries & treatments are funded 100% by NHM.'
    ],
    applicationProcessKn: [
      'ಅಂಗನವಾಡಿಗೆ ಭೇಟಿ ನೀಡುವ RBSK ಡಾಕ್ಟರ್ ತಂಡದಿಂದ ಪರೀಕ್ಷೆ ಪಡೆಯಿರಿ. ಅಗತ್ಯಬಿದ್ದಲ್ಲಿ DEIC ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ರೆಫರ್ ಮಾಡಲಾಗುತ್ತದೆ.'
    ],
    officialWebsite: 'https://rbsk.gov.in',
    helplineNumber: '104',
    lastUpdatedDate: '2026-05-20',
    verificationSource: 'MoHFW RBSK National Health Mission Operational Guidelines',
    nodalOfficerDesk: 'RBSK Medical Officer & District Early Intervention Centre (DEIC) Manager'
  },
  {
    id: 'GOV-SCH-UIP-05',
    officialSchemeCode: 'UIP-FULL-IMMUNIZATION-NHM',
    nameEn: 'Universal Immunization Programme (UIP - Zero Cost Vaccines)',
    nameKn: 'ಸಾರ್ವತ್ರಿಕ ಲಸಿಕಾ ಕಾರ್ಯಕ್ರಮ (UIP ಉಚಿತ ಲಸಿಕೆಗಳು)',
    nameHi: 'सार्वभौमिक टीकाकरण कार्यक्रम',
    departmentEn: 'Immunization Division, MoHFW & Department of Health & Family Welfare Karnataka',
    departmentKn: 'ಲಸಿಕಾ ವಿಭಾಗ, ಆರೋಗ್ಯ ಇಲಾಖೆ ಕರ್ನಾಟಕ',
    category: 'IMMUNIZATION',
    purposeEn: 'Provides free protection against 12 vaccine-preventable diseases to all infants and children across India.',
    purposeKn: '12 ಮಾರಕ ರೋಗಗಳ ವಿರುದ್ಧ ಪ್ರತಿಯೊಂದು ಮಗುವಿಗೆ ಉಚಿತ ಲಸಿಕೆ ಕವರೇಜ್ (BCG, OPV, Hep-B, Pentavalent, Rotavirus, PCV, MR, DPT).',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: '100% Free vaccines supplied by Government of India: BCG, Hepatitis B, OPV, Pentavalent (DPT+HepB+Hib), Rotavirus, Pneumococcal Conjugate Vaccine (PCV), Fractional IPV, Measles-Rubella (MR), Japanese Encephalitis (JE), DPT Booster, and Vit-A drops.',
    financialBenefitDetailsKn: 'ಉಚಿತ ಲಸಿಕೆಗಳು ಹಾಗೂ ಜೀವસತ್ವ A ಹನಿಗಳು ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ ಹಾಗೂ ಅಂಗನವಾಡಿ ಸೆಷನ್‌ಗಳಲ್ಲಿ ಉಚಿತ.',
    freeServicesEn: [
      'Birth Dose: BCG, OPV 0, Hep-B 0',
      '6, 10, 14 Weeks: Pentavalent 1-3, OPV 1-3, Rota 1-3, fIPV, PCV',
      '9 Months: MR 1st dose, JE 1, Vit-A 1st dose, PCV Booster',
      '16-24 Months: MR 2nd dose, DPT Booster 1, OPV Booster',
      'Free Digital Vaccine Tracking on U-WIN Portal'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 192,
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'Universal entitlement for every infant and child in India from birth up to 16 years.',
    eligibilityRulesDescriptionKn: 'ಭಾರತದ ಪ್ರತಿಯೊಂದು ನವಜಾತ ಶಿಶು ಹಾಗೂ ಮಗುವಿಗೆ ಉಚಿತ.',
    requiredDocumentsEn: [
      'MCP Card / RCH ID / U-WIN Digital Immunization Record'
    ],
    requiredDocumentsKn: [
      'ತಾಯಿ ಕಾರ್ಡ್ / U-WIN ಲಸಿಕಾ ಕಾರ್ಡ್'
    ],
    applicationProcessEn: [
      'Register infant on U-WIN portal at birth or via ASHA worker.',
      'Attend Village Health Sanitation and Nutrition Day (VHSND) every month at Anganwadi.',
      'Receive free vaccination and digital SMS certificate.'
    ],
    applicationProcessKn: [
      'ಮಾಸಿಕ VHSND ಅಂಗನವಾಡಿ ದಿನದಂದು ಮಗುವನ್ನು ಲಸಿಕೆಗೆ ಕರೆತನ್ನಿ.'
    ],
    officialWebsite: 'https://uwin.mohfw.gov.in',
    helplineNumber: '1075',
    lastUpdatedDate: '2026-06-20',
    verificationSource: 'Universal Immunization Programme Schedule, MoHFW India',
    nodalOfficerDesk: 'District Immunization Officer (DIO) & Auxiliary Nurse Midwife (ANM)'
  },
  {
    id: 'GOV-SCH-POSHAN-06',
    officialSchemeCode: 'POSHAN-ICDS-SNP-WCD',
    nameEn: 'POSHAN Abhiyaan & ICDS Supplementary Nutrition Programme (SNP)',
    nameKn: 'ಪೋಷಣ್ ಅಭಿಯಾನ ಹಾಗೂ ICDS ಪೂರಕ ಪೌಷ್ಟಿಕಾಹಾರ ಯೋಜನೆ',
    nameHi: 'पोषण अभियान एवं आईसीडीएस पूरक पोषण',
    departmentEn: 'Ministry of Women and Child Development (MoWCD) & Dept of Women & Child Development Karnataka',
    departmentKn: 'ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ ಕರ್ನಾಟಕ',
    category: 'NUTRITION_ICDS',
    purposeEn: 'Aims to reduce stunting, wasting, underweight, and anemia in young children (0-6 years), pregnant women, and lactating mothers through hot cooked meals and Take-Home Ration (THR).',
    purposeKn: '0 ದಿಂದ 6 ವರ್ಷದ ಮಕ್ಕಳು ಮತ್ತು ಬಾಣಂತಿಯರಲ್ಲಿ ಅಪೌಷ್ಟಿಕತೆ, ರಕ್ತಹೀನತೆ ತಡೆಯಲು ಅಂಗನವಾಡಿ ಮೂಲಕ ಉಚಿತ ಪೌಷ್ಟಿಕ ಆಹಾರ ವಿತರಣೆ.',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: 'Free Daily Nutritional Entitlement: Take-Home Ration (Pushthi energy-dense fortified premix / sprouted flour, eggs/milk) for children 6 months to 3 years; Hot Cooked Meals & Eggs/Milk (Mather Purna Yojna in Karnataka) for pregnant/lactating mothers and 3-6 year children.',
    financialBenefitDetailsKn: 'ಅಂಗನವಾಡಿಯಲ್ಲಿ ಉಚಿತ ಬಿಸಿ ಊಟ, ಮೊಟ್ಟೆ, ಹಾಲು ಹಾಗೂ ಮನೆಗೆ ಕೊಂಡೊಯ್ಯುವ ಪೌಷ್ಟಿಕ ಹಿಟ್ಟು (Take Home Ration).',
    freeServicesEn: [
      'Take-Home Ration (THR) for Infants 6m - 3yrs',
      'Hot Cooked Meals & Fortified Milk at Anganwadi for Children 3-6 yrs',
      'Matru Purna Scheme: Hot Cooked Meal with Egg/Chikki for Pregnant & Lactating Women',
      'Growth Monitoring & WHO Z-Score Tracking (Poshan Tracker)'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 72,
      pregnancyStage: 'ANY',
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'All pregnant women, lactating mothers up to 6 months postpartum, and children aged 6 months to 6 years registered at local Anganwadi Centre.',
    eligibilityRulesDescriptionKn: 'ಅಂಗನವಾಡಿ ವ್ಯಾಪ್ತಿಯ ಎಲ್ಲಾ ಗರ್ಭಿಣಿಯರು, ಬಾಣಂತಿಯರು ಮತ್ತು 6 ತಿಂಗಳಿಂದ 6 ವರ್ಷದ ಮಕ್ಕಳು.',
    requiredDocumentsEn: [
      'Anganwadi Registration Entry / Family Survey ID',
      'Mother / Child Aadhaar Number'
    ],
    requiredDocumentsKn: [
      'ಅಂಗನವಾಡಿ ನೋಂದಣಿ ಶೀಟ್',
      'ಆಧಾರ್ ಕಾರ್ಡ್'
    ],
    applicationProcessEn: [
      'Visit your assigned neighborhood Anganwadi Centre (AWC).',
      'Anganwadi Worker (AWW) registers mother and child in Poshan Tracker app.',
      'Collect monthly Take-Home Ration (THR) packets or attend daily hot meal session.'
    ],
    applicationProcessKn: [
      'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆಯಲ್ಲಿ ಹೆಸರು ನೋಂದಾಯಿಸಿ.'
    ],
    officialWebsite: 'https://poshanabhiyaan.gov.in',
    helplineNumber: '14408',
    lastUpdatedDate: '2026-05-30',
    verificationSource: 'MoWCD POSHAN Abhiyaan Operational Guidelines & Mathru Purna Scheme Karnataka',
    nodalOfficerDesk: 'Anganwadi Worker (AWW) & Supervisor / CDPO'
  },
  {
    id: 'GOV-SCH-KMC-07',
    officialSchemeCode: 'KMC-LBW-INCENTIVE-KARNATAKA',
    nameEn: 'Kangaroo Mother Care (KMC) Incentive for Low Birth Weight (LBW) Babies',
    nameKn: 'ಕಂಗಾರು ಮದರ್ ಕೇರ್ (KMC) ಕಡಿಮೆ ತೂಕದ ಶಿಶು ಪೋಷಣೆ ಪ್ರೋತ್ಸಾಹಧನ',
    nameHi: 'कंगारू मदर केयर (केएमसी) प्रोत्साहन योजना',
    departmentEn: 'Department of Health & Family Welfare Services, Govt of Karnataka & NHM',
    departmentKn: 'ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಸೇವೆಗಳು, ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    category: 'SPECIAL_CARE',
    purposeEn: 'Provides dedicated clinical support, thermal preservation training, and financial encouragement to mothers of premature or Low Birth Weight (<2.5kg) infants practicing continuous skin-to-skin contact.',
    purposeKn: '2.5 ಕೆಜಿಗಿಂತ ಕಡಿಮೆ ತೂಕದ ನವಜಾತ ಶಿಶುಗಳಿಗೆ ತಾಯಿಯ ಚರ್ಮದಿಂದ ಚರ್ಮಕ್ಕೆ ಬೆಚ್ಚಗಿನ ಸ್ಪರ್ಶ (KMC) ನೀಡಲು ಮಾರ್ಗದರ್ಶನ ಹಾಗೂ ಆರ್ಥಿಕ ಪ್ರೋತ್ಸಾಹ.',
    cashBenefitAmount: 1000,
    financialBenefitDetailsEn: '₹1,000 direct conditional cash transfer for mothers completing minimum 7 consecutive days of logged KMC (8+ hours daily) along with 3 follow-up weight monitoring visits at PHC KMC Lounge.',
    financialBenefitDetailsKn: '7 ದಿನಕ್ಕಿಂತ ಹೆಚ್ಚು KMC ಪೂರೈಸಿ ತೂಕದ ಪ್ರಗತಿ ತೋರಿಸಿದ ತಾಯಿಗೆ ₹1,000 ಪ್ರೋತ್ಸಾಹಧನ.',
    freeServicesEn: [
      'Free KMC Binder Wrap / KMC Lounge Access at SNCU/PHC',
      'Free Weight Monitoring & Lactation Counseling',
      'Dedicated ASHA Follow-up Visits at Home (Day 1, 3, 7, 14, 21, 28)'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 2,
      maxBirthWeightKg: 2.49,
      incomeCategory: ['ALL'],
      state: 'Karnataka'
    },
    eligibilityRulesDescriptionEn: 'Mothers with newborn infants weighing under 2,500 grams (Low Birth Weight) born in Karnataka public health facilities or supervised home births.',
    eligibilityRulesDescriptionKn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಜನಿಸಿದ 2.5 ಕೆಜಿಗಿಂತ ಕಡಿಮೆ ತೂಕದ ಎಲ್ಲಾ ನವಜಾತ ಶಿಶುಗಳ ತಾಯಂದಿರು.',
    requiredDocumentsEn: [
      'SNCU / Delivery Discharge Card showing birth weight < 2.5 kg',
      'ASHA KMC Logbook Entry',
      'Aadhaar Linked Bank Account'
    ],
    requiredDocumentsKn: [
      'ಮಗುವಿನ ಹುಟ್ಟು ತೂಕ ನಮೂದಾಗಿರುವ ಡಿಸ್ಚಾರ್ಜ್ ಕಾರ್ಡ್',
      'ಆಶಾ KMC ಲಾಗ್‌ಬುಕ್'
    ],
    applicationProcessEn: [
      'Identify LBW infant at delivery in SNCU/Maternity Ward.',
      'Practice 8+ hours/day KMC using KMC pouch/wrap guided by Staff Nurse.',
      'ASHA verifies 3 home visits and signs KMC Logsheet.',
      'PHC Medical Officer certifies and submits DBT payout.'
    ],
    applicationProcessKn: [
      'ಆಸ್ಪತ್ರೆಯಲ್ಲಿ KMC ತರಬೇತಿ ಪಡೆಯಿರಿ. ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಮನೆಗೆ ಭೇಟಿ ನೀಡಿ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ.'
    ],
    officialWebsite: 'https://karunadu.karnataka.gov.in/hfw',
    helplineNumber: '104',
    lastUpdatedDate: '2026-06-05',
    verificationSource: 'Karnataka State Health Policy for Newborn Care & KMC Guidelines',
    nodalOfficerDesk: 'PHC Staff Nurse & SNCU Nodal Officer'
  },
  {
    id: 'GOV-SCH-ABDM-CHILD-08',
    officialSchemeCode: 'ABDM-ABHA-CHILD-ID',
    nameEn: 'Ayushman Bharat Digital Mission (ABHA Child Health Account)',
    nameKn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಡಿಜಿಟಲ್ ಮಿಷನ್ (ABHA ಬಾಲಕ್ ಹೆಲ್ತ್ ಐಡಿ)',
    nameHi: 'आयुष्मान भारत डिजिटल मिशन (आभा बाल स्वास्थ्य खाता)',
    departmentEn: 'National Health Authority (NHA) & Ayushman Bharat Digital Mission (ABDM)',
    departmentKn: 'ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಪ್ರಾಧಿಕಾರ (NHA)',
    category: 'TELEMEDICINE_DIGITAL',
    purposeEn: 'Creates a lifelong 14-digit ABHA Health ID linked to parent’s account for digital health record storage, electronic lab reports, and seamless interoperability across hospitals.',
    purposeKn: 'ಮಗುವಿನ ಎಲ್ಲಾ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು, ಲಸಿಕಾ ಪ್ರಮಾಣ ಪತ್ರ ಹಾಗೂ ಹೆಲ್ತ್ ಹಿಸ್ಟರಿಯನ್ನು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಸಂಗ್ರಹಿಸಲು 14 ಅಂಕಿಯ ಉಚಿತ ABHA ಸಂಖ್ಯೆ.',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: '100% Free lifelong digital health wallet & cloud records repository under Government of India encryption standards.',
    financialBenefitDetailsKn: 'ಉಚಿತ 14 ಅಂಕಿಯ ಡಿಜಿಟಲ್ ಹೆಲ್ತ್ ಐಡಿ ಕಾರ್ಡ್ ಹಾಗೂ ಆನ್‌ಲೈನ್ ಹೆಲ್ತ್ ಲಾಕರ್.',
    freeServicesEn: [
      '14-digit Unique ABHA Health Number for Child',
      'Digital Scan & Share OPD Registration at Government & Private Hospitals',
      'Automatic sync of U-WIN Immunization Certificates',
      'ABDM Health Records App Access'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 216,
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'All newborn babies and children up to 18 years linked via Parent Aadhaar / Birth Certificate.',
    eligibilityRulesDescriptionKn: 'ಎಲ್ಲಾ ಮಕ್ಕಳಿಗೆ ಉಚಿತವಾಗಿ ಪೋಷಕರ ಆಧಾರ್ ಮೂಲಕ ರಚಿಸಬಹುದು.',
    requiredDocumentsEn: [
      'Parent (Mother/Father) Aadhaar Card with Mobile OTP',
      'Child Birth Registration / Name details'
    ],
    requiredDocumentsKn: [
      'ಪೋಷಕರ ಆಧಾರ್ ಕಾರ್ಡ್',
      'ಮಗುವಿನ ಜನನ ದಾಖಲೆ'
    ],
    applicationProcessEn: [
      'Visit abha.abdm.gov.in or create directly inside JANANI360 AI.',
      'Authenticate Parent Aadhaar via OTP.',
      'Enter child birth details to generate 14-digit ABHA ID Card.',
      'Download and print official ABDM Health Card.'
    ],
    applicationProcessKn: [
      'abha.abdm.gov.in ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ JANANI360 ಆಪ್ ಮೂಲಕ ತಕ್ಷಣವೇ ಪಡೆದುಕೊಳ್ಳಿ.'
    ],
    officialWebsite: 'https://abha.abdm.gov.in',
    helplineNumber: '1800-11-4477',
    lastUpdatedDate: '2026-06-18',
    verificationSource: 'National Health Authority ABDM Specifications 2.0',
    nodalOfficerDesk: 'ABDM State Mission Director & PHC Data Entry Operator'
  },
  {
    id: 'GOV-SCH-ESANJEEVANI-09',
    officialSchemeCode: 'ESANJEEVANI-TELE-PEDIATRIC-MOHFW',
    nameEn: 'eSanjeevani OPD (National Free Tele-Pediatric Consultation)',
    nameKn: 'ಈ-ಸಂಜೀವನಿ (ರಾಷ್ಟ್ರೀಯ ಉಚಿತ ವೈದ್ಯಕೀಯ ವೀಡಿಯೋ ಸಮಾಲೋಚನೆ)',
    nameHi: 'ई-संजीवनी फ्री टेली-पीडियाट्रिक परामर्श',
    departmentEn: 'Ministry of Health & Family Welfare (MoHFW) & CDAC Mohali',
    departmentKn: 'ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಸಚಿವಾಲಯ',
    category: 'TELEMEDICINE_DIGITAL',
    purposeEn: 'Provides 24x7 free video consultation with government pediatricians, doctors, and specialists directly from smartphone or Ayushman Arogya Mandir.',
    purposeKn: 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮೂಲಕವೇ ಸರ್ಕಾರಿ ಮಕ್ಕಳ ತಜ್ಞ ವೈದ್ಯರಿಂದ (Pediatricians) ಉಚಿತ ವೀಡಿಯೋ ಕಾಲ್ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್.',
    cashBenefitAmount: 0,
    financialBenefitDetailsEn: '100% Free doctor video consultation, free digital e-prescription valid at all Government PHCs for medicine dispense.',
    financialBenefitDetailsKn: 'ಉಚಿತ ವೀಡಿಯೋ ವೈದ್ಯಕೀಯ ಸಲಹೆ ಹಾಗೂ ಆನ್‌ಲೈನ್ ಔಷಧಿ ಚೀಟಿ.',
    freeServicesEn: [
      'Free 24x7 Doctor Video Consultation',
      'Pediatric Specialty OPD',
      'Legally Valid Digital Prescription (e-Prescription)',
      'Free Medicine Dispense at nearest PHC against e-Prescription'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 216,
      incomeCategory: ['ALL'],
      state: 'National'
    },
    eligibilityRulesDescriptionEn: 'Open to all citizens of India for child health queries, fever, skin issues, nutrition guidance, and post-op follow-ups.',
    eligibilityRulesDescriptionKn: 'ಭಾರತದ ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನಿಗೆ ಉಚಿತ.',
    requiredDocumentsEn: [
      'Mobile Phone Number for OTP authentication',
      'Previous Medical / Immunization records (optional upload)'
    ],
    requiredDocumentsKn: [
      'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'
    ],
    applicationProcessEn: [
      'Open esanjeevani.in or launch eSanjeevani portal.',
      'Enter Mobile OTP and select "Pediatric OPD / General Medicine".',
      'Connect via live video call with Government Doctor.',
      'Download e-Prescription instantly on smartphone.'
    ],
    applicationProcessKn: [
      'esanjeevani.in ಗೆ ಲಾಗ್ ಇನ್ ಆಗಿ ಮಕ್ಕಳ ವೈದ್ಯರ ವೀಡಿಯೋ ಕಾಲ್ ಸೆಷನ್‌ಗೆ ಸೇರಿಕೊಳ್ಳಿ.'
    ],
    officialWebsite: 'https://esanjeevani.in',
    helplineNumber: '104',
    lastUpdatedDate: '2026-06-12',
    verificationSource: 'MoHFW eSanjeevani Tele-Medicine Division',
    nodalOfficerDesk: 'eSanjeevani State Nodal Hub & Tele-Consultant Doctors'
  },
  {
    id: 'GOV-SCH-BHAGYALAKSHMI-10',
    officialSchemeCode: 'BHAGYALAKSHMI-SUKANYA-KARNATAKA',
    nameEn: 'Bhagyalakshmi / Sukanya Samriddhi Girl Child Welfare Scheme',
    nameKn: 'ಭಾಗ್ಯಲಕ್ಷ್ಮಿ / ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ ಹೆಣ್ಣು ಮಗುವಿನ ರಕ್ಷಣಾ ಯೋಜನೆ',
    nameHi: 'भाग्यलक्ष्मी / सुकन्या समृद्धि बालिका योजना',
    departmentEn: 'Department of Women & Child Development, Govt of Karnataka & India Post / LIC',
    departmentKn: 'ಮಹಿಳಾ ಮತ್ತು ಮಕ್ಕಳ ಅಭಿವೃದ್ಧಿ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    category: 'GIRL_CHILD_WELFARE',
    purposeEn: 'Financial security and educational incentive for girl children born in BPL families to promote girl child birth, prevent female foeticide, and guarantee funding for higher education at age 18.',
    purposeKn: 'BPL ಕುಟುಂಬದಲ್ಲಿ ಜನಿಸುವ ಹೆಣ್ಣು ಮಗಳ ಶಿಕ್ಷಣ ಮತ್ತು ಭವಿಷ್ಯಕ್ಕಾಗಿ 18 ವರ್ಷ ಪೂರೈಸಿದ ನಂತರ ಆರ್ಥಿಕ ಭದ್ರತೆ ನೀಡುವ ಪ್ರಸಿದ್ಧ ಯೋಜನೆ.',
    cashBenefitAmount: 100000,
    financialBenefitDetailsEn: 'Maturity benefit of up to ₹1,00,000+ upon girl child attaining 18 years of age, plus annual scholarship for 8th to 10th standard schooling.',
    financialBenefitDetailsKn: 'ಹೆಣ್ಣು ಮಗುವಿಗೆ 18 ವರ್ಷ ತುಂಬಿದಾಗ ₹1,00,000 ಕ್ಕೂ ಹೆಚ್ಚು ಆರ್ಥಿಕ ಪರಿಹಾರ ಹಾಗೂ ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿವೇತನ.',
    freeServicesEn: [
      'Sukanya Samriddhi / Postal Fixed Deposit Account Enrollment',
      'Annual Educational Scholarship from 8th Class Onwards',
      'Free Health Insurance Coverage up to ₹25,000/year for Girl Child'
    ],
    eligibilityCriteria: {
      minAgeMonths: 0,
      maxAgeMonths: 12,
      pregnancyStage: 'POSTPARTUM',
      incomeCategory: ['BPL'],
      parityLimit: 2,
      state: 'Karnataka'
    },
    eligibilityRulesDescriptionEn: 'Girl child born in BPL family in Karnataka registered within 1 year of birth. Maximum 2 girl children per family eligible.',
    eligibilityRulesDescriptionKn: 'ಕರ್ನಾಟಕದ BPL ಕುಟುಂಬದಲ್ಲಿ ಜನಿಸಿದ ಮೊದಲ 2 ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಮಗು ಹುಟ್ಟಿದ 1 ವರ್ಷದೊಳಗೆ ನೋಂದಾಯಿಸಿದರೆ ಅರ್ಹತೆ.',
    requiredDocumentsEn: [
      'Girl Child Birth Certificate',
      'BPL Ration Card of Parents',
      'Mother and Father Aadhaar Card',
      'Immunization Certificate (U-WIN / MCP Card)',
      'Passport size photo of Girl Child with Mother'
    ],
    requiredDocumentsKn: [
      'ಹೆಣ್ಣು ಮಗುವಿನ ಜನನ ಪ್ರಮಾಣ ಪತ್ರ',
      'BPL ಪಡಿತರ ಚೀಟಿ',
      'ತಾಯಿ ಮತ್ತು ತಂದೆಯ ಆಧಾರ್',
      'ಲಸಿಕಾ ನೀಡಿದ ಕಾರ್ಡ್'
    ],
    applicationProcessEn: [
      'Apply through Anganwadi Worker (AWW) or CDPO office within 1 year of child’s birth.',
      'Submit Form along with BPL Ration card and Birth Certificate.',
      'Department opens Sukanya Samriddhi / Bond Account in Girl Child’s name.',
      'Receive official Bhagyalakshmi Bond certificate.'
    ],
    applicationProcessKn: [
      'ಮಗು ಹುಟ್ಟಿದ 1 ವರ್ಷದೊಳಗೆ ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಬಾಂಡ್ ಪಡೆದುಕೊಳ್ಳಿ.'
    ],
    officialWebsite: 'https://wcd.karnataka.gov.in',
    helplineNumber: '080-22355985',
    lastUpdatedDate: '2026-05-10',
    verificationSource: 'Karnataka Dept of WCD Bhagyalakshmi Notification',
    nodalOfficerDesk: 'CDPO (Child Development Project Officer) & Anganwadi Supervisor'
  }
];
