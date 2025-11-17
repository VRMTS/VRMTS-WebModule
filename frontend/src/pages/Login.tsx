import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Include cookies for sessions
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Success!');

        // Redirect after successful login based on userType
        setTimeout(() => {
          let dashboardPath = '/studentdashboard';
          if (data.user.userType === 'instructor') {
            dashboardPath = '/instructordashboard';
          } else if (data.user.userType === 'admin') {
            dashboardPath = '/admindashboard';
          }
          navigate(dashboardPath);
        }, 1000);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Shared styles
  const inputStyle = "bg-background/50 border-border/50 focus:border-accent transition-all duration-300 focus:shadow-[0_0_20px_-5px_hsl(var(--accent)/0.3)]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent animate-glow-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent animate-glow-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8 group">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in-up">
            <span className="bg-gradient-to-r from-accent via-accent to-secondary bg-clip-text text-transparent animate-gradient-shift bg-300%">VRMTS</span>
          </h1>
          <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">← Back to home</p>
        </Link>
        
        {/* Main card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-glow hover:shadow-elegant transition-all duration-500 animate-scale-in"
             style={{ boxShadow: "0 0 40px -10px hsl(var(--accent) / 0.3)" }}>
          
          {/* Error/Success Messages */}
          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/50 text-red-500">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/50 text-green-500">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={loading}
                className={inputStyle} 
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={loading}
                className={inputStyle} 
              />
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-accent hover:text-secondary transition-colors" disabled={loading}>
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90 text-background font-semibold shadow-glow hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-4 text-muted-foreground" style={{ backgroundColor: 'hsl(228 45% 7%)' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google login */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-border/50 bg-background/30 hover:bg-background/50 hover:border-accent/50 transition-all duration-300"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Footer links */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link to="/" className="text-accent hover:text-secondary transition-colors">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/" className="text-accent hover:text-secondary transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}