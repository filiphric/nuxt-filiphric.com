---
title: "Skip test conditionally with Cypress"
date: 2021-02-08
published: true
slug: "skip-test-conditionally-with-cypress"
description: "This article explains various ways of skipping and filtering your tests in Cypress."
author: "Filip Hric"
tags: ['skip', 'grep', 'cypress', 'conditional']
---
In this blog, I’d like to show you various strategies and tools how you can skip your test and run them conditionally. In the past, I wrote a blogpost on how you can <nuxt-link to="/test-grepping-in-cypress-using-module-api">grep your tests using module API.</nuxt-link> You might like that as well.

## .skip and .only
The easiest way to skip or filter a test is to use `.only` and `.skip` functions. You can use them with multiple tests in a single spec, so that you’ll run only those test that you want. This code will tun only `test #1` and `test #3`
```js
it.only('test #1', () => {
  // ...
})
it('test #2', () => {
  // ...
})
it.only('test #3', () => {
  // ...
})
```
And this test will only run `test #1`.
```js
it('test #1', () => {
  // ...
})
it.skip('test #2', () => {
  // ...
})
it.skip('test #2', () => {
  // ...
})
```
These work whether you use them in GUI or CI. By the way, to avoid accidentally leaving `.only` in your test, make sure you setup precommit hook that will prevent this, or simply install [this nice plugin.](https://www.npmjs.com/package/stop-only) You can also use these keywords for your `describe` blocks. In that case, tests will work like this:
```js
describe.only('suite #1', () => {

  it('test #2', () => {
    // this test will run
  });

})

describe('suite #2', () => {

  it('test #2', () => {
    // this test will not run
  })

})
```
## Config file
In your `cypress.json` you can specify which tests you want to run or skip. You can use the name of your tests or use minimatch to pick which tests should run. Let’s say you have three tests:
```
test1.ts
test2.ts
test.smoke.ts
```

To just run `test1`, you’d put this in your `cypress.json` file:

```json {cypress.json}
{
  "testFiles": "test1.ts"
}
```
If you use subfolders in your `integration` folder, you can select all tests with the same name inside all of those folder by passing `**/test.ts`. More importantly, if you use a naming convention for your smoke tests, like `test.smoke.ts`, you can filter these by passing `*.smoke.ts` to your `testFiles`. So for example this configuration will run just our `test.smoke.ts` file:
```json {cypress.json}
{
  "testFiles": "*.smoke.ts"
}
```

 All these principles apply to skipping tests as well. For ignoring your test files, use `ignoreTestFiles`. You can also pass arrays these attributes. These can contain either test name or minimatch, so you can do stuff like:
```json {cypress.json}
{
  "ignoreTestFiles": ["test1.ts", "*.smoke.ts"]
}
```
This configuration will run only our `test2.ts` file. To get a better understanding of how minimatch works, you can experiment on [globtester.xyz](https://globtester.xyz) or on [this nice little site](https://pthrasher.github.io/minimatch-test/).

## Test configuration
If you want to add more complex conditions to your tests, you can use spec configuration. For example, you can configure your test to run only in a certain browser.
```js
it('will run only on chrome', { browser: 'chrome' }, () => {
    // ...
  });

it('will run only on firefox', { browser: 'firefox' }, () => {
  // ...
});
```
This test configuration enables you to do much more, but as far as test skipping and filtering goes, this is it. But then again, Cypress tests are all JavaScript. Nothing stops you from writing a condition right inside your spec file:
```js
if (Cypress.config('viewportWidth') > 350) {

  it('does not run on mobile viewports', () => {
    // ...
  });

}
```
This test will only run when the set viewport is larger than 350 pixels.

## Plugin
There’s a [really nice plugin](https://github.com/cypress-io/cypress-skip-test) that enables you to skip your tests based on various conditions. It makes it easier to run certain tests only on Mac or only on Windows, as well as skip them using these conditions. It looks something like this:
```js
it('runs only on mac', () => {
  cy.onlyOn('mac')
  // ...
})
```
There are more cool examples on readme page, make sure you check them out. What’s even cooler, you can set any condition you like with this plugin, so our mobile-only example from above would be written like this:
```js
it('does not run on mobile viewports', () => {
  cy.skipOn(Cypress.env('viewportWidth') < 350);
  // ...
})
```

## Using CLI
Similarly to our `cypress.json` configuration, we can pass CLI arguments to run only those tests we want. To run only smoke tests we’ll run:
```bash
npx cypress run --spec 'cypress/integration/*.smoke.ts'
```
To run all tests except the smoke ones, we’ll run a command like this:
```bash
npx cypress run --spec 'cypress/integration/*[!.smoke].ts'
```

## Your own logic
There are quite a lot options you can use out there. I described one of them <nuxt-link to="/test-grepping-in-cypress-using-module-api">in my blog</nuxt-link>. With Module API, there’s really nothing stopping you from organizing your test suite in various different ways. There’s also an option for grepping all of your tests [via plugin](https://github.com/bahmutov/cypress-select-tests). Whichever you choose!

If you liked this blog, you can help me grow it by sharing it on your favourite social network. I write posts like these every week, so if you like them, you can subscribe to my newsletter down below this article.