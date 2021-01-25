---
title: "Dealing with multiple redirects in Cypress"
date: 2021-01-25
published: true
slug: "dealing-with-multiple-redirects-in-cypress"
description: "There are cases where you might deal app quickly redirecting through multiple pages. Chances are that Cypress will not register the page in the middle of redirect chain. In this post I will show you ways you can deal with this."
tags: ['cypress', 'tricks']
---
Let’s take a look into [our very simple app](https://github.com/filiphric/multiple-redirects). Clicking on out "Let’s go!" button will redirect us to `page2.html`. This second page has an immediate redirect to `page3.html`

<v-video alt="Redirects on our app" src="redirects.mp4"></v-video>

The whole thing happens very fast, but when you look closely you can see the redirect happening for a brief second in the address bar. Let’s now write a test for all of our redirects, so that we know that the middle one actually happens. Our test will look like this:

```js
it('redirects to page2 and page3', () => {

  cy
    .visit('/')

  cy
    .get('a')
    .click()

  // test first redirect
  cy
    .location('href')
    .should('eq', 'page2')

  // test second redirect
  cy
    .location('href')
    .should('eq', 'page3')

});
```
When we run our test though, we can see that the test fails. Our redirect happens just too fast. Since Cypress waits for page to fully load, our assertion comes in too late and our test fails.
<v-video alt="Redirect not registered by Cypress" src="failed-test.mp4"></v-video>

We see Cypress registering this redirect event, so it seems like it is something we should be able to test. And it’s true. This is one of the events we can look into in our test. Whenever a url is changed, this event is registered. Using `cy.on` command we can catch the event called `url:changed`. This event returns the url which we are being redirected to, so we can feed this into an array of all our redirects and test our array instead, like this:

```js
it('passing test', () => {

  const urlRedirects = [];

  cy
    .visit('/')

  cy
    .on('url:changed', (url) => {
      urlRedirects.push(url);
    });


  cy
    .get('a')
    .click()

  cy
    .then(() => {

      expect(urlRedirects).to.have.length(3);
      expect(urlRedirects[1]).to.eq(`${Cypress.config('baseUrl')}/page2`);
      expect(urlRedirects[2]).to.eq(`${Cypress.config('baseUrl')}/page3`);

    });

});
```
Instead of using `.location()` command, we are now just testing our `urlRedirects` array. We need to use `.then()` command, otherwise our assertion would be ran before our array is filled with values.

Hope this helps!