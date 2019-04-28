/**
 * If you want to add or change rules we have in this file, you can first test your changes locally
 * by following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-pr
 *
 * After you are satisfied with your changes, you can also have Danger place a comment on a PR by
 * following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-and-faking-being-on-a-ci
 */

import { danger, fail, markdown, message, warn } from 'danger'
import { getPackageNames, splitPath } from './tools/danger'
import { hasCorrectScope, hasCorrectSyntax } from './tools/danger'
import { getChangedPackageFiles } from './tools/danger/get-changed-package-files'
import { getFilesWithoutTestFile } from './tools/danger/get-files-without-test-file'

const pr = danger.github.pr

console.log(`Title:`, pr.title)

const modifiedFiles = danger.git.modified_files
const newFiles = danger.git.created_files
const touchedFiles = [...modifiedFiles, ...newFiles]

console.log(`touchedFiles`, touchedFiles)

const touchedPackages = getPackageNames(touchedFiles)

/**
 * Warn when PR titles doesn't match the convention
 */
// Incorrect scope between the parentheses
if (hasCorrectScope(pr.title, touchedPackages)) {
  fail(':no_entry: PR title does not have the correct scope')
}
// Incorrect general syntax (formatting)
if (hasCorrectSyntax(pr.title)) {
  fail(':no_entry: PR title does not have the correct formatting')
}

/**
 * Warn if PR does not have a description
 */
if (pr.body.length < 10) {
  warn('Please add a description to your PR.')
}

/**
 * Warn when yarn.lock file has changed but package.json has no changes
 */
const packageChanged = danger.git.modified_files.includes('package.json')
const lockfileChanged = danger.git.modified_files.includes('yarn.lock')
if (packageChanged && !lockfileChanged) {
  const msg = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  fail(`${msg} - <i>${idea}</i>`)
}

/**
 * Warn when origin branch is NOT coming from a fork (in other words, coming from the same repo)
 */
if (pr.base.repo.full_name === pr.head.repo.full_name) {
  warn('This PR is not coming from a fork. Tread lightly! :walking_man:')
}

/**
 * Warn when files have changed but there's no change to any corresponding spec files
 */
const filesWithoutTest = getFilesWithoutTestFile(touchedFiles)
console.log(`filesWithoutTest`, filesWithoutTest)
const list: string = filesWithoutTest.reduce<string>(
  (acc, fileName) => acc + '- ' + fileName + '\n',
  'There are files changed that have no test changes associated with them: \n'
)
markdown(`### :microscope: Missing tests\n\n\`\`\`${list}\`\`\``)

/**
 * Warn when PR is really big
 */
const bigPrThreshold = 600
if (danger.github.pr.additions + danger.github.pr.deletions > bigPrThreshold) {
  warn(':exclamation: Big PR!')
  markdown(
    `Pull Request size seems relatively large. If this Pull Request contains multiple changes, split each into a separate PR will helps with faster and easier reviewing. :+1:`
  )
}

/**
 * Warn when scope of change doesn't match changes in packages
 */

// Print bundle sizes (deltas?)

// Print coverage stats
