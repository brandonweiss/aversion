import VersionManager from "../version_manager"

export default class ASDF extends VersionManager {
  get languageKey() {
    return "ruby"
  }

  get globalVersionCommand() {
    return "[ -f ~/.tool-versions ] && cat ~/.tool-versions | grep ruby | cut -d ' ' -f '2'"
  }

  get installedVersionsCommand() {
    return "asdf list ruby"
  }

  get isInstalledCommand() {
    return "which asdf && asdf plugin-list | grep -q ruby"
  }

  get projectVersionFiles() {
    return {
      ".ruby-version": (contents: string) => contents.replace("ruby-", ""),
      ".tool-versions": (contents: string) => {
        let line = contents.split("\n").find((line) => line.includes("ruby"))
        let matches = line && line.match(/\w+ ([\d\.]+)$/)
        return matches && matches[1]
      },
    }
  }
}

VersionManager.register(new ASDF())
