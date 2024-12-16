"use client"

import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";
import { SiteHeader } from "@/components/ui/site-header";
import Link from "next/link";
import { ArrowRight, Gift, Heart, Sparkles, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";


export default function Home() {
  return (
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[800px] mx-auto text-center space-y-8"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Digital{" "}
                <GradientText>Shagun</GradientText>
                <br />
                Made Beautiful & Simple
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground">
                Create your personalized digital shagun collection page for your wedding.
                Modern, secure, and hassle-free way to receive blessings.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500" asChild>
                  <Link href="/create">
                    Create Your Page <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
              <StatsCard
                icon={<Gift className="h-6 w-6 text-primary" />}
                value="10,000+"
                label="Weddings"
              />
              <StatsCard
                icon={<IndianRupee className="h-6 w-6 text-primary" />}
                value="₹1Cr+"
                label="Collected"
              />
              <StatsCard
                icon={<Heart className="h-6 w-6 text-primary" />}
                value="50,000+"
                label="Blessings"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">
                Everything you need for a{" "}
                <GradientText>Perfect Wedding Gift Collection</GradientText>
              </h2>
              <p className="text-muted-foreground text-lg">
                Simple, elegant, and secure way to collect and manage wedding gifts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Gift className="h-10 w-10 text-primary" />}
                title="Easy Collection"
                description="Simple QR code scanning and instant gift transfer through UPI"
              />
              <FeatureCard
                icon={<Heart className="h-10 w-10 text-pink-500" />}
                title="Heartfelt Messages"
                description="Let your guests share their blessings along with their shagun"
              />
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-yellow-500" />}
                title="Beautiful Design"
                description="Modern and elegant interface that matches your wedding's grandeur"
              />
            </div>
          </div>
        </section>
      </main>
    
  );
}

function StatsCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center p-8 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-3 p-3 bg-primary/5 rounded-full">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group flex flex-col items-center text-center p-8 rounded-xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all"
    >
      <div className="mb-4 p-3 bg-primary/5 rounded-full w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}