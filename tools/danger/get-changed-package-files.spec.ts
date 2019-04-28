import { mockWithRootFiles } from './__test-data'
import { getChangedPackageFiles } from './get-changed-package-files'

describe('getChangesPackageFiles', () => {
  it(`should return only the files from {{packageName}}/src/...`, () => {
    expect(getChangedPackageFiles(mockWithRootFiles)).toEqual([
      'packages/server/src/sitemap/products-sitemap.ts',
      'packages/products/src/LensPacks/LensPacks.spec.tsx',
      'packages/products/src/LensPacks/LensPacks.tsx',
      'packages/products/src/LensPacks/__snapshots__/LensPacks.spec.tsx.snap',
      'packages/products/src/SSP/SSP.spec.tsx',
      'packages/products/src/SSP/SSP.tsx',
      'packages/products/src/SSP/__snapshots__/SSP.spec.tsx.snap',
      'packages/products/src/SSP/utils.ts',
    ])
  })
})
