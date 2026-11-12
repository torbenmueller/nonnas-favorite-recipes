import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

function getFirebaseApp() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error("Firebase configuration is missing. See the Firebase setup instructions.")
  }

  return getApps().length ? getApp() : initializeApp(config)
}

export function getRecipeDatabase() {
  return getFirestore(getFirebaseApp())
}

export function getRecipeAuth() {
  return getAuth(getFirebaseApp())
}

export function getRecipeStorage() {
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  if (!bucket) throw new Error("Firebase Storage configuration is missing. See the Firebase setup instructions.")
  return getStorage(getFirebaseApp(), `gs://${bucket}`)
}
