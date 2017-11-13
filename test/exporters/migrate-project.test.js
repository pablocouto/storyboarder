const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const mockFs = require('mock-fs')

const migrateProject = require('../../src/js/exporters/migrate-project')

let fixturesPath = path.join(__dirname, '..', 'fixtures')

describe('migrate-project', () => {
  before(function () {
    // fake filesystem
    mockFs({
      [fixturesPath]: {
        'no-parent': {
          'no-parent.fountain': '',
          'storyboards': {
            'storyboarder.settings': '',
          }
        }
      }
    })
  })

  it('can migrate a project', async () => {
    // simulate the trash fn so we can use it with mockFs
    const trashFn = async filename => fs.removeSync(filename)

    let filepath = path.join(fixturesPath, 'no-parent', 'no-parent.fountain')

    let result = await migrateProject(filepath, trashFn)
    assert.equal(result, path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'no-parent.fountain'))
    
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'no-parent.fountain')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'storyboards')))
    assert(fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarderproject', 'storyboards', 'storyboarder.settings')))

    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'no-parent.storyboarder')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'storyboarder')))
    assert(!fs.existsSync(path.join(fixturesPath, 'no-parent', 'storyboarder', 'storyboarder.settings')))
  })

  after(function () {
    mockFs.restore()
  })
})
