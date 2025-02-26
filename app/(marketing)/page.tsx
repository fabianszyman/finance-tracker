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

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <PiggyBank className="h-6 w-6" />
            <span>FinanceAI</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground/80">Features</Link>
            <Link href="#benefits" className="transition-colors hover:text-foreground/80">Benefits</Link>
            <Link href="#faq" className="transition-colors hover:text-foreground/80">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Take control of your finances with the power of <span className="text-primary">AI</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Track expenses, plan investments, and manage your financial future with intelligent insights 
                powered by artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[350px] lg:h-[500px] rounded-lg bg-muted/50 overflow-hidden">
              {/* This is where you could add a screenshot or illustration of your app */}
              <div className="absolute inset-0 flex items-center justify-center text-muted text-lg">
                App Dashboard Illustration
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-20 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Powered by AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our intelligent features help you understand your spending patterns and make smarter financial decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Analysis</CardTitle>
                <CardDescription>
                  AI-powered insights into your spending patterns and habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Automatically categorizes expenses and identifies trends over time to help you understand where your money goes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Investment Planning</CardTitle>
                <CardDescription>
                  Personalized investment recommendations based on your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our AI analyzes your financial profile and suggests investment strategies aligned with your risk tolerance and objectives.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Budget Optimization</CardTitle>
                <CardDescription>
                  Smart budgeting suggestions that adapt to your lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>The AI learns from your spending patterns to create realistic budgets that help you save money without sacrificing comfort.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Financial Forecasting</CardTitle>
                <CardDescription>
                  Predictive insights into your future financial state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our AI models project your financial trajectory based on current habits, helping you plan for big expenses and life events.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fraud Protection</CardTitle>
                <CardDescription>
                  Advanced anomaly detection for suspicious transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>AI algorithms monitor your transaction patterns and alert you to unusual activity that might indicate fraud or identity theft.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-full w-fit bg-primary/10 mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Debt Optimization</CardTitle>
                <CardDescription>
                  Strategic recommendations to eliminate debt faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get personalized strategies to pay down debt more efficiently, saving you money on interest and helping you become debt-free sooner.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="bg-muted/50 py-20">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose FinanceAI</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform offers unique advantages to help you achieve financial success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>
                    Complete Financial Overview
                  </h3>
                  <p className="text-muted-foreground">
                    Get a holistic view of your finances in one place, with intuitive dashboards and reports that make complex financial data easy to understand.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</span>
                    Personalized To Your Goals
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI adapts to your unique financial situation and goals, providing tailored advice that evolves as your circumstances change.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</span>
                    Secure and Private
                  </h3>
                  <p className="text-muted-foreground">
                    Your financial data is encrypted and protected with the highest security standards. We never sell your information to third parties.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">4</span>
                    Time-Saving Automation
                  </h3>
                  <p className="text-muted-foreground">
                    Automatic categorization and analysis save you hours of manual tracking and calculation, giving you more time to focus on what matters.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">5</span>
                    Educational Resources
                  </h3>
                  <p className="text-muted-foreground">
                    Access a library of AI-curated financial education materials that help you improve your financial literacy and make better decisions.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">6</span>
                    Continuous Improvement
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI models continuously learn and improve, ensuring you always have access to the most accurate and helpful financial guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container py-20">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thousands of people are already taking control of their finances with FinanceAI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10"></div>
                  <div>
                    <CardTitle className="text-lg">Sarah J.</CardTitle>
                    <CardDescription>Small Business Owner</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">
                  "The investment planning feature helped me allocate my business profits more effectively. 
                  I've seen a 20% increase in my portfolio in just 6 months!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10"></div>
                  <div>
                    <CardTitle className="text-lg">Michael T.</CardTitle>
                    <CardDescription>Recent Graduate</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">
                  "As someone new to managing finances, the AI suggestions helped me pay off my student loans 
                  3 years earlier than expected. The debt optimization is incredible."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10"></div>
                  <div>
                    <CardTitle className="text-lg">Elena K.</CardTitle>
                    <CardDescription>Freelance Designer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">
                  "The financial forecasting helped me prepare for irregular income months. 
                  Now I never worry about cash flow, even when clients pay late."
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-muted/50 py-20">
          <div className="container space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get answers to common questions about FinanceAI.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is my financial data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we use bank-level encryption to protect your data. We also implement strict access controls,
                    regular security audits, and follow industry best practices for data protection. Your privacy is our top priority.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How accurate is the AI financial forecasting?</AccordionTrigger>
                  <AccordionContent>
                    Our AI models have been trained on vast amounts of financial data and continuously improve with more usage.
                    While no forecast can be 100% accurate, our predictions have shown to be within 5-10% accuracy for most users
                    after 2-3 months of consistent use.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Do I need to connect my bank accounts?</AccordionTrigger>
                  <AccordionContent>
                    Connecting your accounts provides the most comprehensive experience, but it's not required.
                    You can manually enter transactions and still benefit from our AI-powered analysis and recommendations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Is there a free plan available?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a free basic plan that includes expense tracking, budgeting, and limited AI insights.
                    Premium plans unlock advanced features like investment planning, financial forecasting, and unlimited AI recommendations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How does the investment planning work?</AccordionTrigger>
                  <AccordionContent>
                    Our AI analyzes your financial situation, risk tolerance, goals, and market conditions to provide
                    personalized investment recommendations. We don't manage your investments directly but provide
                    guidance you can implement through your preferred investment platform.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20">
          <div className="rounded-xl bg-primary p-8 md:p-12 lg:p-16 text-primary-foreground text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your financial future?</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Join thousands of users who are already using AI to take control of their finances and build a better future.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started For Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold">
              <PiggyBank className="h-6 w-6" />
              <span>FinanceAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent financial management for everyone. Powered by advanced AI to help you achieve your financial goals.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
              <li><Link href="#" className="hover:text-foreground">Updates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Knowledge Base</Link></li>
              <li><Link href="#" className="hover:text-foreground">Tutorials</Link></li>
              <li><Link href="#" className="hover:text-foreground">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="container mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinanceAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 