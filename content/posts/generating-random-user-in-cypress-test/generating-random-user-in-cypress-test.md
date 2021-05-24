---
title: "Generating a random user in Cypress test"
date: 2021-05-24
published: true
slug: "generating-random-user-in-cypress-test"
description: "Article on how to randomly generate a user and various ways how to use its data"
tags: ["cypress", "faker", "random"]
---

Most of web applications under test require some kind of authentication. What I like to do when testing such application is to create a testing user. This is usually a randomly generated user, which I then use for most of my tests. In this blogpost I explore a couple of ways how to generate a user an then use that user in Cypress tests. 

As is usual on this blog, I use my Trello clone app in a repository that you can check out and follow along. I tried to keep this blogpost simple, so the creating of user in my app is just a single http request. But in principle, you should be able to apply this into your test efforts as well.

## Using a hook
It is possible to put a `before()` or a `beforeEach()` hook in your `support/index.js` file like this:

```js [./cypress/support/index.js]
const { internet } = require('faker');
const email = internet.exampleEmail()
const password = internet.password()

beforeEach(() => {
  cy
    .request('POST', '/signup', { email, password })
    .then(({ body }) => {
    cy
      .setCookie('trello_token', body.accessToken);
  });
});
```
With a little bit of help from [faker](https://www.npmjs.com/package/faker), we can generate random example emails in our application for each spec or for each test. In our test, we are logging in by inserting authorization cookie into our browser. 

Signing up before each test may create quite a lot of data. On the other hand, it helps our tests with being separated from one another. This is usually a good thing, but for most of the tests, creating a new user might be a little bit of an overkill.

By the way, that curly bracket syntax is known as destructuring. It’s a JavaScript syntax, and I wrote <nuxt-link to="/using-destructuring-in-cypress">an article about how to use it in Cypress</nuxt-link>.

## Creating a script
This is an approach I have chosen in the past. Basically, before I’d start my test with `cypress run` I’d run a script that would create my test user and write it to a file. I’d then use that file in my test and log in with my user.

```js [signup.js]
const axios = require('axios')
const { internet } = require('faker');
const email = internet.exampleEmail()
const password = internet.password()
const fs = require('fs')

const signupUser = async () => {

  const user = await axios
    .post('http://localhost:3000/signup', { email, password })
      
  fs.writeFileSync("./cypress/data.json", JSON.stringify(user.data))

}

signupUser()
```
I would run this as a separate script, which I’d define in my `package.json` file.

```json [package.json]
"scripts": {
    "start": "cd trelloapp && npm start",
    "cy:run": "cypress run",
    "createUser": "node signupUser.js"
  }
```
When I have a script like this, I can run it by `npm run createUser` and then run my tests by `npm run cy:run`. In my tests, I can simply read the file and set the cookie from the file:
```js
cy
  .readFile('./cypress/data.json')
  .then(({ accessToken }) => {
  cy
    .setCookie('trello_token', accessToken);
}); 
```
If you choose this approach, it is important to include the `data.json` in `.gitignore` file. Especially if the user you have created is not a disposable one. It is not a good practice to store any sensitive data in your storage. In fact, the main reason I have moved away from this approach was that it is risky, especially as your team grows and more people start contributing to the code base.

I also find this solution not to be very elegant. If I forget to run the script my tests will fail. But it was a part of my learning journey and it served me well while I was using it. So far, the best approach for me was to run this script as a plugin and resolve it during Cypress config.

## Writing a plugin
Let’s now rewrite our `signupUser` script so that it returns the response data and can be imported as a module:
```js {6,10} [signupUser.js] 
const signupUser = async () => {

  const user = await axios
    .post('http://localhost:3000/signup', { email, password })
      
  return user.data

}

module.exports = signupUser
```

We can now import this module to our `plugins/index.js` file and use it during configuration:
```js [cypress/plugins/index.js]
const signupUser = require('../../signupUser.js')

module.exports = async (on, config) => {

  config.env = await signupUser()

  return config;

}
```

Cypress will wait until our `signupUser()` function is resolved, and then saves the data returned by that function to `config` object. This way, our data is generated during test run and it’s only available while Cypress runs. If you run your tests in parallel e.g. on 10 machines, then this script will be called 10 times. But that might actually be a good thing since those generated users will not interfere with each other.

If you enjoyed this blog, subscribe to the newsletter to get notified about new articles. Or follow me on [Twitter](https://twitter.com/filip_hric/) and [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/), where I usually share when a new blog comes out.
