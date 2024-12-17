#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Install jq and bc
apt-get update && apt-get install -y jq bc

# Input parameters
COVERAGE_DIR=${1:-/workspace/coverage}   
BRANCH_NAME=${2:-"unknown"}             
GCS_BUCKET=${3:-"gs://safe-inputs-devsecops-outputs-for-dashboard"}   
SHORT_SHA=${4:-"unknown"}          

# Generate a timestamp
export timestamp=$(date +%s)

# Get the last commit's coverage report from GCS
echo "Getting last commit's test coverage report..."
last_commit_on_this_branch=$(gsutil ls "${GCS_BUCKET}/test-coverage/a11y/" | grep "$BRANCH_NAME" | sort | tail -n 1 || true)
# last_commit_on_this_branch=$(gsutil ls gs://safe-inputs-devsecops-outputs-for-dashboard/test-coverage/a11y/ | grep "$BRANCH_NAME" | sort | tail -n 1)

# If this isn't the first commit on this branch, then determine test coverage trend 
if [[ -n "$last_commit_on_this_branch" ]]; then
    
    # Download the last coverage report in order to be able to use jq
    gsutil cp "$last_commit_on_this_branch" last_commit_coverage.json

    # Extract current and last coverage percentages
    this_coverage=$(jq -r '.total.statements.pct' /workspace/coverage/coverage-summary.json)
    last_coverage=$(jq -r '.total.statements.pct' last_commit_coverage.json)

    # Compare coverage
    echo "Current coverage: $this_coverage%"
    echo "Last coverage: $last_coverage%"
    coverage_difference=$(echo "$this_coverage - $last_coverage" | bc)
    echo "Coverage difference: $coverage_difference%"

    echo "Apending report with the coverage difference..."
    jq ". + {\"difference_from_last_commit\": {\"statements_pct\": $coverage_difference}}" "${COVERAGE_DIR}/coverage-summary.json" > "${COVERAGE_DIR}/updated-coverage-summary.json"
    mv updated-coverage-summary.json "${COVERAGE_DIR}/coverage-summary.json"
    
    #jq ". + {\"difference_from_last_commit\": {\"statements_pct\": $coverage_difference}}" /workspace/coverage/coverage-summary.json > /workspace/coverage/updated-coverage-summary.json
    # mv /workspace/coverage/updated-coverage-summary.json  /workspace/coverage/coverage-summary.json

else
    echo "No previous coverage reports found on this branch."
    echo "Skipping coverage trend calculations."
fi

echo "formating file..."
# jq '.' /workspace/coverage/coverage-summary.json > /workspace/coverage/coverage-pretty.json
jq '.' "${COVERAGE_DIR}/coverage-summary.json" > "${COVERAGE_DIR}/coverage-pretty.json"

echo "Copying coverage report to GCS bucket..."
gsutil -m cp -r "${COVERAGE_DIR}/coverage-pretty.json" \
  "${GCS_BUCKET}/test-coverage/a11y/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"