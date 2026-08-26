"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight,
  ShieldCheck, Truck, Sparkles, Tag
} from "lucide-react";

export interface CartItem {
  id: string;
  title: string;
  price_inr: number;
  quantity: number;
  category: string;
}

const DEFAULT_CART_ITEMS: CartItem[] = [
  {
    id: "prod-2",
    title: "Builder Embedded Arduino Kit",
    price_inr: 2999,
    quantity: 1,
    category: "builder"
  }
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    // Load cart from localStorage or fallback
    const saved = localStorage.getItem("siksatech_cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        setCartItems(DEFAULT_CART_ITEMS);
      }
    } else {
      setCartItems(DEFAULT_CART_ITEMS);
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      localStorage.setItem("siksatech_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("siksatech_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "MAKER10" || couponCode.toUpperCase() === "SIKSA10") {
      setDiscountPercent(10);
      setCouponApplied(true);
    } else {
      alert("Invalid promotional code. Use code 'MAKER10' for 10% off.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price_inr * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discountAmount + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Your Hardware Cart
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your cart is empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Explore our curated STEM starter kits, sensors, and autonomous rovers to add hardware to your order.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Browse Hardware Kits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {item.category} kit
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs font-extrabold text-slate-900 font-mono">
                        ₹{item.price_inr} <span className="text-slate-400 font-normal">/ unit</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold font-mono text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900 font-mono">
                          ₹{item.price_inr * item.quantity}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-sm">
                  <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span><strong>Free Express Shipping</strong> across India on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>14-Day Defect Replacement</strong> warranty with all hardware kits</span>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (MAKER10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-mono uppercase text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> 10% Maker Discount Applied!
                  </p>
                )}

                {/* Calculation Breakdown */}
                <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount (10%):</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-3">
                    <span>Total Amount (incl. taxes):</span>
                    <span className="font-mono text-blue-600 text-lg">₹{total}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" /> Proceed to Checkout
                </Link>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Secured 256-bit checkout powered by Razorpay (UPI, NetBanking, Debit/Credit Cards).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
