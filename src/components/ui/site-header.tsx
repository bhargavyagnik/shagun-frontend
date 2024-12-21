"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Menu, LogOut } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const router = useRouter();

  console.log(isAuthenticated)
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false); // Close mobile menu
    router.push('/'); // Force refresh the page
  };
  // Determine current route type
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isEventContributionPage = pathname.startsWith('/event/');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg transition-all duration-200 ${
        scrolled ? "bg-background/80 shadow-sm" : "bg-background/60"
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                <GradientText>Shagun</GradientText>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && !isEventContributionPage ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              !isAuthPage && !isEventContributionPage && (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button - Hide on event contribution pages */}
          {!isEventContributionPage && (
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
          )}
        </div>
      </div>

      {/* Mobile Menu - Hide on event contribution pages */}
      {!isEventContributionPage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : -20,
          }}
          className={`md:hidden border-t ${isMobileMenuOpen ? "block" : "hidden"}`}
        >
          <div className="container py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/create">
                  <Button variant="ghost" className="w-full justify-start">
                    Create Event
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-pink-500 to-rose-500"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}