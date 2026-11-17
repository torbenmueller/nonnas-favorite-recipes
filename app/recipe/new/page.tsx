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
import { useLanguage } from "@/lib/i18n"

export default function NewRecipePage() {
  const { t } = useLanguage()
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
        setError(t("new.firebaseError"))
        setAuthLoading(false)
      })
    } catch (err) {
      console.error("Authentication configuration error:", err)
      setError(t("new.firebaseConfigError"))
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
      setError(t("new.signInError"))
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
      setError(t("new.signOutError"))
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
      setMessage(t("new.verificationSent"))
    } catch (err) {
      console.error("Verification email failed:", err)
      setError(t("new.verificationError"))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-700 underline">{t("new.back")}</Link>
        <h1 className="text-3xl font-bold my-6">{t("new.title")}</h1>
        {error && <p role="alert" className="text-red-700 mb-4">{error}</p>}
        {message && <p role="status" className="text-green-700 mb-4">{message}</p>}
        {authLoading ? <p role="status">{t("new.checking")}</p> : !user ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <p>{t("new.signInPrompt")}</p>
            <div><Label htmlFor="email">{t("new.email")}</Label><Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label htmlFor="password">{t("new.password")}</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button disabled={busy} type="submit">{busy ? t("new.signingIn") : t("new.signIn")}</Button>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <p>{t("new.signedInAs")} {user.email}</p>
              <Button type="button" variant="outline" disabled={busy} onClick={handleSignOut}>{t("new.signOut")}</Button>
            </div>
            {!user.emailVerified ? (
              <div className="space-y-4">
                <p>{t("new.verifyPrompt")}</p>
                <Button type="button" disabled={busy} onClick={handleVerification}>{t("new.sendVerification")}</Button>
              </div>
            ) : (
              <RecipeForm
                imageRequired
                submitLabel={t("new.saveRecipe")}
                savingLabel={t("new.savingRecipe")}
                errorMessage={t("new.saveError")}
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
