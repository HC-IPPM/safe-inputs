#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Install jq and bc
apt-get update && apt-get install -y jq bc

# Input parameters
CLOUDBUILD_DIR=${1:-"error-occured"}
COVERAGE_DIR=${2:-"/workspace/coverage"}
BRANCH_NAME=${3:-"unknown_branch"}
SHORT_SHA=${4:-"unknown_sha"}

echo "Arguments passed: $@"
echo "CLOUDBUILD_DIR: $CLOUDBUILD_DIR"
echo "BRANCH_NAME: $BRANCH_NAME"
echo "SHORT_SHA: $SHORT_SHA"
echo "COVERAGE_DIR: $COVERAGE_DIR"

BUCKET_NAME="test-outputs-go-here"

# Generate a timestamp
export timestamp=$(date +%s)

# Log the coverage directory
echo "Coverage directory: $COVERAGE_DIR"

# Check if coverage directory exists
if [[ ! -d "$COVERAGE_DIR" ]]; then
    echo "Error: Coverage directory $COVERAGE_DIR does not exist!"
    exit 1
else
    echo "Contents of $COVERAGE_DIR:"
    ls -la "$COVERAGE_DIR"
fi

# Get the last commit's coverage report from GCS
echo "Getting last commit's test coverage report..."
last_commit_on_this_branch=$(gsutil ls "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}" 2>/dev/null | grep "$BRANCH_NAME" | sort | tail -n 1 || true)

if [[ -z "$last_commit_on_this_branch" ]]; then
    echo "No previous coverage reports found for branch: $BRANCH_NAME"
    echo "Skipping coverage trend calculations."
else
    echo "Last commit coverage report found: $last_commit_on_this_branch"

    # Download the last coverage report
    gsutil cp "$last_commit_on_this_branch" last_commit_coverage.json

    # Extract current and last coverage percentages
    this_coverage=$(jq -r '.total.statements.pct' "$COVERAGE_DIR/coverage-summary.json")
    last_coverage=$(jq -r '.total.statements.pct' last_commit_coverage.json)

    # Compare coverage
    echo "Current coverage: $this_coverage%"
    echo "Last coverage: $last_coverage%"
    coverage_difference=$(echo "$this_coverage - $last_coverage" | bc)
    echo "Coverage difference: $coverage_difference%"

    # Append the report with the coverage difference
    jq ". + {\"difference_from_last_commit\": {\"statements_pct\": $coverage_difference}}" \
        "$COVERAGE_DIR/coverage-summary.json" > "$COVERAGE_DIR/updated-coverage-summary.json"
    mv "$COVERAGE_DIR/updated-coverage-summary.json" "$COVERAGE_DIR/coverage-summary.json"
fi

# Format the report
echo "Formatting coverage report..."
jq '.' "$COVERAGE_DIR/coverage-summary.json" > "$COVERAGE_DIR/coverage-pretty.json"

# Copy the coverage report to GCS bucket
echo "Copying coverage report to GCS bucket: gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"
gsutil -m cp -r "$COVERAGE_DIR/coverage-pretty.json" \
    "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"


# #!/usr/bin/env bash
# set -o errexit
# set -o pipefail
# set -o nounset

# # Install jq and bc
# apt-get update && apt-get install -y jq bc

# # Input parameters

# CLOUDBUILD_DIR=${1:-"error-occured"}
# BRANCH_NAME=${2:-"unknown_branch"}             
# SHORT_SHA=${3:-"unknown_sha"}      
# COVERAGE_DIR=${4:-"/workspace/coverage"}     

# BUCKET_NAME=test-outputs-go-here

# # Generate a timestamp
# export timestamp=$(date +%s)

# echo "coverage directory: $COVERAGE_DIR"
# # Check if coverage directory exists
# if [[ ! -d ${COVERAGE_DIR} ]]; then
#     echo "Error: Coverage directory  does not exist!"
# else
#     echo "Contents of $COVERAGE_DIR:"
#     ls -la ${COVERAGE_DIR}
# fi

# # Get the last commit's coverage report from GCS
# echo "Getting last commit's test coverage report..."
# last_commit_on_this_branch=$(gsutil ls "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}" 2>/dev/null | grep "$BRANCH_NAME" | sort | tail -n 1 || true)

# if [[ -z "$last_commit_on_this_branch" ]]; then
#     echo "No previous coverage reports found for branch: ${BRANCH_NAME}"
#     echo "Skipping coverage trend calculations."
# else
#     echo "Last commit coverage report found: ${last_commit_on_this_branch}"

#     # Download the last coverage report in order to be able to use jq
#     gsutil cp "$last_commit_on_this_branch" last_commit_coverage.json

#     # Extract current and last coverage percentages
#     this_coverage=$(jq -r '.total.statements.pct' ${COVERAGE_DIR}/coverage-summary.json)
#     last_coverage=$(jq -r '.total.statements.pct' last_commit_coverage.json)

#     # Compare coverage
#     echo "Current coverage: $this_coverage%"
#     echo "Last coverage: $last_coverage%"
#     coverage_difference=$(echo "$this_coverage - $last_coverage" | bc)
#     echo "Coverage difference: $coverage_difference%"

#     echo "Apending report with the coverage difference..."
#     jq ". + {\"difference_from_last_commit\": {\"statements_pct\": $coverage_difference}}" ${COVERAGE_DIR}/coverage-summary.json > ${COVERAGE_DIR}/updated-coverage-summary.json
#     mv ${COVERAGE_DIR}/updated-coverage-summary.json  ${COVERAGE_DIR}/coverage-summary.json
# fi

# echo "formating file..."
# jq '.' ${COVERAGE_DIR}/coverage-summary.json > ${COVERAGE_DIR}/coverage-pretty.json

# echo "Copying coverage report to GCS bucket... gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"
# gsutil -m cp -r ${COVERAGE_DIR}/coverage-pretty.json \
#   "gs://${BUCKET_NAME}/test-coverage/${CLOUDBUILD_DIR}/${BRANCH_NAME}__${timestamp}__${SHORT_SHA}.json"