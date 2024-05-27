# Safe Inputs

## What is "Safe Inputs"?

This is a Proof of Concept project demonstrating input handling - providing a safe alternative to emailed spreadsheets.

### Why move away from emailed spreadsheets?

Complicated files like PDFs and excel spreadsheets use quick, but [memory unsafe](https://alexgaynor.net/2019/aug/12/introduction-to-memory-unsafety-for-vps-of-engineering/) languages [like C and C++ when parsing files](https://security.googleblog.com/2022/12/memory-safe-languages-in-android-13.html) to open. This means that these types of files can be [prone to embedded malware](https://www.hse.ie/eng/services/publications/conti-cyber-attack-on-the-hse-full-report.pdf).

Some surveillance teams within PHAC have moved towards LiquidFiles - a secure file transfer platform. Unfortunately if an attack is targeted, the signature-type virus scanners in applications like LiquidFiles' can miss the virus, allowing the still compromised file to be securely delivered into the GoC network for someone to click on. We're seeing more and more [targeted attacks](https://globalnews.ca/news/9391018/sickkids-most-systems-back-after-ransomware-attack/), and aim to minimize the ability for malware to enter the GoC by [avoiding parsing untrustworthy files](https://chromium.googlesource.com/chromium/src/+/master/docs/security/rule-of-2.md) (untrustworthy files = any files) in our system, as well as minimizing virus blast radius by using cloud platforms.

### A solution

The Safe Inputs solution follows a design pattern outlined in this [article](https://www.usenix.org/system/files/login/articles/login_spring17_08_bratus.pdf) using the concept of Language Theoretic Security (LangSec) (read more about this in the [node microservices demo](https://github.com/PHACDataHub/node-microservices-demo/tree/main/api)). To avoid using these memory unsafe parsers to open excel files, the Safe Inputs [user interface](https://safeinputs.alpha.phac-aspc.gc.ca/) extracts the data from the potentially compromised file in the sender's web browser. The actual excel file never leaves the sender's computer - only the extracted data in JSON format is sent to the GraphQL API where LangSec is applied; ensuring the data type matches the expected type.

### Additional Safe Inputs sub-proof-of-concepts

- The [user interface](https://safeinputs.alpha.phac-aspc.gc.ca/) is made up of reusable react components that can be used to spin-up a government-style web application for a project using the building blocks.
- Demonstrates using [GitOps](https://www.youtube.com/watch?v=El1Eh-qaVKU) to eliminate configuration drift and the [security benefits of pull-based CI/CD pipelines](https://alex.kaskaso.li/post/pull-based-pipelines).

### Surveillance Team call out

We'd love to explore implementing this project with you! We're looking for feedback on what works, what doesn't and what you'd like to see in the project while ingesting your excel files safely and initiating an event driven data-pipeline; enabling more timely data. Please reach out if you're interested or have any questions.

## Development

The local development environment requires docker and can be launched using `npm run dev` from the repo root (short hand for `docker compose -f ./docker-compose.dev.yaml up`). One ready, the UI will be served on `localhost:8080`, and the api will be served on `localhost:3000`. To run the api with a node debugger session, temporarily edit `docker-compose.dev.yaml` to replace the api container's command with `npm run dev:debug-docker`.

### Running tests

TODO

### Additional dev env notes

The development docker containers watch for changes in both the host's `./ui` and `./api` src directories as well as their
`package-lock.json` files, reinstalling node modules and restarting container commands in response to changes on the host file system.

Node modules are installed in a separate volume inside the containers, the host's node modules (if they exist) from
either project subdirectory are not used or modified. **Note:** if the host doesn't already have a `node_modules` directory
created in one of the project subdirectories, the docker containers may will inadvertently create an empty, root-owned, `node_modules`
directory at those locations on the host file system. A weird little quirk. If this happens, you will likely get permission
errors when next trying to run `npm ci` etc on the host system, so delete those root-owned `node_modules` directories and
create your own (either manually or by running `npm ci` on the host OS). Once those directories exist on your system, subsequent
dev containers will not mess with them.

Environment variables and the database population script/dev data is not watched. After changing either, you will need to re-start the docker compose session.
