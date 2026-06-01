shadcn

2)import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});



@--> .. krne ki jarurat nhi
--------
3)//named ecport kara hai sare components ko tabhi ese import krahai {}
import {Navbar} from "@/layout/Navbar";
---
3)🚀 Data-driven way (jo tum dekh rahe ho)
const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
];

{navLinks.map(link => (
  <a key={link.href} href={link.href}>
    {link.label}
  </a>
))}

Benefits 👇

1 jagah change → sab jagah change

Mobile + Desktop same data

Easy reorder

Easy animation

Easy active highlight

Scalable (10 → 100 links)
-----
🧠 Golden rule (yaad rakh lo)

React me UI likhne se pehle data likha jaata hai


5)svg
---
 transition-all  duration-500   glow-border   aspect-video  text-center  inset-0
 <div
                    className="absolute inset-0 
                    bg-gradient-to-t from-card via-card/50
                    to-transparent opacity-60"
                  />


hover jes element me karo transition jarur lagao and duration bhi do
-- ---
 jo class bina prefix likhi hoti hai → mobile ke liye
 sm: md: lg: → badi screens ke liye
 ---