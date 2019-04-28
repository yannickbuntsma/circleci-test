export interface SplitPathResult {
  dirname: string
  filename: string
  extension: string
  params: string
}

export const splitPath = (filePath: string): SplitPathResult => {
  const result = filePath.replace(/\\/g, '/').match(/(.*\/)?(\..*?|.*?)(\.[^.]*?)?(#.*$|\?.*$|$)/)
  if (!result) {
    return {
      dirname: '',
      filename: '',
      extension: '',
      params: '',
    }
  }

  return {
    dirname: result[1] || '',
    filename: result[2] || '',
    extension: result[3] || '',
    params: result[4] || '',
  }
}
