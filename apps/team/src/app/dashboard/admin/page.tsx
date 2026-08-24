"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Lead } from "@siksatech/database";
import { 
  Users, 
  Layers, 
  PhoneCall, 
  CheckSquare, 
  LogOut, 
  Cpu, 
  Phone,
  Mail,
  RefreshCw,
  FolderOpen
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "overview">("leads");
  
  // Dashboard stats state
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
  });

  const loadLeadsData = async () => {
    const list = await db.getLeads();
    setLeads(list);
    
    // Calculate stats
    setStats({
      totalLeads: list.length,
      newLeads: list.filter(l => l.status === "new").length,
      contactedLeads: list.filter(l => l.status === "contacted").length,
      convertedLeads: list.filter(l => l.status === "converted").length,
    });
  };

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== "siksatech_admin") {
      router.push("/auth/login");
      return;
    }
    setAdminUser(user);
    loadLeadsData();
  }, [router]);

  const updateStatus = async (id: string, nextStatus: Lead["status"]) => {
    const success = await db.updateLeadStatus(id, nextStatus);
    if (success) {
      loadLeadsData();
    } else {
      alert("Failed to update status.");
    }
  };

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  if (!adminUser) return null;

  return (
    <div className="flex min-h-screen bg-navy-dark text-secondary-white font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border-slate bg-primary-navy flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-extrabold tracking-wider">
              SIKSA<span className="text-accent-cyan">TECH</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-accent-cyan/15 text-[8px] font-mono text-accent-cyan border border-accent-cyan/20">ADMIN</span>
          </Link>

          <div className="p-4 rounded border border-border-slate bg-navy-light/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/15 flex items-center justify-center border border-accent-cyan/20 text-accent-cyan font-bold">
              A
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate">{adminUser.name}</h4>
              <span className="text-[10px] text-text-muted">Operations Admin</span>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold tracking-wider transition-technical ${
                activeTab === "leads" ? "bg-accent-cyan/10 text-accent-cyan border-l-4 border-accent-cyan" : "text-text-muted hover:bg-navy-light/40"
              }`}
            >
              <Layers className="w-4 h-4" /> LEADS CRM PIPELINE
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold tracking-wider transition-technical ${
                activeTab === "overview" ? "bg-accent-cyan/10 text-accent-cyan border-l-4 border-accent-cyan" : "text-text-muted hover:bg-navy-light/40"
              }`}
            >
              <Users className="w-4 h-4" /> CRM ANALYTICS
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 text-xs font-semibold tracking-widest text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded transition-technical"
          >
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center border-b border-border-slate pb-6 mb-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight">SiksaTech Operations</h1>
            <p className="text-xs text-text-muted">Internal Operations CRM Pipeline</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={loadLeadsData}
              className="p-2 border border-border-slate rounded text-text-muted hover:text-accent-cyan hover:border-accent-cyan transition-technical"
              title="Refresh Pipeline"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center gap-2 text-xs font-bold text-red-400"
            >
              <LogOut className="w-4 h-4" /> LOGOUT
            </button>
          </div>
        </header>

        {/* Dynamic CRM Layout */}
        
        {/* Tab 1: Leads CRM List */}
        {activeTab === "leads" && (
          <div className="space-y-8">
            
            {/* Stats pipeline layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-lg border border-border-slate bg-primary-navy">
                <span className="text-[9px] font-mono text-text-muted uppercase">Total Lead Inputs</span>
                <h3 className="text-2xl font-bold mt-1">{stats.totalLeads}</h3>
              </div>
              <div className="p-5 rounded-lg border border-border-slate bg-primary-navy">
                <span className="text-[9px] font-mono text-text-muted uppercase">New / Unprocessed</span>
                <h3 className="text-2xl font-bold mt-1 text-accent-cyan">{stats.newLeads}</h3>
              </div>
              <div className="p-5 rounded-lg border border-border-slate bg-primary-navy">
                <span className="text-[9px] font-mono text-text-muted uppercase">Contacted In-Progress</span>
                <h3 className="text-2xl font-bold mt-1 text-yellow-400">{stats.contactedLeads}</h3>
              </div>
              <div className="p-5 rounded-lg border border-border-slate bg-primary-navy">
                <span className="text-[9px] font-mono text-text-muted uppercase">Converted Partner/Makers</span>
                <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats.convertedLeads}</h3>
              </div>
            </div>

            {/* Leads Table */}
            <div className="border border-border-slate bg-primary-navy rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border-slate bg-navy-light/30">
                <h3 className="text-xs font-extrabold tracking-widest text-secondary-white uppercase">Active Leads Queue</h3>
              </div>
              
              {leads.length === 0 ? (
                <div className="p-12 text-center text-xs text-text-muted">
                  No enquiry submissions found in this session. Try registering an enquiry from the homepage/learn page forms first!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-text-muted leading-relaxed">
                    <thead className="bg-navy-light/40 text-[9px] font-bold text-secondary-white uppercase tracking-wider border-b border-border-slate">
                      <tr>
                        <th className="px-6 py-4">Reference ID</th>
                        <th className="px-6 py-4">Name / Sector</th>
                        <th className="px-6 py-4">Contact Coordinates</th>
                        <th className="px-6 py-4">Details Summary</th>
                        <th className="px-6 py-4">Current Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-slate/50">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-navy-light/10 transition-technical">
                          <td className="px-6 py-4 font-mono text-[10px] text-accent-cyan font-bold">{lead.id}</td>
                          <td className="px-6 py-4 space-y-1">
                            <span className="font-bold text-secondary-white block">{lead.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-navy-light text-[8px] font-mono border border-border-slate uppercase font-extrabold text-accent-cyan">
                              {lead.leadType}
                            </span>
                          </td>
                          <td className="px-6 py-4 space-y-1 font-mono text-[10px]">
                            <span className="flex items-center gap-1.5 text-secondary-white">
                              <Phone className="w-3 h-3 text-text-muted" /> {lead.phone}
                            </span>
                            {lead.email && (
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-text-muted" /> {lead.email}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <ul className="space-y-0.5 text-[10px] pl-1 list-disc">
                              {lead.details.field1 && <li>{lead.details.field1}</li>}
                              {lead.details.field2 && <li>{lead.details.field2}</li>}
                              {lead.details.field3 && <li>Loc: {lead.details.field3}</li>}
                              {lead.details.field4 && <li>Focus: {lead.details.field4}</li>}
                            </ul>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                              lead.status === "new" ? "bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan" :
                              lead.status === "contacted" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                              "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {lead.status === "new" && (
                                <button
                                  onClick={() => updateStatus(lead.id, "contacted")}
                                  className="px-2.5 py-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/25 rounded transition-technical"
                                >
                                  CONTACTED
                                </button>
                              )}
                              {lead.status !== "converted" && (
                                <button
                                  onClick={() => updateStatus(lead.id, "converted")}
                                  className="px-2.5 py-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/25 rounded transition-technical"
                                >
                                  CONVERT
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: CRM Analytics */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="border-b border-border-slate pb-4">
              <h2 className="text-lg font-bold tracking-tight">CRM Database Analytics</h2>
              <p className="text-xs text-text-muted">High-level statistics on platform engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lead Conversions Chart */}
              <div className="p-8 border border-border-slate bg-primary-navy rounded-lg space-y-6">
                <h3 className="text-xs font-extrabold tracking-widest text-secondary-white uppercase flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-accent-cyan" /> Conversion Metrics
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Pipeline Conversion Ratio</span>
                      <span className="font-bold text-accent-cyan">
                        {stats.totalLeads > 0 ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-navy-dark rounded-full h-2">
                      <div 
                        className="bg-accent-cyan h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalLeads > 0 ? (stats.convertedLeads / stats.totalLeads) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Active Contact Rate</span>
                      <span className="font-bold text-yellow-400">
                        {stats.totalLeads > 0 ? Math.round(((stats.contactedLeads + stats.convertedLeads) / stats.totalLeads) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-navy-dark rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalLeads > 0 ? ((stats.contactedLeads + stats.convertedLeads) / stats.totalLeads) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRM logs placeholder info */}
              <div className="p-8 border border-border-slate bg-primary-navy rounded-lg space-y-4">
                <h3 className="text-xs font-extrabold tracking-widest text-secondary-white uppercase flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent-cyan" /> Operations Node Info
                </h3>
                <div className="space-y-2 text-xs text-text-muted leading-relaxed font-mono">
                  <p>• Database Sync: <strong className="text-emerald-400 font-normal">Active</strong></p>
                  <p>• RLS Policies Check: <strong className="text-secondary-white font-normal">Validated</strong></p>
                  <p>• Host Server: <strong className="text-secondary-white font-normal">team.siksatech.in</strong></p>
                  <p>• Encryption Scheme: <strong className="text-secondary-white font-normal">AES-256 MockLocal</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
