export const getFilesWithoutTestFile = (filePaths: string[]) => {
  const sourceFileNames: string[] = filePaths.filter(
    (item) => !item.includes('.spec.') && !item.includes('.snap') && !item.includes('index')
  )
  const testFileNames: string[] = filePaths.filter(
    (item) => item.includes('.spec.') && !item.includes('.snap')
  )

  const convertedTestFileNames = testFileNames.map((item) => item.replace('.spec.', '.'))
  return sourceFileNames.filter((file) => !convertedTestFileNames.includes(file))
}
