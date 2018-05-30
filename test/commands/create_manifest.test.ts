import {expect, test} from '@oclif/test'

describe('create_manifest', () => {
  test
  .stdout()
  .command(['create_manifest'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['create_manifest', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
