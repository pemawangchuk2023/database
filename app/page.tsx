"use client";

import Link from "next/link";
import { FileText, Shield, Search, Upload, FolderOpen, Clock, Menu, X, Sparkles, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 dark:bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/50 dark:shadow-blue-500/30">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ministry of Finance
                </h1>
                <p className="text-sm text-muted-foreground">Document Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button size="lg" className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                  Staff Login
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4">
              <Link href="/auth/login" className="block">
                <Button size="lg" className="w-full font-medium bg-gradient-to-r from-blue-600 to-indigo-600">
                  Staff Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1">
        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl">
            {/* Main Content */}
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-lg shadow-green-500/10">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Internal Staff Portal
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Document Management
                </span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  System
                </span>
              </h1>

              <p className="mb-10 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Centralized platform for Ministry of Finance staff to securely store,
                organize, and access financial records, reports, and official documents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login" className="w-full sm:w-auto group">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105">
                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Access Portal
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full sm:w-auto group">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold h-12 px-8 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105">
                    <Lock className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Request Access
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { value: "156", label: "Documents", gradient: "from-blue-500 to-cyan-500" },
                { value: "12", label: "Categories", gradient: "from-purple-500 to-pink-500" },
                { value: "24", label: "This Month", gradient: "from-orange-500 to-red-500" },
                { value: "2.4 GB", label: "Storage Used", gradient: "from-green-500 to-emerald-500" }
              ].map((stat, index) => (
                <Card key={index} className="p-6 text-center border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 group">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Upload,
                  title: "Quick Upload",
                  description: "Upload documents with automatic categorization and metadata",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Search,
                  title: "Instant Search",
                  description: "Find any document quickly with powerful search filters",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: Shield,
                  title: "Secure Access",
                  description: "Role-based permissions ensure data security and compliance",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: FolderOpen,
                  title: "Smart Organization",
                  description: "Documents organized by type, department, and date",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  icon: Clock,
                  title: "Version History",
                  description: "Track changes and access previous versions of documents",
                  gradient: "from-indigo-500 to-purple-500"
                },
                {
                  icon: Zap,
                  title: "Quick Preview",
                  description: "View documents without downloading for faster workflow",
                  gradient: "from-yellow-500 to-orange-500"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Ministry of Finance</div>
                <div className="text-sm text-muted-foreground">Document Management System</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Support
              </Link>
              <Link href="/auth/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Documentation
              </Link>
              <Link href="/auth/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © 2024 Ministry of Finance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
