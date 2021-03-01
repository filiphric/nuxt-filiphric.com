---
title: "Make your Cypress tests faster with .clock()"
date: 2021-03-01
published: true
slug: "make-your-cypress-tests-faster-with-clock"
description: "With .clock() and .tick() functions, it is possible to manipulate app’s time and make your test faster by skipping waits of setTimeout() and setInterval() functions."
tags: ['cypress', 'date', 'time', 'clock']
---
The fact that Cypress is running inside the same context as the tested application is one of its greatest advantages. I wrote about this in previous posts about [Page Objects vs. App Actions](https://applitools.com/blog/page-objects-app-actions-cypress/) and also in article about <nuxt-link to="/opening-a-new-tab-in-cypress">opening a new tab in Cypress</nuxt-link>. This architecture allows us to look into the functions our app is executing. It also allows adjust the app’s context such as browser preferences and time. The latter is the subject of this blog.

Let’s look at a simple app [I’ve made for this article](https://github.com/filiphric/cypress-clock). It basically just opens up and starts counting seconds. Like a stopwatch, but resetting only on refresh.

The way this app works, is that inside this app, we have a `setInterval()` function. This is a JS function that takes two arguments. First one is the function we want to run, and the second one is time in milliseconds, that tells our function how often should it run this function.

```js [app.js]
setInterval(updateTime, 1000);
```
Our `updateTime()` function does all the work in this app. The way it works is pretty simple. There are two `Date` objects in our app. One will get our time at the moment we open our app, and the other one is created every time our `updateTime()` function is called. These two are then compared so every second we get a new time information. We then take the  `<div class="timer"></div>` element, and update it’s text with the new time.

The `.clock()` function in Cypress allows us to tap into all the Date objects and time handling functions and move them around as we wish. Let’s say we want to move our time 10 seconds further when we open the app. We would do it with following code:
```ts
it('move timer', () => {

  const now = new Date()

  cy
    .visit('index.html')

  cy
    .clock(now)

  cy
    .tick(10000)

});
```

Passing the `now` variable to our`.clock()` command will set our Cypress clock to the current moment. Without this argument it would start with at the beginning of UNIX epoch, which would set our clock more than 50 years backwards.

Using the `.tick()` Cypress function will move our time 10 seconds forward. To restore our time and move everything back to normal, just invoke the `.clock()` restore function like this:
```ts
it('move timer', () => {

  const now = new Date()

  cy
    .visit('index.html')

  cy
    .clock(now)

  cy
    .tick(10000)

  cy.clock().invoke('restore')

});
```

This is a great tool for improving the speed of your tests. In my [Trello clone app](https://github.com/filiphric/trelloapp), I have an error message that appears when we get a non-200 response from server. That error message uses a `setTimeout()` function, so that after 4 seconds, it automatically disappears. To test it, I use the `.intercept()` command, which I have mentioned in my <nuxt-link to="/migrating-route-to-intercept-in-cypress">previous blog post</nuxt-link>.

```ts
it('error message works', () => {

  cy
    .intercept('POST', '/api/boards', {
      forceNetworkError: true
    })
    .as('boardCreate')

  cy
    .visit('/');

  cy
    .get('[data-cy=create-board]')
    .click()

  cy
    .get('[data-cy=new-board-input]')
    .type('new garden{enter}')

  cy
    .get('#errorMessage')
    .should('be.visible')

  cy
    .get('#errorMessage')
    .should('not.be.visible')

})
```
In my test I’m testing that the `#errorMessage` element appears, but also that it disappears. Since default retry timeout in Cypress is set to 4000ms this test works beautifully.

Except one thing.

<v-video alt="Test is taking way too long" src="long.mp4"></v-video>

In this test, we are waiting for 4 seconds while the error message disappears. That’s 4 seconds of idle waiting. It doesn’t seem like much, but if your test suite contains hundreds of tests, you might want to optimize. With a test like this, you definitely should.

We can do the exact same thing we did with our precious test on the timer. We can move our time forward and skip the wait:

```ts
it('error message works', () => {

  cy
    .intercept('POST', '/api/boards', {
      forceNetworkError: true
    })
    .as('boardCreate')

  cy
    .clock();

  cy
    .visit('/');

  cy
    .get('[data-cy=create-board]')
    .click()

  cy
    .get('[data-cy=new-board-input]')
    .type('new garden{enter}')

  cy
    .get('#errorMessage')
    .should('be.visible')

  cy
    .tick(4000)

  cy
    .get('#errorMessage')
    .should('not.be.visible')

})

```
In this case, we don’t really need to pass a Date object to our `.clock()` function since we are working with a `setTimeout()` function which will just get moved with the `.tick()` function and we don’t really mind the exact date. Now our test passes immediately:
<v-video alt="Test is running faster" src="short.mp4"></v-video>

We have made our function 4 seconds faster and removed the idle time.

Hope you like this. You can find more cool Cypress material on this blog, just click the "blog" section at the top of this page. I write content like this every week, so if you enjoyed it, consider subscribing - I send out an email when a new article comes out. I also share it on social network, so you can follow me on [Twitter](https://twitter.com/filip_hric/) or [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/).