"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { scrollToTopOnNextNavigation } from "@/components/scroll-to-top-on-navigation"

export default function ImprintPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-green-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button type="button" onClick={() => {
            scrollToTopOnNextNavigation()
            router.back()
          }} className="text-orange-700 underline">Back to previous page</button>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Imprint</h1>
            <div className="prose prose-orange max-w-none">
              <h2 className="font-semibold mb-1">Responsible for Content</h2>
              <p className="mb-4">Nonna's Favorite Recipes<br/>
              Torben Jan Müller<br/>
              Am Hammershöfchen 23<br/>
              45219 Essen<br/>
              Germany</p>

              <h2 className="font-semibold mb-1">Contact Information</h2>
              <p className="mb-4">Email: <a className="link" href="mailto:info@nonnas-favorite-recipes.com">info@nonnas-favorite-recipes.com</a><br/>
              Phone: +49 +49 151 284 720 59</p>

              <h2 className="font-semibold mb-1">Responsible for Content according to § 55 Abs. 2 RStV</h2>
              <p className="mb-4">Torben Jan Müller<br/>
              Am Hammershöfchen 23<br/>
              45219 Essen<br/>
              Germany</p>

              <h2 className="font-semibold mb-1">Disclaimer</h2>
              <p className="mb-4">The content of this website has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, and timeliness of the information provided.</p>

              <h2 className="font-semibold mb-1">External Links</h2>
              <p className="mb-4">Our website contains links to external third-party websites. We have no influence on the content of these websites and cannot accept any liability for them.</p>

              <h2 className="font-semibold mb-1">Legal Notice</h2>
              <p>This imprint was created using the <a className="link" href="https://www.impressum-generator.de">Impressum Generator</a> of <a className="link" href="https://www.impressum-generator.de">impressum-generator.de</a> and the <a className="link" href="https://www.anwaltskanzlei-weiss.de">Law Office of Dr. Thomas Schwenke</a>.</p>
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
