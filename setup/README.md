# @REPO@

## Prerequisites
1. Make sure you have the `nr1` CLI installed on your machine. Run the following command:<br> ```command -v nr1``` <br> If nothing shows up, it's not installed yet. Proceed to the next step. If it is installed, feel free to disregard step #2 below.
2. Install the `nr1` CLI tool [here](https://one.newrelic.com/launcher/developer-center.launcher). You can skip steps #5 and #6 in the Quick Start form as we'll run through these examples in this workshop.
    - **Important:** Make sure to do step **#4** of the Quick Start steps. This ensures your credentials are stored on your machine.

## Getting started

Run the following scripts:

```
nr1 nerdpack:uuid -gf
npm install
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local) and :sparkles:

## Creating new artifacts

If you want to create new artifacts run the following command:

```
nr1 create
```

> Example: `nr1 create --type nerdlet --name my-nerdlet`.
