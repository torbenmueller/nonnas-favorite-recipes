"use client"

import { Dices, Search, Plus } from 'lucide-react'
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
                  <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide">Nonna's Favorite Recipes</h1>
                </div>
              </div>
            </Link>
          </div>
          
          {(onSearchChange || onRandomRecipe) && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {onSearchChange && (
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={onSearchChange}
                    className="max-w-[400px] w-full pl-10 bg-white text-gray-900 border-0"
                  />
                </div>
              )}
              <Link href="/recipe/new" className="w-full sm:w-auto">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 whitespace-nowrap w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Recipe
                </Button>
              </Link>
              {onRandomRecipe && (
                <Button 
                  onClick={onRandomRecipe} 
                  className="bg-green-600 hover:bg-green-700 text-white border-0 whitespace-nowrap w-full sm:w-auto"
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
