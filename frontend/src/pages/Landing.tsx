import React from "react";
import { Link } from "react-router-dom";
import { Brain, Sparkles, Users, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(160_100%_50%/0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,hsl(250_60%_65%/0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10">
        {/* --- NAVBAR --- */}
        <header className="flex justify-between items-center px-8 py-6 border-b border-border/50 backdrop-blur-sm bg-background/80">
          <h1 className="text-2xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              VRMTS
            </span>
          </h1>
          <nav className="hidden md:flex gap-8 text-sm items-center">
            <a
              href="#features"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Modules
            </a>
            <a
              href="#team"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Team
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="bg-accent text-accent-foreground font-semibold px-6 py-2.5 rounded-lg hover:shadow-[0_0_30px_hsl(160_100%_50%/0.4)] hover:scale-105 transition-all duration-300"
            >
              Log In
            </Link>
          </nav>
        </header>

        {/* --- HERO SECTION --- */}
        <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 md:py-32 gap-12">
          <div className="max-w-2xl space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm animate-glow-pulse">
                ✨ The Future of Medical Education
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                VR – MEDICAL
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                TRAINING SYSTEM
              </span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              <span className="text-accent font-semibold">VR</span> combines cutting-edge VR,
              WebGL, AI integration and adaptive feedback to make anatomy education accessible,
              interactive and unforgettable.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                to="/dashboard"
                className="group bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-[0_0_40px_hsl(160_100%_50%/0.5)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Explore as Guest
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="group border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 hover:scale-105 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                Log In
                <Zap className="w-4 h-4 group-hover:animate-pulse" />
              </Link>
            </div>
          </div>

          {/* VR Preview with enhanced styling */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-20 blur-3xl rounded-full" />
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl flex items-center justify-center backdrop-blur-md bg-gradient-to-br from-card/50 to-card/30 border-2 border-accent/30 shadow-[0_0_60px_hsl(160_100%_50%/0.2)]">
              <div className="text-center space-y-4">
                <Brain className="w-24 h-24 mx-auto text-accent animate-glow-pulse" />
                <p className="text-muted-foreground font-medium">3D VR Preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="py-24 px-8 md:px-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
          
          <div className="relative">
            <h3 className="text-center text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Immersive Medical Learning
            </h3>
            <p className="text-center text-accent font-semibold text-lg mb-16">
              Anywhere, Anytime
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Feature
                icon={<Brain className="w-8 h-8" />}
                title="Explore in VR"
                text="Interact with anatomy models in fully immersive 3D environments."
                delay="0"
              />
              <Feature
                icon={<Sparkles className="w-8 h-8" />}
                title="Learn on the Web"
                text="Access 3D viewers, quizzes & feedback without a headset."
                delay="100"
              />
              <Feature
                icon={<Zap className="w-8 h-8" />}
                title="Adaptive Feedback"
                text="AI adjusts questions and guides your learning path."
                delay="200"
              />
            </div>
          </div>
        </section>

        {/* --- TEAM --- */}
        <section id="team" className="py-24 px-8 md:px-16">
          <h3 className="text-center text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Meet The Team
          </h3>
          <p className="text-center text-accent font-semibold text-lg mb-16">
            Innovators Behind VR
          </p>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <TeamMember name="Tauha Imran" role="Unity + VR Developer" />
            <TeamMember name="Abeer Jawad" role="Backend & WebGL Developer" />
            <TeamMember name="Daniya Qasim" role="AI Engineer" />
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="py-28 px-8 md:px-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent" />
          
          <div className="relative space-y-8 max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">
                Start Your VR Anatomy Journey Today
              </span>
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed px-4">
              Experience the future of medical education with immersive VR technology, 
              AI-powered adaptive learning, and comprehensive 3D anatomy exploration. 
              Transform the way you learn medicine.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-accent to-secondary text-accent-foreground px-10 py-5 font-bold rounded-xl hover:shadow-[0_0_50px_hsl(160_100%_50%/0.6)] hover:scale-105 transition-all duration-300 text-lg"
            >
              Get Started Now
              <Sparkles className="w-5 h-5 animate-pulse" />
            </Link>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-card/50 backdrop-blur-sm text-muted-foreground text-sm py-10 px-6 text-center border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            <Link to="/" className="hover:text-accent transition-colors">About</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/dashboard" className="hover:text-accent transition-colors">Demo</Link>
            <span className="hidden md:inline">·</span>
            <a href="#team" className="hover:text-accent transition-colors">Team</a>
            <span className="hidden md:inline">·</span>
            <a href="#features" className="hover:text-accent transition-colors">Modules</a>
            <span className="hidden md:inline">·</span>
            <Link to="/login" className="hover:text-accent transition-colors">Log In</Link>
          </div>
          <p className="text-xs">
            VR © 2025 · All rights reserved · Transforming Medical Education
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ---- COMPONENTS ---- */
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  delay?: string;
}

function Feature({ icon, title, text, delay = "0" }: FeatureProps) {
  return (
    <div 
      className="group p-8 bg-gradient-to-br from-card/60 to-card/40 border border-border/50 rounded-2xl hover:border-accent/50 transition-all duration-500 backdrop-blur-sm hover:shadow-[0_8px_32px_hsl(160_100%_50%/0.15)] hover:scale-105 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:animate-glow-pulse">
        {icon}
      </div>
      <h4 className="text-accent font-bold text-xl mb-3 group-hover:text-secondary transition-colors">
        {title}
      </h4>
      <p className="text-muted-foreground leading-relaxed">
        {text}
      </p>
    </div>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
}

function TeamMember({ name, role }: TeamMemberProps) {
  return (
    <div className="group bg-gradient-to-br from-card/60 to-card/40 border border-border/50 rounded-2xl p-8 hover:border-accent/50 transition-all duration-500 backdrop-blur-sm hover:shadow-[0_8px_32px_hsl(160_100%_50%/0.15)] hover:scale-105">
      <div className="relative w-28 h-28 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-accent to-secondary opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity" />
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-card to-input border-2 border-accent/30 flex items-center justify-center text-accent text-3xl font-bold group-hover:border-accent transition-colors shadow-[0_0_20px_hsl(160_100%_50%/0.2)]">
          {name[0]}
        </div>
      </div>
      <h5 className="font-bold text-xl mb-2 text-foreground group-hover:text-accent transition-colors">
        {name}
      </h5>
      <p className="text-muted-foreground mb-6">{role}</p>
      <button className="border-2 border-accent text-accent px-6 py-2.5 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-[0_0_20px_hsl(160_100%_50%/0.4)] w-full">
        Contact
      </button>
    </div>
  );
}
