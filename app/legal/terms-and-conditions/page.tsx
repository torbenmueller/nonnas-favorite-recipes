"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsAndConditionsPage() {
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
            <div className="prose prose-orange max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>By using Nonna's Favorite Recipes, you agree to these Terms and Conditions. If you do not agree, please do not use our website.</p>

              <h2>2. Content Usage</h2>
              <p>All content on our website, including recipes, photos, and text, is protected by copyright. You may:</p>
              <ul>
                <li>View content for personal, non-commercial use</li>
                <li>Share links to our content</li>
                <li>Print recipes for personal use</li>
              </ul>
              <p>You may not:</p>
              <ul>
                <li>Copy or distribute content without permission</li>
                <li>Use content for commercial purposes</li>
                <li>Modify or create derivative works</li>
              </ul>

              <h2>3. User Conduct</h2>
              <p>You agree to:</p>
              <ul>
                <li>Use the website in a legal and ethical manner</li>
                <li>Respect other users' rights and privacy</li>
                <li>Not post inappropriate or harmful content</li>
              </ul>

              <h2>4. Disclaimer</h2>
              <p>The recipes and information provided are for general guidance only. We do not guarantee the results of any recipes and are not liable for any damages arising from their use.</p>

              <h2>5. Changes to Terms</h2>
              <p>We may update these Terms and Conditions at any time. Your continued use of the website constitutes acceptance of any changes.</p>

              <h2>6. Contact Us</h2>
              <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
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
