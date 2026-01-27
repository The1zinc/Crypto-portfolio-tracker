import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Activity, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import './index.css';

// Initial Mock Data (the commit generator script will overwrite this with historical data)
const mockChartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const assets = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.24', price: '$64,230.00', change: '+2.4%', isPositive: true },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '4.5', price: '$3,420.50', change: '-1.2%', isPositive: false },
  { id: 'sol', name: 'Solana', symbol: 'SOL', balance: '142.0', price: '$145.20', change: '+5.6%', isPositive: true },
];

function App() {
  const [chartData, setChartData] = useState(mockChartData);

  return (
    <div className="min-h-screen bg-background text-text p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CryptoFolio
            </h1>
            <p className="text-muted text-sm mt-1">Your decentralized asset dashboard</p>
          </div>
          <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-colors border border-primary/20">
            <Wallet size={18} />
            <span className="font-medium">0x8F...4a2B</span>
          </button>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <h3 className="text-muted text-sm font-medium flex items-center gap-2">
              <Activity size={16} /> Total Balance
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold">$42,850.20</span>
              <span className="text-accent text-sm font-medium flex items-center">
                <TrendingUp size={14} className="mr-1" /> +$1,240 (24h)
              </span>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h3 className="text-muted text-sm font-medium flex items-center gap-2">
              <ArrowRightLeft size={16} /> 24h Volume
            </h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$3,420.50</span>
            </div>
          </div>

          <div className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-muted text-sm font-medium flex items-center gap-2">
              <ShieldAlert size={16} /> Health Factor
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">1.84</span>
              <span className="text-muted text-sm">Safe</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Portfolio Performance</h2>
              <div className="flex bg-surface rounded-lg p-1">
                {['1D', '1W', '1M', '1Y'].map((t) => (
                  <button key={t} className={`px-3 py-1 text-sm rounded-md transition-colors ${t === '1W' ? 'bg-primary/20 text-primary' : 'text-muted hover:text-text'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assets List */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold mb-6">Your Assets</h2>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <p className="text-sm text-muted">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{asset.price}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${asset.isPositive ? 'text-accent' : 'text-red-400'}`}>
                      {asset.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
