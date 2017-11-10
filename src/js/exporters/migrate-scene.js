const fs = require('fs-extra')
const path = require('path')
const trash = require('trash')

const migrateScene = async (filepath, trashFn = trash) => {
  const scenepath = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)) + '.storyboarderscene')
  const newFilepath = path.join(scenepath, path.basename(filepath))

  fs.ensureDirSync(scenepath)

  // copy .storyboarder
  fs.copySync(filepath, newFilepath)
  
  // copy images
  fs.copySync(
    path.join(path.dirname(filepath), 'images'),
    path.join(scenepath, 'images'),
    {
      overwrite: false,
      errorOnExist: true
    }
  )

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
