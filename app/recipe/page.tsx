"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, Users, Minus, Plus, ChefHat } from "lucide-react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardImage } from "@/components/ui/card-image"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { RecipeForm } from "@/components/recipe-form"
import { getRecipeAuth } from "@/lib/firebase"
import { getRecipe, getRecipeTranslation, type Recipe, updateRecipe } from "@/lib/recipes"
import Link from "next/link"
import { translateIngredientUnit, useLanguage } from "@/lib/i18n"

const ADMIN_EMAILS = ["torben.jan.mueller@gmail.com"]

export default function RecipePage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [editing, setEditing] = useState(false)
  const [servings, setServings] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      return onAuthStateChanged(getRecipeAuth(), setUser, (err) => {
        console.error("Authentication state could not be loaded:", err)
      })
    } catch (err) {
      console.error("Firebase authentication could not be initialized:", err)
    }
  }, [])

  useEffect(() => {
    let active = true
    const id = new URLSearchParams(window.location.search).get("id") ?? ""
    getRecipe(id).then((item) => {
      if (active) {
        setRecipe(item)
        if (item) setServings(item.servings)
      }
    }).catch((err) => {
      console.error("Could not load recipe:", err)
      if (active) setError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  if (loading) {
    return <p className="min-h-screen flex items-center justify-center text-center" role="status">{t("recipe.loading")}</p>
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error ? t("recipe.loadError") : t("recipe.notFound")}</h1>
          <Link href="/" className="text-orange-700 underline">{t("recipe.back")}</Link>
        </div>
      </div>
    )
  }

  const multiplier = servings / recipe.servings
  const isAdmin = Boolean(user?.emailVerified && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
  const content = getRecipeTranslation(recipe, language)

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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return t("difficulty.easy")
      case "Medium":
        return t("difficulty.medium")
      case "Hard":
        return t("difficulty.hard")
      default:
        return difficulty
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
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-orange-700 underline">{t("recipe.back")}</Link>
          {isAdmin && !editing && <Button type="button" variant="outline" onClick={() => setEditing(true)}>{t("recipe.edit")}</Button>}
        </div>

        {editing && user && (
          <Card className="mt-6">
            <CardHeader><CardTitle>{t("recipe.edit")}</CardTitle></CardHeader>
            <CardContent>
              <RecipeForm
                recipe={recipe}
                submitLabel={t("recipe.saveChanges")}
                savingLabel={t("recipe.savingChanges")}
                errorMessage={t("recipe.updateError")}
                onCancel={() => setEditing(false)}
                onSave={async (data, image) => {
                  const updatedRecipe = await updateRecipe(String(recipe.id), data, recipe.image, image, user.uid)
                  setRecipe(updatedRecipe)
                  setServings(updatedRecipe.servings)
                  setEditing(false)
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Recipe Header */}
        <div className="mb-8 mt-4">
          <CardImage src={recipe.image} alt={recipe.title} />

          <div className="flex flex-wrap items-center gap-3 my-4">
            <Badge variant="outline" className="text-sm border-transparent bg-gray-200 text-gray-800">{content.category}</Badge>
            <Badge variant="outline" className={`text-sm border-transparent ${getDifficultyColor(recipe.difficulty)}`}>{getDifficultyLabel(recipe.difficulty)}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>

          <p className="text-lg text-gray-700 mb-6">{content.description}</p>

          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookTime} {t("recipe.minutes")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{recipe.servings} {t("recipe.servings")}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("recipe.ingredients")}</span>
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
                    {servings} {servings === 1 ? t("recipe.serving") : t("recipe.servings")}
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
                    <span className="text-gray-700">{content.ingredients[index]?.name ?? ingredient.name}</span>
                    <span className="font-medium">
                      {formatAmount(ingredient.amount)} {translateIngredientUnit(content.ingredients[index]?.unit ?? ingredient.unit, language)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recipe.instructions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {content.instructions.map((instruction, index) => (
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
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-amber-600" />
              {t("recipe.tip")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700">
                {content.tip || t("recipe.defaultTip")}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer onCategorySelect={(category) => router.push(`/?category=${encodeURIComponent(category)}`)} />
    </div>
  )
}
