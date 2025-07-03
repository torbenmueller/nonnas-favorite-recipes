"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ImprintPage() {
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Imprint</h1>
            <div className="prose prose-orange max-w-none">
              <h2>Responsible for Content</h2>
              <p>Nonna's Favorite Recipes<br/>
              Torben Jan Müller<br/>
              [Your Street Address]<br/>
              [Your City, ZIP Code]<br/>
              Germany</p>

              <h2>Contact Information</h2>
              <p>Email: info@nonnasrecipes.com<br/>
              Phone: +49 [Your Phone Number]</p>

              <h2>Commercial Register</h2>
              <p>Entry in the commercial register: [Your Registration Number]<br/>
              Register court: [Your Court]</p>

              <h2>VAT ID</h2>
              <p>VAT identification number: [Your VAT ID]</p>

              <h2>Responsible for Content according to § 55 Abs. 2 RStV</h2>
              <p>Torben Jan Müller<br/>
              [Your Street Address]<br/>
              [Your City, ZIP Code]</p>

              <h2>Disclaimer</h2>
              <p>The content of this website has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, and timeliness of the information provided.</p>

              <h2>External Links</h2>
              <p>Our website contains links to external third-party websites. We have no influence on the content of these websites and cannot accept any liability for them.</p>

              <h2>Legal Notice</h2>
              <p>This imprint was created using the <a href="https://www.impressum-generator.de" className="text-orange-600 hover:text-orange-700">Impressum Generator</a> of <a href="https://www.impressum-generator.de" className="text-orange-600 hover:text-orange-700">impressum-generator.de</a> and the <a href="https://www.anwaltskanzlei-weiss.de" className="text-orange-600 hover:text-orange-700">Law Office of Dr. Thomas Schwenke</a>.</p>
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
