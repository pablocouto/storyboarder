const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const mockFs = require('mock-fs')

const migrateScene = require('../../src/js/exporters/migrate-scene')

let fixturesPath = path.join(__dirname, '..', 'fixtures')

describe('migrate-scene', () => {
  before(function () {
    // fake filesystem
    mockFs({

      [fixturesPath]: {
        'no-parent': {
          'no-parent.storyboarder': JSON.stringify({
            "version": "0.8.0",
            "boards": [
              {
                "uid": "ABC01",
                "url": "board-1-ABC01.png",
                "layers": {
                  "reference": {
                    "url": "board-1-ABC01-reference.png"
                  },
                  "notes": {
                    "url": "board-1-ABC01-notes.png"
                  }
                },
                "link": "board-1-ABC01.psd"
              }
            ]
          }),
          'images': {
            'board-1-ABC01.png':                  new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'board-1-ABC01-reference.png':        new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'board-1-ABC01-notes.png':            new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'board-1-ABC01-thumbnail.png':        new Buffer([8, 6, 7, 5, 3, 0, 9]),
            'board-1-ABC01.psd':                  new Buffer([8, 6, 7, 5, 3, 0, 9])
          },
          'exports': {
            'example.png':                        new Buffer([8, 6, 7, 5, 3, 0, 9])
          }
        }
      }

    })
  })

  it('can migrate a scene', async () => {
    // simulate the trash fn so we can use it with mockFs
    const trashFn = async filename =>
      fs.removeSync(filename)

    let filepath = path.join(fixturesPath, 'no-parent', 'no-parent.storyboarder')

    let result = await migrateScene(filepath, trashFn)
    assert.equal(result, path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderscene', 'no-parent.storyboarder'))
    
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderscene')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderscene', 'no-parent.storyboarder')))

    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarder')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'images')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'exports')))
  })

  after(function () {
    mockFs.restore()
  })
})
