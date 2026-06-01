import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "../Components/Button";
import { AnimatedBorderButton } from "../Components/AnimatedBorderButton";

export const Hero = () => {
  return (
    <section className="hero-frame relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/projects/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/90 to-background" />

      <div className="container mx-auto px-5 sm:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-center">
          <div>
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs sm:text-sm font-medium text-primary">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Open to software development opportunities
              </span>
            </div>

            <p className="mt-8 text-sm sm:text-base font-semibold tracking-[0.18em] uppercase text-secondary-foreground animate-fade-in animation-delay-100">
              MERN Stack Developer
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-[84px] font-bold leading-[1.02] tracking-tight animate-fade-in animation-delay-100">
              From{" "}
              <span className="whitespace-nowrap text-primary glow-text">
                UI to API,
              </span>
              <br />
              I build full-stack
              <br />
              web applications
              <br />
              <span className="font-serif italic font-normal text-white">
                that perform.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base sm:text-lg text-muted-foreground animate-fade-in animation-delay-200">
              I&apos;m Rohit Pokhariya, a B.Tech CSE graduate focused on building
              reliable MERN applications with clean interfaces, practical backend
              logic, and production-minded user experiences.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-4 animate-fade-in animation-delay-300">
              <a href="#projects">
                <Button size="lg" className="w-full sm:w-auto">
                  View Projects <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <a
                href="/Rohit_Pokhariya_CV.pdf"
                download="Rohit_Pokhariya_Resume.pdf"
              >
                <AnimatedBorderButton className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Resume
                </AnimatedBorderButton>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-sm text-muted-foreground">Connect</span>
              <a
                href="https://github.com/rohitpokhariya10"
                aria-label="GitHub"
                className="p-2.5 rounded-xl glass hover:text-primary hover:-translate-y-1"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/rohit-singh-pokhariya-24742a220/"
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl glass hover:text-primary hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-fade-in animation-delay-200">
            <div className="absolute inset-4 rounded-[2rem] bg-primary/20 blur-3xl" />
            <div className="relative glass rounded-[2rem] p-3 glow-border">
              <img
                src="/projects/profile-photo.jpg"
                alt="Rohit Pokhariya"
                className="w-full rounded-[1.4rem] object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
