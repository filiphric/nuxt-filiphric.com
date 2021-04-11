---
title: "Cypress basics: Check, attributes value and text"
date: 2021-04-12
published: true
slug: "cypress-basics-check-attributes-value-and-text"
description: "Short explanation of how to test and access different properties of a given element using .invok() function"
tags: ['cypress', 'basics', 'attributes', 'value', 'text']
---

Hey! Welcome to another episode of Cypress basics. You can check out some other articles on my blog where I provide step by step explanations of some Cypress basics + some extra tips on how you can take things one step further. So far, I wrote about:

- <nuxt-link to="/cypress-basics-before-beforeeach-after-aftereach">before(), beforeEach(), after() and afterEach()</nuxt-link>
- <nuxt-link to="/cypress-basics-check-if-element-exists">Check if element exists</nuxt-link>
- <nuxt-link to="/cypress-basics-selecting-elements">Selecting elements</nuxt-link>
- <nuxt-link to="/cypress-basics-where-did-my-cookies-disappear">Where did my cookies disappear?</nuxt-link>

## Get element text
To get proper attributes of an element, it’s good to understand some basics of different HTML elements. Let me give you an example. Let’s say we have two elements:

```html
<div>Please type in your name:</div>
<input type="text"></input>
```

During my test, I’m going to fill the input field and then check if the text has correct text inside. With both of these elements, you can see the text on page. But if I want to "check text" on these elements, I need to use slightly different approach with each:

```js
cy
  .get('div')
  .should('have.text', 'Please type in your name:')

cy
  .get('input')
  .type('Rick Sanchez')
  .should('have.value', 'Rick Sanchez')
```

The difference here is, that our `div` element contains a certain text, but `input` elements in HTML are used for inserting value. I strongly suggest checking out [W3Schools docs](https://www.w3schools.com/html/html_form_input_types.asp) to explore different types of input form fields.

## Get attribute
You may be in a situation where you need to check your links. In that case, getting your `href` attribute from anchor element would be useful. Let’s say we have a following link:
```html
<a href="https://docs.cypress.io">Read the docs!</a>
```

To check the `href` attribute, you can write a test like this:

```js
cy
  .get('a')
  .invoke('attr', 'href')
  .should('eq', 'https://docs.cypress.io')
```

In addition, you can test if the link is actually valid, by making an http request to it:

```js
cy
  .get('a')
  .invoke('attr', 'href')
  .then(href => {

    cy
      .request(href)
      .its('status')
      .should('eq', 200);

});
```

## Invoke properties
By using `.invoke('prop')`, you can access many different properties from selected element. The whole list of that properties can be found in Chrome DevTools. To access them, click on the given element and open properties panel.

<v-video  src="chrome-props.mp4" alt="Element properties in Chrome DevTools"></v-video>

As you can see, there are tons of options. For example, we can use `.invoke()` command to look into whether checkbox element is checked.

```js
cy
  .get('input')
  .invoke('prop', 'checked')
  .then(state => {

    console.log(`checkbox is ${state ? 'checked' : 'not checked'}`)

  });
```

Remember how we tested the value of a certain input? With `.invoke()` we can pass the value of that input to another function, like this:

```js
cy
  .get('input')
  .type('Rick Sanchez')
  .invoke('val')
  .then(val => {

    const inputValue = val;

  });
```

In the past, I had a bad input element in my app that would re-render during my test and delete my input in the test. I would write a special "type and check" command that would retry if the input would not work properly.

```js
Cypress.Commands.add('typeAndCheck', { prevSubject: true }, (subject, input) => {

  cy
    .wrap(subject)
    .type(input);

  cy
    .wrap(subject)
    .then(($subj) => {
      if ($subj[0].value !== input) {

        cy
          .wrap(subject)
          .clear({ force: true })
          .typeAndCheck(input);

      }
    });

});
```

This is definitely very hacky solution. I’d recomment checking out this great blog on [identifying code smells](https://codingitwrong.com/2020/10/09/identifying-code-smells-in-cypress.html) (as the described situation is definitely one!) or looking into Gleb Bahmutov’s blog about the topic of [when can a test start typing](https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/).

The other interesting thing about `.invoke()` val is that by passing a second argument to this function will enable you to change the value and (kinda) simulate pasting a text to an textarea. I wrote about this in a [recent blog for egghead.io](https://egghead.io/blog/handling-copy-and-paste-in-cypress), so give that a read. The simple example goes something like this:

```js
cy
  .get("input")
  .invoke('val', 'paste this text')
```

Hope you like this. If you did, you can subscribe to a newsletter to get notified about a new article every week. You can also follow me on [Twitter](https://twitter.com/filip_hric/) or [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/).

See you next week!
