import Link from "next/link"
import type { Metadata } from "next"
import { FaFileMedical } from "react-icons/fa"
import { BackgroundEffect } from "../components/background-effect"
import { AnimatedSection } from "../components/animated-section"

export const metadata: Metadata = {
  title: "Privacy Policy - MediScribe",
  description: "Privacy Policy for MediScribe - AI-powered Prescription Documentation",
}

export default function PrivacyPolicy() {
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
                <FaFileMedical />
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
        </div>
      </header>

      <main className="relative z-10">
        <AnimatedSection className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              🩺 Privacy Policy — MediScribe.in
            </h1>
            
            <div className="text-sm text-gray-400 mb-8">
              Last updated: October 2025
            </div>

            <div className="prose prose-invert prose-headings:text-purple-300 prose-strong:text-blue-300 prose-em:text-gray-300 max-w-none bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 shadow-inner">
              <p className="text-lg text-gray-200 mb-6">
                At MediScribe ("we," "our," or "us"), we value and respect your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website, products, and services.
              </p>

              <p className="text-lg text-gray-200 mb-8">
                By using <a href="https://mediscribe.in" className="text-blue-400 hover:text-blue-300 underline">https://mediscribe.in</a> (the "Website") or any of our services, you agree to the terms of this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-200 mb-4">We may collect the following types of information:</p>

              <h3 className="text-xl font-medium text-blue-300 mt-6 mb-3">a) Information you provide to us</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-6">
                <li>Your name, email address, and contact details when you fill out forms or contact us.</li>
                <li>Feedback, support requests, or other communications you send to us.</li>
              </ul>

              <h3 className="text-xl font-medium text-blue-300 mt-6 mb-3">b) Automatically collected information</h3>
              <p className="text-gray-200 mb-3">When you visit our website, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-6">
                <li>Device and browser information</li>
                <li>IP address and general location</li>
                <li>Usage statistics (via analytics tools such as Google Analytics)</li>
              </ul>

              <h3 className="text-xl font-medium text-blue-300 mt-6 mb-3">c) Product-related data</h3>
              <p className="text-gray-200 mb-4">
                If you use our MediScribe AI tools (e.g., handwriting OCR or prescription analysis), we may temporarily process uploaded handwriting samples, text, or related metadata only for the purpose of generating results.
              </p>
              <p className="text-gray-200 mb-6">
                This data is not shared or sold to any third parties and is stored securely or deleted after processing.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-200 mb-3">We use collected data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Communicate important updates or product improvements</li>
                <li>Ensure security, fraud prevention, and compliance</li>
                <li>Improve AI model accuracy (in anonymized and aggregated form only)</li>
              </ul>
              <p className="text-gray-200 mb-6 font-medium text-blue-300">We do not sell or rent your personal data to anyone.</p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">3. Data Security</h2>
              <p className="text-gray-200 mb-4">
                We use reasonable physical, technical, and administrative safeguards to protect your information against unauthorized access, loss, or misuse.
              </p>
              <p className="text-gray-200 mb-6">
                Sensitive data (such as handwritten prescription uploads) is processed using encrypted channels and secure storage.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">4. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-6">
                <li>Website analytics data is retained for as long as necessary to understand traffic trends.</li>
                <li>Uploaded content (like handwriting samples) is stored temporarily and deleted automatically after processing or as per the product's data policy.</li>
                <li>Communication records are kept as long as needed to provide support.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">5. Sharing of Information</h2>
              <p className="text-gray-200 mb-3">We do not share personal data with third parties except:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-6">
                <li>When required by law or regulatory authorities</li>
                <li>With trusted service providers who assist us in operations (hosting, analytics, etc.) — under strict confidentiality agreements</li>
              </ul>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-gray-200 mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-200 mb-4">
                <li>Access, correct, or delete your personal data</li>
                <li>Withdraw consent for data processing (where applicable)</li>
                <li>Request information about how your data is used</li>
              </ul>
              <p className="text-gray-200 mb-6">
                To exercise these rights, contact us at <a href="mailto:support@mediscribe.in" className="text-blue-400 hover:text-blue-300 underline">support@mediscribe.in</a>.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-200 mb-6">
                Our website may use cookies or similar technologies to enhance your browsing experience. You can control cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-200 mb-6">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors.
              </p>

              <h2 className="text-2xl font-semibold text-purple-300 mt-8 mb-4">9. Updates to This Policy</h2>
              <p className="text-gray-200 mb-8">
                We may update this Privacy Policy from time to time. The updated version will always be available at <a href="https://mediscribe.in/privacy" className="text-blue-400 hover:text-blue-300 underline">https://mediscribe.in/privacy</a> with a new "Last updated" date.
              </p>

              <div className="text-center mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400">
                  🌐 <a href="https://mediscribe.in" className="text-blue-400 hover:text-blue-300 underline">https://mediscribe.in</a>
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link 
                href="/" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="bg-gray-900/50 border-t border-gray-800 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gray-900 rounded-full p-2">
                <FaFileMedical />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MediScribe
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} MediScribe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
