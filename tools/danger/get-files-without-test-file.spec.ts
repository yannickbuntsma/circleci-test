import { getFilesWithoutTestFile } from './get-files-without-test-file'

const testList = [
  'packages/products/src/LensPacks/__snapshots__/LensPacks.spec.tsx.snap',
  'packages/products/src/LensPacks/LensPackItem.tsx',
  'packages/products/src/LensPacks/LensPacks.spec.tsx',
  'packages/products/src/LensPacks/LensPacks.tsx',
  'packages/products/src/SSP/__snapshots__/SSP.spec.tsx.snap',
  'packages/products/src/SSP/SSP.spec.tsx',
  'packages/products/src/SSP/SSP.tsx',
  'packages/products/src/SSP/utils.ts',
  'packages/server/src/sitemap/products-sitemap.ts',
  'packages/stores/src/Util/index.ts',
]

describe('getFilesWithoutTestFile', () => {
  const filteredList = getFilesWithoutTestFile(testList)

  it('should return the paths of files without a corresponding test file in the list', () => {
    expect(filteredList).toEqual([
      'packages/products/src/LensPacks/LensPackItem.tsx',
      'packages/products/src/SSP/utils.ts',
      'packages/server/src/sitemap/products-sitemap.ts',
    ])
  })

  it('should not return index files', () => {
    expect(filteredList).not.toContain('index')
  })

  it('should not return snapshot files', () => {
    expect(filteredList).not.toContain('.snap')
  })

  it('should not return test files, only source files', () => {
    expect(filteredList).not.toContain('.spec.')
  })
})
