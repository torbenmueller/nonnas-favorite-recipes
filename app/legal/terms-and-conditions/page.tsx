"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { scrollToTopOnNextNavigation } from "@/components/scroll-to-top-on-navigation"
import { useLanguage } from "@/lib/i18n"

export default function TermsAndConditionsPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-green-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button type="button" onClick={() => {
            scrollToTopOnNextNavigation()
            router.back()
          }} className="text-orange-700 underline">{t("legal.back")}</button>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("terms.title")}</h1>
            <div className="prose prose-orange max-w-none">
              <h2 className="font-semibold mb-1">{t("terms.acceptance")}</h2>
              <p className="mb-4">{t("terms.acceptanceText")}</p>

              <h2 className="font-semibold mb-1">{t("terms.content")}</h2>
              <p className="mb-1">{t("terms.contentLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("terms.contentView")}</li>
                <li>{t("terms.contentShare")}</li>
                <li>{t("terms.contentPrint")}</li>
              </ul>
              <p className="mb-1">{t("terms.contentNotAllowedLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("terms.contentCopy")}</li>
                <li>{t("terms.contentCommercial")}</li>
                <li>{t("terms.contentModify")}</li>
              </ul>

              <h2 className="font-semibold mb-1">{t("terms.conduct")}</h2>
              <p className="mb-1">{t("terms.conductLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("terms.conductLegal")}</li>
                <li>{t("terms.conductRespect")}</li>
                <li>{t("terms.conductContent")}</li>
              </ul>

              <h2 className="font-semibold mb-1">{t("terms.disclaimer")}</h2>
              <p className="mb-4">{t("terms.disclaimerText")}</p>

              <h2 className="font-semibold mb-1">{t("terms.changes")}</h2>
              <p className="mb-4">{t("terms.changesText")}</p>

              <h2 className="font-semibold mb-1">{t("terms.contact")}</h2>
              <p>{t("terms.contactText")}</p>
              <p>{t("terms.email")} <a className="link" href="mailto:info@nonnas-favorite-recipes.com">info@nonnas-favorite-recipes.com</a></p>
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
