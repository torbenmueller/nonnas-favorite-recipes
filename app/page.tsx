"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, Users, Utensils, Search, Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Header } from '@/components/header'

import { CardImage } from "@/components/ui/card-image"
import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"

import { recipes } from "@/data/recipes"

interface Recipe {
  id: number
  title: string
  category: string
  image: string
  cookTime: number
  servings: number
  difficulty: string
  description: string
  ingredients: Array<{
    name: string
    amount: number
    unit: string
  }>
  instructions: string[]
}

const categories = ["All", ...new Set(recipes.map((recipe: Recipe) => recipe.category))] as const

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  // Get featured recipes (first 4)
  useEffect(() => {
    setFeaturedRecipes(recipes.slice(0, 4))
  }, [])

  const handleCategorySelect = (category: typeof categories[number]) => {
    setSelectedCategory(category)
  }

  // Filter recipes based on category and search
  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get paginated recipes
  const paginatedRecipes = filteredRecipes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-800"
      case "Medium":
        return "bg-amber-100 text-amber-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRandomRecipe = () => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
    window.location.href = `/recipe/${randomRecipe.id}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        onRandomRecipe={handleRandomRecipe}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover the Flavors of Italy</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From traditional pasta dishes to authentic pizzas, explore our collection of time-honored Italian recipes
            passed down through generations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category: typeof categories[number]) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  : ""
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Recipes */}
        {/* <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Featured Recipes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <CardImage src={recipe.image} alt={recipe.title} />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl">{recipe.title}</CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link href={`/recipe/${recipe.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                      View Recipe
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div> */}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}
          
          {paginatedRecipes.map((recipe: Recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <CardImage src={recipe.image} alt={recipe.title} />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {recipe.category}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>{recipe.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{recipe.title}</CardTitle>
                <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/recipe/${recipe.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                    View Recipe
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {paginatedRecipes.length > 0 && filteredRecipes.length > page * itemsPerPage && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Load More
            </Button>
          </div>
        )}
        {paginatedRecipes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No recipes found matching your search criteria.</p>
          </div>
        )}
      </main>

          <Footer onCategorySelect={handleCategorySelect} />
    </div>
  )
}
