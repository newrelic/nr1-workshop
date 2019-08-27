# workshop/lab8

This repo has been spun up locally only.

## Getting started

1. Open a Terminal window.
2. Type the following to confirm that you can run the NR1 CLI `nr1 --version`
3. If you can't run that command, go to the Developer Center in New Relic One, register for a developer API key and download the NR1 CLI. See the complete [Setup instructions](../SETUP.md) for more details
4. Open a Terminal window. From the command line you should the following:

```bash
# To verify that you've unzipped the NR1 CLI, run this command and see similar output
ls ~/nr1
README.md node_modules package-lock.json bin oclif.manifest.json package.json
```

5. From the command line, run the following:

```bash
#Create an alias to the cli
ln -s ~/nr1/bin/nr1 /usr/local/bin/nr1

#Verify that you can execute nr1
nr1 --version

#You should see output to the terminal window
```

6. And if you haven't already cloned the workshop repo, do that now.

```bash
# if you haven't cloned the workshop repo already
git clone git@github.com:newrelic/nr1-eap-workshop.git

# then change directory into lab8
cd workshop/lab8

npm install
npm start
```

7. In Google Chrome, navigate to the following URL `https://one.newrelic.com?nerdpacks=local`


## Lab Instructions

[Who wants to make some map visualizations](INSTRUCTIONS.md)?!?