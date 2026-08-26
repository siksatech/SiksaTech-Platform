"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@siksatech/ui";
import {
  getUserOrders,
  createBrowserClient,
  isRealSupabase,
  type OrderRecord
} from "@siksatech/database";
import {
  Package, Truck, CheckCircle2, Clock, ArrowLeft, ExternalLink,
  ChevronRight, ShoppingBag
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const data = await getUserOrders(supabase, user.id);
            setOrders(data);
          }
        } catch (err) {
          console.error("Order fetch error:", err);
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hardware Orders &amp; Shipment Tracking
            </h1>
          </div>
          <Link
            href="/cart"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            View Cart
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs shadow-sm">
            Loading your shipment history...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No Orders Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When you purchase a hardware starter kit or components, your courier tracking ID and delivery status will appear here.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Explore Hardware Kits <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Order Reference
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-mono">
                      {order.order_number}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500 font-mono">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === "delivered"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : order.status === "shipped"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ordered Packages:
                  </h4>
                  <div className="space-y-2">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-slate-800">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          ₹{item.subtotal_inr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Tracking Box */}
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Delivery Destination:</span>
                    <p className="font-semibold text-slate-900">{order.shipping_address.fullName}</p>
                    <p className="text-slate-600">{order.shipping_address.addressLine}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postalCode}</p>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Courier Tracking:</span>
                    {order.tracking_number ? (
                      <div>
                        <p className="font-mono font-bold text-blue-700">{order.tracking_number}</p>
                        <p className="text-slate-500 font-medium">via {order.courier_name || "Express Courier"}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">Tracking details will update once dispatched from center.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
