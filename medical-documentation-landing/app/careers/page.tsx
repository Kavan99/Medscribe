import Link from "next/link"
import { FileText, Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { FloatingCta } from "../components/floating-cta"
import { AnimatedSection } from "../components/animated-section"
import { BackgroundEffect } from "../components/background-effect"

export const metadata: Metadata = {
  title: "Careers - MediScribe",
  description: "Join our mission to transform healthcare with AI-powered solutions",
}

export default function CareersPage() {
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
                <FileText className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
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
        {/* Hero Section */}
        <AnimatedSection className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Join Our Mission to Transform Healthcare
            </h1>
            <p className="text-xl text-blue-400 mb-8">
              We're building the future of medical documentation with AI
            </p>
          </div>
        </AnimatedSection>

        {/* Job Listing Section */}
        <AnimatedSection className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="job-card relative group mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                <h2 className="job-title text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Generative AI Engineer
                </h2>
                <p className="job-description text-gray-400 mb-6">
                  Join us in building cutting-edge AI solutions for healthcare. Help develop and improve our medical transcription and prescription generation systems.
                </p>
                
                <div className="responsibilities mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>Train, and fine-tune LLMs (GPT, LLaMA, Mistral, etc.) for various applications.</li>
                    <li>Implement prompt engineering and retrieval-augmented generation (RAG) techniques.</li>
                    <li>Optimize model performance and reduce latency for real-world applications.</li>
                    <li>Work with NLP, transformers, embeddings, and vector databases.</li>
                    <li>Collaborate with cross-functional teams to integrate AI solutions into products.</li>
                    <li>Stay updated with the latest advancements in AI/ML and LLM research.</li>
                  </ul>
                </div>
                
                <div className="requirements mb-6">
                  <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>Strong background in Machine Learning, Deep Learning, and NLP.</li>
                    <li>Proficiency in Python, TensorFlow, PyTorch, LangChain, Hugging Face.</li>
                    <li>Experience with LLM fine-tuning, training, and optimization.</li>
                    <li>Ability to work with large datasets, vector databases (FAISS, Pinecone, ChromaDB).</li>
                    <li>Strong problem-solving skills and ability to work in a fast-paced environment.</li>
                  </ul>
                </div>
                
                <div className="preferred-qualifications mb-6">
                  <h3 className="text-xl font-semibold mb-3">Preferred Qualifications</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>Experience with open-source LLMs and custom model training.</li>
                    <li>Familiarity with multimodal AI (text, image, speech).</li>
                  </ul>
                </div>
                
                <div className="benefits">
                  <h3 className="text-xl font-semibold mb-3">Benefits</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <strong>Letter of Recommendation from IIT Bombay Professor:</strong> Since this is an IITB Funded Startup, exceptional performers will receive LoR from Prof. Dhwanil Shukla (IIT Bombay faculty and startup mentor) upon project completion, enhancing your academic and professional credentials.
                    </li>
                    <li>
                      <strong>Remote & Flexible Work Environment:</strong> Work from anywhere, anytime! Enjoy the freedom to manage your schedule while contributing to innovative projects that align with your academic and personal commitments.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link 
                  href="https://yip.su/mediscribe" 
                  target="_blank"
                  className="relative group px-8 py-6 h-auto rounded-lg border-0 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 transition-all duration-300 group-hover:scale-105"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_60%)] transition-opacity duration-300"></span>
                  <span className="relative flex flex-col">
                    <span className="text-lg font-semibold">Apply Now</span>
                    <span className="text-xs opacity-80">Join our team</span>
                  </span>
                </Link>
              </Button>
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
                  <FileText className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MediScribe
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                  <Twitter className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                  <Linkedin className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                  <Github className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} MediScribe. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA for mobile */}
      <FloatingCta />
    </div>
  )
}