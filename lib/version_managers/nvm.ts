import VersionManager from "../version_manager"

export default class NVM extends VersionManager {
  get languageKey() {
    return "node"
  }

  get globalVersionCommand() {
    return "[ -f $NVM_DIR/alias/default ] && cat $NVM_DIR/alias/default"
  }

  get installedVersionsCommand() {
    return "[ -d $NVM_DIR/versions/node/ ] && ls $NVM_DIR/versions/node/"
  }

  get isInstalledCommand() {
    return "type nvm" // nvm is a shell function, not a binary, so “which” doesn’t work
  }

  get projectVersionFiles() {
    return {
      ".nvmrc": (contents: string) => contents.replace("v", ""),
      ".node-version": (contents: string) => contents.replace("v", ""),
    }
  }
}

VersionManager.register(new NVM())
