// Localization dictionary for Circle (دواير)
export const dict = {
  en: {
    appName: "Circle",
    tagline: "A new social operating system",
    onboarding: {
      slide1: { title: "Welcome to Circle", body: "Your AI-native super app for everything that matters." },
      slide2: { title: "Eight worlds. One Circle.", body: "Chat, video, social, travel and payments — beautifully unified." },
      slide3: { title: "Designed for you", body: "Privacy-first, intelligence-rich, motion-perfect." },
      cta: "Enter Circle",
      skip: "Skip",
    },
    nav: {
      home: "Home", wasl: "Wasl", mashahd: "Mashahd", lamahat: "Lamahat",
      midan: "Midan", rihla: "Rihla", pay: "Pay", profile: "Profile",
    },
    home: {
      hello: "Good evening",
      featured: "Featured",
      nearby: "Nearby happenings",
      forYou: "For you",
      trending: "Trending in your city",
      workspace: "Workspace updates",
      ask: "Ask Circle anything...",
    },
  },
  ar: {
    appName: "دواير",
    tagline: "نظام تشغيل اجتماعي جديد",
    onboarding: {
      slide1: { title: "مرحبًا بك في دواير", body: "تطبيقك الفائق المدعوم بالذكاء الاصطناعي لكل ما يهم." },
      slide2: { title: "ثمانية عوالم. دائرة واحدة.", body: "محادثة، فيديو، اجتماعي، سفر ومدفوعات — موحّدة بأناقة." },
      slide3: { title: "مصمم لك", body: "خصوصية أولاً، ذكاء غني، حركة مثالية." },
      cta: "ادخل إلى دواير",
      skip: "تخطي",
    },
    nav: {
      home: "الرئيسية", wasl: "وصل", mashahd: "مشاهد", lamahat: "لمحات",
      midan: "ميدان", rihla: "رحلة", pay: "دفع", profile: "الملف",
    },
    home: {
      hello: "مساء الخير",
      featured: "مميز",
      nearby: "بالقرب منك",
      forYou: "مختار لك",
      trending: "الرائج في مدينتك",
      workspace: "تحديثات العمل",
      ask: "اسأل دواير أي شيء...",
    },
  },
} as const;

export type Locale = keyof typeof dict;
