"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { scrollToTopOnNextNavigation } from "@/components/scroll-to-top-on-navigation"
import { useLanguage } from "@/lib/i18n"

export default function ImprintPage() {
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
            <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("imprint.title")}</h1>
            <div className="prose prose-orange max-w-none">
              <h2 className="font-semibold mb-1">{t("imprint.responsible")}</h2>
              <p className="mb-4">Nonna's Favorite Recipes<br/>
              Torben Jan Müller<br/>
              Am Hammershöfchen 23<br/>
              45219 Essen<br/>
              {t("imprint.country")}</p>

              <h2 className="font-semibold mb-1">{t("imprint.contact")}</h2>
              <p className="mb-4">{t("imprint.email")} <a className="link" href="mailto:info@nonnas-favorite-recipes.com">info@nonnas-favorite-recipes.com</a><br/>
              {t("imprint.phone")} +49 151 284 720 59</p>

              <h2 className="font-semibold mb-1">{t("imprint.responsibleRstv")}</h2>
              <p className="mb-4">Torben Jan Müller<br/>
              Am Hammershöfchen 23<br/>
              45219 Essen<br/>
              {t("imprint.country")}</p>

              <h2 className="font-semibold mb-1">{t("imprint.disclaimer")}</h2>
              <p className="mb-4">{t("imprint.disclaimerText")}</p>

              <h2 className="font-semibold mb-1">{t("imprint.externalLinks")}</h2>
              <p className="mb-4">{t("imprint.externalLinksText")}</p>

              <h2 className="font-semibold mb-1">{t("imprint.legalNotice")}</h2>
              <p>{t("imprint.notice.before")}<a className="link" href="https://www.impressum-generator.de">{t("imprint.notice.generator")}</a>{t("imprint.notice.middle")}<a className="link" href="https://www.impressum-generator.de">impressum-generator.de</a>{t("imprint.notice.and")}<a className="link" href="https://www.anwaltskanzlei-weiss.de">{t("imprint.notice.lawOffice")}</a>{t("imprint.notice.end")}</p>
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
