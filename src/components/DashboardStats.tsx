import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Zap, Target } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    highPriority: number;
    completionRate: number;
  };
}

export function DashboardStats({ stats }: StatsProps) {
  const barData = [
    { name: 'To Do', value: stats.todo, fill: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgress, fill: '#3b82f6' },
    { name: 'Done', value: stats.completed, fill: '#10b981' },
  ];

  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Remaining', value: stats.total - stats.completed },
  ];

  const PIE_COLORS = ['#10b981', '#1f2937'];

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<ListTodo className="w-4 h-4" />}
          label="Total"
          value={stats.total}
          color="text-neutral-300"
          bgColor="bg-neutral-800/50"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="To Do"
          value={stats.todo}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label="Active"
          value={stats.inProgress}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Done"
          value={stats.completed}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="High Prio"
          value={stats.highPriority}
          color="text-rose-400"
          bgColor="bg-rose-500/10"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Rate"
          value={`${stats.completionRate}%`}
          color="text-violet-400"
          bgColor="bg-violet-500/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bar Chart */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
            Task Distribution
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="25%">
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#737373' }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e5e5e5',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 backdrop-blur-sm">
          <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
            Completion Progress
          </h4>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e5e5e5',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-200">{stats.completionRate}%</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-xl font-bold ${color} font-mono`}>{value}</p>
    </div>
  );
}
