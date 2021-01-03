---
slug: opening-a-new-tab-in-cypress
date: 2020-10-08
title: 'Opening a new tab in Cypress'
description: 'Spoiler alert: you don’t. But there are tons of things you can do to test your link redirects properly.'
tags: ['tabs', 'cypress']
published: true
---
Cypress has its [trade-offs](https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs). Lack of multiple tabs support may be annoying, especially when you are starting to test an application that opens stuff in new tabs all the time. In this article, I would like to show you how I work around this limitation. Although, is it a limitation? Let’s look at the solutions and you’ll see for yourself.

## Removing target="_blank" attribute
Let’s say you have a following anchor link in your application:
```html
<a href="/about.html" target="_blank">Click me!</a>
```
User clicking on this link will be taken to a new tab. That `target="_blank"` attribute will tell the browser to open a new tab and visit the anchored location. With Cypress, simply using `.click()` command would result in the same behavior. This of course means that as we leave our current tab, we are leaving our Cypress script as well. Our test will not continue in our new tab. The solution here would be removing our `target="_blank"` attribute for the test purposes. Since Cypress runs right inside browser, we have access to our DOM. This enables us to manipulate it using following code:
```js
cy
  .get('a')
  .invoke('removeAttr', 'target')
```
This is basically the same thing as if you would open developer tools, opened elements tab and edited it. However, we are now changing the behavior of our application. This may not be a good solution for you if you may want to make sure that the anchor has the proper attributes. Our `.invoke()` command passes even if there is no `target` attribute present. Let’s look into what more we can do with our link.

## Testing link attributes
Instead of manipulating our element, we may want to choose not to directly click the element but test its attributes. Let’s now check that our link points to the right location and it actually has our `target="_blank"` attribute too. While you’re at it, check for `rel="noopener noreferrer"` attributes so that you are check that your page has no [security vulnerabilities](https://bolajiayodeji.com/the-security-vulnerabilities-of-the-target_blank-attribute).
```js
cy
  .get('a')
  .should('have.attr', 'href', '/about')
  .should('have.attr', 'target', '_blank')
  .should('have.attr', 'rel', 'noopener noreferrer');
```
This checks the existence of our link, but it does not check if the link is actually live. To check that, we can use `.request()` command, and just call our link as an http request.
```js {6}
cy
  .get('a')
  .then(link => {

    cy
      .request(link.prop('href'))
      .its('status')
      .should('eq', 200);

  });
```
On line 6, we are getting our `href` property and we are using it in our request. If that link returns a status code 200, our link works. With this approach, we will probably write two tests. One for our index page and one for the other page. Within each test, we would check that the links that are on each of our pages actually work. We don’t have to do that necessarily. Instead of using `.request()` we can actually use `.visit()` command and join these two test into one.

## Redirects made by JavaScript
In some cases, redirect is not made by html attribute, but by JavaScript. In that case, there’s no href attribute we can open or send a request to. The only option is to click the link. But that link may point to an external site. As Cypress allows you to visit only a single superdomain, you may feel limited when you want to test e.g. a feedback form that is located on Google docs. Visiting the link or sending a request are not viable options here. However, you can choose to spy on a function that is opening our browser window like this:
```js
cy
  .visit('./index.html');

cy
  .window().then((win) => {
    cy.spy(win, 'open').as('redirect');
  });

cy
  .get('a')
  .click();

cy
  .get('@redirect')
  .should('be.calledWith', '_blank', '/about');
```
At the beginning of our test, we are registering our spy method, that going to spy for an `open` function on our `window` object. In our test, we are checking that our function is called with proper arguments, `_blank` and `/about`. This way, we are checking the redirect even when we cannot see the link of our anchor element inside DOM.
