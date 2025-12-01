"use client";

import Link from "next/link";
import { FileText, Shield, Search, Upload, FolderOpen, Clock, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">Ministry of Finance</h1>
                <p className="text-sm text-muted-foreground">Document Management System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button size="lg" className="font-medium">
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
            <div className="md:hidden border-t bg-background px-4 py-4">
              <Link href="/auth/login" className="block">
                <Button size="lg" className="w-full font-medium">
                  Staff Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />

        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl">
            {/* Main Content */}
            <div className="text-center mb-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Internal Staff Portal
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Document Management
                <span className="block text-blue-600 dark:text-blue-400 mt-2">
                  System
                </span>
              </h1>

              <p className="mb-10 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Centralized platform for Ministry of Finance staff to securely store,
                organize, and access financial records, reports, and official documents.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base font-semibold h-12 px-8">
                    Access Portal
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold h-12 px-8 border-2">
                    Request Access
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { value: "156", label: "Documents" },
                { value: "12", label: "Categories" },
                { value: "24", label: "This Month" },
                { value: "2.4 GB", label: "Storage Used" }
              ].map((stat, index) => (
                <Card key={index} className="p-6 text-center border-2 hover:border-primary/50 transition-all">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
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
                  description: "Upload documents with automatic categorization and metadata"
                },
                {
                  icon: Search,
                  title: "Instant Search",
                  description: "Find any document quickly with powerful search filters"
                },
                {
                  icon: Shield,
                  title: "Secure Access",
                  description: "Role-based permissions ensure data security and compliance"
                },
                {
                  icon: FolderOpen,
                  title: "Smart Organization",
                  description: "Documents organized by type, department, and date"
                },
                {
                  icon: Clock,
                  title: "Version History",
                  description: "Track changes and access previous versions of documents"
                },
                {
                  icon: FileText,
                  title: "Quick Preview",
                  description: "View documents without downloading for faster workflow"
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">Ministry of Finance</div>
                <div className="text-sm text-muted-foreground">Document Management System</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              &copy; 2024 Ministry of Finance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
