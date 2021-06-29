# workshop/lab6

This repo has been spun up locally only.

## Getting started

1. Open a Terminal window.
2. Type `nr1 --version` to confirm that you can run the CLI.
3. If you can't run that command, go to the **Build your own application** launcher in New Relic One, register for a developer API key and download the `nr1` CLI. See the complete [Setup instructions](../SETUP.md) for more details

4. And if you haven't already cloned the workshop repo, do that now.

```bash
# if you haven't cloned the workshop repo already
git clone https://github.com/newrelic/nr1-workshop.git
# or if you have SSH keys registered with your account
# git clone git@github.com:newrelic/nr1-workshop.git

# then change directory into lab6
cd workshop/lab6

nr1 nerdpack:uuid -gf
npm install
npm start
```

5. In Google Chrome, navigate to the following URL `https://one.newrelic.com?nerdpacks=local`

## Lab Instructions

[Who wants to execute some NerdGraph in a Nerdlet](INSTRUCTIONS.md)?
