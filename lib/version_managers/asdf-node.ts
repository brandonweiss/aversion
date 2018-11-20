import VersionManager from "../version_manager"

export default class ASDF extends VersionManager {
  get languageKey() {
    return "node"
  }

  get globalVersionCommand() {
    return "[ -f ~/.tool-versions ] && cat ~/.tool-versions | grep nodejs | cut -d ' ' -f '2'"
  }

  get installedVersionsCommand() {
    return "asdf list nodejs"
  }

  get isInstalledCommand() {
    return "which asdf && asdf plugin-list | grep -q nodejs"
  }

  get projectVersionFiles() {
    return {
      ".nvmrc": (contents: string) => contents.replace("v", ""),
      ".node-version": (contents: string) => contents.replace("v", ""),
      ".tool-versions": (contents: string) => {
        let line = contents.split("\n").find((line) => line.includes("nodejs"))
        let matches = line && line.match(/\w+ ([\d\.]+)$/)
        return matches && matches[1]
      },
    }
  }
}

VersionManager.register(new ASDF())
