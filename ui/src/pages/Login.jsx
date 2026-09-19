// src/pages/Login.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, Loader2, Zap, Store, Activity, Cpu } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'shop'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, shopLogin } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({
      x: (-y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'admin') {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await shopLogin(email, password);
        navigate('/shop-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials provided. Please check again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#090d16] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 lg:px-16 py-8 relative text-slate-100 font-sans select-none">
      
      {/* Ultra-Bright & Professional Ambient Light Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-emerald-500/20 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-cyan-500/20 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-teal-400/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Left 3D Interactive Holographic Showcase with Light Back Glow */}
      <div className="hidden lg:flex flex-col justify-center max-w-xl z-10 space-y-6 pr-8 my-auto perspective-[1200px]">
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="relative bg-slate-900/50 backdrop-blur-3xl border border-slate-700/60 p-9 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.7)] group overflow-hidden"
        >
          {/* Glowing Back Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 opacity-90 pointer-events-none"></div>

          {/* Cybernetic Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none"></div>

          {/* Top Badge */}
          <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/20 mb-6 backdrop-blur-md">
            <Zap size={14} className="text-emerald-400 animate-bounce" /> Enterprise Multi-Tenant Core v3.2
          </div>

          {/* Headline */}
          <h1 className="relative z-10 text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]">
              Retail Intelligence.
            </span>
          </h1>
          
          <p className="relative z-10 text-slate-300 text-xs xl:text-sm leading-relaxed mb-8 max-w-md font-medium">
            Experience real-time cross-branch synchronization, cryptographic inventory tracking, and blazing-fast isolated multi-vendor partitioning.
          </p>

          {/* Floating Interactive 3D Metrics Cards */}
          <div className="relative z-10 grid grid-cols-3 gap-3 p-4 bg-slate-950/70 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-inner">
            <div className="transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-base">
                <Activity size={16} /> 99.9%
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Live Sync</p>
            </div>
            <div className="transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-base">
                <Cpu size={16} /> 0ms
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Latency</p>
            </div>
            <div className="transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-1.5 text-teal-400 font-extrabold text-base">
                <Shield size={16} /> 256-Bit
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Secured</p>
            </div>
          </div>

          {/* Light Ambient Orb */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/40 transition-all duration-700"></div>
        </div>
      </div>

      {/* Right Modern Glass Authentication Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-700/80 p-6 sm:p-8 rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative z-10 my-auto">
        
        {/* Top Header Icon */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25 text-slate-950 ring-4 ring-emerald-500/15">
            {loginType === 'admin' ? <Shield className="w-6 h-6 stroke-[2.2]" /> : <Store className="w-6 h-6 stroke-[2.2]" />}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">Portal Access</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Authenticate to manage your workspace</p>
        </div>

        {/* Custom Segmented Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#05070b] border border-slate-700/80 rounded-xl mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => { setLoginType('admin'); setError(''); }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tenant Admin
          </button>
          <button
            type="button"
            onClick={() => { setLoginType('shop'); setError(''); }}
            className={`py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
              loginType === 'shop'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shop Manager
          </button>
        </div>

        {/* Dynamic Error Popup */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium text-center tracking-wide">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {loginType === 'admin' ? 'Tenant Email Address' : 'Manager Work Email'}
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-emerald-400" />
              <input
                type="email"
                required
                placeholder={loginType === 'admin' ? 'admin@business.com' : 'manager@branch.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#05070b] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password Key</label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-emerald-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05070b] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-400/25 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                Authorize {loginType === 'admin' ? 'Tenant Workspace' : 'Shop Terminal'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        {loginType === 'admin' && (
          <p className="text-center text-xs text-slate-400 mt-5">
            New organization?{' '}
            <Link to="/signup" className="text-emerald-400 font-bold hover:underline underline-offset-4">
              Initialize Tenant
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}