"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import { db, StoreKit } from "@siksatech/database";
import {
  ShoppingCart, Package, Tag, Check, Star,
  ArrowRight, Filter
} from "lucide-react";

export default function StorePage() {
  const [kits, setKits] = useState<StoreKit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    db.getStoreKits().then(setKits);
  }, []);

  const categories = [
    { value: "", label: "All Products" },
    { value: "explorer", label: "Explorer Kits" },
    { value: "builder", label: "Builder Kits" },
    { value: "creator", label: "Creator Kits" },
    { value: "engineer", label: "Engineer Kits" },
    { value: "accessory", label: "Accessories" },
  ];

  const filteredKits = selectedCategory
    ? kits.filter((k) => k.category === selectedCategory)
    : kits;

  const categoryColors: Record<string, { badge: string; accent: string }> = {
    explorer: { badge: "bg-emerald-100 text-emerald-700", accent: "border-emerald-200" },
    builder: { badge: "bg-blue-100 text-blue-700", accent: "border-blue-200" },
    creator: { badge: "bg-purple-100 text-purple-700", accent: "border-purple-200" },
    engineer: { badge: "bg-orange-100 text-orange-700", accent: "border-orange-200" },
    component: { badge: "bg-slate-100 text-slate-700", accent: "border-slate-200" },
    accessory: { badge: "bg-amber-100 text-amber-700", accent: "border-amber-200" },
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Header */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                SiksaTech Store
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Hardware Kits & Components
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Curated STEM hardware kits for every learning track. Each kit includes all
                components, a project guide, and everything you need to start building.
              </p>
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                    selectedCategory === cat.value
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKits.map((kit) => {
                const colors = categoryColors[kit.category] || categoryColors.component;
                const discount = kit.originalPrice
                  ? Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={kit.id}
                    className={`bg-white rounded-xl border ${colors.accent} overflow-hidden hover:shadow-lg transition-all group`}
                  >
                    {/* Product Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform" />
                      {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${colors.badge}`}>
                        {kit.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                        {kit.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                        {kit.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {kit.features.slice(0, 4).map((feat, i) => (
                          <span key={i} className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                            <Check className="w-3 h-3 text-emerald-500" />
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-slate-900">
                              ₹{kit.price.toLocaleString("en-IN")}
                            </span>
                            {kit.originalPrice && (
                              <span className="text-sm text-slate-400 line-through">
                                ₹{kit.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-semibold mt-0.5 ${
                            kit.inStock ? "text-emerald-600" : "text-red-500"
                          }`}>
                            {kit.inStock ? `In Stock (${kit.stockCount} left)` : "Out of Stock"}
                          </p>
                        </div>

                        <button
                          disabled={!kit.inStock}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            kit.inStock
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {kit.inStock ? "Add to Cart" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredKits.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Need bulk orders for your institution?
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              We offer special pricing for schools and colleges ordering kits in batches of 20+.
            </p>
            <a
              href="/institutions#inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-all"
            >
              Request Bulk Pricing
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
