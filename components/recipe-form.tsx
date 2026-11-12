"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type Recipe } from "@/lib/recipes"

type IngredientInput = { name: string; amount: string; unit: string; customUnit: string }
type RecipeData = Omit<Recipe, "id" | "image">

const UNIT_OPTIONS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pinch", "whole"]

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
  const [title, setTitle] = useState(recipe?.title ?? "")
  const [category, setCategory] = useState(recipe?.category ?? "")
  const [cookTime, setCookTime] = useState(recipe ? String(recipe.cookTime) : "")
  const [servings, setServings] = useState(recipe ? String(recipe.servings) : "")
  const [difficulty, setDifficulty] = useState(recipe?.difficulty ?? "Easy")
  const [description, setDescription] = useState(recipe?.description ?? "")
  const [ingredients, setIngredients] = useState<IngredientInput[]>(recipe
    ? recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: String(ingredient.amount),
      unit: UNIT_OPTIONS.includes(ingredient.unit) ? ingredient.unit : "custom",
      customUnit: UNIT_OPTIONS.includes(ingredient.unit) ? "" : ingredient.unit,
    }))
    : [{ name: "", amount: "", unit: "", customUnit: "" }])
  const [instructions, setInstructions] = useState(recipe?.instructions ?? [""])
  const [image, setImage] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const parsedIngredients = ingredients.map((ingredient) => ({
      name: ingredient.name.trim(),
      amount: Number(ingredient.amount),
      unit: (ingredient.unit === "custom" ? ingredient.customUnit : ingredient.unit).trim(),
    }))
    const parsedInstructions = instructions.map((instruction) => instruction.trim())
    if (!title.trim() || !category.trim() || !description.trim() ||
      parsedIngredients.some((ingredient, index) => !ingredient.name ||
        !ingredients[index].amount.trim() ||
        !Number.isFinite(ingredient.amount) ||
        ingredient.amount < 0 ||
        (ingredients[index].unit === "custom" && !ingredient.unit)) ||
      parsedInstructions.some((instruction) => !instruction) ||
      !cookTime.trim() || !Number.isFinite(Number(cookTime)) || Number(cookTime) < 0 ||
      !servings.trim() || !Number.isFinite(Number(servings)) || Number(servings) <= 0) {
      setError("Please complete all recipe fields with valid values.")
      return
    }
    if (imageRequired && !image) {
      setError("Choose a recipe image.")
      return
    }
    if (image && (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size === 0 || image.size > 5 * 1024 * 1024)) {
      setError("Choose a JPEG, PNG, or WebP image no larger than 5 MiB.")
      return
    }

    setBusy(true)
    onBusyChange?.(true)
    try {
      await onSave({
        title: title.trim(),
        category: category.trim(),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        description: description.trim(),
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
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
      <div>
        <Label htmlFor="recipe-title">Title</Label>
        <Input id="recipe-title" required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-category">Category</Label>
        <Input id="recipe-category" required maxLength={100} value={category} onChange={(event) => setCategory(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-description">Description</Label>
        <Textarea id="recipe-description" required maxLength={2000} value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-cook-time">Cooking time (minutes)</Label>
        <Input id="recipe-cook-time" type="number" min="0" step="1" required value={cookTime} onChange={(event) => setCookTime(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-servings">Servings</Label>
        <Input id="recipe-servings" type="number" min="1" step="1" required value={servings} onChange={(event) => setServings(event.target.value)} />
      </div>
      <div>
        <Label htmlFor="recipe-difficulty">Difficulty</Label>
        <select id="recipe-difficulty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
      </div>
      <div>
        <Label htmlFor="recipe-image">
          {imageRequired ? "Recipe image (JPEG, PNG or WebP, max 5 MiB)" : "Replace image (optional; JPEG, PNG or WebP, max 5 MiB)"}
        </Label>
        <Input id="recipe-image" type="file" accept="image/jpeg,image/png,image/webp" required={imageRequired} onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
      </div>
      <fieldset className="space-y-3">
        <legend className="font-semibold">Ingredients</legend>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-4">
            <Input aria-label={`Ingredient ${index + 1} name`} placeholder="Name" required value={ingredient.name} onChange={(event) => setIngredients(ingredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, name: event.target.value } : entry))} />
            <Input aria-label={`Ingredient ${index + 1} amount`} placeholder="Amount" type="number" min="0" step="any" required value={ingredient.amount} onChange={(event) => setIngredients(ingredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, amount: event.target.value } : entry))} />
            <div className="space-y-2">
              <select
                aria-label={`Ingredient ${index + 1} unit`}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                value={ingredient.unit && !UNIT_OPTIONS.includes(ingredient.unit) ? "custom" : ingredient.unit}
                onChange={(event) => setIngredients(ingredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, unit: event.target.value } : entry))}
              >
                <option value="">Unit</option>
                {UNIT_OPTIONS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                <option value="custom">Custom...</option>
              </select>
              {ingredient.unit === "custom" && (
                <Input
                  aria-label={`Ingredient ${index + 1} custom unit`}
                  placeholder="Custom unit (e.g. oz)"
                  required
                  value={ingredient.customUnit}
                  onChange={(event) => setIngredients(ingredients.map((entry, itemIndex) => itemIndex === index ? { ...entry, customUnit: event.target.value } : entry))}
                />
              )}
            </div>
            <Button type="button" variant="outline" disabled={ingredients.length === 1} onClick={() => setIngredients(ingredients.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setIngredients([...ingredients, { name: "", amount: "", unit: "", customUnit: "" }])}>Add ingredient</Button>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="font-semibold">Instructions</legend>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2">
            <Textarea aria-label={`Instruction ${index + 1}`} required value={instruction} onChange={(event) => setInstructions(instructions.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))} />
            <Button type="button" variant="outline" disabled={instructions.length === 1} onClick={() => setInstructions(instructions.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setInstructions([...instructions, ""])}>Add instruction</Button>
      </fieldset>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy ? savingLabel : submitLabel}</Button>
        {onCancel && <Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
