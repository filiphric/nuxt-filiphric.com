---
title: "Tips for debugging tests in Cypress"
date: 2021-03-08
published: true
slug: "tips-for-debugging-tests-in-cypress"
description: "If you’ve been testing for a longer time, you know that writing a test is only half of the story. The other half is maintenance. I share a couple of ways you can debug your tests in Cypress in my latest article."
tags: ['cypress', 'debugging', 'flake', 'error']
---

Debugging, right? Not sure if I love it or hate it. The part of me that loves it enjoys the learning that comes with it. The hated part is usually the fact that debugging feels like wasted time. In this article I’d like to share a couple of tips on how I usually debug tests in Cypress in hope of helping you with your own debugging.

## .pause() your test
When using Cypress in GUI mode, you can use `.pause()` command to stop your test at a problematic spot. I usually do this to look at the test right before problematic assertion or action that caused the test to fail. After pausing your test, you can interact with your page, examine the state and then click play button to continue with the test.

<v-video alt=".pause() command in action" src="pause.mp4"></v-video>

You don’t need to worry about leaving this command in your tests, since it is ignored when you run your tests in headless mode. Read more about `.pause()` in [Cypress docs](https://docs.cypress.io/api/commands/pause.html#Syntax).

## console.log()
Cypress is all JavaScript & it runs inside the browser, where you can make use of all the powers of DevTools. If you are not yet comfortable with using debugger or don’t feel like using it, simple `console.log()` is your friend.

```js
cy
  .intercept('POST', '/api/boards')
  .as('createBoard')

cy
  .wait('@createBoard')
  .then( ({ response }) => {
    console.log(response.body)
  })

```
This code will output the response body of an intercepted request. You can see the output in your browser console. I’ve seen this confuse few people, as they would look for this output in the terminal. But while you start your Cypress runner using `npx cypress open` command, the Cypress script itself runs inside the browser. And that’s where your `console.log()` output will be.

## Run your test multiple times
Sometimes you need to debug a test, because it’s flaky. In my experience, the biggest source of flakiness is the speed of how test is executed. There’s a really good section on Cypress blog page on the whole topic of [how to stabilize a flaky test](https://cypress.io/blog/tag/flake/).

But knowing a test is flaky is only a part of the story. To stabilize a test, you need to find the source of the problem. When fighting different race condition situations (click goes too fast, assertion goes too fast, network is unstable) I tend to run my tests multiple times. This is because I often get into situations where test fails on pipeline but passes locally. Running a test multiple times usually surfaces the problem. You can use standard `for` loop, but I’ve enjoyed wrapping a single test with Lodash `times` function like this:

```js
Cypress._.times(10, () => {

  it('flaky test', () => {

    // test code

  });

});
```
## Watch the video
Might seem like an obvious one, but many times I tend to forget that the first thing I should look at is not the error itself, but the context in which the error happens. Cypress records all video automatically in headless mode, but it can be disabled if screenshots are good enough. I have written an article on <nuxt-link to="/improve-your-error-screenshots-in-cypress">how you can improve your screenshots</nuxt-link> to make them more useful for debugging purposes.

The most often, people disable video recording for speed purposes, but you can actually make a pretty good compromise. `videoUploadOnPasses` set to `false` in your `cypress.json` will upload video only if there is a failed test in your spec. This can shave of minutes from your test run.

## Travel through the timeline
Timeline in GUI is a great debugging tool. You can look at the state at each of the stage of your tests and examine what might have caused the failure. I see a common error happening with a following test:
```js
// create item
cy
  .get('input')
  .type('new item{enter}')

// item appears as a second item on page
cy
  .get('.item')
  .eq(1)
  .should('be.visible')
```
I’ve seen a test like this fail a lot. There is a lot happening in between typing in the new item and the item actually appearing on the page. There might be a http request, websocket message, reorder, re-rendering of a list. Al these processes might have caused the test to fail.

This is because Cypress will automatically retry an assertion + previous command. But it will only retry the previous command, not entire command chain. If you would hover over the `.eq()` command in our test, you would see that we are actually not getting the right element. If an item renders with a delay, you would get stuck with the state of your app as it was when `.get()` command was made. Example of what might be happening:

<v-video alt="Failing assertion on .eq() command" src="list.mp4"></v-video>

I explore this topic a little more in one of my <nuxt-link to="testing-lists-of-items">previous blogs</nuxt-link>. While confusing at a first glance, looking at the timeline might shed some more light into what test did before it failed.

## Use the Cypress dashboard
Cypress Dashboard is [free to use for 500 monthly recordings](https://www.cypress.io/pricing/), or [unlimited if you are working on an open source project](https://www.cypress.io/oss-plan/). If you record your test results to dashboard, you and your team can look into screenshots and examine the test failures. But not only that. I especially enjoy the analytics overview, where I can look into most common failures or most flaky tests. This gives me some great pointers into what may be be the greatest weak points in my tests. I still need to roll up my sleeves and use previously mentioned tools for debugging, but analytics provides great set of toolset for finding issues proactively.

If you have enjoyed this, feel free to let me know. I write posts like this every week, so if you feel like getting notified, put your email down below this article or follow me on [Twitter](https://twitter.com/filip_hric/) and [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/) where I usually let the world know that a new article is out there.