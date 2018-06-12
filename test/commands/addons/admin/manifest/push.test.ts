import {expect, test} from '@oclif/test'

describe('addons:admin:manifest:push', () => {
  test
  .stdout()
  .command(['addons:admin:manifest:push'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['addons:admin:manifest:push', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
