import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { Alert } from "../ui/alert";
import { useRouter } from "next/navigation";

interface SignupResponse {
  token: string;
  user: {
    uid: string;
    name: string;
    email: string;
  };
  message: string;
}

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await apiClient<SignupResponse>('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.data) {
        router.push('/login?message=verification_email_sent');
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (error) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
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
          Create your <GradientText>Account</GradientText>
        </h1>
        <p className="text-muted-foreground">
          Join Shagun to start collecting digital gifts
        </p>
      </div>
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

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

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}