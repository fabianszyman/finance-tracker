'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Brain, CreditCard, LineChart, PiggyBank, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavBar from "@/components/NavBar";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <NavBar variant="marketing" />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Take control of your finances<br /> 
              with the power of <span className="text-primary">AI</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
              Track expenses, plan investments, and manage your financial future with intelligent 
              insights powered by artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 bg-muted/30 flex justify-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-xl mx-auto">
              Everything you need to manage your finances smarter, not harder.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="flex flex-col items-center text-center p-6 border-0 shadow-sm">
                <BarChart3 className="h-10 w-10 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">Expense Tracking</CardTitle>
                <CardDescription className="text-base">
                  Automatically categorize and track your expenses in real-time.
                </CardDescription>
              </Card>
              
              <Card className="flex flex-col items-center text-center p-6 border-0 shadow-sm">
                <Brain className="h-10 w-10 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">AI Insights</CardTitle>
                <CardDescription className="text-base">
                  Get personalized recommendations to optimize your spending habits.
                </CardDescription>
              </Card>
              
              <Card className="flex flex-col items-center text-center p-6 border-0 shadow-sm">
                <LineChart className="h-10 w-10 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">Financial Reports</CardTitle>
                <CardDescription className="text-base">
                  Visualize your financial health with beautiful, interactive charts.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-16 flex justify-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose FinanceAI?</h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-xl mx-auto">
              Our platform offers unique advantages that will transform how you manage money.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Quick Setup</h3>
                <p className="text-muted-foreground">
                  Start tracking your finances in minutes, not hours.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Bank-Level Security</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and protected at all times.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multiple Accounts</h3>
                <p className="text-muted-foreground">
                  Connect all your financial accounts in one place.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Savings Goals</h3>
                <p className="text-muted-foreground">
                  Set and track progress towards your financial goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-16 bg-muted/30 flex justify-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-xl mx-auto">
              Get answers to the most common questions about our platform.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is FinanceAI free to use?</AccordionTrigger>
                  <AccordionContent>
                    We offer a free basic plan with limited features. For full access to all features, 
                    including AI insights and custom reports, check out our premium plans.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the AI actually help my finances?</AccordionTrigger>
                  <AccordionContent>
                    Our AI analyzes your spending patterns, identifies opportunities for savings, and provides 
                    personalized recommendations to improve your financial health. It learns from your habits 
                    to offer increasingly tailored advice.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my financial data secure?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely. We use bank-level encryption and security measures to protect your data. 
                    We never sell your personal information to third parties, and you maintain full control 
                    over your data at all times.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I export my financial reports?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export your financial reports in multiple formats including PDF, CSV, and Excel. 
                    This makes it easy to share with financial advisors or use in your own analysis.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 flex justify-center">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your finances?</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of users who have already taken control of their financial future.
            </p>
            <Button size="lg" className="px-8" asChild>
              <Link href="/register">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-2 font-semibold">
              <PiggyBank className="h-5 w-5" />
              <span>FinanceAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FinanceAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 