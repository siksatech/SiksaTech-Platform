"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, 
  FolderOpen, 
  BookOpen, 
  Package, 
  LogOut, 
  ChevronRight, 
  Wrench, 
  Loader2,
  TrendingUp,
  Truck
} from "lucide-react";

export default function InventoryManager() {
  const router = useRouter();
  const [kits, setKits] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick stock editor state
  const [selectedKitId, setSelectedKitId] = useState("");
  const [stockDelta, setStockDelta] = useState(10);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // Shipping updates state
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchInventoryData = async () => {
    setLoading(true);
    if (isRealSupabase && supabase) {
      try {
        const { data: kitsList } = await supabase.from("kits").select("*");
        setKits(kitsList || []);

        const { data: ordersList } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        setOrders(ordersList || []);

        if (kitsList && kitsList.length > 0) {
          setSelectedKitId(kitsList[0].id);
        }
      } catch (err) {
        console.error("Error loading inventory:", err);
      }
    } else {
      setKits([
        { id: "kit-builder", name: "SiksaTech Builder Kit", stock_count: 35, price: 4999.00 }
      ]);
      setOrders([
        { id: "ord-992", kit_id: "kit-builder", quantity: 1, status: "pending", shipping_address: "12 Church St, Bangalore", tracking_number: null }
      ]);
      setSelectedKitId("kit-builder");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKitId) return;
    setIsUpdatingStock(true);

    const kitToUpdate = kits.find(k => k.id === selectedKitId);
    if (!kitToUpdate) return;
    const nextStock = kitToUpdate.stock_count + stockDelta;

    if (isRealSupabase && supabase) {
      try {
        const { error } = await supabase
          .from("kits")
          .update({ stock_count: nextStock })
          .eq("id", selectedKitId);

        if (error) {
          alert("Stock update failed: " + error.message);
        } else {
          alert("Stock level updated!");
          await fetchInventoryData();
        }
      } catch (err: any) {
        alert("Unexpected error: " + err.message);
      }
    } else {
      setKits(kits.map(k => k.id === selectedKitId ? { ...k, stock_count: nextStock } : k));
      alert("Stock level updated in sandbox!");
    }
    setIsUpdatingStock(false);
  };

  const handleUpdateShipping = async (orderId: string, nextStatus: string) => {
    const tracking = trackingInput[orderId] || "TRK-PLACEHOLDER-888";
    setUpdatingOrderId(orderId);

    if (isRealSupabase && supabase) {
      try {
        const { error } = await supabase
          .from("orders")
          .update({ status: nextStatus, tracking_number: tracking })
          .eq("id", orderId);

        if (error) {
          alert("Order status update failed: " + error.message);
        } else {
          alert(`Order updated to: ${nextStatus}`);
          await fetchInventoryData();
        }
      } catch (err: any) {
        alert("Unexpected error: " + err.message);
      }
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus, tracking_number: tracking } : o));
      alert(`[SANDBOX] Order updated to: ${nextStatus}`);
    }
    setUpdatingOrderId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase bg-rose-50 px-2 py-0.5 rounded">
                INTERNAL NETWORK
              </span>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">team.siksatech.in</h2>
              <span className="text-[10px] text-slate-400 block font-mono">Inventory Desk</span>
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                href="/team-portal"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <Users className="w-4 h-4 text-slate-400" />
                Leads Pipeline
              </Link>
              
              <Link
                href="/team-portal/reviews"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <FolderOpen className="w-4 h-4 text-slate-400" />
                Portfolio Reviews
              </Link>

              <Link
                href="/team-portal/curriculum"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                Curriculum Editor
              </Link>

              <Link
                href="/team-portal/inventory"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 text-left transition-technical"
              >
                <Package className="w-4 h-4" />
                Kits Stock Manager
              </Link>
            </nav>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:border-rose-350 hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-rose-600 rounded-lg transition-technical cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              EXIT OPERATIONS
            </button>
          </div>

          {/* Inventory Board */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Stock Levels & Dispatch Logs */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Kit Stock Status */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Physical Hardware Kits Stock</h3>
                    <p className="text-xs text-slate-500 font-mono">Current stock levels in our distribution centers.</p>
                  </div>

                  {loading ? (
                    <div className="text-center py-6 flex justify-center items-center">
                      <Loader2 className="w-4 h-4 text-indigo-650 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {kits.map(kit => (
                        <div key={kit.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-50 border border-slate-150">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{kit.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">Ref: {kit.id} | Rs. {kit.price}</span>
                          </div>
                          <span className={`px-3 py-1.5 rounded font-mono text-xs font-extrabold border ${
                            kit.stock_count < 50
                              ? "bg-rose-50 border-rose-200 text-rose-650 animate-pulse"
                              : "bg-emerald-50 border-emerald-200 text-emerald-650"
                          }`}>
                            {kit.stock_count} units left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dispatch logs */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Hardware Dispatch Logs</h3>
                    <p className="text-xs text-slate-500 font-mono">Monitor and dispatch orders for school and student kits.</p>
                  </div>

                  {loading ? (
                    <div className="text-center py-6 flex justify-center items-center">
                      <Loader2 className="w-4 h-4 text-indigo-650 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">No shipment orders active in the system.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {orders.map(order => (
                        <div key={order.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-start gap-4 text-xs">
                            <div>
                              <span className="text-[9px] font-mono text-slate-400">ORDER ID: {order.id.slice(0, 8)}...</span>
                              <h4 className="font-bold text-slate-800 mt-0.5">Kit Ref: {order.kit_id} (Qty: {order.quantity})</h4>
                              <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-1">
                                Ship To: {order.shipping_address}
                              </p>
                              {order.tracking_number && (
                                <span className="text-[9px] font-mono bg-slate-100 border border-slate-200 text-slate-650 px-2 py-0.5 rounded block w-fit mt-1.5">
                                  Track: {order.tracking_number}
                                </span>
                              )}
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                              order.status === 'delivered'
                                ? "bg-emerald-50 border-emerald-250 text-emerald-650"
                                : order.status === 'shipped'
                                ? "bg-indigo-50 border-indigo-250 text-indigo-650"
                                : "bg-amber-50 border-amber-250 text-amber-650"
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Quick Shipment updates */}
                          {order.status === 'pending' && (
                            <div className="flex gap-2 items-center border-t border-slate-100 pt-3">
                              <input
                                type="text"
                                value={trackingInput[order.id] || ""}
                                onChange={(e) => setTrackingInput({ ...trackingInput, [order.id]: e.target.value })}
                                placeholder="Enter carrier tracking number..."
                                className="px-3 py-1.5 rounded border border-slate-200 bg-white text-[10px] focus:outline-none focus:border-indigo-650 flex-grow"
                              />
                              <button
                                onClick={() => handleUpdateShipping(order.id, "shipped")}
                                disabled={updatingOrderId === order.id}
                                className="px-3.5 py-2 text-[9px] font-bold bg-indigo-650 hover:bg-indigo-755 text-white rounded cursor-pointer flex items-center gap-1"
                              >
                                <Truck className="w-3.5 h-3.5" /> SHIP KIT
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Stock Adjuster Form */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Adjust Kit Stock</h3>

                <form onSubmit={handleAdjustStock} className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Select Kit</label>
                    <select
                      value={selectedKitId}
                      onChange={(e) => setSelectedKitId(e.target.value)}
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    >
                      {kits.map(k => (
                        <option key={k.id} value={k.id}>{k.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Stock Adjustment Value</label>
                    <input
                      type="number"
                      required
                      value={stockDelta}
                      onChange={(e) => setStockDelta(Number(e.target.value))}
                      placeholder="e.g. 10 to add, -5 to deduct"
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingStock}
                    className="w-full py-3.5 text-xs font-bold tracking-widest bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg transition-technical shadow-md cursor-pointer"
                  >
                    {isUpdatingStock ? "ADJUSTING..." : "UPDATE STOCK LEVELS"}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
