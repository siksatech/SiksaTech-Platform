export const SITE_CONFIG = {
  name: "SiksaTech",
  description: "STEM-based technology learning platform for Class 5 through College.",
  domains: {
    public: "https://siksatech.in",
    team: "https://team.siksatech.in",
  },
  tagline: "Technology is better understood when you build it.",
  contacts: {
    email: "support@siksatech.in",
  },
};

export const APP_CONFIG = {
  name:           "SiksaTech",
  tagline:        "Learn · Build · Showcase · Compete · Connect",
  supportEmail:   "support@siksatech.in",
  currency:       "INR",
  currencySymbol: "₹",
} as const;

// Re-export roles and permissions
export * from "./roles";
