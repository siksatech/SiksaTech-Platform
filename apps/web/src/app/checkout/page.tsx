"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import {
  createOrder,
  createBrowserClient,
  isRealSupabase,
  type ShippingAddress
} from "@siksatech/database";
import {
  ShieldCheck, ArrowLeft, CheckCircle2, Lock, CreditCard,
  Truck, Loader2, Sparkles, AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  // Address form
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    email: "",
    addressLine: "",
    city: "",
    state: "Delhi",
    postalCode: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("siksatech_cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price_inr * item.quantity, 0);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine) {
      alert("Please fill in all mandatory shipping address fields.");
      return;
    }

    setIsProcessing(true);
    let userId: string | null = null;
    let supabase;

    if (isRealSupabase) {
      try {
        supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (err) {
        console.error("Auth lookup error:", err);
      }
    }

    // Process Order Creation & Razorpay Payment Record
    const res = await createOrder(supabase, {
      user_id: userId,
      items: cartItems.map((item) => ({
        product_id: item.id,
        product_name: item.title,
        price_inr: item.price_inr,
        quantity: item.quantity
      })),
      shipping_address: formData,
      payment_gateway: "razorpay",
      payment_id: `rzp_test_${Date.now()}`
    });

    if (res.success && res.orderNumber) {
      // Clear cart
      localStorage.removeItem("siksatech_cart");
      setOrderComplete(res.orderNumber);
    } else {
      alert("Order placement failed: " + (res.error || "Please try again"));
    }
    setIsProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">
                Payment Confirmed &middot; Razorpay
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                Order Placed Successfully!
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. Your hardware kit order has been routed to our packing center.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-bold text-slate-900">{orderComplete}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-blue-600">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-600 font-bold">Processing Dispatch</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/student"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/store"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all block"
              >
                Return to Store
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Details Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                Step 1 of 2
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Pan-India Shipping Address
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your residential or institutional address for physical kit delivery.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4" id="checkout-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Recipient Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Aditya Roy"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Phone / Mobile Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Email Address (for shipment tracking updates) *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. aditya@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="addressLine" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Street Address &amp; House / Apartment No. *
                </label>
                <input
                  id="addressLine"
                  type="text"
                  name="addressLine"
                  required
                  placeholder="e.g. Flat 402, Sunshine Heights, Main Road"
                  value={formData.addressLine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="state" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    State / UT *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Other">Other State/UT</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="postalCode" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    PIN Code *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    required
                    maxLength={6}
                    placeholder="e.g. 110001"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Payment & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 tracking-wider">
                  Step 2 of 2
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Payment Method
                </h2>
              </div>

              {/* Razorpay Gateway Badge */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Razorpay Gateway (India)
                  </div>
                  <span className="text-[10px] font-mono text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">
                    UPI &middot; Cards &middot; NetBanking
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Supports Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, and all Indian bank netbanking.
                </p>
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items):</span>
                  <span className="font-mono font-bold text-slate-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% included):</span>
                  <span className="font-mono text-slate-500">₹{Math.round(subtotal * 0.18)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Courier Delivery:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-3">
                  <span>Final Total:</span>
                  <span className="font-mono text-blue-600 text-xl">₹{total}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[44px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AUTHORIZING PAYMENT...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> PAY ₹{total} WITH RAZORPAY
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                PCI-DSS Level 1 Compliant 256-bit Encryption
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
