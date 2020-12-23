---
slug: understanding-code-coverage
date: 2020-12-21
title: 'Understanding code coverage in Cypress'
description: 'It’s pretty awesome that you can use e2e tests to generate your coverage data. In this blog I’m describing how the whole process works.'
published: false
author: 'Filip Hric'
tags: ['testing', 'advanced']
---
Code coverage is one of those few things that doesn’t come right out of the box with Cypress. To set up code coverage, there’s some web development knowledge that one must understand first. I struggled with this initially, but last weeks I was finally able to wrap my head around it. I wrote this blog for those that are beginning to learn about how web apps are built. If you are just here for the coverage part, I recommend you visit this [great piece of documentation](https://docs.cypress.io/guides/tooling/code-coverage.html#Introduction), or look into the [video that was done by Cypress team](https://www.youtube.com/watch?v=C8g5X4vCZJA) on this topic.

## Part 1 - What are web apps made of
As it’s almost usual on this blog, there’s a repo you can clone and follow along this blog. Our app is super simple, it’s just a site with a button that generates a random and totally useless fact. Knowing these provides absolutely no value to your life. But pulling these facts in a conversation will certainly make you more annoying. So there’s that.

This app, contains three files, as is usual for web apps:
```
index.html
app.js
style.css
```
Each plays different part in our app. Our css and js files are linked together in our html file, inside the `<head>` tag:
```html
<head>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
```

Our `app.js` is responsible for the "fun" part on our site. Clicking on the button will reveal our random fact. The file looks like this:
```js
const $ = document.querySelector.bind(document)

$('button').addEventListener('click', () => {
  $('p').textContent = 'A rainbow can be seen only in the morning or late afternoon. It can occur only when the sun is 40 degrees or less above the horizon.'
})
```
There is a paragraph that does not have any text when app is loaded. But when we click on our button, it reveals a fact about rainbows. A single fact is not that random and makes our site boring. Or at least even more boring than it currently is. Luckily (or unfortunately?) there’s an [API for random useless facts](https://uselessfacts.jsph.pl/). I’m not kidding. Let’s now use this. To do that, I’m going to create another file, that is going to fetch our API for a random useless fact. I’m going to name this file `randomFact.js` and I’m going to require this in our `app.js`:
```js {2}
const $ = document.querySelector.bind(document)
const { randomFact } = require("./randomFact");

$('button').addEventListener('click', () => {
  randomFact().then( (text) => {
      $('p').textContent = text
  });
})
```
## Part 2 - bundling JavaScript files
When we do this though, and open our app in browser, an error appears: `require is not defined`. This is because require does not exist in browser context. Since we want to use our `randomFact.js`, the common solution is to bundle up our js files into one. For our simple app, we can use tool called [Browserify](http://browserify.org/). It will convert our `app.js` file to a bundle that will be browser friendly. To do that, I will use the following command:
```bash
npx browserify app/app.js -o app/bundle.js
```
This will look into our `app.js` as well as all the file it references and will create a single bundle file. The output (`-o`) of our `app.js` file will be a new file called `bundle.js`. From now on, we will use our `bundle.js` in our html:
```html {3}
<head>
  <link rel="stylesheet" href="style.css">
  <script src="bundle.js" defer></script>
</head>
```
## Part 3 - transforming JavaScript files
When you look into the bundle.js file, you can see that it contains our `app.js` code, our `randomFact` code and our `axios` module code which we use in our `randomFact` function. In our case, this bundling is often referred to as **building** the app. Build processes often contain of many different smaller processes, like minifying js code, compiling css etc. One of these processes will be our instrumentation, where we will bundle our code in such a way that we will be able to track coverage on it.

