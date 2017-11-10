const fs = require('fs-extra')
const path = require('path')
const trash = require('trash')

const migrateProject = async (filepath, trashFn = trash) => {
  const projectpath = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.storyboarderproject')
  const newFilepath = path.join(projectpath, path.basename(filepath))

  fs.ensureDirSync(path.join(projectpath, 'storyboards'))

  // copy script
  fs.copySync(filepath, newFilepath)

  // copy storyboards + storyboarder.settings
  fs.copySync(
    path.join(path.dirname(filepath), 'storyboards'),
    path.join(projectpath, 'storyboards'),
    {
      overwrite: false,
      errorOnExist: true
    }
  )

  // remove old files and folders
  await trashFn(filepath)
  await trashFn(path.join(path.dirname(filepath), 'storyboards'))

  return newFilepath
}

module.exports = migrateProject
