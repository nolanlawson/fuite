import cli from '../../src/cli.js'

describe('basic test suite', () => {
  it('can detect a simple leak', async () => {
    await cli()
  })
})