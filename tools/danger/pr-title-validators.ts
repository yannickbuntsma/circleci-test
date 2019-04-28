export const hasCorrectScope = (title: string, packageNames: string[]): boolean =>
  packageNames.reduce<boolean>((acc, name) => title.includes(name) || false, false)

export const hasCorrectSyntax = (title: string) =>
  new RegExp('^[A-Z](\\w+)\\(.*\\): (.*)').test(title)
