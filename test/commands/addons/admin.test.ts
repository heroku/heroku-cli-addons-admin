import {expect, test} from '@oclif/test'

describe('addons:admin', () => {
  test
  .stdout()
  .command(['addons:admin'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['addons:admin', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
