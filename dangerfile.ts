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

const createMarkdownBlock = (title: string, body: string): ReturnType<typeof markdown> =>
  markdown(`### ${title}\n\n\`\`\`${body}\`\`\``)

const pr = danger.github.pr

console.log(`Title:`, pr.title)

const modifiedFiles = danger.git.modified_files
const newFiles = danger.git.created_files
const touchedFiles = [...modifiedFiles, ...newFiles]

const touchedPackages = getPackageNames(touchedFiles)

/**
 * Fail when PR titles doesn't match the convention
 */

// Scope of change doesn't match changes in packages
if (!hasCorrectScope(pr.title, touchedPackages)) {
  fail(':telescope:  PR title does not have the correct scope')
}
// Incorrect general syntax (formatting)
if (!hasCorrectSyntax(pr.title)) {
  fail(':memo:  PR title does not have the correct formatting')
}

/**
 * Fail if PR does not have a description
 */
if (pr.body.length < 10) {
  fail(':pencil2:  Please add a short description to your PR explaining your changes.')
}

/**
 * Fail when yarn.lock file has changed but package.json has no changes
 */
const packageChanged = danger.git.modified_files.includes('package.json')
const lockfileChanged = danger.git.modified_files.includes('yarn.lock')
if (packageChanged && !lockfileChanged) {
  const msg = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  fail(`:information_desk_person:  ${msg} - <i>${idea}</i>`)
}

/**
 * Warn when origin branch is NOT coming from a fork (in other words, coming from the same repo)
 */
if (pr.base.repo.full_name === pr.head.repo.full_name) {
  warn(':walking:  This PR is not coming from a fork. Tread lightly!')
}

/**
 * Warn when files have changed but there's no change to any corresponding spec files
 */
const filesWithoutTest = getFilesWithoutTestFile(touchedFiles)
const list: string = filesWithoutTest.reduce<string>(
  (acc, fileName) => acc + '- ' + fileName + '\n',
  ''
)
createMarkdownBlock(':microscope: These files are missing tests', list)

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
const smallPrThreshold = 100
if (danger.github.pr.additions + danger.github.pr.deletions < smallPrThreshold) {
  warn(':exclamation: Small PR!')
  markdown(
    `Pull Request size seems very small. You did a good job!. :+1:`
  )
}

// Print bundle sizes (deltas?)

// Print coverage stats
