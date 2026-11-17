"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { type Recipe, type RecipeTranslation } from "@/lib/recipes"
import { translateIngredientUnit, useLanguage, type Language } from "@/lib/i18n"
import { LanguageFlag } from "@/components/language-flag"

type IngredientInput = { amount: string }
type LocalizedIngredientInput = { name: string; unit: string; customUnit: string }
type LocalizedContentInput = Omit<RecipeTranslation, "ingredients"> & { ingredients: LocalizedIngredientInput[] }
type RecipeData = Omit<Recipe, "id" | "image">

const FORM_LANGUAGES: Language[] = ["en", "de", "it"]
const LANGUAGE_NAMES: Record<Language, string> = { en: "English", de: "Deutsch", it: "Italiano" }
const UNIT_OPTIONS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pinch", "whole"]

function getLocalizedInitialValue(recipe: Recipe | undefined, language: Language): LocalizedContentInput {
  const translation = recipe?.translations?.[language]

  return {
    title: translation?.title ?? recipe?.title ?? "",
    category: translation?.category ?? recipe?.category ?? "",
    description: translation?.description ?? recipe?.description ?? "",
    tip: translation?.tip ?? recipe?.tip ?? "",
    ingredients: recipe
      ? recipe.ingredients.map((ingredient, index) => {
        const unit = translation?.ingredients[index]?.unit ?? ingredient.unit
        const isStandardUnit = UNIT_OPTIONS.includes(unit)
        return {
          name: translation?.ingredients[index]?.name ?? ingredient.name,
          unit: isStandardUnit ? unit : unit ? "custom" : "",
          customUnit: isStandardUnit ? "" : unit,
        }
      })
      : [{ name: "", unit: "", customUnit: "" }],
    instructions: translation?.instructions ?? recipe?.instructions ?? [""],
  }
}

function getInitialLocalizedContent(recipe: Recipe | undefined): Record<Language, LocalizedContentInput> {
  return {
    en: getLocalizedInitialValue(recipe, "en"),
    de: getLocalizedInitialValue(recipe, "de"),
    it: getLocalizedInitialValue(recipe, "it"),
  }
}

interface RecipeFormProps {
  recipe?: Recipe
  imageRequired?: boolean
  submitLabel: string
  savingLabel: string
  errorMessage: string
  onSave: (data: RecipeData, image: File | null) => Promise<void>
  onBusyChange?: (busy: boolean) => void
  onCancel?: () => void
}

