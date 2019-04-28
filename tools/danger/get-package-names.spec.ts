import { getPackageNames } from './get-package-names'
import { mockTouchedFileSet } from './__test-data'

describe('getPackageNames', () => {
  it('should return the package names of the files in the list', () => {
    expect(getPackageNames(mockTouchedFileSet)).toEqual([
      'api-client',
      'bloomreach',
      'server',
      'stores',
    ])
  })
})
