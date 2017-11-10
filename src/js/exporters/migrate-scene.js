const fs = require('fs-extra')
const path = require('path')
const trash = require('trash')

const exporterCopyProject = require('./copy-project')

const migrateScene = async (filepath, trashFn = trash) => {
  const scenepath = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.storyboarderscene')
  const newFilepath = path.join(scenepath, path.basename(filepath))

  fs.ensureDirSync(scenepath)

  // copy .storyboarder
  // copy images
  exporterCopyProject.copyProject(filepath, scenepath)    
  // copy exports
  fs.copySync(
    path.join(path.dirname(filepath), 'exports'),
    path.join(scenepath, 'exports'),
    {
      overwrite: false,
      errorOnExist: true
    }
  )

  // remove old files
  await trashFn(filepath)
  await trashFn(path.join(path.dirname(filepath), 'images'))
  await trashFn(path.join(path.dirname(filepath), 'exports'))

  return newFilepath
}

module.exports = migrateScene
