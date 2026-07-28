import { OFFICIAL_GOVERNMENT_SCHEMES, GovernmentScheme } from '../data/governmentSchemesData';
import { OFFICIAL_GOVERNMENT_FACILITIES, GovernmentFacility } from '../data/governmentFacilitiesData';

export interface ProfileInput {
  childId?: string;
  childName?: string;
  childAgeMonths?: number;
  childAgeDays?: number;
  birthWeightKg?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  parity?: number; // 1 for 1st child, 2 for 2nd, etc.
  pregnancyStage?: 'PREGNANT' | 'POSTPARTUM' | 'INFANT' | 'CHILD_UP_TO_6_YRS';
  motherName?: string;
  rchId?: string;
  incomeCategory?: 'BPL' | 'APL' | 'SC_ST' | 'NFSA_CARD';
  district?: string;
  taluk?: string;
  state?: string;
  vaccinesGivenCount?: number;
  availedSchemeIds?: string[];
  isLBW?: boolean;
  hasCongenitalCondition?: boolean;
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

export class WelfareService {
  /**
   * Get all verified official government schemes with optional filters
   */
  public static getSchemes(filter?: {
    category?: string;
    state?: string;
    search?: string;
  }): GovernmentScheme[] {
    let result = [...OFFICIAL_GOVERNMENT_SCHEMES];

    if (filter?.category && filter.category !== 'ALL') {
      result = result.filter(s => s.category === filter.category);
    }

    if (filter?.state && filter.state !== 'ALL') {
      result = result.filter(s => s.eligibilityCriteria.state === 'National' || s.eligibilityCriteria.state === filter.state);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(s => 
        s.nameEn.toLowerCase().includes(q) ||
        s.nameKn.toLowerCase().includes(q) ||
        s.officialSchemeCode.toLowerCase().includes(q) ||
        s.departmentEn.toLowerCase().includes(q) ||
        s.purposeEn.toLowerCase().includes(q)
      );
    }

    return result;
  }

