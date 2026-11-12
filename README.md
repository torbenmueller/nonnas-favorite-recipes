# Nonna's Favorite Recipes

The site uses Next.js static export and Cloud Firestore. STRATO serves the
exported files; browsers fetch recipes directly from Firestore. Administrators
can sign in and add recipes and images from the website.

## Set up Firebase

1. Create a Firebase project, register a web app, and create a Cloud Firestore
   database. Choose the database location carefully; it is separate from the
   STRATO hosting location.
2. Enable the Email/Password sign-in provider under Firebase Authentication
   and manually create an administrator user in the Firebase console.
   Authentication's enabled email/password provider can also permit public
   account creation through Firebase APIs; the app does not expose sign-up.
   The allowlist below, not the absence of a sign-up page, protects writes.
3. Set up Firebase Storage and create the default bucket. Check current Firebase
   Storage billing requirements and quotas before enabling it.
4. In **both** `firestore.rules` and `storage.rules`, replace the empty list
   in `request.auth.token.email in []` with the exact administrator email
   addresses, for example `in ['admin@example.com']`. Keep both lists
   identical. An empty list denies all writes.
5. Publish `firestore.rules` in the Firestore **Rules** tab and
   `storage.rules` in the Storage **Rules** tab. Recipe data and images are
   publicly readable. Only signed-in users with a verified email on the
   allowlist can create recipes and upload JPEG, PNG, or WebP images up to
   5 MiB. Browser updates and deletes are denied; use the Firebase console
   to edit or delete existing data. Do not use test-mode rules in production.
6. Copy `.env.example` to `.env.local` and fill in the web app configuration
   values from Firebase project settings. These `NEXT_PUBLIC_` values are
   embedded in the site when it is built and are not secrets. Never put a
   service-account key in these variables or in the repository.
   Set `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` to the bucket name shown in
   Firebase Storage (without `gs://`).
7. In Firebase Authentication settings, add the production domain and any
   local development domain to **Authorized domains**. Start the app, open
   **New Recipe**, and sign in with the administrator account. If the email
   is not verified, use the verification button, open the email link, then
   sign out and back in. Firebase must be able to send verification emails.

Administrators should use strong passwords and secure their Firebase/Google
accounts. Security Rules are the access-control boundary; client-side checks
do not grant permission. Removing an email from both rules revokes its write
access after the updated rules are published.

## Adding recipes

After Firebase setup, use **New Recipe** to sign in and create recipes.
There is no need to import any initial recipes. Recipe data is stored in the
Firestore `recipes` collection; browser-created recipes use generated string
document IDs that match their `id` field.

Recipe fields `title`, `category`, `image`, `difficulty`, and `description` are
strings; `cookTime` and `servings` are numbers; `ingredients` is an array of
maps with `name` (string), `amount` (number), and `unit` (string);
`instructions` is an array of strings. Images can use paths in `public`
or suitable public image URLs. Images uploaded through the form are stored in
Firebase Storage. Their download URLs are public; do not upload private images.
If an image uploads but saving the recipe fails, the page reports this and
the unused image may need to be removed in the Storage console. Deleting a
recipe in the console does not automatically delete its image.

## Develop and deploy

```powershell
npm install --legacy-peer-deps
npm run dev
npm run build
npm test
```

The peer-dependency flag is needed because the project's existing
`react-day-picker` and `date-fns` versions have conflicting peer requirements.
After a successful build, upload the **contents** of `out` to the document root
of the STRATO domain, including the `_next` and `images` directories. Enable
HTTPS on the domain. The build must have the Firebase environment variables
set; changing them requires rebuilding and uploading again.

Recipe links use `/recipe/?id=<id>`, so recipes added later can be opened
without rebuilding the site. A browser reload fetches the latest recipe data.
Firebase usage is subject to its quotas and pricing.
