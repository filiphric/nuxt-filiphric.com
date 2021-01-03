---
slug: test-grepping-in-cypress-using-module-api
date: 2020-11-09
title: 'Test grepping in Cypress using Module API'
published: true
description: 'Sometimes you want to run just a subset of your tests. With Module API, you can achieve just that. Showcasing how you can grep your tests by folder.'
tags: ['ci', 'headless', 'cypress']
---
If you are running hundreds of tests in Cypress, chances are you may want to run just a subset of them. There are several ways you can do this, and in this blog, I’d like to show you mine. If you are here just for the solution, feel free to scroll down to the end end of this blog where you’ll find the code.

As you probably know, to run all of your Cypress tests, you can type following command into your command line:
```bash
npx cypress run
```
This will run all tests inside your current Cypress project. These are usually stored in `integration` folder. I usually like to create more folders inside to create separate test categories. Let’s say I have an `api` and `ui` folder. To run each one of them, I could create a separate npm scripts, so in my `package.json` I’d have the following:
```json [package.json]
{
  "scripts": {
    "cy:run": "npx cypress run",
    "cy:run:api": "npx cypress run --spec ./cypress/integration/api/*.ts",
    "cy:run:ui": "npx cypress run --spec ./cypress/integration/ui/*.ts"
  }
}
```
These commands of course work well, but in order to run each of my test folders, I need to run a separate command. This is not such a big deal when there are only two folders, but if you have multiple of them, things can get complicated.

This is where [Module API](https://docs.cypress.io/guides/guides/module-api.html#Options) comes in super handy and I’ll show you how in a second. First, let’s write our run script with Module API. We’ll create a new `cypress.js` file in the root of our project and add following code inside:

```js [cypress.js]
const cypress = require('cypress');

cypress.run();

```
This is pretty much the same thing as if we ran our `npx cypress run` command. But instead of this, we will run our command by typing this to our terminal:
```bash
node cypress.js
```
To make things easier for us, let’s add this to our `package.json` scripts:
```json [package.json]
{
  "scripts": {
    "cy:run": "node cypress.js"
  }
}
```
Our `cypress.run()` function can also take an options parameter. This way we can which tests should be run, similarly as we did with the `--spec` flag in our previous example. So let’s add options inside our function and specify a spec folder to run:
```js {4}
const cypress = require('cypress');

cypress.run({
  spec: './cypress/integration/api/*.ts',
});
```
This property can also be an array, so we can run more folders and specify which ones we want to run:

```js {4}
const cypress = require('cypress');

cypress.run({
  spec: ['./cypress/integration/api/*.ts', './cypress/integration/ui/*.ts'],
});
```
Now that we know all this, we can play inside our `cypress.js` file and apply any kind of logic we like.

Let’s say that instead of `api` and `ui` folder, I have folders named: `list`, `detail`, `settings`, `login` and `signup`. I want to be able to pick any number or combination of these, and at the same time be able to run all of them. To do this, we will add a module called [yargs](https://www.npmjs.com/package/yargs). This package enables us to create and work with our own command line options. We are going to add a `--grep` option, so that if we just want to run tests inside `settings` and `login` folders, we will call a script like this:
```bash
npm run cy:run -- --grep settings login
```
To define our `--grep` option, we will add following to our `cypress.js` file:
```js {5} [cypress.js]
const yargs = require('yargs');

const { grep } = yargs
  .option('grep', {
    type: 'array'
  }).argv;
```
This will digest out `--grep` flag. In order to give it multiple arguments, we need do specify the type of the input as highlighted on line 5. If you are unfamiliar with the `{ grep }` syntax, go and [check out my blog on destructuring](https://filiphric.com/using-destructuring-in-cypress), where I explain this in more detail.

Let’s finalize our script and pass these options to our `cypress.run()` command:

```js {11} [cypress.js]
const cypress = require('cypress');
const yargs = require('yargs');

const { grep } = yargs
  .option('grep', {
    type: 'array',
    default: ['*']
  }).argv;

cypress.run({
  spec: grep.map(folder => `./cypress/integration/${folder}/*.ts`),
});

```
On line 11, we are mapping out all the folder names, so that when we call `npm run cy:run -- --grep settings login` our `grep` variable will be assigned the value of:
```text
["settings", "login"]
```
and our spec attribute will have the value of:
```text
["./cypress/integration/settings/*.ts", "./cypress/integration/login/*.ts"]
```

This way we can either pass names of our folders to our `--grep` argument, or we can omit the argument and run all of our tests.

It’s all just JavaScript so we can apply any logic we want. Instead of `--grep` we could maybe use `--folder` as the name of our parameter. We can go even further and create both `--folder` and `--testFile` flags to make our pick even more specific.

 This has proven to be incredibly useful in my case. I can run just those tests I need to be ran instead of waiting for the whole test suite, but still maintain the option to run everything. Several CI providers enable you to run your pipeline on demand and specify a pipeline variable, which can be used exactly for setting up which tests you want to run.

If you liked this article, be sure to subscribe down below. I write blogs like these every week and whenever I publish one, I send out an email, so you don’t miss it. You can also [follow me on Twitter](https://twitter.com/filip_hric) and reach out to me if you have any questions.

> EDIT: When talking about selecting tests, I suggest you check out solution by [Netanel Basal](https://twitter.com/NetanelBasal). [With his plugin](https://github.com/NetanelBasal/cyrun), you can select tests or folders to run.
