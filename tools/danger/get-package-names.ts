import { splitPath } from './split-path'

export const getPackageNames = (filePaths: string[]): string[] =>
  filePaths.reduce<string[]>((acc, filePath) => {
    const { dirname } = splitPath(filePath)
    const dirPath: string[] = dirname.split('/')

    const name: string = dirPath.find((item, index) => dirPath[index - 1] === 'packages') || ''

    const result = name && acc.includes(name) ? acc : [...acc, name]

    return result.filter((v) => v).sort()
  }, [])
