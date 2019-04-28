import { hasCorrectScope, hasCorrectSyntax } from './pr-title-validators'
import {
  mockTitlesCorrect,
  mockTitlesIncorrectScope,
  mockTitlesIncorrectSyntax,
} from './__test-data'

const passTitle = 'should return TRUE if PR title PASSES'
const failTitle = 'should return FALSE if PR title FAILS'

describe('PR title validators', () => {
  describe('hasCorrectScope', () => {
    it(passTitle, () => {
      mockTitlesCorrect.forEach(({ title, scope }) => {
        expect(hasCorrectScope(title, scope)).toBeTruthy()
      })
    })

    it(failTitle, () => {
      mockTitlesIncorrectScope.forEach(({ title, scope }) => {
        expect(hasCorrectScope(title, scope)).not.toBeTruthy()
      })
    })
  })

  describe('hasCorrectSyntax', () => {
    it(passTitle, () => {
      mockTitlesCorrect.forEach(({ title }) => {
        expect(hasCorrectSyntax(title)).toBeTruthy()
      })
    })

    it(failTitle, () => {
      mockTitlesIncorrectSyntax.forEach((title) => {
        expect(hasCorrectSyntax(title)).not.toBeTruthy()
      })
    })
  })
})
