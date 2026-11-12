const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")
const typescript = require("typescript")

function loadRecipes(options = {}) {
  const calls = []
  const database = {}
  const storage = {}
  const firestore = {
    collection: () => ({ collection: "recipes" }),
    doc: (...args) => args.length === 1
      ? { id: "generatedRecipeId" }
      : { id: args[2] },
    getDoc: async (document) => {
      calls.push(["getDoc", document.id])
      return options.document ?? { exists: () => false }
    },
    getDocs: async () => ({ docs: options.documents ?? [] }),
    setDoc: async (document, recipe) => {
      calls.push(["setDoc", document.id, recipe])
      if (options.saveError) throw options.saveError
    },
    updateDoc: async (document, recipe) => {
      calls.push(["updateDoc", document.id, recipe])
      if (options.updateError) throw options.updateError
    },
  }
  const storageSdk = {
    ref: (_storage, name) => ({ fullPath: name }),
    uploadBytes: async (ref, file, metadata) => {
      calls.push(["uploadBytes", ref.fullPath, file, metadata])
      if (options.uploadError) throw options.uploadError
    },
    getDownloadURL: async () => "https://example.test/image",
  }
  const source = fs.readFileSync(path.join(__dirname, "..", "lib", "recipes.ts"), "utf8")
  const code = typescript.transpileModule(source, {
    compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 },
  }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    require: (id) => {
      if (id === "firebase/firestore") return firestore
      if (id === "firebase/storage") return storageSdk
      if (id === "@/lib/firebase") return { getRecipeDatabase: () => database, getRecipeStorage: () => storage }
      return require(id)
    },
    console: { error: (...args) => calls.push(["error", ...args]) },
  })
  return { ...exports, calls }
}

const recipe = {
  title: "Test recipe",
  category: "Pasta",
  cookTime: 20,
  servings: 4,
  difficulty: "Easy",
  description: "Test",
  ingredients: [{ name: "Pasta", amount: 100, unit: "g" }],
  instructions: ["Cook"],
}

test("creates a generated recipe and uploads its image before saving", async () => {
  const api = loadRecipes()
  const image = { type: "image/png" }
  assert.equal(await api.createRecipe(recipe, image, "user1"), "generatedRecipeId")
  assert.equal(api.calls[0][0], "uploadBytes")
  assert.equal(api.calls[0][1], "recipe-images/user1/generatedRecipeId")
  assert.equal(api.calls[1][0], "setDoc")
  assert.equal(api.calls[1][2].id, "generatedRecipeId")
  assert.equal(api.calls[1][2].image, "https://example.test/image")
})

test("does not save a document when image upload fails", async () => {
  const api = loadRecipes({ uploadError: new Error("upload denied") })
  await assert.rejects(api.createRecipe(recipe, {}, "user1"), /upload denied/)
  assert.equal(api.calls.some((call) => call[0] === "setDoc"), false)
})

test("reports a potentially orphaned image if saving fails", async () => {
  const api = loadRecipes({ saveError: new Error("permission denied") })
  await assert.rejects(api.createRecipe(recipe, {}, "user1"), /image was uploaded/)
  assert.equal(api.calls.some((call) => call[0] === "error"), true)
})

test("updates recipe details while retaining the current image", async () => {
  const api = loadRecipes()
  const updated = await api.updateRecipe("recipe_1", { ...recipe, title: "Updated recipe" }, "/current-image.jpg", null, "user1")
  assert.equal(updated.title, "Updated recipe")
  assert.equal(updated.image, "/current-image.jpg")
  assert.equal(api.calls[0][0], "updateDoc")
  assert.equal(api.calls[0][1], "recipe_1")
})

test("uploads a replacement image before updating the recipe", async () => {
  const api = loadRecipes()
  const image = { type: "image/png" }
  const updated = await api.updateRecipe("recipe_1", recipe, "/current-image.jpg", image, "user1")
  assert.equal(api.calls[0][0], "uploadBytes")
  assert.equal(api.calls[0][1], "recipe-images/user1/generatedRecipeId")
  assert.equal(api.calls[1][0], "updateDoc")
  assert.equal(updated.image, "https://example.test/image")
})

test("validates an update before uploading or writing", async () => {
  const api = loadRecipes()
  await assert.rejects(api.updateRecipe("recipe_1", { ...recipe, servings: 0 }, "/image.jpg", {}, "user1"))
  assert.equal(api.calls.length, 0)
})

test("validates a recipe before uploading", async () => {
  const api = loadRecipes()
  await assert.rejects(api.createRecipe({ ...recipe, servings: 0 }, {}, "user1"))
  assert.equal(api.calls.length, 0)
})

test("loads both imported numeric and generated IDs and rejects mismatched IDs", async () => {
  const api = loadRecipes({ documents: [
    { id: "generatedRecipeId", data: () => ({ ...recipe, id: "generatedRecipeId", image: "/image.jpg" }) },
    { id: "1", data: () => ({ ...recipe, id: 1, image: "/image.jpg" }) },
  ] })
  const recipes = await api.getRecipes()
  assert.deepEqual(Array.from(recipes, (item) => item.id), [1, "generatedRecipeId"])
  const invalid = loadRecipes({ document: { exists: () => true, id: "1", data: () => ({ ...recipe, id: 2, image: "/image.jpg" }) } })
  await assert.rejects(invalid.getRecipe("1"), /mismatched id/)
})

test("rejects malformed document paths without calling Firestore", async () => {
  const api = loadRecipes()
  assert.equal(await api.getRecipe("not/a/document"), null)
  assert.equal(api.calls.length, 0)
})
