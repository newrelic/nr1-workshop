# workshop/lab1

This repo has been spun up locally only.

## Getting started

1. Open a Terminal window.
2. Type the following to confirm that you can run the NR1 CLI `nr1 --version`

You should see similar output:

```bash
@datanerd/nr1/0.8.0 darwin-x64 node-v10.16.3
```

3. If you can't run that command, go to the **Build a New Relic One application** launcher in New Relic One, register for a developer API key and download the NR1 CLI. See the complete [Setup instructions](../SETUP.md) for more details

4. And if you haven't already cloned the workshop repo, do that now.

```bash
# if you haven't cloned the workshop repo already
git clone git@github.com:newrelic/nr1-workshop.git

# then change directory into lab1
cd workshop/lab1

nr1 nerdpack:uuid -gf
npm install
npm start
```

5. In Google Chrome, navigate to the following URL [https://one.newrelic.com?nerdpacks=local](https://one.newrelic.com?nerdpacks=local)

## Lab Instructions

[Let's explore the charting library](INSTRUCTIONS.md)!