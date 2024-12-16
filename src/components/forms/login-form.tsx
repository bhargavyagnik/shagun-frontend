import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      } else {
        // Handle error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <GradientText>Shagun</GradientText>
        </h1>
        <p className="text-muted-foreground">
          Sign in to manage your digital shagun collection
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}