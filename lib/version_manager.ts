import compareVersions from "compare-versions"
import fileWalker from "./file_walker"
import { readFileSync } from "fs"
import { execSync } from "child_process"
import { Memoize } from "typescript-memoize"

const cleanExecSync = (command: string) => {
  return execSync(command)
    .toString()
    .trim()
}

const cleanReadFileSync = (path: string) => {
  return readFileSync(path)
    .toString()
    .trim()
}

abstract class VersionManager {
  abstract readonly languageKey: string
  abstract readonly globalVersionCommand: string
  abstract readonly installedVersionsCommand: string
  abstract readonly isInstalledCommand: string
  abstract readonly projectVersionFiles: { [key: string]: Function }

  static versionManagers: Array<VersionManager>

  get isInstalled() {
    try {
      execSync(this.isInstalledCommand).toString()
      return true
    } catch (_error) {
      return false
    }
  }

  @Memoize()
  get installedVersions() {
    return cleanExecSync(this.installedVersionsCommand)
      .split("\n")
      .map((version) => version.trim().replace("v", ""))
  }

  versionIsInstalled(version: string) {
    return this.installedVersions.some((installedVersion) => {
      return compareVersions(installedVersion, version) === 0
    })
  }

  @Memoize()
  projects(directory: string) {
    let projects: { [key: string]: string } = {}

    try {
      let globalVersion = cleanExecSync(this.globalVersionCommand)

      if (globalVersion.length !== 0) {
        projects["global"] = globalVersion
      }
    } catch (_error) {}

    let files = fileWalker(directory, Object.keys(this.projectVersionFiles))

    return files.reduce((projects, file) => {
      let match = file.match(new RegExp(`^${directory}\/?(.+)/(.+)$`))

      if (!match) {
        return projects
      }

      let projectName = match[1]
      let projectVersionFileName = match[2]

      let projectVersionFileFunction = this.projectVersionFiles[projectVersionFileName]
      let versionNumber = cleanReadFileSync(file)

      projects[projectName] = projectVersionFileFunction(versionNumber)
      return projects
    }, projects)
  }

  projectVersions(directory: string) {
    return Object.values(this.projects(directory))
  }

  unusedVersions(directory: string) {
    let projectVersions = this.projectVersions(directory)

    return this.installedVersions.filter((installedVersion) => {
      return !projectVersions.some((projectVersion) => {
        return compareVersions(installedVersion, projectVersion) === 0
      })
    })
  }

  static register(versionManager: VersionManager) {
    this.versionManagers.push(versionManager)
  }

  static findByLanguage(languageKey: string) {
    let versionManagers = this.versionManagers.filter((versionManager) => {
      return versionManager.languageKey === languageKey
    })

    return versionManagers.find((versionManager) => versionManager.isInstalled)
  }
}

VersionManager.versionManagers = []

export default VersionManager
