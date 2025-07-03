"use client"

import { Dices } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRandomRecipe?: () => void
}

export function Header({ searchQuery = '', onSearchChange, onRandomRecipe }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-amber-100 to-orange-200 shadow-lg border-b-4 border-orange-400">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 relative">
              <div className="absolute w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden">
                <Image src="/images/Nonna.jpg" alt="Nonna" width={24} height={24} className="w-24 h-24 object-cover rounded-full" />
              </div>
              <div className="ml-[106px]">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-gray-900 font-['Lobster']">Nonna's Favorite Recipes</h1>
                  <div className="w-8 h-6 flex">
                    <div className="w-4 h-6 bg-green-600"></div>
                    <div className="w-4 h-6 bg-white border-y border-gray-300"></div>
                    <div className="w-4 h-6 bg-red-600"></div>
                  </div>
                </div>
                <span className="text-lg text-gray-600">Authentic Italian Recipes</span>
              </div>
            </Link>
          </div>
          
          {(onSearchChange || onRandomRecipe) && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {onSearchChange && (
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  className="max-w-[400px] w-full"
                />
              )}
              {onRandomRecipe && (
                <Button 
                  onClick={onRandomRecipe} 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 whitespace-nowrap w-full sm:w-auto"
                >
                  <Dices className="mr-2 h-4 w-4" />
                  Random Recipe
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
