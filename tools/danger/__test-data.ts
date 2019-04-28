export const mockTitlesCorrect = [
  { title: `Chore(carts): new styling add to cart notification`, scope: ['carts'] },
  { title: `Feat(auth,checkout-v2): Add opt-ins to the checkout`, scope: ['auth', 'checkout-v2'] },
  { title: `Feat(elements,many): Add re-usable checkbox element`, scope: ['elements', 'many'] },
  {
    title: `Fix(checkout-v2): Allow consents from persisted state to be updated by props`,
    scope: ['checkout-v2'],
  },
  { title: `Fix(checkout-v2): Remove smooth scrolling`, scope: ['checkout-v2'] },
  { title: `Fix(layout): Appointment button pushed out of navbar`, scope: ['layout'] },
  { title: `Fix(search): Contact lenses bundle name in suggestions`, scope: ['search'] },
  {
    title: `Fix(state): set correct country prop and don't update consumers on every provider render`,
    scope: ['state'],
  },
  {
    title: `Fix(state): BREAKING set correct country prop and don't update consumers on every provider render`,
    scope: ['state'],
  },
]

export const mockTitlesIncorrectSyntax = [
  `Chore(carts):No space after colon`,
  `Fix:checkout-v2: Missing parentheses`,
  `Some random text`,
]

export const mockTitlesIncorrectScope = [
  { title: `Chore(carts):No space after colon`, scope: ['wrong'] },
  { title: `Whatever(auth,checkout-v2): Incorrect "feat/fix/..." prefix`, scope: ['wrong'] },
  { title: `Feat(whatever): Non-existing scope`, scope: ['wrong'] },
  { title: `Fix:checkout-v2: Missing parentheses`, scope: ['wrong'] },
]

export const mockWithRootFiles = [
  '.gitignore',
  '.prettierrc',
  'tools/build',
  'server/src/sitemap/products-sitemap.spec.ts',
  'packages/server/src/sitemap/products-sitemap.ts',
  'packages/stores/src/Util/index.ts',
  'packages/products/src/LensPacks/LensPacks.spec.tsx',
  'packages/products/src/LensPacks/LensPacks.tsx',
  'packages/products/src/LensPacks/__snapshots__/LensPacks.spec.tsx.snap',
  'packages/products/src/SSP/SSP.spec.tsx',
  'packages/products/src/SSP/SSP.tsx',
  'packages/products/src/SSP/__snapshots__/SSP.spec.tsx.snap',
  'packages/products/src/SSP/utils.ts',
]

export const mockTouchedFileSet = [
  'package.json',
  'packages/api-client/src/index.ts',
  'packages/bloomreach/src/types/bloomreach.ts',
  'packages/server/package.json',
  'packages/server/src/sitemap/cms-sitemap.spec.ts',
  'packages/server/src/sitemap/cms-sitemap.ts',
  'packages/server/src/sitemap/create-sitemap.ts',
  'packages/server/src/sitemap/products-sitemap.spec.ts',
  'packages/server/src/sitemap/products-sitemap.ts',
  'packages/stores/src/Util/index.ts',
  'packages/api-client/src/stores/index.ts',
  'packages/api-client/src/stores/specs.ts', // this one is tricky, so a good test candidate
  'packages/api-client/src/stores/stores-sitemap.spec.ts',
  'packages/api-client/src/stores/stores-sitemap.ts',
  'packages/api-client/src/stores/towns.spec.ts',
  'packages/api-client/src/stores/towns.ts',
  'packages/server/src/sitemap/stores-sitemap.spec.ts',
  'packages/server/src/sitemap/stores-sitemap.ts',
  'packages/stores/src/Util/normalize-town-name.spec.ts',
  'packages/stores/src/Util/normalize-town-name.ts',
]
