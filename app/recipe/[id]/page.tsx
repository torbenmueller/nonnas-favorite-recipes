"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Users, Utensils, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardImage } from "@/components/ui/card-image"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { recipes } from "@/data/recipes"

export default function RecipePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = Number.parseInt(params.id as string)
  const recipe = recipes.find((r) => r.id === recipeId)

  const [servings, setServings] = useState(recipe?.servings || 4)

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </div>
      </div>
    )
  }

  const multiplier = servings / recipe.servings

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

  const formatAmount = (amount: number) => {
    const adjustedAmount = amount * multiplier
    if (adjustedAmount < 1 && adjustedAmount > 0) {
      return adjustedAmount.toFixed(2)
    }
    return Math.round(adjustedAmount * 10) / 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-100 to-orange-200 shadow-lg border-b-4 border-orange-400">
        <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <img src="/images/Nonna.png" alt="Nonna" className="w-16 h-16" />
              </div>
              <div>
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
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>

        {/* Recipe Header */}
        <div className="mb-8">
          <CardImage src={recipe.image} alt={recipe.title} />

          <div className="flex flex-wrap items-center gap-3 my-4">
            <Badge variant="secondary">{recipe.category}</Badge>
            <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>

          <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Serves {recipe.servings}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Ingredients</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    disabled={servings <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-normal px-3">
                    {servings} {servings === 1 ? "serving" : "servings"}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setServings(servings + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{ingredient.name}</span>
                    <span className="font-medium">
                      {formatAmount(ingredient.amount)} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nonna's Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Pro tip:</strong> For the best results with Italian cooking, always use high-quality
                ingredients. Fresh herbs, good olive oil, and authentic Italian cheeses make all the difference in
                flavor. Don't rush the cooking process - Italian cuisine is about taking time to let flavors develop
                naturally.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
