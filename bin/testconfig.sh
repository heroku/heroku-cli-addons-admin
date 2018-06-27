curl --user ${CIRCLE_TOKEN}: \
  --request POST \
  --form revision=f793589e50c94a1cd53e657c596b3e2ee6cb9d43 \
  --form config=@config.test.yml \
  --form notify=false \
  https://circleci.com/api/v1.1/project/github/heroku/heroku-cli-addons-admin/tree/amanmibra-diff
