"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { scrollToTopOnNextNavigation } from "@/components/scroll-to-top-on-navigation"
import { useLanguage } from "@/lib/i18n"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("privacy.title")}</h1>
            <div className="prose prose-orange max-w-none">
              <h2 className="font-semibold mb-1">{t("privacy.introduction")}</h2>
              <p className="mb-4">{t("privacy.introductionText")}</p>

              <h2 className="font-semibold mb-1">{t("privacy.collect")}</h2>
              <p className="mb-1">{t("privacy.collectLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("privacy.collectNewsletter")}</li>
                <li>{t("privacy.collectReviews")}</li>
                <li>{t("privacy.collectContact")}</li>
              </ul>

              <h2 className="font-semibold mb-1">{t("privacy.use")}</h2>
              <p className="mb-1">{t("privacy.useLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("privacy.useNewsletter")}</li>
                <li>{t("privacy.useRespond")}</li>
                <li>{t("privacy.useImprove")}</li>
              </ul>

              <h2 className="font-semibold mb-1">{t("privacy.protection")}</h2>
              <p className="mb-4">{t("privacy.protectionText")}</p>

              <h2 className="font-semibold mb-1">{t("privacy.rights")}</h2>
              <p className="mb-1">{t("privacy.rightsLead")}</p>
              <ul className="mb-4 list-disc list-inside">
                <li>{t("privacy.rightsAccess")}</li>
                <li>{t("privacy.rightsCorrection")}</li>
                <li>{t("privacy.rightsDeletion")}</li>
              </ul>

              <h2 className="font-semibold mb-1">{t("privacy.updates")}</h2>
              <p className="mb-4">{t("privacy.updatesText")}</p>

              <h2 className="font-semibold mb-1">{t("privacy.contact")}</h2>
              <p>{t("privacy.contactText")}</p>
              <p>{t("privacy.email")} <a className="link" href="mailto:info@nonnas-favorite-recipes.com">info@nonnas-favorite-recipes.com</a></p>
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
