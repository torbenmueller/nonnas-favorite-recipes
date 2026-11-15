import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { format } from "date-fns"
import { siFacebook, siInstagram, siX, siYoutube } from "simple-icons"
import { scrollToTop, scrollToTopOnNextNavigation } from "@/components/scroll-to-top-on-navigation"

interface FooterProps {
  onCategorySelect: (category: string) => void
}

export function Footer({ onCategorySelect }: FooterProps) {
  const currentYear = format(new Date(), 'yyyy')
  const pathname = usePathname()
  const router = useRouter()

  const selectCategory = (category: string) => {
    if (pathname === "/") {
      onCategorySelect(category)
      scrollToTop()
    } else {
      scrollToTopOnNextNavigation()
      router.push(`/?category=${encodeURIComponent(category)}`, { scroll: false })
    }
  }

  return (
    <footer className="bg-gradient-to-r from-amber-100 to-orange-200 border-t-2 border-orange-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nonna's Favorite Recipes</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bringing authentic Italian recipes from our family to yours. Discover the true flavors of Italy with
              traditional recipes passed down through generations.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/profile.php?id=100071947813879" target="_blank" className="text-gray-600 hover:text-orange-600 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siFacebook.path} /></svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/steve_vaii73/" target="_blank" className="text-gray-600 hover:text-orange-600 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siInstagram.path} /></svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://x.com/TorbenJan" target="_blank" className="text-gray-600 hover:text-orange-600 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siX.path} /></svg>
                <span className="sr-only">X</span>
              </Link>
              <Link href="https://www.youtube.com/@torbenjanmuller1485" target="_blank" className="text-gray-600 hover:text-orange-600 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={siYoutube.path} /></svg>
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors text-sm" onClick={(e) => {
                  e.preventDefault()
                  selectCategory("All")
                }}>
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipe/new" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Add a Recipe
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors text-sm" onClick={(e) => {
                  e.preventDefault()
                  selectCategory("Pasta")
                }}>
                  Pasta Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    selectCategory("Risotto")
                  }}
                >
                  Risotto Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    selectCategory("Antipasti")
                  }}
                >
                  Antipasti Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    selectCategory("Soups")
                  }}
                >
                  Italian Soups
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    selectCategory("Desserts")
                  }}
                >
                  Italian Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600 hover:text-orange-600 transition-colors text-sm"><a href="mailto:info@nonnas-favorite-recipes.com">info@nonnas-favorite-recipes.com</a></span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-600" />
                <span className="text-gray-600 text-sm">+49 151 284 720 59</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Am Hammershöfchen 23
                  <br />
                  45219 Essen, Germany
                </span>
              </div>
            </div>
          </div>

           {/* Legal Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Legal Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy-policy" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-and-conditions" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/imprint" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Stay Updated</h4>
            <p className="text-gray-600 text-sm">Subscribe to our newsletter for new recipes and cooking tips!</p>
            <form
              action="https://nonnas-favorite-recipes.us6.list-manage.com/subscribe/post?u=ab34b074927fdf20b97be28b5&amp;id=7f2ddad826&amp;f_id=001d5ee0f0"
              method="post"
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-2"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                name="EMAIL"
                placeholder="Your email address"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" required className="mt-1" />
                <span>
                  I agree to receive the newsletter and have read the{" "}
                  <Link className="link" href="/legal/privacy-policy">Privacy Policy</Link>.
                </span>
              </label>
              <div aria-hidden="true" className="absolute -left-[5000px]">
                <input type="text" name="b_ab34b074927fdf20b97be28b5_7f2ddad826" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-colors">
                Subscribe
              </button>
              <p className="text-xs text-gray-600">Mailchimp will open in a new tab to complete your signup.</p>
              <a href="http://eepurl.com/C8gAUoCryu" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg" alt="Intuit Mailchimp" width={220} height={40} />
              </a>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-orange-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-gray-600 text-sm">© {currentYear} Nonna's Favorite Recipes. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
