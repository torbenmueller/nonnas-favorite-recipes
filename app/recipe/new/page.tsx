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
import { RecipeForm } from "@/components/recipe-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRecipeAuth } from "@/lib/firebase"
import { createRecipe } from "@/lib/recipes"

export default function NewRecipePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
              <RecipeForm
                imageRequired
                submitLabel="Save recipe"
                savingLabel="Saving recipe..."
                errorMessage="Could not upload the image or save the recipe. Check that your verified email is allowed in both Firebase rules and try again."
                onBusyChange={setBusy}
                onSave={async (data, image) => {
                  if (!user || !image) throw new Error("A signed-in user and recipe image are required.")
                  setMessage("")
                  const id = await createRecipe(data, image, user.uid)
                  router.push(`/recipe/?id=${encodeURIComponent(id)}`)
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
