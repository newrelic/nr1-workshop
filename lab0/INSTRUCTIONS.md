Lab 0: Building your first Nerdpack
===================================

The purpose of this lab is to provide hands on experience building on top of the New Relic One platform. Following the instructions in this lab, you will be up and running quickly. First, let's make sure you understand a few key concepts that you'll be working with.
* **Launcher**: An entry point into the New Relic One platform that is loaded on the "Home" page.
* **Nerdlet**: A visual component that renders inside the New Relic One platform at a well defined extension point. For example, a Launcher can invoke a Nerdlet (as you will see shortly). At their core, Nerdlets are React.js components.
* **Nerdpack** (aka Package): A collection of artifacts, e.g. Nerdlets, that are "packaged" up and published into the New Relic One platform.

In Lab0, you will create a Launcher and then add a Nerdlet to it that will be invoked when the user clicks on the Launcher. After this lab you should understand:

* How to use the CLI to create a Launcher
* How to use the CLI to create a Nerdlet
* How to connect a Launcher to a Nerdlet
* How to create and locally develop an Nerdpack

# Step 0: Setup and Prerequisites

Load the prerequisites and follow the setup instructions in [Setup](../SETUP.md).

**Reminder**: Make sure that you're ready to go with your `lab0` by ensuring you've run the following commands:

```bash
# from the nr1-eap-workshop directory
cd lab0
```

# Step 1: Create a Launcher

Launchers are a type of artifact within a Nerdpack that is selectable from the New Relic One homepage, and serves as an entry to a Nerdlet.

1. Use the NR1 CLI to create a new Launcher

```bash
# assuming we're in nr1-eap-workshop/lab0
nr1 create
? What kind of component do you want to create? launcher
# chose launcher and name your component lab0-launcher
? Name your component. lab0-launcher
Component created successfully!
launcher lab0-launcher is available at "./launchers/lab0-launcher"
```

You'll notice that the CLI creates a `./launchers/lab0-launcher` directory: with a nr1.json configuration.

2. Now that you have a Launcher, open the `launchers/lab0-launcher/nr1.json`. You'll see something like this.

```json
{
    "schemaType": "LAUNCHER",
    "id": "lab0-launcher",
    "displayName": "Lab0Launcher",
    "description": "",
    "icon": "interface_placeholders_icon-placeholder",
    "rootNerdletId": "4c9c902e-5ebb-4ac7-be85-1e7fe75cd04e.replace-me-with-nerdlet-id"
}
```

3. Now, we're going to start our development server using the CLI.

```bash
npm install
nr1 nerdpack:serve
# Note: Once you start the local server, it will automatically listen for changes in the file system. To issue commands while the local server is running, simply open a new terminal and change to the lab0 directory.
```

4. Navigate in Google Chrome to `https://one.newrelic.com/?nerdpacks=local` and click on the `Lab0Launcher`.

![lab0-launcher](../screenshots/lab0_screen01.png)

5. Your browser should look _something_ like the screenshot below showing a 404 error message. Why? Remember that a Launcher is the entry point on the Home page to a specific Nerdlet. Currently, the Lab 0 Launcher is not connected to a Nerdlet, which causes an error to be displayed. Let's fix that by creating a Nerdlet and connecting it to the Lab 0 Launcher.

![lab0-launcher-clicked](../screenshots/lab0_screen02.png)

In the next steps we'll create a new Nerdlet and connect our Launcher to this Nerdlet.

# Step 2: Create a Nerdlet

A Nerdlet is the main artifact that is included within an Nerdpack. A Nerdlet consists of three files by default: `index.js`, `styles.scss`, and a `nr1.json` configuration.

A Nerdlet is where the bulk of the code in your Nerdpack will live.

1. Use the CLI to create a Nerdlet.

```bash
# assuming we're in nr1-eap-workshop/lab0
nr1 create
? What kind of component do you want to create? nerdlet
? Name your component. lab0-nerdlet
Component created successfully!

your lab0-nerdlet is available at "./nerdlets/lab0-nerdlet"
```

You'll notice that the CLI creates three files in the `./nerdlets/lab0-nerdlet` directory: `index.js`, `styles.scss`, and a `nr1.json` configuration.

# Step 3: Connecting your Launcher and Nerdlet

1. Within `./lab0/launchers/lab0-launcher` open the Launcher's `nr1.json` configuration file and add the correct `rootNerdletId`. 

The `rootNerdletId` value is a combination of the package ID (the `nr1.uuid` value in `lab0/package.json`) and the name we gave the nerdlet earlier (lab0-nerdlet).

```bash
{
    "schemaType": "LAUNCHER",
    "id": "lab0-launcher",
    "displayName": "Lab 0 Launcher",
    "description": "",
    "icon": "interface_placeholders_icon-placeholder",
    "rootNerdletId": "<your_package_id>.lab0-nerdlet"
}
```

2. Save the `nr1.json`, then navigate back https://one.newrelic.com/?nerdpacks=local and click on the `Lab0Launcher`. Your browser window should look similar to below with the `lab0-nerdlet` launched. 

**Note:** You may need to restart the development server in order for the changes to take effect. To restart, type `Ctrl`+`c` in the Terminal and then running `nr1 nerdpack:serve`.

![lab0-nerdlet](../screenshots/lab0_screen05.png)

# Step 4: Creating a Nerdpack

## What is a Nerdpack?

A Nerdpack is a deployable unit that contains one or more artifacts. A Nerdlet is the main artifact in a Nerdpack, but Nerdpacks can also include Launchers, overlays, hooks, and entities.

In steps 1-3 we were creating a `lab0` Nerdpack. Yet, there is a quicker way to create a Nerdpack with a Launcher and Nerdlet already connected.

**`nr1 create` will do it for you!**

From your root directory (or the directory your want your Nerdpacks located), run the following command in your terminal:

```bash
# The CLI will create a new folder to contain the artifacts within your Nerdpack
nr1 create
? What kind of component do you want to create? package
? Name your component. lab0-nerdpack
Component created successfully!
```

You'll notice that the CLI creates a `/lab0-nerdpack` directory: including `launchers` and `nerdlets` folders, and all of the needed internal files.

![lab0-package](../screenshots/lab0_screen06.png)

If you go into the `lab0-nerdpack` directory and run `npm install && npm start` you will be able to run your package!

# For Consideration / Discussion

- _How do you use a Nerdlet to build custom visualizations?_
- _How do you access your account data?_
