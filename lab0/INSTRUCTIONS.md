Lab 0: Building your first Nerdpack
===================================

The purpose of this lab is to provide you a quick, hands on experience building on top of the New Relic One platform. First, let's make sure you understand a few key concepts that you'll be working with.
* **Launcher**: An entry point into the New Relic One platform that is loaded on the "Apps" page.
* **Nerdlet**: A visual component that renders inside the New Relic One platform at a well defined extension point. For example, a launcher can invoke a Nerdlet (as you will see shortly). At their core, Nerdlets are React.js components.
* **Nerdpack** (aka Package): A collection of Nerdpack items, e.g. Nerdlets, that are "packaged" up and published into the New Relic One platform.
* **Visualization:** This is another Nerdpack item that renders your data in a customized way. Unlike Nerdlets, you can add visualizations to dashboards. 

> **Note:** For now, you'll focus on Nerdlets, but you'll learn about visualizations in a later lab.

In Lab0, you will create a launcher and then add a Nerdlet to it that will be invoked when the user clicks on the launcher. After this lab you should understand:

* How to use the CLI to create a launcher
* How to use the CLI to create a Nerdlet
* How to connect a Launcher to a Nerdlet
* How to create and locally develop a Nerdpack

# Step 0: Setup and Prerequisites

Load the prerequisites and follow the setup instructions in [Setup](../SETUP.md).

**Reminder**: Make sure that you're ready to go with your `lab0` by ensuring you've run the following commands:

```bash
# from the nr1-workshop directory
cd lab0
nr1 nerdpack:uuid -gf
```

# Step 1: Create a launcher

Launchers are a type of Nerdpack item that is selectable from the New Relic One "Apps" page, and serves as an entry to a Nerdlet from within a Nerdpack.

1. Use `nr1` to create a new launcher

```bash
# assuming we're in nr1-workshop/lab0
nr1 create
✔ What kind of component do you want to create? › launcher
✔ Name your launcher. … lab0-launcher
 ℹ  Remember to replace "rootNerdletId" inside launchers/lab0-launcher/nr1.json

 ✔  launcher created successfully!
    launcher lab0-launcher is available at "./launchers/lab0-launcher"
```

You'll notice that the CLI creates a `./launchers/lab0-launcher` directory: with a nr1.json configuration.

2. Now that you have a launcher, open the `launchers/lab0-launcher/nr1.json`. You'll see something like this.

```json
{
    "schemaType": "LAUNCHER",
    "id": "lab0-launcher",
    "description": "Describe me",
    "displayName": "Lab0Launcher",
    "rootNerdletId": "replace-me-with-nerdlet-id"
}

```

3. Now, we're going to start our development server using the CLI.

```bash
npm install
nr1 nerdpack:serve
# Note: Once you start the local server, it will automatically listen for changes in the file system. To issue commands while the local server is running, simply open a new terminal and change to the lab0 directory.
```

4. Navigate in Google Chrome to [`https://one.newrelic.com/?nerdpacks=local`](https://one.newrelic.com/?nerdpacks=local) and click on the `Lab0Launcher`.

![lab0-launcher](../screenshots/lab0_screen01.png) <sup>Note: The icon might be a little different from the screenshot.</sup>

5. Your browser should look _something_ like the screenshot below showing a 404 error message. Why? Remember that a launcher is the entry point on the "Apps" page to a specific Nerdlet. Currently, the Lab 0 launcher is not connected to a Nerdlet causing an error to be displayed. Let's fix that by creating a Nerdlet and connecting it to the Lab 0 launcher.

![lab0-launcher-clicked](../screenshots/lab0_screen02.png)

In the next steps we'll create a new Nerdlet and connect our launcher to this Nerdlet.

# Step 2: Create a Nerdlet

A Nerdlet is one of the main Nerdpack items, containing the bulk of the code in your Nerdpack. It consists of three files by default: `index.js`, `styles.scss`, and a `nr1.json` configuration.

1. Use the CLI to create a Nerdlet.

```bash
# assuming we're in nr1-workshop/lab0
nr1 create
✔ What kind of component do you want to create? › nerdlet
✔ Name your nerdlet. … lab0-nerdlet

 ✔  nerdlet created successfully!
    nerdlet lab0-nerdlet is available at "./nerdlets/lab0-nerdlet"
```

You'll notice that the CLI creates three files in the `./nerdlets/lab0-nerdlet` directory: `index.js`, `styles.scss`, and a `nr1.json` configuration.

2. Open the project in the IDE of your choice. However, these instructions assume Visual Studio Code.

```bash
# if you're not there already, navigate to the workshop directory
cd nr1-workshop/lab0
# open the current project directory in your IDE
code .
# voilà
```

3. A Nerdlet is created and added to the `./lab0/nerdlets` folder. Your code editor should look similar to the screenshot below:

![lab0-nerdlet-created](../screenshots/lab0_screen03.png)


# Step 3: Connecting your launcher and Nerdlet

1. Within `./lab0/launchers/lab0-launcher` open the launcher's `nr1.json` configuration file and add the correct `rootNerdletId`.

![lab0-launcher](../screenshots/lab0_screen04.png)

2. Replace the code within `./lab0/launchers/lab0-launcher/nr1.json` with the JSON object below.

```bash
{
    "schemaType": "LAUNCHER",
    "id": "lab0-launcher",
    "displayName": "Lab 0 Launcher",
    "description": "",
    "rootNerdletId": "lab0-nerdlet"
}
```

3. To draw the association precisely, open the file `lab0/package.json` and find the value of the attribute `nr1.uuid`. That uuid is the identifier of your package.

4. Save the `nr1.json` and restart your local server with `CTRL+C` and `nr1 nerdpack:serve`. Then navigate back https://one.newrelic.com/?nerdpacks=local and click on the `Lab0Launcher`. Your browser window should look similar to below with the `lab0-nerdlet` launched.

![lab0-nerdlet](../screenshots/lab0_screen05.png)

# Step 4: Creating a Nerdpack

## What is a Nerdpack?

A Nerdpack is a deployable unit that contains one or more Nerdpack items. A Nerdlet is the main Nerdpack item in a Nerdpack, but Nerdpacks can also include launchers, overlays, hooks, and entities.

In steps 1-3 we were creating a `lab0` Nerdpack. Yet, there is a quicker way to create a Nerdpack with a launcher and Nerdlet already connected.

**`nr1 create` will do it for you!**

From your project directory, run the following command in your terminal:

```bash
# The CLI will create a new folder to contain the Nerdpack items within your Nerdpack
nr1 create
✔ What kind of component do you want to create? › nerdpack
✔ Name your nerdpack. … lab0-nerdpack
✔ Name your nerdlet. … lab0-nerdlet
✔ Name your launcher. … lab0-launcher

Installing dependencies...
npm notice created a lockfile as package-lock.json. You should commit this file.
added 8 packages from 3 contributors and audited 8 packages in 1.79s
found 0 vulnerabilities

 ✔  nerdpack created successfully!
    nerdpack lab0-nerdpack is available at "./"


 ✔  nerdlet created successfully!
    nerdlet lab0-nerdlet is available at "./nerdlets/lab0-nerdlet"


 ✔  launcher created successfully!
    launcher lab0-launcher is available at "./launchers/lab0-launcher"
```

You'll notice that the CLI creates a `/lab0-nerdpack` directory: including `launchers` and `nerdlets` folders, and all of the needed internal files.

![lab0-package](../screenshots/lab0_screen06.png)

If you go into the `lab0-nerdpack` directory and run `npm install && npm start` you will be able to run your package!

# For Consideration / Discussion

- _How do you access your account data?_
