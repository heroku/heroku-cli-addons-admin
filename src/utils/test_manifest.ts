const manifest = {
  "id": "test",
  "name": "test",
  "version": 3,
  "api": {
    "config_vars": [ "MYADDON_URL" ],
    "requires": [],
    "regions": [ "us" ],
    "password": "test",
    "sso_salt": "test",
    "production": {
      "base_url": "https://yourapp.herokuapp.com/heroku/resources",
      "sso_url": "https://yourapp.herokuapp.com/sso/login"
    },
    "test": {
      "base_url": "http://localhost:4567/heroku/resources",
      "sso_url": "http://localhost:4567/sso/login"
    }
  }
};

export default manifest;
