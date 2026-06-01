import { ArrowUpRight, Github } from "lucide-react";
export const Projects = () => {
  const projects = [
    
    {
      title: "eTrade – Dummy E-Commerce Frontend UI",
      description:
        "A dummy e-commerce frontend UI built using React and Tailwind CSS. This project focuses on creating reusable components, product layouts, and a clean responsive design similar to real-world shopping platforms.",
      image: "/projects/eTrade.png",
      tags: ["React", "Tailwind CSS"],
      link: "#",
      github: "#",
    },
   
    {
      title: "QuickAI – AI SaaS Web Application",
      description:
        "An AI-powered SaaS web app that provides features like content generation and smart tools using external AI APIs. Focused on building reusable components, API handling, and clean UI/UX for production-style apps.",
      image: "/projects/AI-SaaS-App.png",
      tags: ["React", "Node.js", "Express.js", "API Integration", "Tailwind CSS"],
      link: "#",
      github: "#",
    },
    
    {
      title: "Modern Developer Portfolio",
      description:
        "A modern and responsive personal portfolio built with React and Tailwind CSS. Designed with a data-first approach where content is defined first and UI components are generated dynamically.",
      image: "/projects/modern-portfolio-2026.png",
      tags: ["React", "Tailwind CSS"],
      link: "#",
      github: "#",
    },
     {
      title: "StudyNotion – E-Learning Platform",
      description:
        "A full-stack e-learning platform where students can explore courses and instructors can manage content. Built to understand real-world authentication flow, role-based access, and API integration using MERN stack.",
      image: "/projects/study-notion.png",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
      link: "#",
      github: "#",
    }

  ];

  return (
    <section id="projects" className="section-shell py-24 md:py-36 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-5xl mb-16 md:mb-20 reveal-on-scroll">
          <span className="section-kicker animate-fade-in">Featured Work</span>
          <h2 className="section-title mt-5 mb-6 animate-fade-in animation-delay-100"> Projects that
            {/* {" "}--> iise ek hi line me space aata hain */}
            {" "}
            <span className="font-serif italic font-normal text-white">make an impact.</span>
          </h2>
          < p className="section-copy mx-auto animate-fade-in animation-delay-200">
            Selected applications that show how I approach interfaces, backend
            logic, integrations, and responsive product design.
          </p>
        </div>
        {/* Project Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 md:pb-8 reveal-on-scroll">
          {
            projects.map(function (project, index) {
              return <div
                key={index}
                // group class ka name diya hai ---> neeche group class ko hover krenge tab ye lagaya hai
                className="group glass rounded-3xl overflow-hidden animate-fade-in md:row-span-1"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden  aspect-video">
                  <img src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover  transition-transform transition-delay-700  group-hover:scale-110 duration-700"
                  />
                  {/* gradient images ke upar */}
                  <div
                    className="absolute inset-0 
                    bg-gradient-to-t from-card via-card/50
                    to-transparent opacity-60"
                  />
                  {/* Overlay Links */}
                  {/* inset-0 ---> */}
                  {/* duration-300 --> transition 300ms tak chalega */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={project.link}
                      aria-label={`View ${project.title}`}
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                    <a
                      href={project.github}
                      aria-label={`View ${project.title} source code`}
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                  
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="w-5 h-5 
                  text-muted-foreground group-hover:text-primary
                   group-hover:translate-x-1 
                   group-hover:-translate-y-1 transition-all"
                  />
                </div>

                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              </div>
            })
          }

        </div>
      </div>
    </section>
  )
}
