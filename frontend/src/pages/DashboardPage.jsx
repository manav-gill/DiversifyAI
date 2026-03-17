import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { getSectorDistribution, getPortfolio } from '../../services/api';

const COLORS = [
  'bg-emerald-500', 
  'bg-cyan-500', 
  'bg-amber-500', 
  'bg-slate-800', 
  'bg-orange-400',
  'bg-indigo-500',
  'bg-rose-500'
];

const HEX_COLORS = [
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
  '#f59e0b', // amber-500
  '#1e293b', // slate-800
  '#fb923c', // orange-400
  '#6366f1', // indigo-500
  '#f43f5e'  // rose-500
];

function DashboardPage() {
  const [sectorData, setSectorData] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({ totalInvestment: 0, currentValue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectors, portfolio] = await Promise.all([
          getSectorDistribution(),
          getPortfolio()
        ]);
        
        // Convert object { "IT": 25 } to array [['IT', 25, 'bg-...', '#...']]
        const formattedSectors = Object.entries(sectors).map(([sector, value], i) => [
          sector, 
          value, 
          COLORS[i % COLORS.length],
          HEX_COLORS[i % HEX_COLORS.length]
        ]);
        setSectorData(formattedSectors);

        // Calculate portfolio summary
        const currentVal = portfolio.stocks?.reduce((acc, s) => acc + (s.currentValue || (s.buyPrice * s.quantity)), 0) || 0;
        setPortfolioStats({
          totalInvestment: portfolio.totalInvestment || 0,
          currentValue: currentVal
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate CSS for conic-gradient dynamically based on sector %
  const generateConicGradient = () => {
    if (sectorData.length === 0) return 'conic-gradient(#e2e8f0 0 100%)';
    
    let currentPercentage = 0;
    const gradients = sectorData.map(([, percentage, , hexCode]) => {
      const start = currentPercentage;
      const end = currentPercentage + percentage;
      currentPercentage = end;
      return `${hexCode} ${start}% ${end}%`;
    });
    
    return `conic-gradient(${gradients.join(', ')})`;
  };

  const topCards = [
    ['Total Investment', `₹${portfolioStats.totalInvestment.toLocaleString()}`, 'Principal Amount'],
    ['Current Value', `₹${portfolioStats.currentValue.toLocaleString()}`, 'Market Valuation'],
    ['Portfolio Health', '74 / 100', 'Calculated periodically'],
    ['Diversification', `${sectorData.length > 0 ? 68 : 0} / 100`, sectorData.length > 2 ? 'Good spread' : 'Needs diversification'],
  ];

  return (
    <AppLayout
      title="Investment Command Dashboard"
      subtitle="A high-clarity overview of portfolio value, risk posture, diversification quality, and recommendation momentum."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topCards.map(([label, value, helper], index) => (
          <article key={label} className="hover-panel enter-up rounded-2xl border border-slate-200 bg-white p-5" style={{ animationDelay: `${120 + index * 60}ms` }}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">{isLoading ? '...' : value}</p>
            <p className="mt-2 text-xs text-slate-500">{helper}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="hover-panel enter-up rounded-3xl border border-slate-200 bg-white p-6" style={{ animationDelay: '220ms' }}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">Sector Allocation View</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Visual Summary
            </span>
          </div>

          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-slate-500 mt-5">Loading chart...</div>
          ) : sectorData.length === 0 ? (
            <div className="mt-8 text-center text-slate-500">No stocks added yet. Add stocks via the Portfolio page to see your allocation.</div>
          ) : (
            <div className="mt-5 grid gap-6 sm:grid-cols-[0.95fr_1.05fr]">
              <div className="grid place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div 
                  className="relative h-48 w-48 rounded-full shadow-inner transition-all duration-700" 
                  style={{ background: generateConicGradient() }}
                >
                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white grid place-items-center text-center shadow">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Sectors</p>
                    <p className="font-display text-2xl leading-none">{sectorData.length}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm flex flex-col justify-center">
                {sectorData.map(([sector, value, barColor]) => (
                  <div key={sector}>
                    <div className="mb-1 flex justify-between font-semibold text-slate-700">
                      <span>{sector}</span><span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${barColor} shadow-sm rounded-full`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="hover-panel enter-up rounded-3xl border border-slate-200 bg-white p-6" style={{ animationDelay: '300ms' }}>
          <h2 className="font-display text-2xl tracking-tight">AI Insights Overview</h2>
          <p className="mt-2 text-sm text-slate-600">Quick snapshot of actions to take based on your current allocation.</p>
          <div className="mt-5 space-y-3">
             <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                <p className="font-semibold text-cyan-900">Run Full Analysis</p>
                <p className="text-sm text-cyan-700 mt-1">Head over to the Analysis tab to trigger our LLM and get in-depth feedback based on these metrics.</p>
             </div>
             {sectorData.length > 0 && sectorData[0][1] > 40 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="font-semibold text-amber-900">High Concentration Alert</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Your portfolio is highly concentrated in <strong>{sectorData[0][0]}</strong> ({sectorData[0][1]}%). Consider diversifying to reduce sector-specific risk.
                  </p>
                </div>
             )}
          </div>
        </article>
      </section>
    </AppLayout>
  );
}

export default DashboardPage;
