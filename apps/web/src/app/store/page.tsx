"use client";

import { useState, useEffect } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { db, StoreKit } from "@siksatech/database";
import {
  Check, Star, ShieldCheck, Truck, RotateCcw, CheckCircle2, ShoppingBag, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function StorePage() {
  const [kits, setKits] = useState<StoreKit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    db.getStoreKits().then(setKits);
  }, []);

  const categories = [
    { value: "", label: "All Products" },
    { value: "explorer", label: "Explorer (Class 5–7)" },
    { value: "builder", label: "Builder (Class 8–10)" },
    { value: "creator", label: "Creator (Class 11–12)" },
    { value: "engineer", label: "Engineer (College)" },
  ];

  const filteredKits = selectedCategory
    ? kits.filter((k) => k.category === selectedCategory)
    : kits;

  const handleAddToCart = (kit: StoreKit) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siksatech_cart");
      let items: any[] = [];
      if (saved) {
        try {
          items = JSON.parse(saved);
        } catch {
          items = [];
        }
      }
      const existing = items.find((i) => i.id === kit.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({
          id: kit.id,
          title: kit.name,
          price_inr: kit.price,
          quantity: 1,
          category: kit.category
        });
      }
      localStorage.setItem("siksatech_cart", JSON.stringify(items));
    }
    setAddedItem(kit.name);
    setTimeout(() => setAddedItem(null), 2500);
  };

  const handleBuyNow = (kit: StoreKit) => {
    handleAddToCart(kit);
    window.location.href = "/cart";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Crisp Light Header Hero */}
        <section className="bg-white text-slate-900 py-12 sm:py-16 border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase rounded-full">
              SIKSATECH OFFICIAL HARDWARE STORE
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Curated Prototyping Kits &amp; Electronics
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Industrial-grade microcontrollers, sensors, and chassis bundled with verified step-by-step schematics and video tutorials.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                <span><strong>Free Pan-India Delivery</strong> on all starter kits</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                <RotateCcw className="w-5 h-5 text-emerald-600 shrink-0" />
                <span><strong>14-Day Free Replacement</strong> on defective parts</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700">
                <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
                <span><strong>100% Quality Tested</strong> before dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toast Notification */}
          {addedItem && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">{addedItem}</p>
                <p className="text-[10px] text-slate-400">Added to cart. Proceed to checkout.</p>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {kit.category.toUpperCase()} KIT
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      In Stock • Dispatches in 24h
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {kit.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {kit.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{(kit as any).componentsCount || (kit as any).components?.length || 16} Precision Hardware Components</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Printed Circuit Wiring Manual Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Safe 5V / 3.3V Low-Voltage Lab Rail</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold font-mono text-slate-900">
                      ₹{kit.price}
                    </span>
                    <span className="text-xs text-slate-400 font-mono line-through">
                      ₹{Math.round(kit.price * 1.6)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(kit)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add
                    </button>
                    <button
                      onClick={() => handleBuyNow(kit)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Buy Now &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
