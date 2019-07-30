# workshop/lab3

This repo has been spun up locally only.

## Getting started

1. In Google Chrome, navigate to `https://github.com/newrelic/eap-cli/tree/master/dist`, and click on the latest release of the NR1 CLI. (ex. `nr1-v0.3.0-alpha.11`)
2. Download the apppropriate zipped bundle of the NR1 CLI and **unzip it to your home folder** (ex. for Mac it would be `nr1-v0.3.0-alpha.11-darwin-x64.tar.gz`).
3. Open a Terminal window. From the command line you should the following:

```bash
# To verify that you've unzipped the NR1 CLI, run this command and see similar output
ls ~/nr1
README.md node_modules package-lock.json bin oclif.manifest.json package.json
```

4. From the command line, run the following:

```bash
#Create an alias to the cli
ln -s ~/nr1/bin/nr1 /usr/local/bin/nr1

#Verify that you can execute nr1
nr1 --version

#You should see output to the terminal window
```

5. If you haven't done so yet, generate your personal SSL cert for your development environment.

```bash
cd ~
sudo ./nr1/bin/nr1 certs:generate
#The cert will be saved to a hidden folder
```

6. And if you haven't already cloned the workshop repo, do that now.

```bash
# if you haven't cloned the workshop repo already
git clone git@github.com:newrelic/nr1-eap-workshop.git

# then change directory into lab3
cd workshop/lab3

npm install
npm start
```

7. In Google Chrome, navigate to the following URL `https://one.newrelic.com?use_version=45a97944&packages=local`

## Lab Instructions

[Let's dive deeper into the New Relic One UI](INSTRUCTIONS.md)!
