#!/usr/bin/env node

import { readdirSync } from "fs"
import meow from "meow"
import updateNotifier from "update-notifier"
import VersionManager from "./lib/version_manager"
import { green, red } from "./lib/colors"

const cli = meow(`
  Usage
    ❯ aversion <directory> <language>

  Examples
    ❯ aversion /Users/brandon/Code node
    ❯ aversion /Users/brandon/Code ruby
`)

updateNotifier({ pkg: cli.pkg }).notify()

let directory = cli.input[0]
let language = cli.input[1]

// These need to be required here. The modules aren’t used here but
// requiring them registers them on the VersionManager class.
readdirSync(`${__dirname}/lib/version_managers`).forEach((module) => {
  require(`${__dirname}/lib/version_managers/${module.replace(".ts", "")}`)
})

let versionManager: VersionManager | undefined

if (language === undefined) {
  cli.showHelp()
  process.exit()
} else {
  versionManager = VersionManager.findByLanguage(language)
}

if (!versionManager) {
  console.error("You do not appear to have a version manager installed for that language.")
  process.exit(1)
}

let projects = versionManager!.projects(directory)

let projectNameLengths = Object.keys(projects).map((projectName) => projectName.length)
let longestProjectName = Math.max(...projectNameLengths)

Object.entries(projects).forEach(([projectName, versionNumber]) => {
  let color = versionManager!.versionIsInstalled(versionNumber) ? green : red

  console.log(projectName.padEnd(longestProjectName, " "), color(versionNumber))
})

let unusedVersions = versionManager!.unusedVersions(directory)

if (unusedVersions.length) {
  var unused = unusedVersions.map((version) => red(version)).join(", ")
} else {
  var unused = green("None! 👌🏼")
}

console.log("")
console.log(`Unused versions: ${unused}`)
