// Central source for real portfolio content used across the portfolio.
// Resume-backed facts and project links are verified against
// /Rohit_Singh_Pokhariya_AI_FullStack_Developer_Resume.pdf.

export const profile = {
  name: "Rohit Singh Pokhariya",
  shortName: "Rohit Pokhariya",
  initials: "RP",
  logo: "/logo.png",
  role: "AI Full Stack Developer",
  location: "Dehradun, Uttarakhand, India",
  email: "rohit.pokhariya123@gmail.com",
  phone: "+91 90124 64329",
  website: "https://rohitpokhariya.in",
  websiteLabel: "rohitpokhariya.in",
  github: "https://github.com/rohitpokhariya10",
  githubLabel: "github.com/rohitpokhariya10",
  // These newer user-supplied profiles intentionally supersede the older
  // LinkedIn and LeetCode annotations embedded in the résumé PDF.
  linkedin: "https://in.linkedin.com/in/rohit-singh-pokhariya",
  linkedinLabel: "rohit-singh-pokhariya",
  leetcode: "https://leetcode.com/u/rohitpokhariya10/",
  leetcodeLabel: "120+ problems solved",
  resume: "/Rohit_Singh_Pokhariya_AI_FullStack_Developer_Resume.pdf",
  photo: "/profile/rohit-singh-pokhariya-professional-headshot.png",
  headline: "AI Full Stack Developer",
  subline:
    "Building production-ready SaaS products with React, Next.js, Node.js, Express, MongoDB/PostgreSQL, AI/LLM systems, Docker, AWS, and modern DevOps workflows.",
  summary:
    "I ship production SaaS features, RESTful APIs, and real-time systems across MERN and Next.js, from schema design and business logic to deployed UI. I also work with LangChain, Retrieval-Augmented Generation (RAG), agentic and multi-agent AI, LLM APIs, Docker, Kubernetes, AWS, CI/CD, and microservices.",
};

// Derive every channel from `profile` so cards, navigation, and contact pages
// cannot silently publish different addresses for the same person.
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

// Display order is intentional: the UI presents these groups as a learning-to-
// production progression rather than sorting them alphabetically.
export const skillGroups = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "C++", "SQL", "HTML5", "CSS3"],
  },
  {
    title: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux Toolkit",
      "Tailwind CSS",
      "SCSS",
      "Responsive Design",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "JWT",
      "OAuth 2.0",
      "WebSockets",
      "Socket.IO",
      "MVC",
      "Microservices Architecture",
    ],
  },
  {
    title: "Databases",
    items: ["MongoDB", "Mongoose", "PostgreSQL", "Redis", "MongoDB Aggregation"],
  },
  {
    title: "AI & LLM",
    items: [
      "LangChain",
      "Retrieval-Augmented Generation (RAG)",
      "Agentic AI",
      "Multi-Agent Systems",
      "Large Language Model (LLM) APIs",
      "Gemini API",
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      "Docker",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "Git",
      "GitHub",
      "Vercel",
      "Unit Testing (Jest)",
      "Postman",
      "npm",
    ],
  },
  {
    title: "Integrations & CS",
    items: [
      "Razorpay",
      "ImageKit",
      "Cloudinary",
      "Data Structures & Algorithms (DSA)",
      "DBMS",
      "Operating Systems",
      "OOP",
      "Computer Networks",
    ],
  },
];

