import type { FAQ } from "./types";

const raw = [
  { question: "Is BankPilots free to use?", answer: "Yes. Comparing products on BankPilots is completely free. We may earn a commission from partners when you apply, at no extra cost to you." },
  { question: "How do you make money?", answer: "We use affiliate (CPA) partnerships. When you apply for a product through our links, the provider may pay us a commission. This never affects our independent rankings." },
  { question: "Is the data up to date?", answer: "We review offers regularly and update fees, bonuses and conditions. Always confirm final terms on the provider's website before applying." },
  { question: "Do you cover insurance as well as banking?", answer: "Yes. We compare personal and business accounts, cards, and car, home, health, life, travel and business insurance." },
  { question: "Can I open an account without a PESEL?", answer: "Several products on BankPilots are foreigner-friendly and don't require a PESEL. Use the 'Accounts for foreigners' category or our recommendation wizard." },
  { question: "How do you rank products?", answer: "Our editorial team scores products on fees, usability, support and benefits, combined with user popularity. Rankings are independent of commissions." },
];

export const globalFaqs: FAQ[] = raw.map((f, i) => ({ id: `global-${i}`, order: i, ...f }));
