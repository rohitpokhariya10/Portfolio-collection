// Icons import ho rahe hain lucide-react se (SVG icons as React components)
import { Code2, Lightbulb, Rocket, Users } from "lucide-react";

// Highlights data → Right side cards ke liye (icon + title + description)
const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Writing maintainable, scalable code that stands the test of time.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Optimizing for speed and delivering lightning-fast user experiences.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working closely with teams to bring ideas to life.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Staying ahead with the latest technologies and best practices.",
  },
];

export const About = () => {
  return (
    // section tag → ek logical block of content
    // id="about" → navbar ke #about link se yahin scroll hoga
    <section id="about" className="section-shell py-24 md:py-36 relative overflow-hidden">
      
      {/* 
        container → content ko center me rakhta hai
        mx-auto → left-right auto margin
        px-6 → horizontal padding
      */}
      <div className="container mx-auto px-5 sm:px-8 relative z-10">

        {/* 
          grid layout:
          - mobile: 1 column (default)
          - lg screen: 2 columns
        */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-8">

            {/* Small heading (About Me) */}
            <div className="animate-fade-in">
              <span className="section-kicker">
                About Me
              </span>
            </div>

            {/* Main heading */}
            <h2 className="section-title animate-fade-in animation-delay-100 reveal-on-scroll">
              From interface to API,
              {/* span inline hota hai isliye line automatic break hoti hai width ke hisaab se */}
              <span className="font-serif italic font-normal text-white">
                {" "}
                built with purpose.
              </span>
            </h2>

            {/* About description paragraphs */}
            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200 reveal-on-scroll">
              <p>
              Hi, I’m Rohit Pokhariya, a B.Tech CSE graduate and MERN Stack Developer who loves building complete web applications from idea to deployment. I focus on clean UI, strong backend logic, performance, and solving real world problems through code.
              </p>

              <p>
                I’m actively looking for opportunities where I can grow as a
                MERN stack developer, contribute to meaningful products, and learn
                from experienced engineers. I enjoy writing clean, maintainable
                code and creating user interfaces that feel smooth, intuitive,
                and responsive.
              </p>

              <p>
               Outside of development, I enjoy exploring new technologies, improving my problem-solving and technical skills, and staying updated with modern web trends to build better, more impactful products.
              </p>
            </div>

           
          </div>
          

          {/* ================= RIGHT COLUMN (HIGHLIGHTS) ================= */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 reveal-on-scroll">

            {/* 
              map() → highlights array ke har object se ek card bana rahe hain
            */}
           
            {highlights.map((item, idx) => (
              <div
                key={idx} // React ko batata hai kaunsa item unique hai
                className="glass p-5 sm:p-6 rounded-2xl animate-fade-in"
                // har card ka animation thoda delay se start ho
                style={ { animationDelay:`${(idx + 1) * 200}ms `}}
              >
                {/* Icon container */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                  {/* Dynamic icon component */}
                  <item.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Card title */}
                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                {/* Card description */}
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
         {/* Mission statement card */}
           <div className="flex items-center justify-center ">
             <div className="mt-14 md:mt-20 glass rounded-2xl p-6 sm:p-8 glow-border animate-fade-in animation-delay-300 reveal-on-scroll max-w-3xl">
              <p className="text-lg sm:text-xl font-medium italic text-foreground">
                "My goal is to build complete web applications that are clear,
                reliable, and genuinely useful - from the first interaction to
                the backend logic behind it."
              </p>
            </div>
           </div>
      </div>
    </section>
  );
};
