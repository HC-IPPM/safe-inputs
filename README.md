# Safe Inputs
This is a Proof of Concept project demonstrating input handling - providing a safe alternative to emailed spreadsheets.
 
## Why move away from emailed spreadsheets?
 
Complicated files like PDFs and excel spreadsheets use quick, but [memory unsafe](https://alexgaynor.net/2019/aug/12/introduction-to-memory-unsafety-for-vps-of-engineering/) languages [like C and C++ when parsing files](https://security.googleblog.com/2022/12/memory-safe-languages-in-android-13.html) to open.  This means that these types of files can be [prone to embedded malware](https://www.hse.ie/eng/services/publications/conti-cyber-attack-on-the-hse-full-report.pdf).
 
Some surveillance teams within PHAC have moved towards LiquidFiles - a secure file transfer platform. Unfortunately if an attack is targeted, the signature-type virus scanners in applications like LiquidFiles' can miss the virus, allowing the still compromised file to be securely delivered into the GoC network for someone to click on. We're seeing more and more [targeted attacks](https://globalnews.ca/news/9391018/sickkids-most-systems-back-after-ransomware-attack/), and aim to minimize the ability for malware to enter the GoC by [avoiding parsing untrustworthy files](https://chromium.googlesource.com/chromium/src/+/master/docs/security/rule-of-2.md) (untrustworthy files = any files) in our system, as well as minimizing virus blast radius by using cloud platforms.
 
 
## A solution
The Safe Inputs solution follows a design pattern outlined in this [article](https://www.usenix.org/system/files/login/articles/login_spring17_08_bratus.pdf) using the concept of Language Theoretic Security (LangSec) (read more about this in the [node microservices demo](https://github.com/PHACDataHub/node-microservices-demo/tree/main/api)). To avoid using these memory unsafe parsers to open excel files, the Safe Inputs [user interface](https://safeinputs.alpha.canada.ca/) extracts the data from the potentially compromised file in the sender's web browser. The actual excel file never leaves the sender's computer - only the extracted data in JSON format is sent to the GraphQL API where LangSec is applied; ensuring the data type matches the expected type.

## Additional Safe Inputs sub-proof-of-concepts
* The [user interface](https://safeinputs.alpha.canada.ca/) is made up of reusable react components that can be used to spin-up a government-style web application for a project using the building blocks.
* The [dev container](./.devcontainer) sets up the github codespaces environment, enabling development in open source technologies using computers without ADMIN privileges.
* Demonstrates using [GitOps](https://www.youtube.com/watch?v=El1Eh-qaVKU) to eliminate configuration drift and the [security benefits of pull-based CI/CD pipelines](https://alex.kaskaso.li/post/pull-based-pipelines).
* The API acts as the initiation point for a [real-time data pipeline (proof-of-concept)](https://github.com/PHACDataHub/nats-data-pipeline-demo) using NATS cloud-native messaging system.
 
## Surveillance Team call out
We'd love to explore implementing this project with you! We're looking for feedback on what works, what doesn't and what you'd like to see in the project while ingesting your excel files safely and initiating an event driven data-pipeline; enabling more timely data. Please reach out if you're interested or have any questions.

