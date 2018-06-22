import {expect, test} from '@oclif/test'

describe('addons:admin:manifest:diff', () => {
  test
  .stdout()
  .command(['addons:admin:manifest:diff'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['addons:admin:manifest:diff', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
