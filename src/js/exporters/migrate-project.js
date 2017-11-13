const fs = require('fs-extra')
const path = require('path')
const trash = require('trash')

const migrateProject = async (filepath, trashFn = trash) => {
  const projectpath = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.storyboarderproject')
  const newFilepath = path.join(projectpath, path.basename(filepath))

  fs.ensureDirSync(path.join(projectpath, 'storyboards'))

  // don't move the script
  // fs.copySync(filepath, path.join(path.dirname(newFilepath), '..'))

  // copy storyboards + storyboarder.settings
  fs.copySync(
    path.join(path.dirname(filepath), 'storyboards'),
    path.join(projectpath, 'storyboards'),
    {
      overwrite: false,
      errorOnExist: true
    }
  )

  // remove old folders
  await trashFn(path.join(path.dirname(filepath), 'storyboards'))
}

module.exports = migrateProject
