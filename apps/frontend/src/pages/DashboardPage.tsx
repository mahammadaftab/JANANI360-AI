import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Stethoscope, 
  HeartHandshake, 
  UserCheck, 
  LogOut, 
  Activity, 
  ShieldCheck, 
  ShieldAlert,
  Cpu,
  MapPin,
  LayoutDashboard,
  Ambulance,
  Baby,
  PieChart,
  Heart,
  Lock,
  Award
} from 'lucide-react';
import { logout, UserRole } from '../store/authSlice';
import { RootState } from '../store';
import { MotherPortalPage } from './MotherPortalPage';
import { HospitalManagementPage } from './HospitalManagementPage';
import { MaternalCarePage } from './MaternalCarePage';
import { ReferralsPage } from './ReferralsPage';
import { PediatricCarePage } from './PediatricCarePage';
import { CommandCenterPage } from './CommandCenterPage';

type TabKey = 'mother-portal' | 'command' | 'maternal' | 'referrals' | 'pediatric' | 'hospitals' | 'overview';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set default active tab based on logged in persona role
  const getDefaultTab = (): TabKey => {
    switch (user?.role) {
      case UserRole.PATIENT:
        return 'mother-portal';
      case UserRole.ASHA_WORKER:
        return 'maternal';
      case UserRole.DOCTOR:
        return 'maternal';
      case UserRole.DISTRICT_OFFICER:
        return 'command';
      default:
        return 'overview';
    }
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getDefaultTab());

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case UserRole.DISTRICT_OFFICER:
        return { title: 'District Health Officer (DHO)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Building2 };
      case UserRole.DOCTOR:
        return { title: 'PHC Medical Officer', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Stethoscope };
      case UserRole.ASHA_WORKER:
        return { title: 'ASHA Village Facilitator', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: HeartHandshake };
      case UserRole.PATIENT:
        return { title: 'Pregnant Mother', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: UserCheck };
      default:
        return { title: 'Health Official', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: ShieldCheck };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BadgeIcon = badge.icon;

  // Strict Role Scoping Check
  const isTabAllowed = (tab: TabKey): boolean => {
    const role = user?.role;
    if (role === UserRole.SUPER_ADMIN) return true;

    if (role === UserRole.PATIENT) {
      return tab === 'mother-portal'; // Pregnant mother can ONLY view her own personal passbook
    }
    if (role === UserRole.ASHA_WORKER) {
      return tab === 'maternal' || tab === 'pediatric' || tab === 'referrals';
    }
    if (role === UserRole.DOCTOR) {
      return tab === 'maternal' || tab === 'pediatric' || tab === 'referrals' || tab === 'hospitals';
    }
    if (role === UserRole.DISTRICT_OFFICER) {
      return tab === 'command' || tab === 'hospitals' || tab === 'referrals' || tab === 'pediatric';
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col">
      {/* Top Stripe-grade Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-emerald-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-600/30">
              J
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">JANANI360 AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">v1.0.0</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{user?.district || 'Karnataka Maternal Health System'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-semibold ${badge.color}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badge.title}</span>
            </div>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-200">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition"
                title="Logout Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Role-Scoped Workspace Module Bar */}
        <div className="border-t border-slate-900 bg-slate-950/40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex space-x-1 py-2 overflow-x-auto custom-scrollbar">
            {isTabAllowed('mother-portal') && (
              <button
                onClick={() => setActiveTab('mother-portal')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeTab === 'mother-portal'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Heart className="w-4 h-4 fill-rose-400" />
                <span>My Maternal Health Passbook</span>
              </button>
            )}

            {isTabAllowed('maternal') && (
              <button
                onClick={() => setActiveTab('maternal')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeTab === 'maternal'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Maternal EHR & AI Risk Engine</span>
              </button>
            )}

            {isTabAllowed('command') && (
              <button
                onClick={() => setActiveTab('command')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeTab === 'command'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>DHO Command Telemetry</span>
              </button>
            )}

            {isTabAllowed('pediatric') && (
              <>
                <button
                  onClick={() => setActiveTab('pediatric')}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                    activeTab === 'pediatric'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Baby className="w-4 h-4" />
                  <span>Child EHR & Immunization</span>
                </button>

                <button
                  onClick={() => navigate('/child-welfare-hub')}
                  className="flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-md cursor-pointer border border-amber-300"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Govt Welfare Hub</span>
                </button>
              </>
            )}

            {isTabAllowed('referrals') && (
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeTab === 'referrals'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Ambulance className="w-4 h-4" />
                <span>108 Emergency Logistics</span>
              </button>
            )}

            {isTabAllowed('hospitals') && (
              <button
                onClick={() => setActiveTab('hospitals')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap ${
                  activeTab === 'hospitals'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Hospital Matrix</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body with Access Guard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {!isTabAllowed(activeTab) ? (
          <div className="py-20 text-center space-y-4 max-w-lg mx-auto glass-panel p-8 rounded-3xl border border-red-500/30">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">403 Security Access Guard</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your logged-in role <span className="text-rose-400 font-mono font-bold">[{user?.role}]</span> does not have DISHA clearance to access administrative command telemetry or clinical hospital registers.
            </p>
            <button
              onClick={() => setActiveTab(getDefaultTab())}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              Return to Authorized Workspace
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'mother-portal' && <MotherPortalPage />}
            {activeTab === 'command' && <CommandCenterPage />}
            {activeTab === 'pediatric' && <PediatricCarePage />}
            {activeTab === 'referrals' && <ReferralsPage />}
            {activeTab === 'maternal' && <MaternalCarePage />}
            {activeTab === 'hospitals' && <HospitalManagementPage />}
            {activeTab === 'overview' && (
              <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 space-y-4">
                <h2 className="text-xl font-bold text-white">System Architecture & Service Health</h2>
                <p className="text-xs text-slate-300">All 6 core modules and Python FastAPI AI Microservice running live.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
