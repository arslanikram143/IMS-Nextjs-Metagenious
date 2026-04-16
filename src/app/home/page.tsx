"use client";

import LandingNavbar from "@/components/LandingNavbar";
import { ArrowRight, Zap, Users, BarChart3, Calendar, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LandingNavbar />

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                  Modern School
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Management System
                  </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl">
                  Streamline your institution's operations with our comprehensive platform for managing students, teachers, classes, and more.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50"
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-400">10K+</p>
                  <p className="text-gray-400 text-sm">Active Schools</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">500K+</p>
                  <p className="text-gray-400 text-sm">Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">99.9%</p>
                  <p className="text-gray-400 text-sm">Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-blue-500/30">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-24 h-24 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-lg">School Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to run your school efficiently</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Student Management</h3>
              <p className="text-gray-400">Efficiently manage student records, enrollment, and academic progress all in one place.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <Calendar className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Class Scheduling</h3>
              <p className="text-gray-400">Create and manage class timetables, lessons, and exam schedules effortlessly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <BarChart3 className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Analytics & Reports</h3>
              <p className="text-gray-400">Get detailed insights with comprehensive analytics and performance reports.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Real-time Updates</h3>
              <p className="text-gray-400">Instant notifications and live updates keep everyone in the loop.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <Shield className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-400">Enterprise-grade security to protect sensitive student and institutional data.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <BookOpen className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Subject Management</h3>
              <p className="text-gray-400">Organize subjects, assignments, and curriculum materials efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section id="ai-tools" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Tools</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Our intelligent system uses AI to help with student assessments, personalized learning paths, and predictive analytics for better educational outcomes.
            </p>
            <button className="mt-8 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all">
              Explore AI Features
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">About EduHub</h2>
              <p className="text-gray-400 text-lg">
                EduHub is a modern school management platform designed to simplify administrative tasks and enhance the educational experience for students, teachers, and parents.
              </p>
              <p className="text-gray-400 text-lg">
                With over a decade of experience in education technology, we're committed to providing schools with innovative solutions that improve efficiency and student outcomes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Founded in 2015
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Serving 10,000+ schools globally
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  99.9% uptime guarantee
                </li>
              </ul>
            </div>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-400">About Section Image/Video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your school's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">For small schools</p>
              <p className="text-4xl font-bold text-white mb-6">
                $99<span className="text-lg text-gray-400">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Up to 500 students
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Basic features
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Email support
                </li>
              </ul>
              <button className="w-full py-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 border border-blue-400/50 relative md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-white/90 mb-6">For growing schools</p>
              <p className="text-4xl font-bold text-white mb-6">
                $299<span className="text-lg text-white/80">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Up to 2,000 students
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Advanced features
                </li>
                <li className="flex items-center text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Priority support
                </li>
              </ul>
              <button className="w-full py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-500/50 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6">For large institutions</p>
              <p className="text-4xl font-bold text-white mb-6">
                Custom<span className="text-lg text-gray-400">/year</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Unlimited students
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  All features
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Dedicated support
                </li>
              </ul>
              <button className="w-full py-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your School?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of schools using EduHub to streamline their operations.</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50"
          >
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                EduHub
              </p>
              <p className="text-gray-400">Modern school management for the digital age.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
