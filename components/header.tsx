"use client"

import { Dices, Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage, type Language } from '@/lib/i18n'
import { LanguageFlag } from '@/components/language-flag'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGE_NAMES: Record<Language, string> = { en: 'English', de: 'Deutsch', it: 'Italiano' }
const LANGUAGE_OPTIONS = ['en', 'de', 'it'] satisfies Language[]

function isLanguage(value: string): value is Language {
  return LANGUAGE_OPTIONS.some((languageOption) => languageOption === value)
}

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRandomRecipe?: () => void
}

export function Header({ searchQuery = '', onSearchChange, onRandomRecipe }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 relative">
              <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
                <Image src="/images/Nonna.jpg" alt="Nonna" width={16} height={16} className="w-16 h-16 object-cover rounded-full" />
              </div>
              <div className="ml-[80px]">
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl lobster-regular">Nonna's Favorite Recipes</h1>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {(onSearchChange || onRandomRecipe) && (
              <>
              {onSearchChange && (
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder={t("header.search")}
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="max-w-[400px] w-full pl-10 bg-white text-gray-900 border-0"
                  />
                </div>
              )}
              {onRandomRecipe && (
                <Button
                  type="button"
                  onClick={onRandomRecipe}
                  className="bg-green-600 hover:bg-green-700 text-white border-0 whitespace-nowrap w-full sm:w-auto [&_svg]:size-6"
                >
                  <Dices className="mr-2" />
                  {t("header.random")}
                </Button>
              )}
              </>
            )}
            <div className="text-sm whitespace-nowrap">
              <Select
                value={language}
                onValueChange={(value) => {
                  if (isLanguage(value)) setLanguage(value)
                }}
              >
                <SelectTrigger
                  aria-label={t("language.label")}
                  className="w-auto border-white/40 bg-white text-gray-900"
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <LanguageFlag language={language} />
                      {LANGUAGE_NAMES[language]}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((value) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        <LanguageFlag language={value} />
                        {LANGUAGE_NAMES[value]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
