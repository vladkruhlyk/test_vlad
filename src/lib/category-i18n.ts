/** Maps a category slug to its translation namespace + key for localized titles. */
export const categoryI18n: Record<string, { ns: "BanksMenu" | "InsuranceMenu"; key: string }> = {
  "personal-accounts": { ns: "BanksMenu", key: "personalAccounts" },
  "business-accounts": { ns: "BanksMenu", key: "businessAccounts" },
  "cashback-cards": { ns: "BanksMenu", key: "cashbackCards" },
  "accounts-for-foreigners": { ns: "BanksMenu", key: "foreignersAccounts" },
  "online-account-opening": { ns: "BanksMenu", key: "onlineOpening" },
  "premium-banking": { ns: "BanksMenu", key: "premiumBanking" },
  "student-accounts": { ns: "BanksMenu", key: "studentAccounts" },
  "car-insurance": { ns: "InsuranceMenu", key: "carInsurance" },
  "home-insurance": { ns: "InsuranceMenu", key: "homeInsurance" },
  "health-insurance": { ns: "InsuranceMenu", key: "healthInsurance" },
  "life-insurance": { ns: "InsuranceMenu", key: "lifeInsurance" },
  "travel-insurance": { ns: "InsuranceMenu", key: "travelInsurance" },
  "business-insurance": { ns: "InsuranceMenu", key: "businessInsurance" },
};
