export const SITE_CONFIG = {
  name: {
    ar: "كسره",
    en: "Kasrah"
  },
  description: {
    ar: "موقعك الأول لأخبار كرة القدم السعودية، النتائج المباشرة، الانتقالات والتحليلات",
    en: "Your first source for Saudi football news, live results, transfers and analysis"
  }
};

export const NAVIGATION_ITEMS = [
  {
    key: "home",
    labelAr: "الرئيسية",
    labelEn: "Home",
    icon: "fas fa-home",
    route: "/"
  },
  {
    key: "matches",
    labelAr: "المباريات",
    labelEn: "Matches",
    icon: "fas fa-calendar-alt",
    route: "/matches"
  },
  {
    key: "transfers",
    labelAr: "الانتقالات",
    labelEn: "Transfers",
    icon: "fas fa-exchange-alt",
    route: "/transfers"
  },
  {
    key: "news",
    labelAr: "الأخبار",
    labelEn: "News",
    icon: "fas fa-newspaper",
    route: "/news"
  },
  {
    key: "more",
    labelAr: "المزيد",
    labelEn: "More",
    icon: "fas fa-ellipsis-h",
    route: "/more"
  }
];

export const MATCH_STATUS = {
  scheduled: {
    ar: "مجدولة",
    en: "Scheduled"
  },
  live: {
    ar: "مباشر",
    en: "Live"
  },
  completed: {
    ar: "انتهت",
    en: "Completed"
  },
  postponed: {
    ar: "مؤجلة",
    en: "Postponed"
  }
};

export const TRANSFER_STATUS = {
  rumor: {
    ar: "إشاعة",
    en: "Rumor"
  },
  confirmed: {
    ar: "مؤكد",
    en: "Confirmed"
  },
  completed: {
    ar: "مكتمل",
    en: "Completed"
  }
};

export const NEWS_CATEGORIES = {
  breaking: {
    ar: "عاجل",
    en: "Breaking"
  },
  transfer: {
    ar: "انتقالات",
    en: "Transfers"
  },
  match: {
    ar: "مباريات",
    en: "Matches"
  },
  analysis: {
    ar: "تحليل",
    en: "Analysis"
  }
};
