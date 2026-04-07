import { useState, useEffect } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(217,91%,60%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(199,89%,48%)'];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(r => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <DashboardLayout><div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;

  const placementPie = [
    { name: 'Placed', value: data.placed }, 
    { name: 'Intern', value: data.intern }, 
    { name: 'Unplaced', value: data.unplaced }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Placement Analytics</h1>
          <p className="text-muted-foreground">Data-driven insights into placement activities</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="dashboard-section p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Placement & Intern Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={placementPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {placementPie.map((_, i) => <Cell key={i} fill={i === 0 ? 'hsl(142,71%,45%)' : i === 1 ? 'hsl(199,89%,48%)' : 'hsl(0,0%,70%)'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Application Status Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {data.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Department-wise Placements</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="placed" fill="hsl(142,71%,45%)" radius={[4,4,0,0]} name="Placed" />
                <Bar dataKey="intern" fill="hsl(199,89%,48%)" radius={[4,4,0,0]} name="Intern" />
                <Bar dataKey="total" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-section p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Company-wise Applications</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.companyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="applications" fill="hsl(217,91%,60%)" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
