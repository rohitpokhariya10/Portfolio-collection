// Central source for real portfolio content used across the portfolio.
// Keeping facts here prevents visual components from drifting out of sync.

export const profile = {
  name: "Rohit Singh Pokhariya",
  shortName: "Rohit Pokhariya",
  initials: "RP",
  logo: "/logo.png",
  role: "Full Stack AI Developer",
  location: "India",
  email: "rohit.pokhariya123@gmail.com",
  phone: "+91 90124 64329",
  website: "https://rohitpokhariya.in",
  websiteLabel: "rohitpokhariya.in",
  github: "https://github.com/rohitpokhariya10",
  githubLabel: "github.com/rohitpokhariya10",
  linkedin: "https://www.linkedin.com/in/rohit-singh-pokhariya-24742a220/",
  linkedinLabel: "rohit-singh-pokhariya-24742a220",
  leetcode: "https://leetcode.com/u/user8310wm/",
  leetcodeLabel: "100+ problems solved",
  resume: "/Rohit_Pokhariya_CV.pdf",
  photo: "/projects/profile-photo.jpg",
  headline: "Full Stack AI Developer",
  subline:
    "MERN / PERN developer shipping production-grade web apps end to end. Currently building CrediFlow AI, an automated invoice-recovery platform for Indian MSMEs.",
  summary:
    "I build production-grade, AI-integrated web applications from React and Next.js interfaces through Node.js APIs, databases, queues, payments, and deployment. My current flagship build is CrediFlow AI, a B2B invoice-recovery platform for Indian MSMEs anchored in Section 43B(h) vendor-payment compliance.",
};

export const contactLinks = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    label: "Website",
    value: profile.websiteLabel,
    href: profile.website,
  },
  {
    label: "LinkedIn",
    value: profile.linkedinLabel,
    href: profile.linkedin,
  },
  {
    label: "GitHub",
    value: profile.githubLabel,
    href: profile.github,
  },
  {
    label: "LeetCode",
    value: profile.leetcodeLabel,
    href: profile.leetcode,
  },
];

export const skillGroups = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "C++", "Java", "SQL", "HTML5", "CSS3"],
  },
  {
    title: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Responsive Design",
      "Cross-Browser Compatibility",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "REST API Design",
      "JWT Authentication",
      "Google OAuth 2.0",
      "MVC Architecture",
    ],
  },
  {
    title: "Data & Caching",
    items: ["MongoDB (Mongoose)", "PostgreSQL", "Redis"],
  },
  {
    title: "AI & Integrations",
    items: ["Google Gemini API", "Razorpay", "Cloudinary", "ImageKit"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "Docker", "Postman", "Vercel"],
  },
  {
    title: "Core CS",
    items: [
      "Data Structures & Algorithms",
      "DBMS",
      "Operating Systems",
      "OOP",
      "Computer Networks",
    ],
  },
];

export const projects = [
  {
    id: "crediflow-ai",
    number: "01",
    title: "CrediFlow AI",
    shortTitle: "CrediFlow",
    label: "B2B Invoice Recovery Platform",
    status: "Flagship AI product",
    image: null,
    timeline: "Current",
    stack: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "Redis",
      "BullMQ",
      "Socket.io",
      "Razorpay (test mode)",
      "Cloudinary",
      "Docker Compose",
    ],
    description:
      "A B2B SaaS platform that helps Indian MSMEs recover overdue vendor payments and stay aligned with Section 43B(h). It combines secure payment workflows, scheduled follow-ups, real-time status updates, and automated recovery-readiness scoring.",
    highlights: [
      "Razorpay webhook signature verification with idempotency handling",
      "Real-time status updates through Socket.io",
      "Token-gated buyer portal",
      "Automated risk and recovery-readiness scoring",
    ],
  },
  {
    id: "study-notion",
    number: "02",
    title: "StudyNotion",
    shortTitle: "StudyNotion",
    label: "E-Learning Platform",
    status: "Production full-stack app",
    image: "/projects/study-notion.png",
    timeline: "Mar-Aug 2025",
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Redis",
      "Razorpay",
      "Cloudinary",
    ],
    description:
      "A MERN e-learning platform with role-based student and instructor dashboards across 10+ courses, a Redis-cached course catalog, Cloudinary-backed media uploads, and Razorpay webhook-driven enrollment.",
    highlights: [
      "JWT role authentication for student/instructor dashboards",
      "Redis caching for frequently accessed course data",
      "Razorpay webhook verification and automated enrollment",
    ],
  },
  {
    id: "arifex-ai",
    number: "03",
    title: "Arifex-AI",
    shortTitle: "Arifex-AI",
    label: "AI SaaS Platform",
    status: "Gemini-powered SaaS",
    image: "/projects/AI-SaaS-App.png",
    timeline: "Sep-Dec 2024",
    stack: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Gemini API",
      "Google OAuth",
      "ImageKit",
    ],
    description:
      "A PERN SaaS platform for AI-powered text generation and resume analysis via Gemini, with Google OAuth 2.0, ImageKit-optimized media delivery, and rate-limited REST APIs backed by PostgreSQL.",
    highlights: [
      "AI text generation and resume analysis with Gemini API",
      "Google OAuth 2.0 social login",
      "Rate-limited PostgreSQL APIs with structured errors",
    ],
  },
];

export const experience = [
  {
    company: "BrightChamps",
    role: "Freelance Coding Instructor",
    date: "Apr 2026-Present",
    location: "Remote",
    detail:
      "Delivering live coding sessions to 20+ students daily across Grade 1-12, covering Scratch, HTML/CSS/JavaScript, and web development fundamentals; designing age-appropriate, project-based curricula.",
  },
  {
    company: "PayrollCloud India Pvt Ltd",
    role: "Project Management Intern",
    date: "Jun-Aug 2025",
    location: "Ahmedabad",
    detail:
      "Coordinated planning and delivery tracking across 3 concurrent client projects, contributing to a 15% improvement in timelines. Authored 10+ process/workflow documents that reduced cross-team ambiguity.",
  },
];

export const education = {
  degree: "B.Tech, Computer Science Engineering",
  school: "Graphic Era Hill University, Dehradun",
  date: "2022-2026",
  detail: "CGPA 7.2, graduate as of 2026.",
};

export const achievements = [
  "100+ DSA problems solved on LeetCode.",
  "Deployed 2 production full-stack applications with live domains.",
];

export const proofStats = [
  ["AI product", "CrediFlow AI"],
  ["Apps deployed", "2+"],
  ["Courses shipped", "10+"],
  ["DSA solved", "100+"],
];
