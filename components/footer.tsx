import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export function Footer() {
  const currentYear = format(new Date(), 'yyyy')

  return (
    <footer className="bg-gradient-to-r from-amber-100 to-orange-200 border-t-2 border-orange-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nonna's Favorite Recipes</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bringing authentic Italian recipes from our family to yours. Discover the true flavors of Italy with
              traditional recipes passed down through generations.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/?category=Pasta" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Pasta Recipes
                </Link>
              </li>
              <li>
                <Link href="/?category=Pizza" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Pizza Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Desserts"
                  className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                >
                  Italian Desserts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                  Cooking Tips
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
                <span className="text-gray-600 text-sm">info@nonnasfavorites.com</span>
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

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Stay Updated</h4>
            <p className="text-gray-600 text-sm">Subscribe to our newsletter for new recipes and cooking tips!</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 border border-orange-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-orange-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">© {currentYear} Nonna's Favorite Recipes. All rights reserved.</div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                Cookie Policy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">
                Legal Notice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
