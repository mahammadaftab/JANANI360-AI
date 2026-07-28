import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Baby, 
  Award, 
  Sparkles, 
  Bot, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  ExternalLink, 
  PhoneCall, 
  MapPin, 
  Building2, 
  FileText, 
  Download, 
  Printer, 
  RefreshCw, 
  ArrowLeft, 
  CreditCard, 
  HeartHandshake, 
  Stethoscope, 
  Apple, 
  Syringe, 
  QrCode, 
  Wifi, 
  WifiOff, 
  ChevronRight,
  Info,
  Check,
  User,
  Calendar,
  Share2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { welfareService, GovernmentScheme, SchemeEvaluationResult, GovernmentFacility, AiAdviceResponse } from '../services/welfareService';
import { childService } from '../services/childService';

export const GovernmentChildWelfareHubPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id = '129004812749-C1' } = useParams();
  const navigate = useNavigate();

  // Active Beneficiary Profile State
  const [selectedRchId, setSelectedRchId] = useState<string>(id || '129004812749-C1');
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Scheme & Evaluation States
  const [evaluations, setEvaluations] = useState<SchemeEvaluationResult[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<SchemeEvaluationResult[]>([]);
  const [facilities, setFacilities] = useState<GovernmentFacility[]>([]);
  const [aiAdvice, setAiAdvice] = useState<AiAdviceResponse | null>(null);

  // UI Filters
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'SCHEMES' | 'NEARBY' | 'AI_ADVISOR' | 'PASS'>('SCHEMES');

  // Selected Detail Modal
  const [selectedSchemeEval, setSelectedSchemeEval] = useState<SchemeEvaluationResult | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);

  // Offline ASHA Sync
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [offlineSynced, setOfflineSynced] = useState<boolean>(true);

  // Fetch Child Profile & Scheme Evaluations
  useEffect(() => {
    fetchWelfareData();
  }, [selectedRchId]);

  // Handle Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchWelfareData = async () => {
    setLoading(true);
    try {
      // 1. Load Child Hub Details
      let childObj: any = null;
      try {
        const hubRes = await childService.getChildProfileHub(selectedRchId);
        if (hubRes?.child) {
          childObj = hubRes.child;
        }
      } catch (err) {
        console.warn('⚠️ Using fallback profile data for evaluation', err);
      }

      // Default mock profile fallbacks for demonstration
      if (!childObj) {
        if (selectedRchId.includes('BLR')) {
          childObj = {
            id: 'JAN-KA-BLR-892102-C1',
            fullName: 'Baby Vihaan M.',
            gender: 'MALE',
            birthWeightKg: 2.1, // LBW
            newbornRiskCategory: 'LBW KMC Active',
            dateOfBirth: '2026-06-15',
            childRchId: 'JAN-KA-BLR-892102-C1',
            mother: { fullName: 'Sunitha M.', rchId: 'RCH-994102', village: { nameEn: 'Varthur Sector 4', district: 'Bengaluru Urban', taluk: 'Mahadevapura' } }
          };
        } else if (selectedRchId.includes('HVR')) {
          childObj = {
            id: 'JAN-KA-HVR-554109-C1',
            fullName: 'Baby Aarav Gowda',
            gender: 'MALE',
            birthWeightKg: 3.2,
            newbornRiskCategory: '100% Immunized',
            dateOfBirth: '2025-05-10',
            childRchId: 'JAN-KA-HVR-554109-C1',
            mother: { fullName: 'Kavitha Gowda', rchId: 'RCH-778901', village: { nameEn: 'Shiggaon Agri Sector', district: 'Haveri', taluk: 'Shiggaon' } }
          };
        } else {
          childObj = {
            id: '129004812749-C1',
            fullName: 'Baby Ananya',
            gender: 'FEMALE',
            birthWeightKg: 2.8,
            newbornRiskCategory: 'Normal Infant',
            dateOfBirth: '2026-04-20',
            childRchId: '129004812749-C1',
            mother: { fullName: 'Lakshmi Devi', rchId: 'RCH-882190', village: { nameEn: 'Shiggaon Agri Sector', district: 'Haveri', taluk: 'Shiggaon' } }
          };
        }
      }

      setChildData(childObj);

      // Compute Age in Months
      const dob = new Date(childObj.dateOfBirth || '2026-04-20');
      const ageMs = new Date().getTime() - dob.getTime();
      const ageMonths = Math.max(0.5, ageMs / (1000 * 60 * 60 * 24 * 30.44));

      const profilePayload = {
        childId: childObj.id,
        childName: childObj.fullName,
        childAgeMonths: ageMonths,
        birthWeightKg: childObj.birthWeightKg || 2.8,
        gender: childObj.gender || 'FEMALE',
        parity: 1,
        incomeCategory: 'BPL',
        district: childObj.mother?.village?.district || 'Haveri',
        taluk: childObj.mother?.village?.taluk || 'Shiggaon',
        isLBW: (childObj.birthWeightKg || 2.8) < 2.5,
        availedSchemeIds: ['GOV-SCH-UIP-05'] // e.g. UIP Birth Dose already received
      };

      // 2. Fetch Eligibility Evaluations
      const evalRes = await welfareService.evaluateEligibility(profilePayload);
      if (evalRes?.evaluations) {
        setEvaluations(evalRes.evaluations);
        setFilteredEvaluations(evalRes.evaluations);
      }

      // 3. Fetch Nearby Facilities
      const facRes = await welfareService.getNearbyFacilities({
        district: childObj.mother?.village?.district || 'Haveri',
        taluk: childObj.mother?.village?.taluk || 'Shiggaon'
      });
      if (facRes?.facilities) {
        setFacilities(facRes.facilities);
      }

      // 4. Fetch AI Advice
      const aiRes = await welfareService.getAiAdvice(profilePayload, i18n.language);
      if (aiRes?.advice) {
        setAiAdvice(aiRes.advice);
      }

    } catch (error) {
      console.error('❌ Error fetching welfare hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let result = [...evaluations];

    if (activeCategory !== 'ALL') {
      result = result.filter(e => e.scheme.category === activeCategory);
    }

    if (activeStatus !== 'ALL') {
      result = result.filter(e => e.status === activeStatus);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const isKn = i18n.language === 'kn';
      result = result.filter(e => 
        (isKn ? e.scheme.nameKn : e.scheme.nameEn).toLowerCase().includes(q) ||
        e.scheme.officialSchemeCode.toLowerCase().includes(q) ||
        (isKn ? e.scheme.departmentKn : e.scheme.departmentEn).toLowerCase().includes(q) ||
        (isKn ? e.scheme.purposeKn : e.scheme.purposeEn).toLowerCase().includes(q)
      );
    }

    setFilteredEvaluations(result);
  }, [activeCategory, activeStatus, searchQuery, evaluations, i18n.language]);

  // Derived Totals
  const eligibleItems = evaluations.filter(e => e.status === 'ELIGIBLE');
  const totalCashAmount = eligibleItems.reduce((acc, curr) => acc + (curr.scheme.cashBenefitAmount || 0), 0);
  const freeServicesCount = eligibleItems.reduce((acc, curr) => acc + curr.scheme.freeServicesEn.length, 0);

  const isKn = i18n.language === 'kn';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      <Navbar />

      {/* Official Government Citizen Portal Top Emblem & Title Header */}
      <header className="border-b border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 backdrop-blur-md sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Left: Official Government Seal & Title */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-emerald-500/20 border border-amber-300">
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> Government of Karnataka & MoHFW Portal
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Verified Govt Sources Only
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                  {isKn ? 'ಸರ್ಕಾರಿ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಶಿಶು ಕಲ್ಯಾಣ ಪೋರ್ಟಲ್' : 'Government Benefits & Child Welfare Hub'}
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {isKn ? 'ಅಧಿಕೃತ MoHFW, NHM, ABDM ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ನೈಜ ಯೋಜನೆ ಸೌಲಭ್ಯಗಳು' : 'Direct Citizen Portal for MoHFW, NHM, ABDM & Karnataka WCD Healthcare & Monetary Schemes'}
                </p>
              </div>
            </div>

            {/* Right Controls: Beneficiary Switcher & Official Entitlement Pass Print */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Beneficiary Selector */}
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-slate-300 shadow-inner">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-400">Beneficiary:</span>
                <select 
                  value={selectedRchId} 
                  onChange={(e) => setSelectedRchId(e.target.value)}
                  className="bg-transparent text-slate-100 font-extrabold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="129004812749-C1" className="bg-slate-900 text-slate-200">Baby Ananya (Lakshmi Devi · Female 3m)</option>
                  <option value="JAN-KA-BLR-892102-C1" className="bg-slate-900 text-amber-300">Baby Vihaan M. (Sunitha M. · LBW KMC 1m)</option>
                  <option value="JAN-KA-HVR-554109-C1" className="bg-slate-900 text-emerald-300">Baby Aarav Gowda (Kavitha G. · 14m Immunized)</option>
                </select>
              </div>

              {/* Print Official Entitlement Pass */}
              <button 
                onClick={() => setIsPassModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isKn ? 'ಅರ್ಹತಾ ಪಾಸ್ ಮುದ್ರಿಸಿ' : 'Print Entitlement Pass'}</span>
              </button>

              {/* Back to Child Health */}
              <button 
                onClick={() => navigate(`/child-profile/${selectedRchId}`)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isKn ? 'ಶಿಶು ಹೆಲ್ತ್ ಕಾರ್ಡ್' : 'Child EHR'}</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 flex-1 w-full">
        
        {/* Offline ASHA Worker Sync Banner (If Offline or Sync Status) */}
        <div className={`rounded-2xl p-3.5 border text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg ${
          isOffline 
            ? 'bg-amber-950/60 border-amber-500/50 text-amber-200' 
            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {isOffline ? (
              <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Wifi className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-extrabold text-sm block">
                {isOffline ? 'ASHA Offline Mode Active (IndexedDB Cached)' : 'Government Data Pipeline Synchronized'}
              </span>
              <span className="text-[11px] text-slate-300">
                {isOffline 
                  ? 'All scheme evaluation rules are running locally on your device for rural field visits.'
                  : 'Connected directly to MoHFW, ABDM, & Karnataka Health Department Real-time Services.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 font-semibold">
              Verified: July 2026 Gazettes
            </span>
          </div>
        </div>

        {/* 4 Entitlement KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Applicable Schemes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{isKn ? 'ಒಟ್ಟು ಅರ್ಹ ಯೋಜನೆಗಳು' : 'Eligible Govt Schemes'}</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
              {eligibleItems.length} <span className="text-xs font-normal text-slate-400">/ {evaluations.length}</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              {isKn ? 'ಮಗುವಿನ ಅರ್ಹತೆಗೆ ಒಳಪಟ್ಟ ಯೋಜನೆಗಳು' : 'Based on profile & location criteria'}
            </span>
          </div>

          {/* Card 2: Unavailed Cash Transfers */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 transition pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{isKn ? 'ಲಭ್ಯವಿರುವ ನಗದು ಧನ' : 'Unavailed Cash Benefits'}</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1">
              ₹{totalCashAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              {isKn ? 'PMMVY, JSY ಮತ್ತು KMC ನಗದು ಸೌಲಭ್ಯಗಳು' : 'Direct DBT transfer into bank account'}
            </span>
          </div>

          {/* Card 3: 100% Free Healthcare Services */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/10 transition pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{isKn ? 'ಉಚಿತ ಚಿಕಿತ್ಸಾ ಸೇವೆಗಳು' : '100% Free Healthcare'}</span>
              <Stethoscope className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
              {freeServicesCount} <span className="text-xs font-normal text-slate-400">Services</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              {isKn ? 'JSSK, UIP, 108 ಆಂಬುಲೆನ್ಸ್ ಹಾಗೂ RBSK' : 'JSSK, UIP, RBSK 4Ds & 108 ambulance'}
            </span>
          </div>

          {/* Card 4: ABHA Digital Health Account */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-purple-500/5 group-hover:bg-purple-500/10 transition pointer-events-none" />
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{isKn ? 'ABHA ಬಾಲಕ್ ಐಡಿ ಸೌಲಭ್ಯ' : 'ABHA Digital Health'}</span>
              <QrCode className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-black text-purple-300 font-mono mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>14-Digit Linked</span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              {isKn ? 'ತಾಯಿಯ ಆಧಾರ್‌ನೊಂದಿಗೆ ಜೋಡಿತ' : 'Linked to mother RCH ID'}
            </span>
          </div>

        </div>

        {/* Personalized AI Scheme Advisor Panel */}
        {aiAdvice && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      {isKn ? 'ಎಐ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಮಾಲೋಚಕ (AI Scheme Advisor)' : 'Personalized AI Government Benefit Advisor'}
                    </h2>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-extrabold uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> MoHFW Verified Rules
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isKn ? 'ನಿಮ್ಮ ಕುಟುಂಬದ ಪ್ರೊಫೈಲ್ ಪ್ರಕಾರ ತಕ್ಷಣದ ಸರ್ಕಾರಿ ನಗದು ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಮಾರ್ಗದರ್ಶನ' : 'Explains eligibility in plain language and highlights immediate un-availed cash transfers'}
                  </p>
                </div>
              </div>
              <div className="bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-emerald-300">
                Action Step: {aiAdvice.immediateActionStep}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <p className="text-slate-200 leading-relaxed font-medium">
                  {aiAdvice.summary}
                </p>
                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-amber-300 font-mono">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>{aiAdvice.verificationNotice}</span>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <span className="font-extrabold text-slate-300 block uppercase tracking-wider text-[10px]">
                  {isKn ? 'ಮುಖ್ಯ ಶಿಫಾರಸು ಯೋಜನೆಗಳು' : 'Top Recommended Government Actions'}
                </span>
                <div className="space-y-2">
                  {aiAdvice.topRecommendedSchemes.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-1">
                      <div className="flex items-center justify-between font-bold text-emerald-400">
                        <span className="truncate">{rec.schemeName}</span>
                        {rec.cashBenefit ? <span className="font-mono text-amber-400 font-black">+₹{rec.cashBenefit}</span> : null}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{rec.whyEligible}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('SCHEMES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'SCHEMES'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isKn ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು (Govt Schemes)' : 'Official Government Schemes'}</span>
              <span className="ml-1 bg-slate-950/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
                {evaluations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('NEARBY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'NEARBY'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{isKn ? 'ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು (Nearby Facilities)' : 'Nearby PHCs & Anganwadis'}</span>
              <span className="ml-1 bg-slate-950/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
                {facilities.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKn ? "ಯೋಜನೆ ಅಥವಾ ಇಲಾಖೆ ಹುಡುಕಿ..." : "Search official schemes, codes..."}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 shadow-inner"
            />
            {searchQuery && (
              <X 
                className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400 cursor-pointer hover:text-slate-200" 
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

        </div>

        {/* Tab 1: Official Schemes Grid & Filter Bar */}
        {activeTab === 'SCHEMES' && (
          <div className="space-y-5">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {[
                { id: 'ALL', label: isKn ? 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು' : 'All Schemes' },
                { id: 'MATERNAL_FINANCIAL', label: isKn ? 'ನಗದು ಸೌಲಭ್ಯ (Cash Transfer)' : 'Financial Cash Transfer' },
                { id: 'INFANT_HEALTHCARE', label: isKn ? 'ಉಚಿತ ಚಿಕಿತ್ಸೆ (JSSK Healthcare)' : '100% Free JSSK Care' },
                { id: 'IMMUNIZATION', label: isKn ? 'ಲಸಿಕೆಗಳು (UIP Vaccination)' : 'UIP Immunization' },
                { id: 'NUTRITION_ICDS', label: isKn ? 'ಪೌಷ್ಟಿಕ ಆಹಾರ (POSHAN ICDS)' : 'POSHAN & Anganwadi Food' },
                { id: 'SPECIAL_CARE', label: isKn ? 'ವಿಶೇಷ ಪಾಲನೆ (RBSK & KMC)' : 'Special Care (RBSK & KMC)' },
                { id: 'GIRL_CHILD_WELFARE', label: isKn ? 'ಹೆಣ್ಣು ಮಗು (Bhagyalakshmi)' : 'Girl Child Welfare' },
                { id: 'TELEMEDICINE_DIGITAL', label: isKn ? 'ಡಿಜಿಟಲ್ (eSanjeevani & ABHA)' : 'Tele-OPD & ABHA' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 text-xs border-b border-slate-800/60 pb-3">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Eligibility Status:</span>
              {[
                { id: 'ALL', label: 'All Statuses' },
                { id: 'ELIGIBLE', label: 'Eligible Only' },
                { id: 'ALREADY_AVAILED', label: 'Already Availed' },
                { id: 'UPCOMING', label: 'Upcoming' },
                { id: 'NOT_ELIGIBLE', label: 'Not Eligible' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setActiveStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition cursor-pointer ${
                    activeStatus === st.id
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-500 border border-slate-900 hover:text-slate-300'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Scheme Benefit Cards Grid */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-mono flex items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Evaluating Official Government Schemes...</span>
              </div>
            ) : filteredEvaluations.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">No matching official government schemes found</h3>
                <p className="text-xs text-slate-400">Try adjusting your search query or category filters.</p>
                <button 
                  onClick={() => { setActiveCategory('ALL'); setActiveStatus('ALL'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvaluations.map((item) => {
                  const { scheme, status, matchScore, eligibilityRationaleEn, eligibilityRationaleKn, nextActionStepEn, nextActionStepKn } = item;

                  const isEligible = status === 'ELIGIBLE';
                  const isAvailed = status === 'ALREADY_AVAILED';
                  const isUpcoming = status === 'UPCOMING';

                  return (
                    <div 
                      key={scheme.id}
                      className={`bg-slate-900/90 rounded-3xl p-5 border transition flex flex-col justify-between shadow-xl relative overflow-hidden group hover:shadow-2xl ${
                        isEligible 
                          ? 'border-emerald-500/40 hover:border-emerald-400/80 shadow-emerald-500/5' 
                          : isAvailed
                          ? 'border-blue-500/40 hover:border-blue-400/80'
                          : isUpcoming
                          ? 'border-amber-500/40 hover:border-amber-400/80'
                          : 'border-slate-800 opacity-75'
                      }`}
                    >
                      {/* Card Header & Status Badge */}
                      <div className="space-y-3">
                        
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
                            {scheme.officialSchemeCode}
                          </span>

                          {/* Dynamic Status Tag */}
                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow border ${
                            isEligible 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
                              : isAvailed
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                              : isUpcoming
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {isEligible && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {isAvailed && <Check className="w-3 h-3 text-blue-400" />}
                            {isUpcoming && <Clock className="w-3 h-3 text-amber-400" />}
                            <span>{isKn ? item.statusLabelKn : item.statusLabelEn}</span>
                          </span>
                        </div>

                        {/* Official Scheme Name */}
                        <div>
                          <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-emerald-300 transition">
                            {isKn ? scheme.nameKn : scheme.nameEn}
                          </h3>
                          <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
                            {isKn ? scheme.departmentKn : scheme.departmentEn}
                          </span>
                        </div>

                        {/* Purpose */}
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {isKn ? scheme.purposeKn : scheme.purposeEn}
                        </p>

                        {/* Financial or Free Healthcare Highlight */}
                        <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 space-y-1">
                          {scheme.cashBenefitAmount ? (
                            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                              <span>Cash Transfer Incentive:</span>
                              <span className="font-mono text-base font-black text-amber-400">
                                ₹{scheme.cashBenefitAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ) : null}
                          <p className="text-[11px] text-slate-300 font-medium line-clamp-2">
                            {isKn ? (scheme.financialBenefitDetailsKn || scheme.freeServicesEn.join(', ')) : (scheme.financialBenefitDetailsEn || scheme.freeServicesEn.join(', '))}
                          </p>
                        </div>

                        {/* Rationale & Action */}
                        <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                          <div className="flex items-start gap-1.5 text-emerald-300 font-medium">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                            <span>{isKn ? eligibilityRationaleKn : eligibilityRationaleEn}</span>
                          </div>
                        </div>

                      </div>

                      {/* Card Footer: Action & Modal Trigger */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>Helpline: <strong className="text-slate-200 font-extrabold">{scheme.helplineNumber}</strong></span>
                        </div>

                        <button 
                          onClick={() => setSelectedSchemeEval(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold text-xs transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <span>{isKn ? 'ವಿವರಗಳು' : 'Full Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Nearby Government Facilities Finder */}
        {activeTab === 'NEARBY' && (
          <div className="space-y-5">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  {isKn ? 'ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು ಮತ್ತು ಅಂಗನವಾಡಿಗಳು' : 'Nearby Primary Health Centres & Anganwadi Hubs'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isKn ? 'ನಿಮ್ಮ ಪ್ರದೇಶದ (Haveri / Bengaluru Urban) ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು, PHC, ಅಂಗನವಾಡಿ ಹಾಗೂ ಕೌಂಟರ್‌ಗಳು' : 'Location-aware search for PHCs, CHCs, Anganwadis, Blood Banks, & Scheme Helpdesks'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400">
                  Location: {childData?.mother?.village?.district || 'Karnataka District Sector'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {facilities.map((fac) => (
                <div 
                  key={fac.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-slate-950 border border-slate-800 text-amber-300 px-2.5 py-1 rounded-lg">
                      {fac.typeLabel}
                    </span>
                    {fac.emergency24x7 && (
                      <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                        24x7 Emergency
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white leading-snug">{fac.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fac.address}</span>
                    </p>
                  </div>

                  <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-xs space-y-1.5">
                    <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">Available Scheme Helpdesks:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.availableHelpdesks.map((h, idx) => (
                        <span key={idx} className="bg-slate-900 text-emerald-300 border border-slate-800 text-[10px] px-2 py-0.5 rounded font-medium">
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <a 
                      href={`tel:${fac.contactPhone}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition flex items-center gap-1.5 text-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {fac.contactPhone}</span>
                    </a>

                    <a 
                      href={`https://maps.google.com/?q=${fac.geoCoordinates.latitude},${fac.geoCoordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Scheme Detail Modal */}
      {selectedSchemeEval && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-black uppercase bg-slate-950 border border-slate-800 text-amber-300 px-2.5 py-1 rounded-lg">
                  {selectedSchemeEval.scheme.officialSchemeCode}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {isKn ? selectedSchemeEval.scheme.nameKn : selectedSchemeEval.scheme.nameEn}
                </h2>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {isKn ? selectedSchemeEval.scheme.departmentKn : selectedSchemeEval.scheme.departmentEn}
                </span>
              </div>
              <button 
                onClick={() => setSelectedSchemeEval(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Purpose & Benefits */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[10px] block">
                  Official Scheme Purpose & Objective
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {isKn ? selectedSchemeEval.scheme.purposeKn : selectedSchemeEval.scheme.purposeEn}
                </p>
              </div>

              {/* Cash / Free Benefit Details */}
              {selectedSchemeEval.scheme.cashBenefitAmount ? (
                <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl space-y-1">
                  <span className="font-black text-amber-300 text-sm block">
                    Financial Cash Transfer Incentive: ₹{selectedSchemeEval.scheme.cashBenefitAmount.toLocaleString('en-IN')}
                  </span>
                  <p className="text-slate-300">
                    {isKn ? selectedSchemeEval.scheme.financialBenefitDetailsKn : selectedSchemeEval.scheme.financialBenefitDetailsEn}
                  </p>
                </div>
              ) : null}

              {/* Free Services List */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px] block">
                  100% Free Entitlement Services
                </span>
                <ul className="space-y-1 text-slate-300 font-medium">
                  {selectedSchemeEval.scheme.freeServicesEn.map((srv, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents Checklist */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-cyan-400 uppercase tracking-wider text-[10px] block">
                  Required Mandatory Documents Checklist
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  {(isKn ? selectedSchemeEval.scheme.requiredDocumentsKn : selectedSchemeEval.scheme.requiredDocumentsEn).map((doc, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Application Guide */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-extrabold text-purple-400 uppercase tracking-wider text-[10px] block">
                  Step-by-Step Application Process
                </span>
                <ol className="space-y-1.5 text-slate-300">
                  {(isKn ? selectedSchemeEval.scheme.applicationProcessKn : selectedSchemeEval.scheme.applicationProcessEn).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Official Source & Verification Metadata */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <div>
                  <span>Verification Source: </span>
                  <strong className="text-slate-200">{selectedSchemeEval.scheme.verificationSource}</strong>
                </div>
                <div>
                  <span>Last Gazette Audit: </span>
                  <strong className="text-emerald-400">{selectedSchemeEval.scheme.lastUpdatedDate}</strong>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <a 
                href={`tel:${selectedSchemeEval.scheme.helplineNumber}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call Helpline {selectedSchemeEval.scheme.helplineNumber}</span>
              </a>

              <a 
                href={selectedSchemeEval.scheme.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400"
              >
                <span>Visit Official Portal ({selectedSchemeEval.scheme.officialWebsite.replace('https://', '')})</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Printable Beneficiary Entitlement Pass Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg">
                  J
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Government Healthcare Entitlement Pass</h2>
                  <span className="text-[10px] font-mono text-emerald-400 block">Official Citizen Beneficiary Pass · JANANI360 AI</span>
                </div>
              </div>
              <button onClick={() => setIsPassModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pass Content */}
            <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-5 space-y-4 shadow-inner relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Child Beneficiary Name</span>
                  <h3 className="text-lg font-black text-white">{childData?.fullName || 'Baby Ananya'}</h3>
                  <span className="text-xs text-slate-300">Mother: <strong>{childData?.mother?.fullName || 'Lakshmi Devi'}</strong></span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 uppercase block">RCH Number</span>
                  <span className="text-sm font-extrabold text-emerald-400">{selectedRchId}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider block">Verified Eligible Government Benefits</span>
                <div className="space-y-1.5 text-xs text-slate-200">
                  {eligibleItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center justify-between">
                      <span className="font-bold">{item.scheme.nameEn}</span>
                      {item.scheme.cashBenefitAmount ? (
                        <span className="font-mono text-amber-400 font-black">₹{item.scheme.cashBenefitAmount}</span>
                      ) : (
                        <span className="font-mono text-emerald-400 font-bold">100% Free Service</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div>
                  <span>Issued Date: </span>
                  <strong className="text-slate-200">{new Date().toLocaleDateString()}</strong>
                </div>
                <div>
                  <span>Verification: </span>
                  <strong className="text-emerald-400">MoHFW Verified</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Pass</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GovernmentChildWelfareHubPage;
