#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

# Install jq and bc
apt-get update && apt-get install -y jq bc

# Default values
CLOUDBUILD_DIR="error-occured"
COVERAGE_DIR="/workspace/coverage"
BRANCH_NAME="unknown_branch"
SHORT_SHA="unknown_sha"

# # Check if Git is available (for local runs where these are not built in)
# if command -v git &>/dev/null && [[ -d .git ]]; then
#     BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD || echo "unknown_branch")
#     SHORT_SHA=$(git rev-parse --short HEAD || echo "unknown_sha")
# fi

# # Parse arguments
# while [[ "$#" -gt 0 ]]; do
#     case $1 in
#         --cloudbuild-dir) CLOUDBUILD_DIR="$2"; shift ;;
#         --coverage-dir) COVERAGE_DIR="$2"; shift ;;
#         --branch-name) BRANCH_NAME="$2"; shift ;;
#         --short-sha) SHORT_SHA="$2"; shift ;;
#         *) echo "Unknown parameter: $1"; exit 1 ;;
#     esac
#     shift
# done

#  Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --cloudbuild-dir) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                CLOUDBUILD_DIR="$2"; shift
            else
                echo "Error: Missing value for --cloudbuild-dir"; exit 1
            fi
            ;;
        --coverage-dir) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                COVERAGE_DIR="$2"; shift
            else
                echo "Error: Missing value for --coverage-dir"; exit 1
            fi
            ;;
        --branch-name) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                BRANCH_NAME="$2"; shift
            else
                BRANCH_NAME="unknown_branch"
            fi
            ;;
        --short-sha) 
            if [[ "$#" -gt 1 && $2 != --* ]]; then
                SHORT_SHA="$2"; shift
            else
                SHORT_SHA="unknown_sha"
            fi
            ;;
        *) 
            echo "Unknown parameter: $1"; exit 1
            ;;
    esac
    shift
done

# Debug: Log final values
echo "Cloud Build Directory: $CLOUDBUILD_DIR"
echo "Coverage Directory: $COVERAGE_DIR"
echo "Branch Name: $BRANCH_NAME"
echo "Short SHA: $SHORT_SHA"

BUCKET_NAME=safe-inputs-devsecops-outputs-for-dashboard
# BUCKET_NAME=test-outputs-go-here

# Generate a timestamp
export timestamp=$(date +%s)

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