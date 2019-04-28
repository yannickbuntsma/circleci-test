export const getChangedPackageFiles = (filePaths: string[]) =>
  filePaths.filter((filePath) => filePath.match(new RegExp('packages/.*/src/(.*[^index]).ts(x?)')))
