# Setup Instructions

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
```

_Note: Each exercise exists as a folder in this repository. Following the material will involve going into that directory, running `npm install`, standing up the local development server by running `npm start`, and following the INSTRUCTIONS.md in the given folder._

7. Now start the `setup` NR1 package.

```bash
# ex. change directory into lab2
cd workshop/setup

npm install
npm start
```

Your terminal output should look like the following:
![terminal](screenshots/setup_screen01.png)

8. Open Google Chrome and navigate to the following URL `https://one.newrelic.com?use_version=d37b8d09&packages=local`, and click on the New Relic One Launcher named `Setup Exercise`. You should see the following.
![Congratulations](screenshots/setup_screen02.png)
