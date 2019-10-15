/**
 * If you want to add or change rules we have in this file, you can first test your changes locally
 * by following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-pr
 *
 * After you are satisfied with your changes, you can also have Danger place a comment on a PR by
 * following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-and-faking-being-on-a-ci
 */

const fetch = require('node-fetch')
import { danger, GitHubPRDSL, markdown, warn } from 'danger'

import { getPackageNames, hasCorrectSyntax } from './tools/danger'
import { getFilesWithoutTestFile } from './tools/danger/get-files-without-test-file'

const pr: GitHubPRDSL = danger.github.pr

const requestChanges = async (message: string) => {
  const API_KEY: string | undefined = process.env.DANGER_GITHUB_API_TOKEN
  const url: string = `https://github.com/yannickbuntsma/circleci-test/pulls/${pr.number}`

  if (!API_KEY) {
    console.error(
      `Did not find a GitHub API key and could not request changes on PR #${pr.number}.`
    )
    return
  }

  const response: Response = await fetch(
    `https://api.github.com/repos/yannickbuntsma/circleci-test/pulls/${pr.number}/reviews`,
    {
      method: 'POST',
      credentials: 'omit',
      headers: {
        authorization: `Bearer ${API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        event: 'REQUEST_CHANGES',
        body: message,
      }),
    }
  )

  if (!response.ok) {
    console.error(
      `Failed to request changes on PR #${pr.number} (${url}) , got: ${response.status} ${
        response.statusText
      }.`
    )
  }

  console.log(`response`, response)

  return response
}

const createMarkdownBlock = ({
  title,
  subtitle,
  body,
}: {
  title?: string
  subtitle?: string
  body?: string
}): void => {
  {
    title && markdown('### ' + title + '\n')
  }
  {
    subtitle && markdown(subtitle + '\n')
  }
  {
    body && markdown('```\n' + body + '```')
  }
}

const logger = (name: string, input: unknown, result?: unknown) => {
  console.log('name')
  console.log(name)
  console.log('input')
  console.log(input)
  result && console.log('result')
  result && console.log(result)
  console.log('- - - - - - - - - - -')
}

const modifiedFiles: string[] = danger.git.modified_files
const newFiles: string[] = danger.git.created_files
const touchedFiles: string[] = [...modifiedFiles, ...newFiles]
const touchedPackages: string[] = getPackageNames(touchedFiles)
logger('touchedPackages', touchedFiles, touchedPackages)

// Incorrect general syntax (formatting)
const incorrectGeneralTitleSyntax: boolean = !hasCorrectSyntax(pr.title)
logger('incorrectGeneralTitleSyntax', pr.title, incorrectGeneralTitleSyntax)

/**
 * Fail if PR does not have a description
 */
const noDescription: boolean = pr.body.length < 10

/**
 * Fail when package.json has changed but yarn.lock file has not
 */
const packageChanged = danger.git.modified_files.includes('package.json')
const lockfileChanged = danger.git.modified_files.includes('yarn.lock')
const outdatedLockfile: boolean = packageChanged && !lockfileChanged

/**
 * Warn when origin branch is NOT coming from a fork (in other words, coming from the same repo)
 */
const notFromFork: boolean = pr.base.repo.full_name === pr.head.repo.full_name

/**
 * Warn when PACKAGE files have changed but there's no change to any corresponding spec files
 */
const excludedFiles = ['dangerfile.ts', 'package.json', 'yarn.lock']
const filesWithoutTest: string[] = getFilesWithoutTestFile(touchedFiles).filter(
  (f) => !excludedFiles.includes(f)
)
const hasMissingTests: boolean = filesWithoutTest.length > 0

console.log({
  touchedFiles,
  filesWithoutTest,
  hasMissingTests,
})

/**
 * Warn when PR is really big
 */
const bigPrThreshold = 1200
const isBigPR: boolean = danger.github.pr.additions + danger.github.pr.deletions > bigPrThreshold

const checklistForFailure = [
  incorrectGeneralTitleSyntax,
  noDescription,
  outdatedLockfile,
  notFromFork,
  hasMissingTests,
  isBigPR,
]

const PRpasses = checklistForFailure.every((item) => !item)

if (PRpasses) {
  createMarkdownBlock({
    title: ':tada:  PR looks good, great job!  :tada:',
  })
}

if (incorrectGeneralTitleSyntax) {
  warn(
    ':memo:  PR title does not have the correct general formatting. Our agreed format is {Feat | Fix | Chore | Refactor | BREAKING}({scope}): {PR title} . A correct example of a PR title would be: "Feat(common, elements): Add toast component" (without quotes).'
  )
}

if (noDescription) {
  warn(':pencil2:  Please add a short description to your PR explaining your changes.')
}

if (outdatedLockfile) {
  const msg = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  warn(`:information_desk_person:  ${msg} - <i>${idea}</i>`)
}

if (notFromFork) {
  warn(':walking:  This PR is not coming from a fork. Tread lightly!')
}

if (hasMissingTests) {
  createMarkdownBlock({
    title: ':microscope: These files are missing tests',
    subtitle: `Please have another look at these test files and confirm that any added functionality is tested.`,
  })

  requestChanges(
    'This PR has untested changes. Please add them to be able to merge this PR.\nIf you are certain all changed/added functionality is tested, please ask a peer to review the tests.'
  ).then((res) => console.log(res))
}

if (isBigPR) {
  warn(
    ':rotating_light: Big PR :rotating_light:<br /><br />Pull Request size seems relatively large. If this Pull Request contains multiple changes, split each into a separate PR will helps with faster and easier reviewing.'
  )
}

/**
 * TODO: Print bundle sizes (deltas?)
 */

/**
 * TODO: Print coverage stats
 */
