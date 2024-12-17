"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Menu, Gift } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const isLandingPage = pathname === "/";
  const isAuthenticatedRoute = pathname.includes("/dashboard") || 
    pathname.includes("/create") || 
    pathname === "/profile";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-200 ${
        scrolled 
          ? "bg-background/80 shadow-sm" 
          : "bg-background/60"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
              {/* <Gift className="h-6 w-6 text-primary" /> */}
              <span className="font-bold text-xl">
                <GradientText>Shagun</GradientText>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLandingPage ? (
              <>
                <Button variant="ghost" className="hover:bg-primary/5" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
                  >
                    <Link href="/create">Create Event</Link>
                  </Button>
                </motion.div>
              </>
            ) : isAuthenticatedRoute ? (
              <>
                {/* <Button variant="ghost" className="hover:bg-primary/5" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button> */}
                {/* <Button variant="ghost" className="hover:bg-primary/5" asChild>
                  <Link href="/create">Create Event</Link>
                </Button> */}
                <Button 
                  variant="outline"
                  className="text-rose-500 hover:text-rose-600 hover:border-rose-500/50"
                  asChild
                >
                  <Link href="/">Logout</Link>
                </Button>
              </>
            ) : (
              <Button 
                asChild 
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex md:hidden p-2 rounded-full hover:bg-primary/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20 
        }}
        className={`md:hidden border-t ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="container py-4 space-y-3">
          {isLandingPage ? (
            <>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button 
                className="w-full justify-start bg-gradient-to-r from-pink-500 to-rose-500" 
                asChild
              >
                <Link href="/create">Create Event</Link>
              </Button>
            </>
          ) : isAuthenticatedRoute ? (
            <>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/create">Create Event</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-rose-500 hover:text-rose-600"
                asChild
              >
                <Link href="/logout">Logout</Link>
              </Button>
            </>
          ) : (
            <Button 
              className="w-full justify-start bg-gradient-to-r from-pink-500 to-rose-500" 
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}