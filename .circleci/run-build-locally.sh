#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=ca324c82b827c736a7ef68592c071a4b31821b1d\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/yannickbuntsma/circleci-test/tree/master
