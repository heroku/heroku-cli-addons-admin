/* tslint:disable */
import CommandExtension from '../CommandExtension';

import color from '@heroku-cli/color';
import * as Heroku from '@heroku-cli/schema';

import axiosInstance from './axios';

async function getEmail(this: CommandExtension) {
  // getting Heroku user data
  let email: string | undefined = undefined;
  await axiosInstance.get('/account')
  .then ((res: any) => {
    email = res.data.email;
  })
  .catch((err:any) => {
    if (err) this.error(err)
  });

  // checks if user is logged in, in case default user checking measures do not work
  if (!email) {
    this.error(color.red('Please login with Heroku credentials using `heroku login`.'));
  }
  return email;
}

export {
  getEmail,
}
