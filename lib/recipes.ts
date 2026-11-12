import { z } from "zod"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { getRecipeDatabase, getRecipeStorage } from "@/lib/firebase"

const recipeSchema = z.object({
  id: z.union([z.number().int().positive(), z.string().regex(/^[A-Za-z0-9_-]+$/)]),
  title: z.string().min(1),
  category: z.string().min(1),
  image: z.string().min(1),
  cookTime: z.number().nonnegative(),
  servings: z.number().positive(),
  difficulty: z.string().min(1),
  description: z.string(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    amount: z.number().nonnegative(),
    unit: z.string(),
  })),
  instructions: z.array(z.string()),
})

export type Recipe = z.infer<typeof recipeSchema>

function parseRecipe(documentId: string, data: unknown): Recipe {
  const recipe = recipeSchema.parse(data)
  if (String(recipe.id) !== documentId) {
    throw new Error(`Recipe document ${documentId} has a mismatched id`)
  }
  return recipe
}

export async function getRecipes(): Promise<Recipe[]> {
  const snapshot = await getDocs(collection(getRecipeDatabase(), "recipes"))
  return snapshot.docs.map((item) => parseRecipe(item.id, item.data())).sort((a, b) => {
    if (typeof a.id === "number" && typeof b.id === "number") return a.id - b.id
    if (typeof a.id === "number") return -1
    if (typeof b.id === "number") return 1
    return a.title.localeCompare(b.title)
  })
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) return null
  const snapshot = await getDoc(doc(getRecipeDatabase(), "recipes", id))
  return snapshot.exists() ? parseRecipe(snapshot.id, snapshot.data()) : null
}

export async function createRecipe(data: Omit<Recipe, "id" | "image">, image: File, userId: string): Promise<string> {
  const document = doc(collection(getRecipeDatabase(), "recipes"))
  const imageRef = ref(getRecipeStorage(), `recipe-images/${userId}/${document.id}`)
  const recipe = recipeSchema.parse({ ...data, id: document.id, image: "pending" })
  await uploadBytes(imageRef, image, { contentType: image.type })
  try {
    recipe.image = await getDownloadURL(imageRef)
    await setDoc(document, recipe)
  } catch (error) {
    console.error("Recipe save failed after image upload; the uploaded image may need removal in Firebase Storage:", imageRef.fullPath, error)
    throw new Error("The recipe could not be saved after the image was uploaded. Check Firebase permissions and remove any unused image in Storage before retrying.", { cause: error })
  }
  return document.id
}

export async function updateRecipe(
  id: string,
  data: Omit<Recipe, "id" | "image">,
  currentImage: string,
  image: File | null,
  userId: string,
): Promise<Recipe> {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
    throw new Error("Invalid recipe id")
  }

  const document = doc(getRecipeDatabase(), "recipes", id)
  const recipe = recipeSchema.parse({ ...data, id, image: currentImage })
  let uploadedImageRef: ReturnType<typeof ref> | undefined

  if (image) {
    const imageDocument = doc(collection(getRecipeDatabase(), "recipe-images"))
    uploadedImageRef = ref(getRecipeStorage(), `recipe-images/${userId}/${imageDocument.id}`)
    await uploadBytes(uploadedImageRef, image, { contentType: image.type })
    recipe.image = await getDownloadURL(uploadedImageRef)
  }

  try {
    await updateDoc(document, recipe)
  } catch (error) {
    if (uploadedImageRef) {
      console.error("Recipe update failed after image upload; the uploaded image may need removal in Firebase Storage:", uploadedImageRef.fullPath, error)
      throw new Error("The recipe could not be updated after the image was uploaded. Check Firebase permissions and remove any unused image in Storage before retrying.", { cause: error })
    }
    throw error
  }

  return recipe
}
