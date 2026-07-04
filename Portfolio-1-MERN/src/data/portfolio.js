// Central source for real portfolio content used across the editorial layout.
// Keeping copy and assets here helps prevent invented projects from creeping in.

export const profile = {
  name: "Rohit Pokhariya",
  initials: "RP",
  logo: "/logo.png",
  role: "MERN Stack Developer",
  location: "India",
  email: "rohit.pokhariya123@gmail.com",
  phone: "+91 9012464329",
  github: "https://github.com/rohitpokhariya10",
  linkedin: "https://www.linkedin.com/in/rohit-singh-pokhariya-24742a220/",
  resume: "/Rohit_Pokhariya_CV.pdf",
  photo: "/projects/profile-photo.jpg",
};

export const projects = [
  {
    id: "study-notion",
    number: "01",
    title: "StudyNotion",
    shortTitle: "StudyNotion",
    label: "EdTech platform",
    status: "MERN build",
    image: "/projects/study-notion.png",
    problem:
      "Students need a way to explore courses while instructors manage learning content from the same product.",
    built:
      "A full-stack e-learning platform built around authentication flow, role-based access, and API integration.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    note: "Role-based access did the heavy lifting here.",
    span: "md:col-span-7 md:row-span-2",
    tilt: "-3deg",
    mobileTilt: "-1.5deg",
  },
  {
    id: "quick-ai",
    number: "02",
    title: "QuickAI",
    shortTitle: "QuickAI",
    label: "AI SaaS web app",
    status: "API-backed SaaS",
    image: "/projects/AI-SaaS-App.png",
    problem:
      "A production-style AI tool needs reusable UI and a clean API boundary instead of one-off prompt screens.",
    built:
      "An AI-powered SaaS app with content generation, external AI API handling, reusable components, and production-style UX.",
    tags: ["React", "Node.js", "Express.js", "API Integration", "Tailwind CSS"],
    note: "The AI bit is flashy; the boundary is the useful part.",
    span: "md:col-span-5",
    tilt: "4deg",
    mobileTilt: "1deg",
  },
  {
    id: "vendor-compliance",
    number: "03",
    title: "Vendor Payment Compliance Tracker",
    shortTitle: "Vendor Tracker",
    label: "Compliance concept",
    status: "Audit tracker concept",
    image: null,
    problem:
      "Vendor payment deadlines can become hard to audit when tax-rule timing is tracked outside the workflow.",
    built:
      "A current product concept for tracking vendor payment deadlines against a tax rule before deadline risk turns into cleanup work.",
    tags: ["Compliance workflow", "Deadline tracking", "Audit concept"],
    note: "No fake screenshot. Just the actual idea, pinned like a receipt.",
    span: "md:col-span-4",
    tilt: "-5deg",
    mobileTilt: "0deg",
  },
  {
    id: "etrade",
    number: "04",
    title: "eTrade",
    shortTitle: "eTrade",
    label: "E-commerce frontend",
    status: "Frontend system",
    image: "/projects/eTrade.png",
    problem:
      "Shopping interfaces need repeatable product layouts that hold up across device sizes.",
    built:
      "A responsive e-commerce frontend focused on reusable components, product layouts, and clean shopping-platform patterns.",
    tags: ["React", "Tailwind CSS"],
    note: "Product cards behaved. That counts as a small victory.",
    span: "md:col-span-4",
    tilt: "3deg",
    mobileTilt: "0deg",
  },
  {
    id: "modern-portfolio",
    number: "05",
    title: "Modern Developer Portfolio",
    shortTitle: "Portfolio",
    label: "Content-driven UI",
    status: "React portfolio",
    image: "/projects/modern-portfolio-2026.png",
    problem:
      "Portfolio content becomes hard to maintain when layout and data are tangled together.",
    built:
      "A responsive personal portfolio built with a data-first approach where content is defined first and components map over it.",
    tags: ["React", "Tailwind CSS"],
    note: "Data first, then UI. The notes file already said it out loud.",
    span: "md:col-span-4",
    tilt: "-2deg",
    mobileTilt: "0deg",
  },
];

export const capabilities = [
  {
    title: "MERN stack without the fog machine",
    colorClass: "bg-band-coral",
    stickerColor: "bg-accent-mint",
    stickerImage: "/projects/study-notion.png",
    proof:
      "StudyNotion and QuickAI show React, Node.js, Express.js, MongoDB, REST APIs, and API integration in the same portfolio.",
    sticker:
      "Frontend, backend, and the little wiring bits that quietly decide whether the app works.",
  },
  {
    title: "Teaching makes the code easier to explain",
    colorClass: "bg-band-butter",
    stickerColor: "bg-accent-periwinkle text-paper",
    stickerImage: "/projects/profile-photo.jpg",
    proof:
      "BrightChamps work means teaching Scratch, HTML, CSS, and JavaScript across grades 1-12, then reviewing what students submit.",
    sticker:
      "Daily reminder: if a kid can ask why, the code should have an answer.",
  },
  {
    title: "Interfaces built from real content first",
    colorClass: "bg-band-sage",
    stickerColor: "bg-accent-mint",
    stickerImage: "/projects/modern-portfolio-2026.png",
    proof:
      "The portfolio project and current repo notes both use the same habit: write the data, then map it into UI.",
    sticker:
      "Less mystery meat UI. More arrays doing honest work.",
  },
];