  /**
   * Evaluates dynamic eligibility for a mother & child profile
   */
  public static evaluateProfileEligibility(profile: ProfileInput): SchemeEvaluationResult[] {
    const ageMonths = profile.childAgeMonths ?? (profile.childAgeDays ? profile.childAgeDays / 30.44 : 3);
    const birthWeight = profile.birthWeightKg ?? 2.9;
    const isLBW = profile.isLBW || birthWeight < 2.5;
    const incomeCat = profile.incomeCategory || 'BPL';
    const parity = profile.parity || 1;
    const gender = profile.gender || 'FEMALE';
    const availedSet = new Set(profile.availedSchemeIds || []);

    return OFFICIAL_GOVERNMENT_SCHEMES.map(scheme => {
      let status: 'ELIGIBLE' | 'ALREADY_AVAILED' | 'UPCOMING' | 'NOT_ELIGIBLE' = 'ELIGIBLE';
      let matchScore = 100;
      let rationaleEn = '';
      let rationaleKn = '';
      let nextActionEn = '';
      let nextActionKn = '';

      // Check if already availed
      if (availedSet.has(scheme.id)) {
        status = 'ALREADY_AVAILED';
        matchScore = 90;
        rationaleEn = `This benefit has already been disbursed/availed for this beneficiary record under ${scheme.officialSchemeCode}.`;
        rationaleKn = `ಈ ಯೋಜನೆಯ ಲಭ್ಯತೆಯನ್ನು ಈಗಾಗಲೇ ಪಡೆಯಲಾಗಿದೆ.`;
        nextActionEn = `Keep payment voucher & U-WIN digital slip in health locker.`;
        nextActionKn = `ವೋಚರ್ ಹಾಗೂ ಲಸಿಕಾ ಸ್ಲಿಪ್ ಅನ್ನು ಹೆಲ್ತ್ ಲಾಕರ್‌ನಲ್ಲಿ ಭದ್ರವಾಗಿರಿಸಿ.`;
      } else {
        // Specific Scheme Rules Logic
        switch (scheme.id) {
          case 'GOV-SCH-PMMVY-01': // PMMVY
            if (parity <= 1 || (parity === 2 && gender === 'FEMALE')) {
              status = 'ELIGIBLE';
              matchScore = 98;
              rationaleEn = `Eligible for ₹5,000 cash transfer for 1st live birth or ₹6,000 for 2nd girl child. Beneficiary falls under ${incomeCat} criteria.`;
              rationaleKn = `BPL ಕುಟುಂಬದ 1ನೇ ಮಗುವಿಗೆ ₹5,000 ಅಥವಾ 2ನೇ ಹೆಣ್ಣು ಮಗುವಿಗೆ ₹6,000 ಪಡೆಯಲು ಅರ್ಹರು.`;
              nextActionEn = `Submit Form 1-A at local Anganwadi Centre along with MCP Card & Aadhaar seeded bank passbook.`;
              nextActionKn = `ತಾಯಿ ಕಾರ್ಡ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್‌ನೊಂದಿಗೆ ಅಂಗನವಾಡಿಯಲ್ಲಿ ಫಾರ್ಮ್ 1-ಎ ಸಲ್ಲಿಸಿ.`;
            } else {
              status = 'NOT_ELIGIBLE';
              matchScore = 20;
              rationaleEn = `PMMVY 2.0 guidelines limit financial cash transfers to 1st live birth and 2nd girl child.`;
              rationaleKn = `PMMVY ನಿಯಮಾವಳಿಯಂತೆ 1ನೇ ಮಗು ಹಾಗೂ 2ನೇ ಹೆಣ್ಣು ಮಗುವಿಗೆ ಮಾತ್ರ ನಗದು ಸೌಲಭ್ಯ ಸೀಮಿತವಾಗಿದೆ.`;
              nextActionEn = `Explore Universal Immunization and JSSK healthcare benefits.`;
              nextActionKn = `ಇತರ ಸಾರ್ವತ್ರಿಕ ಆರೋಗ್ಯ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`;
            }
            break;

          case 'GOV-SCH-JSY-02': // JSY
            if (incomeCat === 'BPL' || incomeCat === 'SC_ST') {
              status = 'ELIGIBLE';
              matchScore = 95;
              rationaleEn = `Eligible for ₹1,400 (Rural) / ₹700 (Urban) cash transfer for institutional delivery in Government PHC/CHC.`;
              rationaleKn = `ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ ಹೆರಿಗೆಗಾಗಿ ₹1,400 (ಗ್ರಾಮೀಣ) ನಗದು ಧನಕ್ಕೆ ಅರ್ಹರು.`;
              nextActionEn = `Provide discharge summary and Aadhaar linked bank details at PHC Medical Officer desk.`;
              nextActionKn = `PHC ವೈದ್ಯಾಧಿಕಾರಿ ಬಳಿ ಡಿಸ್ಚಾರ್ಜ್ ಸಮ್ಮರಿ ನೀಡಿ ನಗದು ಪಡೆಯಿರಿ.`;
            } else {
              status = 'NOT_ELIGIBLE';
              matchScore = 40;
              rationaleEn = `Janani Suraksha Yojana cash transfers are targeted towards BPL / SC / ST families.`;
              rationaleKn = `JSY ನಗದು ಸೌಲಭ್ಯವು BPL ಮತ್ತು SC/ST ಕುಟುಂಬಗಳಿಗೆ ಆದ್ಯತೆ ಹೊಂದಿದೆ.`;
              nextActionEn = `Avail free JSSK hospital services.`;
              nextActionKn = `ಉಚಿತ JSSK ಸೌಲಭ್ಯ ಪಡೆಯಿರಿ.`;
            }
            break;

          case 'GOV-SCH-JSSK-03': // JSSK (Universal 100% Free)
            status = 'ELIGIBLE';
            matchScore = 100;
            rationaleEn = `100% Universal Free Entitlement! Zero out-of-pocket expenses for delivery, diagnostics, drugs, diet, and 108 ambulance transport up to 1 year of infant age.`;
            rationaleKn = `100% ಸಂಪೂರ್ಣ ಉಚಿತ! 1 ವರ್ಷದವರೆಗಿನ ಮಗುವಿಗೆ ಔಷಧಿ, ರಕ್ತ ತಪಾಸಣೆ ಮತ್ತು ಆಂಬುಲೆನ್ಸ್ ಉಚಿತ.`;
            nextActionEn = `Present RCH ID at any Government Hospital counter to avail zero-billing.`;
            nextActionKn = `ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ RCH ID ತೋರಿಸಿ ಉಚಿತ ಸೇವೆ ಪಡೆಯಿರಿ.`;
            break;

          case 'GOV-SCH-RBSK-04': // RBSK (4Ds)
            status = 'ELIGIBLE';
            matchScore = 96;
            rationaleEn = `Eligible for free screening & tertiary surgical correction for 30 specified health conditions (Congenital Heart Defect, Clubfoot, Cleft Lip).`;
            rationaleKn = `ಮಗುವಿಗೆ ಹುಟ್ಟು ನ್ಯೂನತೆ, ಹೃದಯ ರೋಗ ಹಾಗೂ ಬೆಳವಣಿಗೆಯ 4Ds ಪರೀಕ್ಷೆ ಉಚಿತ.`;
            nextActionEn = `Get screening done by visiting RBSK Mobile Health Team at local Anganwadi or District Early Intervention Centre (DEIC).`;
            nextActionKn = `ಸ್ಥಳೀಯ ಅಂಗನವಾಡಿಯಲ್ಲಿ RBSK ವೈದ್ಯರ ತಂಡದಿಂದ ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.`;
            break;

          case 'GOV-SCH-UIP-05': // Universal Immunization Programme
            status = 'ELIGIBLE';
            matchScore = 100;
            rationaleEn = `Universal Zero-Cost Vaccine Coverage. All 12 essential pediatric vaccines (BCG, OPV, Pentavalent, PCV, MR) are funded 100% by MoHFW.`;
            rationaleKn = `ಎಲ್ಲಾ 12 ಬಗೆಯ ಪ್ರಮುಖ ಲಸಿಕೆಗಳು 100% ಉಚಿತ.`;
            nextActionEn = `Visit Anganwadi on VHSND Day or PHC Immunization booth. Ensure U-WIN digital logging.`;
            nextActionKn = `ಅಂಗನವಾಡಿ ದಿನದಂದು ಲಸಿಕೆ ಹಾಕಿಸಿ U-WIN ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ.`;
            break;

          case 'GOV-SCH-POSHAN-06': // POSHAN Abhiyaan / ICDS
            status = 'ELIGIBLE';
            matchScore = 95;
            rationaleEn = `Eligible for monthly Take-Home Ration (THR Pushthi fortified flour) and hot cooked meals at local Anganwadi Centre.`;
            rationaleKn = `ಅಂಗನವಾಡಿಯಲ್ಲಿ ಉಚಿತ ಪೌಷ್ಟಿಕ ಆಹಾರ ಹಾಗೂ ಮನೆಗೆ ಕೊಂಡೊಯ್ಯುವ ಹಿಟ್ಟು ಪಡೆಯಲು ಅರ್ಹರು.`;
            nextActionEn = `Ensure mother & child are registered in Poshan Tracker app by local Anganwadi Worker (AWW).`;
            nextActionKn = `ಅಂಗನವಾಡಿ ಕಾರ್ಯಕರ್ತೆಯಿಂದ ಪೋಷಣ್ ಟ್ರ್ಯಾಕರ್ ಆಪ್‌ನಲ್ಲಿ ಹೆಸರು ದಾಖಲಿಸಿ.`;
            break;

          case 'GOV-SCH-KMC-07': // KMC Incentive
            if (isLBW && ageMonths <= 2) {
              status = 'ELIGIBLE';
              matchScore = 99;
              rationaleEn = `HIGH PRIORITY ELIGIBILITY! Infant birth weight is ${birthWeight}kg (<2.5kg). Eligible for ₹1,000 incentive upon 7 days KMC log completion.`;
              rationaleKn = `ವಿಶೇಷ ಆದ್ಯತೆ! ಮಗುವಿನ ತೂಕ ${birthWeight}kg ಇದ್ದು KMC 7 ದಿನ ಪೂರೈಸಿದರೆ ₹1,000 ಪ್ರೋತ್ಸಾಹಧನ ಲಭ್ಯ.`;
              nextActionEn = `Practice continuous skin-to-skin KMC and get ASHA KMC Logbook verified at PHC.`;
              nextActionKn = `ಆಶಾ ಕಾರ್ಯಕರ್ತರ ಲಾಗ್‌ಬುಕ್ ಪೂರ್ಣಗೊಳಿಸಿ PHC ಯಲ್ಲಿ ₹1,000 ಕ್ಲೈಮ್ ಮಾಡಿ.`;
            } else if (ageMonths > 2) {
              status = 'UPCOMING';
              matchScore = 30;
              rationaleEn = `Kangaroo Mother Care incentive is targeted for newborns in the first 0-2 months of life.`;
              rationaleKn = `KMC ಸೌಲಭ್ಯವು ನವಜಾತ 0-2 ತಿಂಗಳ ಶಿಶುಗಳಿಗೆ ಲಭ್ಯವಿತ್ತು.`;
              nextActionEn = `Focus on growth monitoring & immunization.`;
              nextActionKn = `ಬೆಳವಣಿಗೆ ಮತ್ತು ಲಸಿಕೆ ಕಡೆಗೆ ಗಮನಹರಿಸಿ.`;
            } else {
              status = 'NOT_ELIGIBLE';
              matchScore = 40;
              rationaleEn = `Child birth weight is normal (${birthWeight}kg >= 2.5kg). KMC incentive is reserved for Low Birth Weight infants.`;
              rationaleKn = `ಮಗುವಿನ ತೂಕ ಸಾಮಾನ್ಯವಾಗಿದೆ (${birthWeight}kg). KMC ಪ್ರೋತ್ಸಾಹಧನ ಕಡಿಮೆ ತೂಕದ ಶಿಶುಗಳಿಗೆ ಮಾತ್ರ.`;
              nextActionEn = `Follow standard exclusive breastfeeding protocol.`;
              nextActionKn = `ಸಾರ್ವತ್ರಿಕ ಎದೆಹಾಲು ಉಣಿಸುವಿಕೆ ಮುಂದುವರಿಸಿ.`;
            }
            break;

          case 'GOV-SCH-ABDM-CHILD-08': // ABHA Child Health Account
            status = 'ELIGIBLE';
            matchScore = 98;
            rationaleEn = `Eligible to create 14-digit ABHA Child Health Account linked to Mother's Aadhaar for digital records.`;
            rationaleKn = `ತಾಯಿಯ ಆಧಾರ್ ಮೂಲಕ ಮಗುವಿಗೆ 14 ಅಂಕಿಯ ಉಚಿತ ABHA ಹೆಲ್ತ್ ಐಡಿ ಪಡೆಯಲು ಅರ್ಹರು.`;
            nextActionEn = `Click 'Generate ABHA ID' button below to create digital child health card instantly.`;
            nextActionKn = `ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ 'Generate ABHA ID' ಒತ್ತಿ ಡಿಜಿಟಲ್ ಹೆಲ್ತ್ ಐಡಿ ಪಡೆಯಿರಿ.`;
            break;

          case 'GOV-SCH-ESANJEEVANI-09': // eSanjeevani OPD
            status = 'ELIGIBLE';
            matchScore = 100;
            rationaleEn = `24x7 100% Free Tele-pediatric video consultation available with Government Doctors.`;
            rationaleKn = `24x7 ಉಚಿತ ವೀಡಿಯೋ ವೈದ್ಯಕೀಯ ಸಮಾಲೋಚನೆ ಲಭ್ಯ.`;
            nextActionEn = `Launch eSanjeevani OPD portal to talk to a pediatrician directly.`;
            nextActionKn = `esanjeevani.in ಮೂಲಕ ಮಕ್ಕಳ ತಜ್ಞರ ಜೊತೆ ವೀಡಿಯೋ ಕಾಲ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.`;
            break;

          case 'GOV-SCH-BHAGYALAKSHMI-10': // Bhagyalakshmi / Sukanya Samriddhi
            if (gender === 'FEMALE' && incomeCat === 'BPL' && parity <= 2 && ageMonths <= 12) {
              status = 'ELIGIBLE';
              matchScore = 98;
              rationaleEn = `HIGH PRIORITY BENEFIT! Girl child in BPL family enrolled under 1 year. Eligible for ₹1,00,000+ maturity benefit at age 18.`;
              rationaleKn = `ವಿಶೇಷ ಹೆಣ್ಣು ಮಗುವಿನ ಯೋಜನೆ! BPL ಕುಟುಂಬದ ಹೆಣ್ಣು ಮಗುವಿಗೆ 18 ವರ್ಷ ತುಂಬಿದಾಗ ₹1,00,000 ಬಾಂಡ್ ಸೌಲಭ್ಯ.`;
              nextActionEn = `Submit application to CDPO / Anganwadi Worker before child completes 1st birthday.`;
              nextActionKn = `ಮಗುವಿಗೆ 1 ವರ್ಷ ಪೂರೈಸುವ ಮುನ್ನ ಅಂಗನವಾಡಿಯಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`;
            } else if (gender !== 'FEMALE') {
              status = 'NOT_ELIGIBLE';
              matchScore = 10;
              rationaleEn = `Bhagyalakshmi / Sukanya Samriddhi scheme is exclusively designed for Girl Children.`;
              rationaleKn = `ಭಾಗ್ಯಲಕ್ಷ್ಮಿ ಯೋಜನೆಯು ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿದೆ.`;
              nextActionEn = `Explore PMMVY and POSHAN nutrition benefits for boy child.`;
              nextActionKn = `ಇತರ ಸಾರ್ವತ್ರಿಕ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`;
            } else if (ageMonths > 12) {
              status = 'NOT_ELIGIBLE';
              matchScore = 30;
              rationaleEn = `Enrollment deadline for Bhagyalakshmi scheme is within 12 months of birth.`;
              rationaleKn = `ಮಗು ಹುಟ್ಟಿದ 12 ತಿಂಗಳೊಳಗೆ ನೋಂದಣಿ ಮಾಡುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.`;
              nextActionEn = `Contact CDPO office for late-enrollment waiver provisions.`;
              nextActionKn = `ಸಿಡಿಪಿಒ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
            } else {
              status = 'NOT_ELIGIBLE';
              matchScore = 40;
              rationaleEn = `Targeted for BPL girl children.`;
              rationaleKn = `BPL ಹೆಣ್ಣು ಮಕ್ಕಳಿಗೆ ಮಾತ್ರ ಅರ್ಹತೆ.`;
              nextActionEn = `Check Sukanya Samriddhi account at nearest Post Office.`;
              nextActionKn = `ಅಂಚೆ ಕಚೇರಿಯಲ್ಲಿ ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ ಖಾತೆ ತೆರೆಯಿರಿ.`;
            }
            break;

          default:
            status = 'ELIGIBLE';
            matchScore = 80;
            rationaleEn = `Beneficiary meets general eligibility parameters of ${scheme.nameEn}.`;
            rationaleKn = `ಮಗು ${scheme.nameKn} ಸೌಲಭ್ಯಕ್ಕೆ ಅರ್ಹತೆ ಹೊಂದಿದೆ.`;
            nextActionEn = `Visit nearest PHC to apply.`;
            nextActionKn = `ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.`;
            break;
        }
      }

      return {
        scheme,
        status,
        statusLabelEn: status === 'ELIGIBLE' ? 'ELIGIBLE' : status === 'ALREADY_AVAILED' ? 'ALREADY AVAILED' : status === 'UPCOMING' ? 'UPCOMING STAGE' : 'NOT ELIGIBLE',
        statusLabelKn: status === 'ELIGIBLE' ? 'ಅರ್ಹರು (ELIGIBLE)' : status === 'ALREADY_AVAILED' ? 'ಪಡೆಯಲಾಗಿದೆ (AVAILED)' : status === 'UPCOMING' ? 'ಮುಂದಿನ ಹಂತ (UPCOMING)' : 'ಅರ್ಹರಿಲ್ಲ (NOT ELIGIBLE)',
        matchScore,
        eligibilityRationaleEn: rationaleEn,
        eligibilityRationaleKn: rationaleKn,
        nextActionStepEn: nextActionEn,
        nextActionStepKn: nextActionKn,
        unavailedAmount: (status === 'ELIGIBLE' && scheme.cashBenefitAmount) ? scheme.cashBenefitAmount : 0
      };
    });
  }

  /**
   * Search nearby government facilities (PHCs, CHCs, Anganwadis)
   */
  public static getNearbyFacilities(district?: string, taluk?: string, type?: string): GovernmentFacility[] {
    let facilities = [...OFFICIAL_GOVERNMENT_FACILITIES];

    if (district && district !== 'ALL') {
      facilities = facilities.filter(f => f.district.toLowerCase().includes(district.toLowerCase()) || f.district.includes('Statewide'));
    }

    if (taluk && taluk !== 'ALL') {
      facilities = facilities.filter(f => f.taluk.toLowerCase().includes(taluk.toLowerCase()) || f.taluk.includes('Digital'));
    }

    if (type && type !== 'ALL') {
      facilities = facilities.filter(f => f.type === type);
    }

    return facilities;
  }

  /**
   * Generates AI Scheme Advice based strictly on verified official government rules
   */
  public static generateAiSchemeAdvice(profile: ProfileInput, lang: string = 'en') {
    const evaluations = this.evaluateProfileEligibility(profile);
    const eligibleSchemes = evaluations.filter(e => e.status === 'ELIGIBLE');
    const totalCashAvailable = eligibleSchemes.reduce((acc, curr) => acc + (curr.scheme.cashBenefitAmount || 0), 0);
    const freeHealthcareCount = eligibleSchemes.filter(e => e.scheme.freeServicesEn.length > 0).length;

    const topRecommendations = eligibleSchemes
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    const isKn = lang === 'kn';

    const summaryTextEn = `Based on verified MoHFW & Karnataka Govt guidelines for ${profile.childName || 'Child'} (Age: ${Math.round(profile.childAgeMonths || 3)} months, BPL category), your family is eligible for ₹${totalCashAvailable.toLocaleString('en-IN')} in financial benefits and ${freeHealthcareCount} 100% free healthcare/nutrition services.`;

    const summaryTextKn = `${profile.childName || 'ಮಗುವಿನ'} (ವಯಸ್ಸು: ${Math.round(profile.childAgeMonths || 3)} ತಿಂಗಳು, BPL ವರ್ಗ) ದಾಖಲೆಗಳ ಪ್ರಕಾರ, ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ₹${totalCashAvailable.toLocaleString('en-IN')} ನಗದು ಪ್ರೋತ್ಸಾಹಧನ ಹಾಗೂ ${freeHealthcareCount} ಉಚಿತ ಆರೋಗ್ಯ/ಆಹಾರ ಸೇವೆಗಳು ಲಭ್ಯವಿವೆ.`;

    const immediateActionStepEn = topRecommendations.length > 0
      ? `Priority Action: ${topRecommendations[0].nextActionStepEn}`
      : `Visit your nearest Primary Health Centre (PHC) for Routine Child Screening.`;

    const immediateActionStepKn = topRecommendations.length > 0
      ? `ಆದ್ಯತೆಯ ಕ್ರಮ: ${topRecommendations[0].nextActionStepKn}`
      : `ನಿಯಮಿತ ಪರೀಕ್ಷೆಗೆ ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ (PHC) ಭೇಟಿ ನೀಡಿ.`;

    return {
      summary: isKn ? summaryTextKn : summaryTextEn,
      totalEligibleCount: eligibleSchemes.length,
      totalCashAvailable,
      freeHealthcareCount,
      immediateActionStep: isKn ? immediateActionStepKn : immediateActionStepEn,
      topRecommendedSchemes: topRecommendations.map(rec => ({
        schemeCode: rec.scheme.officialSchemeCode,
        schemeName: isKn ? rec.scheme.nameKn : rec.scheme.nameEn,
        purpose: isKn ? rec.scheme.purposeKn : rec.scheme.purposeEn,
        cashBenefit: rec.scheme.cashBenefitAmount,
        whyEligible: isKn ? rec.eligibilityRationaleKn : rec.eligibilityRationaleEn,
        nextStep: isKn ? rec.nextActionStepKn : rec.nextActionStepEn,
        officialPortal: rec.scheme.officialWebsite,
        helpline: rec.scheme.helplineNumber,
        requiredDocs: isKn ? rec.scheme.requiredDocumentsKn : rec.scheme.requiredDocumentsEn
      })),
      verificationNotice: "All recommendations are strictly generated from published Government of India (MoHFW/MoWCD) & Karnataka State Government Gazettes."
    };
  }
}
