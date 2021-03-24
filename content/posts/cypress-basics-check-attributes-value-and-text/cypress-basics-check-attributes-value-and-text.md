---
title: "Cypress basics: Check, attributes value and text"
date: 2021-03-22
published: true
slug: "cypress-basics-check-attributes-value-and-text"
description: ""
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
With anchor elements