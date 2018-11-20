import VersionManager from "../version_manager"

export default class RBENV extends VersionManager {
  get languageKey() {
    return "ruby"
  }

  get globalVersionCommand() {
    return "rbenv global"
  }

  get installedVersionsCommand() {
    return "rbenv versions --bare"
  }

  get isInstalledCommand() {
    return "which rbenv"
  }

  get projectVersionFiles() {
    return {
      ".ruby-version": (contents: string) => contents.replace("ruby-", ""),
    }
  }
}

VersionManager.register(new RBENV())