// Project order is also presentation order. Stable IDs double as native anchor
// targets for the sticky project rail, so they should not be derived from titles.
export const projects = [
  {
    id: "study-notion",
    number: "01",
    title: "StudyNotion",
    shortTitle: "StudyNotion",
    label: "E-Learning Platform",
    status: "Full-stack production project",
    image: null,
    timeline: "Mar 2025 – Aug 2025",
    stack: [
      "MERN Stack",
      "MongoDB",
      "Docker",
      "AWS ECS Fargate",
      "AWS ECR",
      "GitHub Actions",
      "CI/CD",
      "Automated Testing",
    ],
    description:
      "A production-oriented MERN e-learning platform with Student, Instructor, and Admin RBAC across 5+ courses, deployed securely on AWS.",
    highlights: [
      "Optimized MongoDB data access across 12 models using 50 controlled indexes and cursor-based pagination, reducing collection scans and keeping high-volume catalog queries bounded",
      "Containerized with Docker and deployed through ECR to AWS ECS Fargate",
      "Secured production with HTTPS, IAM, and AWS Secrets Manager",
      "Built 18 automated tests and GitHub Actions CI/CD for authentication, course management, protected learning access, and deployment reliability",
    ],
    links: [
      {
        label: "Live Demo",
        href: "https://st-307db269c2004a69be327bee52c92e1f.ecs.ap-south-1.on.aws/",
      },
      {
        label: "GitHub",
        href: "https://github.com/rohitpokhariya10/StudyNotion",
      },
    ],
    concept: {
      eyebrow: "Deployment architecture",
      title: "AWS-deployed e-learning platform",
      flow: ["3-role RBAC", "ECS Fargate", "CI/CD"],
    },
  },
  {
    id: "bidarena",
    number: "02",
    title: "BidArena",
    shortTitle: "BidArena",
    label: "Real-Time Auction Platform",
    status: "Real-time full-stack system",
    image: null,
    timeline: "Jul 2026",
    stack: [
      "MERN Stack",
      "Socket.IO",
      "MongoDB",
      "MongoDB Transactions",
      "Razorpay",
      "WebSockets",
      "Real-Time Systems",
    ],
    description:
      "A server-authoritative real-time auction platform with live bidding, presence, chat, automated timers, recovery, winner selection, and integrated payments.",
    highlights: [
      "Queues bids to preserve transaction integrity and prevent race conditions or duplicate bids",
      "Synchronizes timers, auction recovery, winner selection, user presence, chat, and bid tracking over Socket.IO",
      "Handles Razorpay payments idempotently with server-side signature verification and transactional validation",
    ],
    concept: {
      eyebrow: "System architecture",
      title: "Real-time auction system",
      flow: ["Auction", "Bid queue", "Payment"],
    },
    links: [
      {
        label: "Live Demo",
        href: "https://bidarena-indol.vercel.app/",
      },
    ],
  },
];

export const experience = [
  {
    company: "Sharnex",
    role: "AI Full Stack Developer",
    date: "Aug 2026 – Present",
    location: "Remote, India",
    detail:
      "Partner directly with the founder to architect a production-grade Construction ERP on Next.js, Express, and Prisma, translating business requirements into scalable workflows, REST APIs, and user-facing features. I own full-stack delivery across backend APIs, business logic, database design, authentication, dashboards, business-critical calculations, and frontend workflows built for real construction operations while shaping product and business decisions for an ERP already securing orders from 3 clients and improving usability, automation, and reliability to reduce operational effort.",
  },
  {
    company: "BrightChamps",
    role: "Freelance Coding Instructor",
    date: "Apr 2026 – Present",
    location: "Remote, India",
    detail:
      "Deliver 4+ hours of live coding instruction daily to 20+ international students across HTML, CSS, JavaScript, Scratch, and web development fundamentals. I design project-based coding curricula and hands-on exercises that translate core programming concepts into practical skills while tracking individual progress across each course.",
  },
];

export const education = {
  degree: "B.Tech in Computer Science Engineering",
  school: "Graphic Era Hill University",
  date: "Aug 2022 – Jun 2026",
  detail: "Dehradun, Uttarakhand / CGPA: 7.2",
};

export const achievements = [
  "Solved 120+ DSA problems on LeetCode across arrays, trees, graphs, and dynamic programming.",
  "Mentor 20+ international students weekly at BrightChamps, strengthening technical communication, teaching, and problem-solving skills.",
];

// Compact tuples keep stat labels and values paired when rendered in responsive grids.
export const proofStats = [
  ["Production work", "Construction ERP"],
  ["Client traction", "3 orders"],
  ["DSA solved", "120+"],
  ["Intl. students", "50+ taught"],
];
