"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type Ingredient = {
  name: string
  amount: number | string
  unit: string
}

type Instruction = string

export default function NewRecipePage() {
  const router = useRouter()
  
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [cookTime, setCookTime] = useState<number | string>("")
  const [servings, setServings] = useState<number | string>("")
  const [difficulty, setDifficulty] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: "", unit: "g" }])
  const [instructions, setInstructions] = useState<Instruction[]>([""])
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }])
  }

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    setIngredients(newIngredients)
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const handleRemoveInstruction = (index: number) => {
    const newInstructions = [...instructions]
    newInstructions.splice(index, 1)
    setInstructions(newInstructions)
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real app, you would upload the image and get a URL
      // For now, we'll just use a placeholder
      const imageUrl = "/images/placeholder.jpg"
      
      const newRecipe = {
        id: Date.now(), // Temporary ID, in a real app this would come from the server
        title,
        category,
        image: imageUrl,
        cookTime: Number(cookTime),
        servings: Number(servings),
        difficulty,
        description,
        ingredients: ingredients.filter(i => i.name.trim() !== ""),
        instructions: instructions.filter(i => i.trim() !== "")
      }
      
      // In a real app, you would send this to your API
      console.log("New Recipe:", newRecipe)
      
      // Redirect to the new recipe page
      router.push(`/recipe/${newRecipe.id}`)
    } catch (error) {
      console.error("Error creating recipe:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Add New Recipe</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Spaghetti Carbonara"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Pasta, Dessert, etc."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    min="1"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select onValueChange={setDifficulty} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of the recipe..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="image">Recipe Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            
            {/* Ingredients */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ingredients</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>
              
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="grid grid-cols-5 gap-2 flex-1">
                      <div className="col-span-2">
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) => 
                            handleIngredientChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => 
                          handleIngredientChange(index, "amount", e.target.value)
                        }
                      />
                      <Select
                        value={ingredient.unit}
                        onValueChange={(value) => 
                          handleIngredientChange(index, "unit", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="l">l</SelectItem>
                          <SelectItem value="tsp">tsp</SelectItem>
                          <SelectItem value="tbsp">tbsp</SelectItem>
                          <SelectItem value="cup">cup</SelectItem>
                          <SelectItem value="pinch">pinch</SelectItem>
                          <SelectItem value="whole">whole</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Instructions</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInstruction}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className="mt-2 text-sm font-medium text-gray-500">
                            {index + 1}.
                          </span>
                          <Textarea
                            placeholder={`Step ${index + 1}`}
                            value={instruction}
                            onChange={(e) => 
                              handleInstructionChange(index, e.target.value)
                            }
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                      {instructions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveInstruction(index)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Recipe"}
            </Button>
          </div>
        </form>
      </main>
      
    </div>
  )
}