export function RecipeForm({
  recipe,
  imageRequired = false,
  submitLabel,
  savingLabel,
  errorMessage,
  onSave,
  onBusyChange,
  onCancel,
}: RecipeFormProps) {
  const { t } = useLanguage()
  const [localizedContent, setLocalizedContent] = useState(() => getInitialLocalizedContent(recipe))
  const [cookTime, setCookTime] = useState(recipe ? String(recipe.cookTime) : "")
  const [servings, setServings] = useState(recipe ? String(recipe.servings) : "")
  const [difficulty, setDifficulty] = useState(recipe?.difficulty ?? "Easy")
  const [ingredients, setIngredients] = useState<IngredientInput[]>(recipe
    ? recipe.ingredients.map((ingredient) => ({ amount: String(ingredient.amount) }))
    : [{ amount: "" }])
  const [image, setImage] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const updateLocalizedIngredient = (language: Language, index: number, update: Partial<LocalizedIngredientInput>) => {
    setLocalizedContent((current) => ({
      ...current,
      [language]: {
        ...current[language],
        ingredients: current[language].ingredients.map((ingredient, itemIndex) =>
          itemIndex === index ? { ...ingredient, ...update } : ingredient),
      },
    }))
  }

  const updateAllLocalizedIngredients = (update: (ingredients: LocalizedIngredientInput[]) => LocalizedIngredientInput[]) => {
    setLocalizedContent((current) => ({
      en: { ...current.en, ingredients: update(current.en.ingredients) },
      de: { ...current.de, ingredients: update(current.de.ingredients) },
      it: { ...current.it, ingredients: update(current.it.ingredients) },
    }))
  }

  const updateIngredientUnit = (language: Language, index: number, unit: string) => {
    if (unit === "custom") {
      updateLocalizedIngredient(language, index, { unit })
      return
    }

    updateAllLocalizedIngredients((current) =>
      current.map((ingredient, itemIndex) =>
        itemIndex === index ? { ...ingredient, unit } : ingredient))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const parseTranslation = (language: Language): RecipeTranslation => ({
      title: localizedContent[language].title.trim(),
      category: localizedContent[language].category.trim(),
      description: localizedContent[language].description.trim(),
      tip: localizedContent[language].tip.trim(),
      ingredients: localizedContent[language].ingredients.map((ingredient) => ({
        name: ingredient.name.trim(),
        unit: (ingredient.unit === "custom" ? ingredient.customUnit : ingredient.unit).trim(),
      })),
      instructions: localizedContent[language].instructions.map((instruction) => instruction.trim()),
    })
    const translations = {
      en: parseTranslation("en"),
      de: parseTranslation("de"),
      it: parseTranslation("it"),
    }
    const parsedIngredients = ingredients.map((ingredient, index) => ({
      ...translations.en.ingredients[index],
      amount: Number(ingredient.amount),
    }))
    const invalidTranslation = FORM_LANGUAGES.some((language) => {
      const translation = translations[language]
      return !translation.title || !translation.category || !translation.description || !translation.tip ||
        translation.ingredients.some((ingredient) => !ingredient.name) ||
        localizedContent[language].ingredients.some((ingredient) =>
          ingredient.unit === "custom" && !ingredient.customUnit.trim()) ||
        translation.instructions.length === 0 ||
        translation.instructions.some((instruction) => !instruction)
    })
    if (invalidTranslation ||
      parsedIngredients.some((ingredient, index) =>
        !ingredients[index].amount.trim() || !Number.isFinite(ingredient.amount) || ingredient.amount < 0) ||
      !cookTime.trim() || !Number.isFinite(Number(cookTime)) || Number(cookTime) < 0 ||
      !servings.trim() || !Number.isFinite(Number(servings)) || Number(servings) <= 0) {
      setError(t("form.validationError"))
      return
    }
    if (imageRequired && !image) {
      setError(t("form.chooseImage"))
      return
    }
    if (image && (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size === 0 || image.size > 5 * 1024 * 1024)) {
      setError(t("form.imageError"))
      return
    }

    setBusy(true)
    onBusyChange?.(true)
    try {
      await onSave({
        title: translations.en.title,
        category: translations.en.category,
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        description: translations.en.description,
        tip: translations.en.tip,
        ingredients: parsedIngredients,
        instructions: translations.en.instructions,
        translations,
      }, image)
    } catch (err) {
      console.error("Recipe save failed:", err)
      setError(err instanceof Error && err.message.includes("after the image was uploaded.")
        ? err.message
        : errorMessage)
    } finally {
      setBusy(false)
      onBusyChange?.(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <p className="text-sm text-gray-600">{t("form.translationHint")}</p>
      {FORM_LANGUAGES.map((language) => {
        const content = localizedContent[language]
        return (
          <fieldset key={language} className="space-y-4 rounded-md border p-4 bg-gray-50">
            <legend className="px-2 font-semibold">
              {LANGUAGE_NAMES[language]} <LanguageFlag language={language} />
            </legend>
            <div>
              <Label htmlFor={`${language}-recipe-title`}>{t("form.title")}</Label>
              <Input id={`${language}-recipe-title`} required maxLength={200} value={content.title} onChange={(event) => setLocalizedContent((current) => ({ ...current, [language]: { ...current[language], title: event.target.value } }))} />
            </div>
            <div>
              <Label htmlFor={`${language}-recipe-category`}>{t("form.category")}</Label>
              <Input id={`${language}-recipe-category`} required maxLength={100} value={content.category} onChange={(event) => setLocalizedContent((current) => ({ ...current, [language]: { ...current[language], category: event.target.value } }))} />
            </div>
            <div>
              <Label htmlFor={`${language}-recipe-description`}>{t("form.description")}</Label>
              <Textarea id={`${language}-recipe-description`} required maxLength={2000} value={content.description} onChange={(event) => setLocalizedContent((current) => ({ ...current, [language]: { ...current[language], description: event.target.value } }))} />
            </div>
            <div>
              <Label htmlFor={`${language}-recipe-tip`}>{t("form.tip")}</Label>
              <Textarea id={`${language}-recipe-tip`} required maxLength={1000} value={content.tip} onChange={(event) => setLocalizedContent((current) => ({ ...current, [language]: { ...current[language], tip: event.target.value } }))} />
            </div>
            <fieldset className="space-y-3">
              <legend className="font-medium">{t("form.ingredients")}</legend>
              {content.ingredients.map((ingredient, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[minmax(0,1.3fr)_7rem_minmax(0,1.2fr)_auto] items-center">
                  <Input
                    aria-label={`${LANGUAGE_NAMES[language]} ${t("form.ingredients")} ${index + 1} ${t("form.ingredientName")}`}
                    placeholder={t("form.ingredientName")}
                    required
                    value={ingredient.name}
                    onChange={(event) => updateLocalizedIngredient(language, index, { name: event.target.value })}
                  />
                  <Input
                    aria-label={`${LANGUAGE_NAMES[language]} ${t("form.amount")} ${index + 1}`}
                    placeholder={t("form.amount")}
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={ingredients[index].amount}
                    onChange={(event) => setIngredients((current) =>
                      current.map((entry, itemIndex) => itemIndex === index ? { amount: event.target.value } : entry))}
                  />
                  <div className="space-y-2">
                    <select
                      aria-label={`${LANGUAGE_NAMES[language]} ${t("form.ingredients")} ${index + 1} ${t("form.unit")}`}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      value={ingredient.unit}
                      onChange={(event) => updateIngredientUnit(language, index, event.target.value)}
                    >
                      <option value="">{t("form.unit")}</option>
                      {UNIT_OPTIONS.map((unit) => <option key={unit} value={unit}>{translateIngredientUnit(unit, language)}</option>)}
                      <option value="custom">{t("form.custom")}</option>
                    </select>
                    {ingredient.unit === "custom" && (
                      <Input
                        aria-label={`${LANGUAGE_NAMES[language]} ${t("form.ingredients")} ${index + 1} ${t("form.customUnit")}`}
                        placeholder={t("form.customUnit")}
                        required
                        value={ingredient.customUnit}
                        onChange={(event) => updateLocalizedIngredient(language, index, { customUnit: event.target.value })}
                      />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`${t("form.remove")} ${t("form.ingredientName")} ${index + 1} (${LANGUAGE_NAMES[language]})`}
                    disabled={ingredients.length === 1}
                    onClick={() => {
                      setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))
                      updateAllLocalizedIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIngredients((current) => [...current, { amount: "" }])
                  updateAllLocalizedIngredients((current) => [...current, { name: "", unit: "", customUnit: "" }])
                }}
              >
                {t("form.addIngredient")}
              </Button>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-medium">{t("form.instructions")}</legend>
              {content.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    aria-label={`${LANGUAGE_NAMES[language]} ${t("form.instructions")} ${index + 1}`}
                    required
                    value={instruction}
                    onChange={(event) => setLocalizedContent((current) => ({
                      ...current,
                      [language]: {
                        ...current[language],
                        instructions: current[language].instructions.map((entry, itemIndex) =>
                          itemIndex === index ? event.target.value : entry),
                      },
                    }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`${t("form.remove")} ${t("form.instructions")} ${index + 1} (${LANGUAGE_NAMES[language]})`}
                    disabled={content.instructions.length === 1}
                    onClick={() => setLocalizedContent((current) => ({
                      ...current,
                      [language]: {
                        ...current[language],
                        instructions: current[language].instructions.filter((_, itemIndex) => itemIndex !== index),
                      },
                    }))}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocalizedContent((current) => ({
                  ...current,
                  [language]: { ...current[language], instructions: [...current[language].instructions, ""] },
                }))}
              >
                {t("form.addInstruction")}
              </Button>
            </fieldset>
          </fieldset>
        )
      })}
      <div>
        <Label htmlFor="recipe-cook-time">{t("form.cookingTime")}</Label>
        <Input id="recipe-cook-time" type="number" min="0" step="1" required value={cookTime} onChange={(event) => setCookTime(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-servings">{t("form.servings")}</Label>
        <Input id="recipe-servings" type="number" min="1" step="1" required value={servings} onChange={(event) => setServings(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-difficulty">{t("form.difficulty")}</Label>
        <select id="recipe-difficulty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="Easy">{t("difficulty.easy")}</option><option value="Medium">{t("difficulty.medium")}</option><option value="Hard">{t("difficulty.hard")}</option>
        </select>
      </div>
      <div>
        <Label htmlFor="recipe-image">
          {imageRequired ? t("form.image") : t("form.replaceImage")}
        </Label>
        <Input id="recipe-image" type="file" accept="image/jpeg,image/png,image/webp" required={imageRequired} onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy ? savingLabel : submitLabel}</Button>
        {onCancel && <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>{t("form.cancel")}</Button>}
      </div>
    </form>
  )
}
