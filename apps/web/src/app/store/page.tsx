"use client";

import { useState, useEffect } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { db, StoreKit } from "@siksatech/database";
import {
  ShoppingCart, Package, Tag, Check, Star,
  ArrowRight, Filter, ShieldCheck, Truck, RotateCcw,
  Sparkles, CheckCircle2
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

  const handleAddToCart = (name: string) => {
    setAddedItem(name);
    setTimeout(() => setAddedItem(null), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-[#0A0F1D] text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-mono font-bold uppercase rounded-full">
              SiksaTech Official Hardware Store
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Curated Prototyping Kits &amp; Electronics
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Industrial-grade microcontrollers, sensors, and chassis bundled with verified step-by-step schematics and video tutorials.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                <Truck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span><strong>Free Pan-India Delivery</strong> on all starter kits</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                <RotateCcw className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span><strong>14-Day Free Replacement</strong> on defective parts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span><strong>100% Quality Tested</strong> before dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toast Notification */}
          {addedItem && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">{addedItem}</p>
                <p className="text-[10px] text-slate-400">Added to order. Proceed to checkout.</p>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKits.map((kit) => (
              <div
                key={kit.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200 uppercase">
                      {kit.category} track
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" /> 4.9 (120+ reviews)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{kit.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{kit.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included Hardware:</p>
                    <ul className="space-y-1">
                      {kit.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900">₹{kit.price}</span>
                    {kit.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">₹{kit.originalPrice}</span>
                    )}
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Free Shipping
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(kit.name)}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-all"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/enquiry/kit?kitId=${kit.id}`}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                    >
                      Order Now &rarr;
                    </Link>
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
