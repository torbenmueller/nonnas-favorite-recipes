import { type Language } from "@/lib/i18n"

export function LanguageFlag({ language }: { language: Language }) {
  if (language === "de") {
    return (
      <svg viewBox="0 0 30 20" className="inline-block h-4 w-6 rounded-sm border border-black/10 align-middle" aria-hidden="true">
        <rect width="30" height="6.67" fill="#000" />
        <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
        <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
      </svg>
    )
  }

  if (language === "it") {
    return (
      <svg viewBox="0 0 30 20" className="inline-block h-4 w-6 rounded-sm border border-black/10 align-middle" aria-hidden="true">
        <rect width="10" height="20" fill="#009246" />
        <rect x="10" width="10" height="20" fill="#FFF" />
        <rect x="20" width="10" height="20" fill="#CE2B37" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 30 20" className="inline-block h-4 w-6 rounded-sm border border-black/10 align-middle" aria-hidden="true">
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#FFF" strokeWidth="5" />
      <path d="M0 0 30 20M30 0 0 20" stroke="#C8102E" strokeWidth="2" />
      <path d="M15 0v20M0 10h30" stroke="#FFF" strokeWidth="7" />
      <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3" />
    </svg>
  )
}
