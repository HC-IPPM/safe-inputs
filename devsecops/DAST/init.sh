```
## Exit codes:
The script will exit with codes of:

0: Success
1: At least 1 FAIL
2: At least one WARN and no FAILs
3: Any other failure

use zap_started hook then:

 zap-baseline.py -t https://example.com --hook=my-hooks.py

 docker run -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
    -t https://www.example.com -g gen.conf -r testreport.html --hook=/zap/wrk/my-hooks.py


adjust and supply config (to modify)

## To Run
# venv
python3 -m venv .venv
source .venv/bin/activate

# install dependencies 
pip install -r requirements.txt

# Baseline Scan - example  (https://www.zaproxy.org/docs/docker/baseline-scan/)

docker run -t zaproxy/zap-stable zap-baseline.py -t https://www.example.com


### Saves as json and writes report -example 
docker run --rm -t \
  -v $(pwd)/zap-reports:/zap/wrk \
  zaproxy/zap-stable zap-baseline.py \
  -t https://example.com  \
  -J report_json \
  -r testreport.html


### Saves as json and writes report (safe-inputs)
export target_url=https://safeinputs.alpha.phac-aspc.gc.ca/
export target_url=https://8080-cs-281831690367-default.cs-us-east1-pkhd.cloudshell.dev/

docker run --rm -t \
  -v $(pwd)/zap-reports:/zap/wrk \
  zaproxy/zap-stable zap-baseline.py \
  -t $target_url \
  -J report_json \
  -r testreport.html

# Scan hooks 
https://www.zaproxy.org/docs/docker/scan-hooks/

pre-exit might be interesting to sum warns etc
zap_started <- run before crawling/scanning?
zap_active_scan - disable non-applicable scans

docker run --rm -t \
  -v $(pwd):/zap/wrk \
  zaproxy/zap-stable zap-baseline.py \
  -t $target_url \
  -J zap-reports/report_json \
  -r zap-reports/testreport.html \
  --hook=login-hook.py


# -------------------------------------------------
https://www.zaproxy.org/docs/automate/automation-framework/
https://www.youtube.com/watch?v=19Rptj2be1Y use the automated framework! 


docker run --rm -p 8090:8080 \
  -v $(pwd)/safe-inputs.context:/zap/wrk/safe-inputs.context \
  -v $(pwd)/login_to_safe_inputs.py:/zap/wrk/login_to_safe_inputs.py \
  zaproxy/zap-stable \
  zap-baseline.py -t https://8080-cs-281831690367-default.cs-us-east1-pkhd.cloudshell.dev/signin?post_auth_redirect=%2F&message=SessionRequired -n /zap/wrk/safe-inputs.context
```

(then modify as below to save as json, then save to bucket, modify rules etc)


baseline scan 
FROM owasp/zap2docker-stable:latest
WORKDIR /zap