import {Config} from '@oclif/config'
import {expect, test} from '@oclif/test'
import * as path from 'path'

import AdminBase from '../src/admin-base'

const root = path.resolve(__dirname, '../package.json')
const config = new Config({root})
class Test extends AdminBase {
  async run() {}
}
const cmd = new Test([], config)

describe('AdminBase', () => {
  test
    .it('#addons', () => {
      expect(cmd.addons.pull).to.be.a('function')
      expect(cmd.addons.push).to.be.a('function')
    })

  test
    .nock('https://api.heroku.com', (api: any) => api
      .get('/account')
      .reply(200, {email: 'codey@salesforce.com'})
    )
    .it('(private) #email', async () => {
      // escape compliler errors of private method
      const email = await (cmd as any).email()
      expect(email).to.eq('codey@salesforce.com')
    })
})
