import { useState } from 'react'
import React from "react";
import { Link } from "react-router-dom"
import { PiggyBank, Handshake, TrendingUp, Menu, Shield, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react"
import './App.css'
import heroImage from './assets/hero-building.jpg';
import testimonial1 from "./assets/testimonial-1.png"
import testimonial2 from "./assets/testimonial-2.png"
import testimonial3 from "./assets/testimonial-3.png"
import testimonial4 from "./assets/testimonial-4.png"
function App() {
 

  return (
    <div className=' min-h-screen bg-background'>
      
    {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <PiggyBank className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sacco</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-smooth">Services</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-smooth">Benefits</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-smooth">Testimonials</a>
            <Link to="/login">
              <button variant="outline" size="sm" className="mr-2">Login</button>
            </Link>
            <Link to="/signup">
              <button size="sm" className="bg-primary hover:bg-primary/90">Get Started</button>
            </Link>
          </nav>
          <button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-hero via-hero/95 to-hero/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
            <p className="text-sm text-primary-foreground/90 font-medium">Trusted by 10,000+ Members</p>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-hero-foreground mb-6 leading-tight">
            Your Financial
            <span className="block text-primary bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Partner for Life
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-hero-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering your dreams through smart savings, affordable loans, and strategic investments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-lg group">
                Login
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </button>
            </Link>
            <Link to="/signup">
              <button size="lg" variant="outline" className="bg-card/50 backdrop-blur-sm hover:bg-card border-hero-foreground/20 text-hero-foreground hover:text-foreground px-8 h-14 text-lg">
                Sign Up
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-hero-foreground/10">
              <p className="text-3xl font-bold text-hero-foreground mb-1">10K+</p>
              <p className="text-sm text-hero-foreground/80">Active Members</p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-hero-foreground/10">
              <p className="text-3xl font-bold text-hero-foreground mb-1">$50M+</p>
              <p className="text-sm text-hero-foreground/80">Total Savings</p>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-hero-foreground/10">
              <p className="text-3xl font-bold text-hero-foreground mb-1">15+</p>
              <p className="text-sm text-hero-foreground/80">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <div className="inline-block mb-4 px-4 py-1 bg-primary/10 rounded-full">
        <p className="text-sm text-primary font-semibold">OUR SERVICES</p>
      </div>
      <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Financial Solutions for Every Goal
      </h3>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Comprehensive financial services designed to help you grow and prosper
      </p>
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

      {/* Card 1 */}
      <div className="group relative overflow-hidden rounded-xl border border-border shadow-md hover:shadow-lg transition-all cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
        <div className="pt-12 pb-8 px-8 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <PiggyBank className="h-8 w-8 text-primary-foreground" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-3">Savings Accounts</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Secure your future with competitive interest rates and flexible savings plans tailored to your needs.
          </p>
          <button className="text-primary font-medium inline-flex items-center group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card 2 */}
      <div className="group relative overflow-hidden rounded-xl border border-border shadow-md hover:shadow-lg transition-all cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
        <div className="pt-12 pb-8 px-8 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <Handshake className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-3">Flexible Loans</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Access affordable loans with transparent terms, from personal needs to business expansion.
          </p>
          <button className="text-primary font-medium inline-flex items-center group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card 3 */}
      <div className="group relative overflow-hidden rounded-xl border border-border shadow-md hover:shadow-lg transition-all cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
        <div className="pt-12 pb-8 px-8 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-3">Smart Investments</h4>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Grow your wealth with diversified investment portfolios and expert financial guidance.
          </p>
          <button className="text-primary font-medium inline-flex items-center group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  </div>
</section>
{/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-br from-muted via-background to-muted">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block mb-4 px-4 py-1 bg-primary/10 rounded-full">
                <p className="text-sm text-primary font-semibold">WHY CHOOSE US</p>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built on Trust, Powered by Innovation
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We combine traditional SACCO values with modern technology to deliver exceptional financial services that help our members achieve their dreams.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground mb-2">Secure & Licensed</h5>
                    <p className="text-muted-foreground">Fully regulated and insured, your funds are always protected with us.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground mb-2">Member-Focused</h5>
                    <p className="text-muted-foreground">Your success is our success. We're committed to your financial wellbeing.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground mb-2">Fast Processing</h5>
                    <p className="text-muted-foreground">Quick approvals and instant transactions for your convenience.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="shadow-elevated border-border">
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-foreground mb-6">What You Get</h4>
                  <div className="space-y-4">
                    {[
                      "Competitive interest rates on savings",
                      "Low-cost loans with flexible repayment",
                      "Free financial advisory services",
                      "24/7 online account access",
                      "Mobile banking app",
                      "Annual dividend earnings"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        <p className="text-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 bg-primary/10 rounded-full">
              <p className="text-sm text-primary font-semibold">TESTIMONIALS</p>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Trusted by Thousands</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our members have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { image: testimonial1, name: "Sarah M.", role: "Small Business Owner", quote: "The loan process was incredibly smooth. I was able to expand my business within weeks!" },
              { image: testimonial2, name: "David K.", role: "Teacher", quote: "Their savings plans helped me buy my first home. Couldn't be more grateful!" },
              { image: testimonial3, name: "Michael R.", role: "Entrepreneur", quote: "Professional service and excellent returns on investments. Highly recommend!" },
              { image: testimonial4, name: "Emily L.", role: "Marketing Manager", quote: "The financial advice I received was invaluable. My portfolio has grown significantly." }
            ].map((testimonial, index) => (
              <div key={index} className="group hover:shadow-elevated transition-smooth border-border">
                <div className="pt-8 pb-8 px-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-smooth">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center mb-4">
                    <h5 className="font-bold text-foreground text-lg mb-1">{testimonial.name}</h5>
                    <p className="text-xs text-primary">{testimonial.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-hero via-secondary to-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-hero-foreground mb-6">
            Ready to Transform Your Financial Future?
          </h3>
          <p className="text-xl text-hero-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of members who are already achieving their financial goals with us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button size="lg" className="bg-card hover:bg-card/90 text-foreground px-10 h-14 text-lg shadow-elevated group">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </button>
            <button size="lg" variant="outline" className="border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10 px-10 h-14 text-lg">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">Sacco</h1>
              </div>
              <p className="text-sm text-muted-foreground">Your trusted financial partner for savings, loans, and investments.</p>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-4">Services</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Savings</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Loans</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Investments</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-smooth">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Sacco. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  )
}

export default App
