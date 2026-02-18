
import React, { useState, useCallback, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { GSTIN_REGEX } from './constants';
import { CredibilityReport, RiskLevel } from './types';
import { generateMockReport } from './services/dataGenerator';
import { getRiskExplanation } from './services/geminiService';
import RiskGauge from './components/RiskGauge';
import DataCard from './components/DataCard';

type View = 'LOOKUP' | 'DASHBOARD' | 'API';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('LOOKUP');
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CredibilityReport | null>(null);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async () => {
    if (!GSTIN_REGEX.test(gstin.toUpperCase())) {
      setError('Please enter a valid 15-digit GSTIN (e.g., 22AAAAA0000A1Z5)');
      return;
    }

    setError('');
    setLoading(true);
    setActiveView('LOOKUP');
    
    setTimeout(async () => {
      const basicReport = generateMockReport(gstin.toUpperCase());
      setReport(basicReport);
      
      const explanation = await getRiskExplanation(basicReport);
      setReport(prev => prev ? { ...prev, explanation } : null);
      setLoading(false);
    }, 1200);
  }, [gstin]);

  const individualChartData = useMemo(() => report ? [
    { name: 'Legal', score: report.judicial.litigationRiskScore, color: '#6366f1' },
    { name: 'Tax', score: report.compliance.filingRegularity, color: '#f59e0b' },
    { name: 'Behavior', score: report.behavioral.anomalyScore, color: '#ec4899' },
  ] : [], [report]);

  // Mock Global Data for Dashboard
  const globalStats = {
    riskDistribution: [
      { name: 'Low Risk', value: 6500, color: '#10b981' },
      { name: 'Med Risk', value: 2400, color: '#f59e0b' },
      { name: 'High Risk', value: 1100, color: '#f43f5e' },
    ],
    sectorData: [
      { sector: 'Textiles', score: 72 },
      { sector: 'Logistics', score: 58 },
      { sector: 'Steel', score: 81 },
      { sector: 'Electronics', score: 64 },
      { sector: 'Chemicals', score: 49 },
    ]
  };

  const renderLookupView = () => (
    <>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          India's First AI-Powered <br/><span className="text-indigo-600">Pre-Trade Credibility Score</span>
        </h1>
        <p className="text-slate-600 mb-8">
          Move from reactive litigation to proactive fraud prevention. Get instant risk insights using GSTIN metadata and judicial records.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Enter Buyer GSTIN"
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${error ? 'border-rose-300' : 'border-slate-200 focus:border-indigo-500'}`}
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {error && <p className="absolute -bottom-6 left-0 text-xs text-rose-500 font-medium">{error}</p>}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-400 transition-all flex items-center justify-center min-w-[140px]"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-magnifying-glass mr-2"></i>}
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-4 space-y-6">
            <RiskGauge score={report.overallScore} label={report.riskLevel} />
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
              <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Recommended Action</p>
              <div className={`text-xl font-bold p-3 rounded-xl ${
                report.tradeAction === 'Safe for Credit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                report.tradeAction === 'Partial Credit' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {report.tradeAction}
              </div>
            </div>
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">AI Summary</h4>
                <p className="text-sm leading-relaxed italic">"{report.explanation}"</p>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 text-8xl"><i className="fa-solid fa-robot"></i></div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{report.businessName}</h2>
                  <p className="text-slate-500 font-mono text-sm uppercase">{report.gstin}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Last Verified</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(report.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataCard title="Tax Regularity" icon="fa-receipt" weight={30}>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Filing Regularity</span><span className="font-semibold">{report.compliance.filingRegularity}%</span></div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full" style={{ width: `${report.compliance.filingRegularity}%` }}></div></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Return Consistency</span><span className="font-semibold">{report.compliance.returnFrequencyConsistency}%</span></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Last Filed</span><span className="font-semibold text-indigo-600">{report.compliance.lastFiledMonth}</span></div>
                </DataCard>
                <DataCard title="Legal Exposure" icon="fa-gavel" weight={45}>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Judicial Case Count</span><span className="font-semibold">{report.judicial.caseCount} Cases</span></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Fraud Indicators</span><span className={`font-semibold ${report.judicial.fraudRelatedCases > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{report.judicial.fraudRelatedCases} Flagged</span></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Cheque Bounce</span><span className={`font-semibold ${report.judicial.chequeBounceIndicators > 0 ? 'text-rose-500' : 'text-slate-700'}`}>{report.judicial.chequeBounceIndicators} Indicators</span></div>
                </DataCard>
                <DataCard title="Business Patterns" icon="fa-chart-line" weight={25}>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Anomaly Score</span><span className="font-semibold">{report.behavioral.anomalyScore}%</span></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Turnover Spikes</span><span className="font-semibold">{report.behavioral.turnoverSpikes ? '🚨 Abnormal' : 'Normal'}</span></div>
                  <div className="flex justify-between text-sm pt-2"><span className="text-slate-500">Filing Gaps</span><span className="font-semibold">{report.behavioral.irregularFilingGaps ? '🚨 Irregular' : 'Consistent'}</span></div>
                </DataCard>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center min-h-[200px]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Risk Weighted Model</h4>
                  <div className="w-full h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={individualChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {individualChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!report && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: 'fa-magnifying-glass', title: 'Real-time Lookup', desc: 'Validate any Indian business using its unique 15-digit GSTIN instantly.', color: 'indigo' },
            { icon: 'fa-shield-halved', title: 'Risk Intelligence', desc: 'Aggregate tax compliance and judicial metadata to spot default patterns early.', color: 'rose' },
            { icon: 'fa-money-bill-transfer', title: 'Secure Trade', desc: 'Make informed decisions on credit limits, advance payments, and trade terms.', color: 'emerald' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-indigo-300 transition-colors">
              <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderDashboardView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">National Credit Health Dashboard</h2>
        <p className="text-slate-500">Aggregated insights from 10,000+ simulated MSME profiles across India.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Entities', value: '10,240', change: '+12%', icon: 'fa-building' },
          { label: 'Avg. Credit Score', value: '68/100', change: 'Stable', icon: 'fa-chart-simple' },
          { label: 'Prevention Rate', value: '28.4%', change: '+5.2%', icon: 'fa-shield' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <i className={`fa-solid ${stat.icon}`}></i>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">{stat.change}</span>
            </div>
            <h4 className="text-sm text-slate-500 font-medium">{stat.label}</h4>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-6">Risk Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={globalStats.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {globalStats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {globalStats.riskDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs font-medium text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-6">Sector-wise Credit Stability</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalStats.sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="sector" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Enterprise API Access</h2>
        <p className="text-slate-600 mb-8">
          Integrate BBCP's real-time risk intelligence directly into your ERP or B2B Marketplace. Prevent defaults automatically at the point of order.
        </p>

        <div className="space-y-6">
          <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm text-indigo-300">
            <p className="text-slate-500 mb-2"># Get business credibility report</p>
            <p><span className="text-rose-400">GET</span> /api/v1/score/{'{gstin}'}</p>
            <p className="mt-2 text-slate-500">Headers:</p>
            <p>X-API-KEY: YOUR_KEY</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <h4 className="font-bold mb-1">Bulk Processing</h4>
              <p className="text-xs text-slate-500">Analyze your entire ledger in minutes using batch requests.</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
              <h4 className="font-bold mb-1">Webhooks</h4>
              <p className="text-xs text-slate-500">Get instant alerts when a buyer's judicial status changes.</p>
            </div>
          </div>
          
          <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition">
            Apply for API Key
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button 
              onClick={() => { setActiveView('LOOKUP'); setReport(null); setGstin(''); }}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">B</div>
              <span className="text-xl font-bold tracking-tight text-slate-900">BBCP <span className="text-indigo-600">Analytics</span></span>
            </button>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setActiveView('LOOKUP')}
                className={`text-sm font-semibold transition ${activeView === 'LOOKUP' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Lookup
              </button>
              <button 
                onClick={() => setActiveView('DASHBOARD')}
                className={`text-sm font-semibold transition ${activeView === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveView('API')}
                className={`text-sm font-semibold transition ${activeView === 'API' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Enterprise API
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'LOOKUP' && renderLookupView()}
        {activeView === 'DASHBOARD' && renderDashboardView()}
        {activeView === 'API' && renderApiView()}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 BBCP - Bharat Business Credibility Platform. Supporting 63M+ MSMEs in India.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <button onClick={() => setActiveView('API')} className="text-slate-400 hover:text-indigo-600 text-sm transition">Data Sources</button>
            <button className="text-slate-400 hover:text-indigo-600 text-sm transition">Privacy Policy</button>
            <button className="text-slate-400 hover:text-indigo-600 text-sm transition">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
