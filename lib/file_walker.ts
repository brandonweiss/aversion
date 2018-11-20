import { readdirSync, statSync } from "fs"
import { join as pathJoin, basename } from "path"

const excludeDirectories = [".git", "node_modules", "tmp", "vendor"]

export default function fileWalker(directory: string, fileNamesToFind: string[]): string[] {
  let fileNames = readdirSync(directory)
  let paths = fileNames.map((fileName) => pathJoin(directory, fileName))

  for (let fileNameToFind of fileNamesToFind) {
    if (fileNames.includes(fileNameToFind)) {
      return [pathJoin(directory, fileNameToFind)]
    }
  }

  paths = paths.filter((path) => {
    return !excludeDirectories.includes(basename(path)) && statSync(path).isDirectory()
  })

  return paths.reduce(
    (files, path) => {
      return [...files, ...fileWalker(path, fileNamesToFind)]
    },
    [] as string[],
  )
}
