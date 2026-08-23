export const SECTORS = [
  "FinTech", "AgriTech", "EdTech", "HealthTech",
  "LogisticsTech", "CleanTech", "Other",
];

export const STAGES = ["Idea", "Pre-seed", "Seed", "Series A"];

export const LOCATIONS = [
  "Addis Ababa", "Bahir Dar", "Hawassa", "Mekelle",
  "Adama", "Regional IT Parks", "Other",
];

export const COUNTRIES = [
  "Ethiopia",
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Somalia",
  "Djibouti",
  "South Sudan",
  "Sudan",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Egypt",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "India",
  "China",
  "United Arab Emirates",
  "Other",
];

export const mockStartups = [];
export const mockAccessRequests = [];
export const mockPendingVerifications = [];

export const analyticsData = {
  overview: {
    totalStartups: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    totalInvestors: 0,
    accessRequestsThisMonth: 0,
    approvedThisMonth: 0,
  },
  sectorDistribution: [],
  stageDistribution: [],
  dealFlow: [],
};