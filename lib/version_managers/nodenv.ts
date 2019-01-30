import VersionManager from "../version_manager"

export default class Nodenv extends VersionManager {
  get languageKey() {
    return "node"
  }

  get globalVersionCommand() {
    return "nodenv global"
  }

  get installedVersionsCommand() {
    return "nodenv versions --bare"
  }

  get isInstalledCommand() {
    return "which nodenv"
  }

  get projectVersionFiles() {
    return {
      ".node-version": (contents: string) => contents,
    }
  }
}

VersionManager.register(new Nodenv())
