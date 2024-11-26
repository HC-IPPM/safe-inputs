# DAST Dynamic Application Security Testing using Zap Proxy 

Zed Attack Proxy 

## Set up 

2. Add a '.env' file in axe-testing
```
echo "HOMEPAGE_URL=http://127.0.0.1:8080/" > .env
```

2. Start the dev enviroment.  From the root of the safe-inputs project, run 
```
npm run dev
```

## To Run
1. virtual env
```
python3 -m venv venv
source venv/bin/activate
```

2. install dependencies 
```
pip install -r requirements.txt
```

3. Run
```
<!-- python3 login_to_safe_inputs.py -->

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

## Resources:
https://medium.com/@renbe/integrating-zap-into-ci-cd-pipeline-dc4606d32f60
https://www.zaproxy.org/
https://github.com/zaproxy/zaproxy

*******************************************************
https://www.youtube.com/watch?v=tR93F-llbo8&t=13s  (at 16.32)
*******************************************************

https://www.zaproxy.org/docs/docker/

READ THE DOCS!!!!
add why using! 

Add check to after every week? with cloud run? - trigger to run after time period?

```
docker pull ghcr.io/zaproxy/zaproxy:stable
docker pull zaproxy/zap-stable
docker run --rm -t zaproxy/zap-stable zap-baseline.py -t https://safeinputs.alpha.phac-aspc.gc.ca/

Baseline scan - runs ZAP spider against target for by default 1 minute, followed by optional ajax spikder scan before reporting the results

docker run --rm -t -v zaproxy/zap-stable zap-baseline.py -t https://8080-cs-281831690367-default.cs-us-east1-pkhd.cloudshell.dev/signin?post_auth_redirect=%2F&message=SessionRequired


To save as json docker run --rm -t -v $(pwd):/zap/wrk zaproxy/zap-stable zap-baseline.py -t https://example.com -J /zap/wrk/report_json

<!-- --------------------------------------------------------- -->
mount 
mkdir -p zap-reports
docker run --rm -t -v $(pwd)/zap-reports:/zap/wrk zaproxy/zap-stable zap-baseline.py -t https://example.com -J report.json
 SOFT gating this at the moment until figure out how to work this 

API SCAN https://www.zaproxy.org/docs/docker/api-scan/
zap-api-scan.py -t <target> -f <format> [options]

```

package scan - baseline scan - time limited spider - no active attacking (faster scan)(no Cross site scripting, sql injection etc, but missing security headers, - default 1 minute and a couple of minutes - good for inline pipeline )

zap-baselint.py -t <target> - 0 will keep going until not find anything else
can add ignores 

eg 

docker run -t owsap/zap2docker-stable zap-baseline.py -t https://www.example.com  (this doesn't acually attack anything)

there is api version too

if -context_file, can specify user for authenticated scans
set up zap options with inline -config key=value  report json

in Zap desktop - scripting library can define active scan rules and passive scan rules

can generate config file - rules, then can modify (ignore or fail)
set some out of schope 

Full scan - actively will attack - spider no limit - can max out time
Ajax - takes a bit longer but will launch browsers and click on things - headless browser 

API scan - graphql - target and format eg url /graphql, uses script rules http sender rule 

--hook - ccan run definition at relevant time - zap object allows you to call zap api
option to sleep eg unit test, write to file store, hook wait until file there

GitHub actions owasp zap - baseline and full scans 
- can raise issues in GitHub
- will auto-close issues 

api and daemon
- start zap in daemon mode then have access to api
local host:8090, then can interact with api

zap user group 
use api key 

missing security headers et, can add other tests ie footer with link to legal... (accessibility)
through scan on weekend or overnight, or target specifc things (ie cross site scripting )

test locally and manually first (through desktop) - run spider and see if effectvie or not - if not try ajax spider eg data driven applications - filter out these - look at videos how to do that 
then automate locally (use docker), where do results go?  understand results before chucking at developers
- Authentication ....run in test mode without authentication? eg generate a token
zap 2:10 - authentication headers as env variables (50 min in video)
otherwise use zap authentication - configure to understand - videos, zap automation workship - in there have some authentication (put tests in there to make sure it works, and carrys on working)

docs - FAQ - how to reduce scans

config.xml stores all the options
have desktop work the way you want, then export congfig file and contexts, policies, scripts, plugins

use docker! 

zap automation framework (this was 2021)
configuration is in yaml (no need for Docker)! 
exclude paths, jobs like install add ons, config passive scan 
ignore rules or , run spider or ajax spider - warn if not enough urls, or fail if not found (so ) They use selenium
Security professional go through what is being reporting, ignore 

https://github.com/google/security-crawl-maze

https://owasp.org/www-project-juice-shop/
pull the project and enter the project's directory
build the docker image docker build -t crawlmaze .
run the image and expose port 80 docker run -p 80:8080 --name crawlmaze crawlmaze
to remove the container docker rm -f crawlmaze