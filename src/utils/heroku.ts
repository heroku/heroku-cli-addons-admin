/* tslint:disable */
import CommandExtension from '../CommandExtension';

import color from '@heroku-cli/color';
import * as Heroku from '@heroku-cli/schema';


async function getEmail(this: CommandExtension) {
  const {body: account} = await this.heroku.get<Heroku.Account>('/account', {retryAuth: false});

  // checks if user is logged in, in case default user checking measures do not work
  if (!account) {
    this.error(color.red('Please login with Heroku credentials using `heroku login`.'));
  }
  let email = account.email;
  return email;
}

export {
  getEmail,
}
