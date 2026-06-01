import { Menu, X } from "lucide-react"
import { Button } from "../Components/Button"
import { useEffect, useState } from "react"



export const Navbar = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Journey" },
  ]
  // Navbar ---> condition rendering
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll)

    // cleanup function: scroll event ko hata deta hai
    // taaki component remove hone ke baad bhi event na chale
    //useEffecta() ka hi syntax hai
    return function () {
      window.removeEventListener("scroll", handleScroll)
    }

  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 transition-all duration-500 ${isScrolled ? "glass-strong py-2" : "bg-transparent py-4"} z-99 `}>
      <nav className="container mx-auto text-xl font-bold tracking-tight flex items-center justify-between px-5 sm:px-8">
        <a
          href="#"
          className="text-xl  font-bold tracking-tight hover:text-primary"
        >
          RP <span className="text-primary">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 py-2">

          <div className="glass rounded-xl px-2 py-2 items-center gap-1">
            {/* anchor tag se reloa dnhi hoga kyunki hum single page me hi move kar rhe hai na ki new page open horha hai */}
            {
              navLinks.map(function (link, index) {
                return <a href={link.href} key={index} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground  rounded-full hover:bg-surface">
                  {link.label}
                </a>

              })
            }
          </div>
        </div>
        <div className="hidden md:block">
          <Button size="sm" >
            {/* redirect to contact page */}
            <a href="#contact">Contact Me </a>
          </Button>
        </div>
        {/* Moblile menu Button */}
        <button className="md:hidden p-2 rounded-full glass text-foreground"
          onClick={() => {
            setIsMobileMenu(!isMobileMenu)
          }}
        >
          {isMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>


      </nav>

      {/* Mobile Menu */}
      {isMobileMenu && <div className="md:hidden glass-strong animate-fade-in ">
        <div className="container flex flex-col gap-4 mx-auto px-6 py-6">
          {
            navLinks.map(function (link, index) {
              return <a href={link.href} key={index}
                className="text-xl text-muted-foreground  hover:text-foreground py-2 "
                onClick={() => {
                  //Navbar me se kisi bhi section me click krne se Navbar close krdo
                  setIsMobileMenu(false)
                }}
              >
                {link.label}
              </a>

            })
          }
          <a
            href="#contact"
            onClick={() => setIsMobileMenu(false)}
            className="w-full"
          >
            <Button >Contact Me</Button>
          </a>


        </div>

      </div>}






    </header>

  )
}
