#!/usr/bin/env bash
export STRYKER_DASHBOARD_API_KEY=21a448eb-b1c4-4166-94cb-a7d91af66499
BASE_URL=https://dashboard.stryker-mutator.io
PROJECT=github.com/bodote/book-monkey
VERSION=master


curl -X PUT $BASE_URL/api/reports/$PROJECT/$VERSION  -H "Content-Type: application/json" \
 -H "Host: dashboard.stryker-mutator.io" -H "X-Api-Key: $STRYKER_DASHBOARD_API_KEY" \
 -d @reports/mutation/mutation.json
echo

