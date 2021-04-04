---
title: ".contains() - an overlooked gem in Cypress"
date: 2021-04-05
published: true
slug: "contains-an-overlooked-gem-in-cypress"
description: "Although the name of this command sounds like an assertion, it is actually a selecting command. Let’s look into what makes this command great."
tags: ['cypress', 'selectors', 'contains', 'text', 'assertions']
---
`.contains()` is one of my favorite commands in Cypress. Although the name of this command sounds like an assertion, it is actually a selecting command. You could argue that all selecting commands are also assertions of element existence, but let’s not get too philosophical here 😃

It is important though, to make this distinction. The slightly confusing naming of `.contains()` command may cause overlooking its powers. Part of eternal struggles in testing is to find a suitable selector, while keeping your test easy to read. `.contains()` relies on selecting an element by text, but it can do much more than that.

Let’s look into what makes this command great. I use some examples which can be found in a repo on my GitHub.

The app actually has a pretty simple structure:
```html
<h1>Apples and other fruits</h1>
<ul>
  <li>Apple 🍏</li>
  <li>Pear 🍐</li>
<ul>
```

## Simple usage - select element containing a text
If you are familiar with this command, you probably already know that it helps you select an element using a text:
```ts
cy
  .contains('Apples')
```
Plain and simple. You know what this will do. It will select our heading. Notice how we don’t even need to write the whole text, just `Apples` is good enough.

<v-img alt="Selecting by text" src="simple.png"></v-img>

Bear in mind, that if I just used `Apple` as a text, the result would be different, since `Apple` appears twice on our page. By default `.contains()` will search the whole DOM, and return the first element with matching parameters. If you have multiple elements with the same text, you will need to scope the search,

## Scoping the search
On my workshops, I like to explain the difference between child, parent and dual commands with the `.contains()` command. It is a great example of a dual command. `.contains()` will search within the scope of a previous command if there is one.

```ts
cy
  .contains('Apple') // will select heading

cy
  .get('li')
  .contains('Apple') // will select the "Apple 🍏" element
```

This command helps you find the right element, so if you have a `<button>`, where text is inside a `<span>` element, a `<button>` will be selected. There’s an element preference order which I suggest you [check out in the docs](https://docs.cypress.io/api/commands/contains#Element-preference-order).

However, there’s another way you can approach selecting the right element. And that is by passing two arguments to the `.contains()` function. In this case, first element will be a selector, specifying the scope of our searched element.

```ts
cy
  .contains('ul', 'Pear')
```

Take a look into which element was selected:
<v-img alt="Selecting the parent element" src="parent.png"></v-img>

This way I’m selecting the parent `ul` element.

## Matching the correct text
If you don’t mind small and big letters, you can pass an additional parameter to the function to ignore case:
```ts
cy
  .contains('apples', { matchCase: false })
```
This is especially useful when you have your text abstracted in a separate variable or a file because you might be using different language mutations.

If this is not enough, you regex to matching any string you like.
```ts
cy
  .contains(/Apple/)
```

Although `.contains()` sounds like an assertion and can be used as one, the intention is aimed for selecting elements. I written about different ways of <nuxt-link to="/cypress-basics-selecting-elements">selecting elements with Cypress</nuxt-link> in the past, and `.contains()` makes a great addition to that. Even if you don’t have the tested app under full control, these commands can definitely be a good substitution over xpath or complicated css selectors.

If you enjoyed this, feel free to follow me on [Twitter](https://twitter.com/filip_hric/) or on [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/).