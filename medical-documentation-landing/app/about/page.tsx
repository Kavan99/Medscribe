import Link from "next/link"
import {  Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { FloatingCta } from "../components/floating-cta"
import { AnimatedSection } from "../components/animated-section"
import { BackgroundEffect } from "../components/background-effect"

export const metadata: Metadata = {
  title: "About Us - MediScribe",
  description: "Meet the team behind MediScribe and learn our story",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      <BackgroundEffect />

      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-full p-2">
                <img src="/logo.png" alt="MediScribe Logo" className="h-10 w-19" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              MediScribe
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/careers" className="text-gray-300 hover:text-white transition-colors relative group">
              Careers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Team Section */}
        <AnimatedSection className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Meet Our Team
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Kavan Prajapati */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl h-full transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                      <Link 
                        href="https://www.linkedin.com/in/kavan-prajapati07/" 
                        target="_blank"
                        className="hover:underline"
                      >
                        Kavan Prajapati
                      </Link>
                    </h3>
                    <Link 
                      href="https://www.linkedin.com/in/kavan-prajapati07/" 
                      target="_blank"
                      className="relative group p-2 -mt-2 -mr-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                      <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                        <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Link>
                  </div>
                  <div className="text-blue-400 mb-3">Co-Founder</div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Have experience with Product Management, Launch Strategy, Marketing, and scaling of a GenAI startup, winning Product Hunt #1 Product Award for Trupeer.ai. Worked in 3 startups, helped them in product deployment and revenue growth.
                  </p>
                </div>
              </div>

              {/* Darsh Patel */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl h-full transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                      <Link 
                        href="https://www.linkedin.com/in/darshpateliitb/" 
                        target="_blank"
                        className="hover:underline"
                      >
                        Darsh Patel
                      </Link>
                    </h3>
                    <Link 
                      href="https://www.linkedin.com/in/darshpateliitb/" 
                      target="_blank"
                      className="relative group p-2 -mt-2 -mr-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                      <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                        <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </Link>
                  </div>
                  <div className="text-purple-400 mb-3">Co-Founder</div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Passionate about problem-solving in a creative way. I am the Convener of Tinkerers' Lab, IITB. Have worked on several robotic projects, naming a few - POV display, automatic potentiometric titrator, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Story Section */}
        <AnimatedSection className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Our Story
            </h1>
            
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    MediScribe is revolutionizing healthcare documentation through advanced AI technology. Our mission is to help healthcare professionals focus more on patient care and less on paperwork.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    We understand the challenges faced by clinicians in managing their documentation workload. That's why we've developed an intelligent medical scribe that adapts to your workflow and helps you create accurate, detailed medical records efficiently.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-blue-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    Our team of healthcare experts and AI specialists work together to ensure that our solution meets the highest standards of accuracy and efficiency, making documentation easier for healthcare professionals worldwide.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    With MediScribe, we're not just creating software; we're transforming the way medical documentation is handled, giving clinicians more time to focus on what matters most - their patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
                <div className="relative bg-gray-900 rounded-full p-2">
                  <img src="/logo.png" alt="MediScribe Logo" className="h-10 w-19" />
                </div>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MediScribe
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MediScribe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA for mobile */}
      <FloatingCta />
    </div>
  )
}
