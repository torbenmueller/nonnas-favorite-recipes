"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getRecipeAuth } from "@/lib/firebase"
import { createRecipe } from "@/lib/recipes"

type IngredientInput = { name: string; amount: string; unit: string; customUnit?: string }

const UNIT_OPTIONS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pinch", "whole"] as const

export default function NewRecipePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState<IngredientInput[]>([{ name: "", amount: "", unit: "" }])
  const [instructions, setInstructions] = useState([""])
  const [image, setImage] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    try {
      return onAuthStateChanged(getRecipeAuth(), (currentUser) => {
        setUser(currentUser)
        setAuthLoading(false)
      }, (err) => {
        console.error("Authentication state could not be loaded:", err)
        setError("Could not check your sign-in. Please check the Firebase configuration and reload.")
        setAuthLoading(false)
      })
    } catch (err) {
      console.error("Authentication configuration error:", err)
      setError("Firebase is not configured. See the setup instructions.")
      setAuthLoading(false)
    }
  }, [])

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await signInWithEmailAndPassword(getRecipeAuth(), email.trim(), password)
      setPassword("")
    } catch (err) {
      console.error("Sign-in failed:", err)
      setError("Sign-in failed. Check your credentials and Firebase Authentication configuration.")
    } finally {
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await signOut(getRecipeAuth())
    } catch (err) {
      console.error("Sign-out failed:", err)
      setError("Could not sign out. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  const handleVerification = async () => {
    if (!user) return
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await sendEmailVerification(user)
      setMessage("Verification email sent. Open the link, then sign out and sign in again.")
    } catch (err) {
      console.error("Verification email failed:", err)
      setError("Could not send the verification email. Check Firebase Authentication settings and try again.")
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !image) return
    setError("")
    setMessage("")
    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size === 0 || image.size > 5 * 1024 * 1024) {
      setError("Choose a JPEG, PNG, or WebP image no larger than 5 MiB.")
      return
    }
    const parsedIngredients = ingredients.map((item) => ({
      name: item.name.trim(),
      amount: Number(item.amount),
      unit: (item.unit === "custom" ? item.customUnit ?? "" : item.unit).trim(),
    }))
    const parsedInstructions = instructions.map((step) => step.trim())
    if (!title.trim() || !category.trim() || !description.trim() ||
      parsedIngredients.some((item, index) => !item.name || !ingredients[index].amount.trim() || !Number.isFinite(item.amount) || item.amount < 0 ||
        (ingredients[index].unit === "custom" && !item.unit)) ||
      parsedInstructions.some((step) => !step) ||
      !cookTime.trim() || !Number.isFinite(Number(cookTime)) || Number(cookTime) < 0 ||
      !servings.trim() || !Number.isFinite(Number(servings)) || Number(servings) <= 0) {
      setError("Please complete all recipe fields with valid values.")
      return
    }
    setBusy(true)
    try {
      const id = await createRecipe({
        title: title.trim(),
        category: category.trim(),
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        description: description.trim(),
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
      }, image, user.uid)
      router.push(`/recipe/?id=${encodeURIComponent(id)}`)
    } catch (err) {
      console.error("Recipe creation failed:", err)
      setError(err instanceof Error && err.message.startsWith("The recipe could not be saved after")
        ? err.message
        : "Could not upload the image or save the recipe. Check that your verified email is allowed in both Firebase rules and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-700 underline">Back to recipes</Link>
        <h1 className="text-3xl font-bold my-6">Add a recipe</h1>
        {error && <p role="alert" className="text-red-700 mb-4">{error}</p>}
        {message && <p role="status" className="text-green-700 mb-4">{message}</p>}
        {authLoading ? <p role="status">Checking sign-in...</p> : !user ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <p>Sign in with an administrator account to add recipes.</p>
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button disabled={busy} type="submit">{busy ? "Signing in..." : "Sign in"}</Button>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p>Signed in as {user.email}</p>
              <Button type="button" variant="outline" disabled={busy} onClick={handleSignOut}>Sign out</Button>
            </div>
            {!user.emailVerified ? (
              <div className="space-y-4">
                <p>Verify your email address before adding recipes. After verifying, sign out and sign in again.</p>
                <Button type="button" disabled={busy} onClick={handleVerification}>Send verification email</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div><Label htmlFor="title">Title</Label><Input id="title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div><Label htmlFor="category">Category</Label><Input id="category" required maxLength={100} value={category} onChange={(e) => setCategory(e.target.value)} /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" required maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div><Label htmlFor="cookTime">Cooking time (minutes)</Label><Input id="cookTime" type="number" min="0" step="1" required value={cookTime} onChange={(e) => setCookTime(e.target.value)} /></div>
                <div><Label htmlFor="servings">Servings</Label><Input id="servings" type="number" min="1" step="1" required value={servings} onChange={(e) => setServings(e.target.value)} /></div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select id="difficulty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div><Label htmlFor="image">Recipe image (JPEG, PNG or WebP, max 5 MiB)</Label><Input id="image" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(e) => setImage(e.target.files?.[0] ?? null)} /></div>
                <fieldset className="space-y-3">
                  <legend className="font-semibold">Ingredients</legend>
                  {ingredients.map((item, index) => (
                    <div key={index} className="grid gap-2 sm:grid-cols-4">
                      <Input aria-label={`Ingredient ${index + 1} name`} placeholder="Name" required value={item.name} onChange={(e) => setIngredients(ingredients.map((entry, i) => i === index ? { ...entry, name: e.target.value } : entry))} />
                      <Input aria-label={`Ingredient ${index + 1} amount`} placeholder="Amount" type="number" min="0" step="any" required value={item.amount} onChange={(e) => setIngredients(ingredients.map((entry, i) => i === index ? { ...entry, amount: e.target.value } : entry))} />
                      <div className="space-y-2">
                        <select
                          aria-label={`Ingredient ${index + 1} unit`}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          value={item.unit && !UNIT_OPTIONS.some((unit) => unit === item.unit) ? "custom" : item.unit}
                          onChange={(e) => setIngredients(ingredients.map((entry, i) => i === index ? { ...entry, unit: e.target.value } : entry))}
                        >
                          <option value="">Unit</option>
                          {UNIT_OPTIONS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                          <option value="custom">Custom...</option>
                        </select>
                        {item.unit === "custom" && (
                          <Input
                            aria-label={`Ingredient ${index + 1} custom unit`}
                            placeholder="Custom unit (e.g. oz)"
                            required
                            value={item.customUnit ?? ""}
                            onChange={(e) => setIngredients(ingredients.map((entry, i) => i === index ? { ...entry, customUnit: e.target.value } : entry))}
                          />
                        )}
                      </div>
                      <Button type="button" variant="outline" disabled={ingredients.length === 1} onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setIngredients([...ingredients, { name: "", amount: "", unit: "" }])}>Add ingredient</Button>
                </fieldset>
                <fieldset className="space-y-3">
                  <legend className="font-semibold">Instructions</legend>
                  {instructions.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea aria-label={`Instruction ${index + 1}`} required value={step} onChange={(e) => setInstructions(instructions.map((entry, i) => i === index ? e.target.value : entry))} />
                      <Button type="button" variant="outline" disabled={instructions.length === 1} onClick={() => setInstructions(instructions.filter((_, i) => i !== index))}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setInstructions([...instructions, ""])}>Add instruction</Button>
                </fieldset>
                <Button type="submit" disabled={busy}>{busy ? "Saving recipe..." : "Save recipe"}</Button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  )
}
