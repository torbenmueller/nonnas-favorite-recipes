"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-green-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Previous Page
          </Button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
            <div className="prose prose-orange max-w-none">
              <h2>1. Introduction</h2>
              <p>Welcome to Nonna's Favorite Recipes. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.</p>

              <h2>2. Information We Collect</h2>
              <p>We collect information that you provide to us directly, such as:</p>
              <ul>
                <li>Email address when you subscribe to our newsletter</li>
                <li>Recipe ratings and reviews</li>
                <li>Contact information if you reach out to us</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Send you our newsletter if you subscribe</li>
                <li>Respond to your inquiries</li>
                <li>Improve our website and services</li>
              </ul>

              <h2>4. Data Protection</h2>
              <p>We take appropriate security measures to protect your personal information. We do not sell or share your information with third parties.</p>

              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Request corrections</li>
                <li>Request deletion</li>
              </ul>

              <h2>6. Updates to this Policy</h2>
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>

              <h2>7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p>Email: info@nonnasrecipes.com</p>
            </div>
          </div>
        </div>
      </main>
      <Footer onCategorySelect={() => {}} />
    </div>
  )
}

// Simple button component since we don't have access to the UI components in this file
function Button({ 
  children, 
  onClick, 
  className = '',
  variant = 'default' 
}: { 
  children: React.ReactNode, 
  onClick: () => void, 
  className?: string,
  variant?: 'default' | 'outline' 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-orange-600 text-white hover:bg-orange-700',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  }
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
