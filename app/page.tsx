"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { Header } from '@/components/header'
import Image from "next/image"

import { CardImage } from "@/components/ui/card-image"
import { getRecipeTranslation, getRecipes, type Recipe } from "@/lib/recipes"
import { useLanguage } from "@/lib/i18n"

export default function HomePage() {
  const { language, t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12
  const categories = ["All", ...new Set(recipes.map((recipe) => recipe.category))]

  useEffect(() => {
    let active = true
    const category = new URLSearchParams(window.location.search).get("category")
    if (category) setSelectedCategory(category)
    getRecipes().then((items) => {
      if (active) setRecipes(items)
    }).catch((err) => {
      console.error("Could not load recipes:", err)
      if (active) setError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  // Filter recipes based on category and search
  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
    const matchesSearch = getRecipeTranslation(recipe, language).title.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getCategoryLabel = (category: string) => {
    const recipe = recipes.find((item) => item.category === category)
    return recipe ? getRecipeTranslation(recipe, language).category : category
  }

  const handleRandomRecipe = () => {
    if (recipes.length === 0) return
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
    window.location.href = `/recipe/?id=${randomRecipe.id}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setPage(1) }}
        onRandomRecipe={recipes.length ? handleRandomRecipe : undefined}
      />

      <div className="bg-image">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="md:w-1/2 w-full">
            <span className="text-lg text-gray-600">{t("home.eyebrow")}</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {t("home.title")}
              <Image src="/images/it.svg" alt="Italian flag" width={32} height={32} />
            </h2>
            <p className="text-xl text-gray-900 max-w-2xl mb-8">
              {t("home.description")}
            </p>
            <h1 className="text-orange-600 benvenuti mb-4">Buon appetito!</h1>
          </div>
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src="/images/italian_family.jpg"
              alt="Italian Family"
              
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategorySelect(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  : ""
              }
            >
              {category === "All" ? t("home.category.all") : getCategoryLabel(category)}
            </Button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}
          
          {paginatedRecipes.map((recipe: Recipe) => {
            const content = getRecipeTranslation(recipe, language)
            return (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
              <CardImage src={recipe.image} alt={content.title} />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-sm border-transparent bg-gray-200 text-gray-800">
                  {content.category}
                  </Badge>
                  <Badge variant="outline" className={`text-sm border-transparent ${getDifficultyColor(recipe.difficulty)}`}>{getDifficultyLabel(recipe.difficulty)}</Badge>
                </div>
              <CardTitle className="text-xl mb-2">{content.title}</CardTitle>
              <p className="text-gray-700 text-sm mb-4">{content.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cookTime} {t("home.minutes")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} {t("home.servings")}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/recipe/?id=${recipe.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                    {t("home.viewRecipe")}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            )
          })}
        </div>
        {paginatedRecipes.length > 0 && filteredRecipes.length > page * itemsPerPage && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {t("home.loadMore")}
            </Button>
          </div>
        )}
        {error && <p role="alert" className="text-center text-red-700 py-8">{t("home.loadError")}</p>}
        {!loading && !error && paginatedRecipes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">{t("home.noResults")}</p>
          </div>
        )}
        <section aria-labelledby="newsletter-heading" className="mt-12">
          <Card className="border-orange-300 bg-amber-50">
            <div className="grid gap-6 p-6 md:grid-cols-2 md:items-start">
              <div className="space-y-2">
                <h2 id="newsletter-heading" className="text-xl font-semibold text-gray-900">{t("footer.newsletter")}</h2>
                <p className="text-gray-600 text-sm">{t("footer.newsletterDescription")}</p>
              </div>
              <form
                action="https://nonnas-favorite-recipes.us6.list-manage.com/subscribe/post?u=ab34b074927fdf20b97be28b5&amp;id=7f2ddad826&amp;f_id=001d5ee0f0"
                method="post"
                target="_blank"
                rel="noopener noreferrer"
                className="space-y-2"
              >
                <label htmlFor="newsletter-email" className="sr-only">{t("footer.emailAddress")}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="newsletter-email"
                    type="email"
                    name="EMAIL"
                    placeholder={t("footer.emailPlaceholder")}
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-colors">
                    {t("footer.subscribe")}
                  </button>
                </div>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    {t("footer.newsletterConsent")}{" "}
                    <Link className="link" href="/legal/privacy-policy">{t("footer.privacy")}</Link>.
                  </span>
                </label>
                <div aria-hidden="true" className="absolute -left-[5000px]">
                  <input type="text" name="b_ab34b074927fdf20b97be28b5_7f2ddad826" tabIndex={-1} autoComplete="off" />
                </div>
                <p className="text-xs text-gray-600">{t("footer.mailchimpNotice")}</p>
                <a href="http://eepurl.com/C8gAUoCryu" target="_blank" rel="noopener noreferrer" className="inline-block">
                  <img src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg" alt="Intuit Mailchimp" width={220} height={40} />
                </a>
              </form>
            </div>
          </Card>
        </section>
      </main>
      <Footer onCategorySelect={handleCategorySelect} />
      </div>
    </div>
  )
}
