import { splitPath } from './split-path'
import { mockTouchedFileSet } from './__test-data'

describe('splitPath', () => {
  it('should return an object with the correct dirname, filename, extension and params', () => {
    mockTouchedFileSet.forEach((filePath, index) => {
      expect(splitPath(filePath)).toEqual(results[index])

      const restructuredFilePath = Object.values(splitPath(filePath)).join('')
      expect(restructuredFilePath).toEqual(filePath)
    })
  })
})

const results = [
  { dirname: '', filename: 'package', extension: '.json', params: '' },
  { dirname: 'packages/api-client/src/', filename: 'index', extension: '.ts', params: '' },
  {
    dirname: 'packages/bloomreach/src/types/',
    filename: 'bloomreach',
    extension: '.ts',
    params: '',
  },
  { dirname: 'packages/server/', filename: 'package', extension: '.json', params: '' },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'cms-sitemap.spec',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'cms-sitemap',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'create-sitemap',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'products-sitemap.spec',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'products-sitemap',
    extension: '.ts',
    params: '',
  },
  { dirname: 'packages/stores/src/Util/', filename: 'index', extension: '.ts', params: '' },
  { dirname: 'packages/api-client/src/stores/', filename: 'index', extension: '.ts', params: '' },
  { dirname: 'packages/api-client/src/stores/', filename: 'specs', extension: '.ts', params: '' },
  {
    dirname: 'packages/api-client/src/stores/',
    filename: 'stores-sitemap.spec',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/api-client/src/stores/',
    filename: 'stores-sitemap',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/api-client/src/stores/',
    filename: 'towns.spec',
    extension: '.ts',
    params: '',
  },
  { dirname: 'packages/api-client/src/stores/', filename: 'towns', extension: '.ts', params: '' },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'stores-sitemap.spec',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/server/src/sitemap/',
    filename: 'stores-sitemap',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/stores/src/Util/',
    filename: 'normalize-town-name.spec',
    extension: '.ts',
    params: '',
  },
  {
    dirname: 'packages/stores/src/Util/',
    filename: 'normalize-town-name',
    extension: '.ts',
    params: '',
  },
]
