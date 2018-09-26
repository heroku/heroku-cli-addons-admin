
import {test as oTest} from '@oclif/test'

const test = oTest
.nock('https://api.heroku.com', (api: any) => api
  .get('/account')
  .reply(200, {email: 'aman@abc123.com'})
)

export default test
