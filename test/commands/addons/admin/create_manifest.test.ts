import {expect, test} from '@oclif/test'

describe('addons:admin:create_manifest', () => {
  test
  .stdout()
  .command(['addons:admin:create_manifest'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['addons:admin:create_manifest', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
