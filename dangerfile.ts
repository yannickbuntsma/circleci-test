/**
 * If you want to add or change rules we have in this file, you can first test your changes locally
 * by following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-pr
 *
 * After you are satisfied with your changes, you can also have Danger place a comment on a PR by
 * following this guide: https://danger.systems/js/guides/the_dangerfile.html#using-danger-and-faking-being-on-a-ci
 */

const fetch = require('node-fetch')
import { danger, GitHubPRDSL, GitHubReview, markdown, warn } from 'danger'

import { getPackageNames, hasCorrectSyntax } from './tools/danger'
import { getFilesWithoutTestFile } from './tools/danger/get-files-without-test-file'

interface ExtendedGitHubReview extends GitHubReview {
  state: GitHubReview['state'] & 'CHANGES_REQUESTED'
}

const repo: string = 'yannickbuntsma/circleci-test'
const botName: string = 'bot-yb'
const pr: GitHubPRDSL = danger.github.pr

const doBotReview = async () => {
  const API_KEY: string | undefined = process.env.DANGER_GITHUB_API_TOKEN
  const shared = {
    credentials: 'omit',
    headers: {
      authorization: `Bearer ${API_KEY}`,
      'content-type': 'application/json',
    },
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/pulls/${pr.number}}/reviews`,
    shared
  )
  const reviews: ExtendedGitHubReview[] = await response.json()

  const url: string = `https://github.com/${repo}/pulls/${pr.number}`

  const requestChangesMessage =
    'This PR has untested changes. Please add them to be able to merge this PR.\nIf you are certain all changed/added functionality is tested, please ask a peer to review the tests.'
  const dismissalMessage = 'Missing tests seem to be added.'

  console.log(`reviews`, reviews)
  const botReview =
    !!reviews && reviews.find((r) => r.user.login === botName && r.state === 'CHANGES_REQUESTED')

  if (!API_KEY) {
    console.error(
      `Did not find a GitHub API key and could not request changes on PR #${pr.number}.`
    )
    return
  }

  const submitCall = (message: string) => {
    console.log('===== Submitting review =====')
    return {
      url: `https://api.github.com/repos/${repo}/pulls/${pr.number}}/reviews`,
      settings: {
        method: 'POST',
        body: JSON.stringify({
          event: 'REQUEST_CHANGES',
          body: message,
        }),
      },
    }
  }
  const updateCall = (reviewId: number, message: string) => {
    console.log('===== Updating review =====')
    return {
      url: `https://api.github.com/repos/${repo}/pulls/${pr.number}}/reviews/${reviewId}`,
      settings: {
        method: 'PUT',
        body: JSON.stringify({
          body: message,
        }),
      },
    }
  }
  const dismissCall = (reviewId: number, message: string) => {
    console.log('===== Dismissing review =====')
    return {
      url: `https://api.github.com/repos/${repo}/pulls/${
        pr.number
      }}/reviews/${reviewId}/dismissals`,
      settings: {
        method: 'PUT',
        body: JSON.stringify({
          message,
        }),
      },
    }
  }

  console.log('botReview', botReview)
  if (botReview && botReview.id) {
    if (!hasMissingTests) {
      // dismiss review
      // PUT /repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals
      const call = dismissCall(botReview.id, dismissalMessage)
      const response: Response = await fetch(call.url, {
        ...shared,
        ...call.settings,
      })

      if (!response.ok) {
        console.error(
          `Failed to post review on PR #${pr.number} (${url}), got: ${response.status} ${
            response.statusText
          }.`
        )
      }
    } else {
      // update review
      // PUT /repos/:owner/:repo/pulls/:pull_number/reviews/:review_id
      const call = updateCall(botReview.id, requestChangesMessage)
      const response: Response = await fetch(call.url, {
        ...shared,
        ...call.settings,
      })

      if (!response.ok) {
        console.error(
          `Failed to update review ${botReview.id} on PR #${pr.number} (${url}), got: ${
            response.status
          } ${response.statusText}.`
        )
      }
    }
  } else {
    // post review
    // POST /repos/:owner/:repo/pulls/:pull_number/reviews
    const call = submitCall(requestChangesMessage)
    const response: Response = await fetch(call.url, {
      ...shared,
      ...call.settings,
    })

    if (!response.ok) {
      console.error(
        `Failed to post review on PR #${pr.number} (${url}), got: ${response.status} ${
          response.statusText
        }.`
      )
    }
  }
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
  warn(':bathtub:  This PR is not coming from a fork. Make sure to clean up after yourself.')
}

if (hasMissingTests) {
  createMarkdownBlock({
    title: ':microscope: These files are missing tests',
    subtitle: `Please have another look at these test files and confirm that any added functionality is tested.`,
  })
}

doBotReview()

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
