---
title: "Improve your custom command logs in Cypress"
date: 2021-03-16
published: true
slug: "improve-your-custom-command-logs-in-cypress"
description: "How to take your custom commands to another level with custom logging, snapshots and many more."
tags: ['cypress', 'custom commands', 'logging']
---
In the past, I wrote about custom commands and how you <nuxt-link to="/starting-with-typescript-in-cypress">leverage TypeScript</nuxt-link> to give you some great autocomplete capabilities. Using TypeScript is definitely worth it when working on a bigger project with multiple collaborators. In this blog, I’d like to take our custom commands one level further and enable custom logging. This will improve the experience in test runner.

If you are interested in this topic, I suggest you [check out the webinar on patterns and practices](https://www.youtube.com/watch?v=V-o8WzlwKmM) that Cypress DX team has done. It’s full of great tips, and they talk about custom logging too.

As is usual here on this blog, I’m using my Trello clone app, which you can [find on my GitHub](https://github.com/filiphric/trelloapp) page.

## Creating a custom error
Let’s say we create a simple custom command, that will interact with UI and create a new board. It will look something like this.

```ts
Cypress.Commands.add('addBoardUi', (name: string) => {

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy="new-board-input"]')
    .type(`${name}`)
    .type('{enter}');

});
```
We will then use it in our test like this:

```ts
it('Creates a new board', () => {

  cy
    .visit('/')

  cy
    .addBoardUi() // forgot the board name!

});
```

If we want to use our custom command, we need to provide a name for the board. If we don’t our test will still run, but will throw an error:

<v-img alt=".type() accepts only a string or number" src="error.png"></v-img>

While this is certainly a well written error, we may want to provide some more insight on what exactly went wrong in this case. To do that, we can check whether an argument was provided. If not, we’ll say that right inside our test runner.

```ts
Cypress.Commands.add('addBoardUi', (name: string) => {

  if (!name) throw new Error('You need to provide a board name');

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy="new-board-input"]')
    .type(`${name}`)
    .type('{enter}');

});
```

When we now run an error, we get a slightly more informative message:

<v-img alt="Custom error - board name needs to be provided" src="customError.png"></v-img>

Of course, if we are using TypeScript, it’s hard to miss this kind of error. But mistakes happen, and when they do, it’s nice to find out about the root of the problem as soon as possible.

## Custom messages
So far, our command is just a sequence of actions. If you look at the first screenshot in out test, you can see that there’s not really any trace of our custom command. I believe this is actually a good thing. We’ve been talking about debuggability and finding root of problems fast - it’s really easy to go to the exact command where an error happened.

But you may be in a situation where you want to build a library of commands for your colleagues to use and you want your custom commands to be visible in GUI.

To add some logs, you can just use `cy.log()` command as you would use any other command in your test. But you can take things one step further with `Cypress.log()` api. Let’s add some custom logs to our custom command:

```ts
Cypress.Commands.add('addBoardUi', (name: string) => {

  Cypress.log({
    displayName: 'addBoardUi',
    message: name,
    name: 'Add new board'
  });

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy="new-board-input"]')
    .type(`${name}`)
    .type('{enter}');

});
```
This will now display our custom command in Cypress runner. Nice addition to this, is our `name` parameter, that is printed next to our command name.

<v-img alt="Custom log - new board name is displayed in command log" src="customLog.png"></v-img>

To bring some more information to our board, we can add a `consoleProps` function, that will print additional info to our console:

```ts
Cypress.log({
  consoleProps() {
    return {
      'board name': name
    }
  },
  displayName: 'addBoardUi',
  message: name,
  name: 'Add new board'
});
```

But what if we have some information that is not available in parameter? Let’s say we want to print our board url to the console. Might be useful for debugging after test run. To do this, we need to write our function differently:

```ts {6,31}
Cypress.Commands.add('addBoardUi', (name: string) => {

  let boardUrl;

  const log = Cypress.log({
    autoEnd: false,
    consoleProps() {
      return {
        'board name': name,
        'board url': boardUrl
      }
    },
    displayName: 'addBoardUi',
    message: name,
    name: 'Add new board'
  });

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy="new-board-input"]')
    .type(name)
    .type('{enter}');

  cy
    .url()
    .then((url) => {
      boardUrl = url
      log.end()
    })

});
```

First, we define a variable `boardUrl`. This will be used for assigning our url, later on line 30. The other thing we are doing slightly differently is that we assign our `Cypress.log()` to a variable. This enables us to continuously feed data into our log. This means that although our `boardUrl` will be `undefined` at first, we can fill the information later and it will appear in the test runner. The last thing about this is the `autoEnd` attribute, which will tell Cypress not to finish logging until we explicitly say so using `.end()` function on line 31.

<v-img alt="Information logged into console" src="consoleLog.png"></v-img>

## Highlighting elements
Let’s move on from our current example to something else. In my app I have couple of data attributes, and I want to create a custom command for selecting them. I will call it `take` and it will basically be a shortcut for `.get()` command. I want to be able to write `.take('create-board')` instead of `.get([data-cy='create-board'])`. The basics will look like this:
```ts
Cypress.Commands.add('take', (input: string) => {

  const log = Cypress.log({
    consoleProps() {
      return {
        selector: input
      };
    },
    displayName: 'take',
    name: 'Get by [data-cy] attribute'
  });

  cy
    .get(`[data-cy=${input}]`)

});
```

But you can notice that our new command does not highlight our element:

<v-video alt="Missing highlight on custom command" src="highlight.mp4"></v-video>

Let’s fix that and also get rid of our `.get()` command, so that we don’t have duplicity in our test:

```ts {17,18}
Cypress.Commands.add('take', (input: string) => {

  const log = Cypress.log({
    autoEnd: false,
    consoleProps() {
      return {
        selector: input,
      };
    },
    displayName: 'take',
    name: 'Get by [data-cy] attribute'
  });

  cy
    .get(`[data-cy=${input}]`, { log: false })
    .then(($el) => {
      log.set({ $el });
      log.snapshot()
      log.end();
    });

});
```

Now we only have a single command in our Cypress runner. Not only that, but by using `log.set({ $el });` we are now highlighting the element that our `.get()` command finds. Similar to our previous example, we are using `autoEnd` and `.end()` function to finish our logging. To make our highlight work, we need to do at least one snapshot in our command using `.snapshot()` function.

## Adding more logs

But now we have lost a couple of console logs that the original `.get()` command gives us. To fix that, we’ll once again create placeholder variables and fill in the information as we proceed through our actions.

```ts {3-4,11-12,22-23}
Cypress.Commands.add('take', (input: string) => {

  let element: JQuery<HTMLElement> | HTMLElement[];
  let count: number;

  const log = Cypress.log({
    autoEnd: false,
    consoleProps() {
      return {
        selector: input,
        'Yielded': element,
        'Elements': count
      };
    },
    displayName: 'take',
    name: 'Get by [data-cy] attribute'
  });

  cy
    .get(`[data-cy=${input}]`, { log: false })
    .then(($el) => {
      element = Cypress.dom.getElements($el)
      count = $el.length;
      log.set({ $el });
      log.snapshot().end();
    });

});
```

Our command is starting to look pretty neat. In fact, our console print looks exactly as the original `.get()` command:

<v-img alt="Custom command with logging" src="takeLogs.png"></v-img>

There’s one small bug here, which might not be visible at first sight. Congratulations if you spotted it.

## Handling errors

Our `autoEnd` attribute will wait until our `.end()` function is called. But if the `.get()` command does not find an element, our log will never finish. The test would still fail, so no real harm is done. It’s just that our `take` command will be stuck in a loading state. To fix that, I’ll just tap into the `fail` event, finish my log and throw error:

```ts {28-33}
Cypress.Commands.add('take', (input: string) => {

  let element: JQuery<HTMLElement> | HTMLElement[];
  let count: number;

  const log = Cypress.log({
    autoEnd: false,
    consoleProps() {
      return {
        selector: input,
        'Yielded': element,
        'Elements': count
      };
    },
    displayName: 'take',
    name: 'Get by [data-cy] attribute'
  });

  cy
    .get(`[data-cy=${input}]`, { log: false })
    .then(($el) => {
      element = Cypress.dom.getElements($el)
      count = $el.length;
      log.set({ $el });
      log.snapshot().end();
    });

  cy
    .on('fail', (err) => {
      log.error(err)
      log.end()
      throw err
    })

});
```

For the sake of keeping this article simple, I’m not going to dive into any more details. I am using custom commands e.g. for logging information from API requests (check out how I work with those in my <nuxt-link to="/working-with-api-response-data-in-cypress">previous blog</nuxt-link>), where I snapshot the "before" and "after" state. In my work, I use a similar command to our `.take()` custom command, but I am actually using it as a dual command, meaning that I can get a parent element, and then only select a child element within the context of that parent element. There’s really a lot of cool stuff you can do with this.

Hope you liked this. I’m writing a blogpost like this every week, so if you are interested, make sure to follow me on Twitter, connect with me on LinkedIn, or subscribe to my newsletter where I will let you know each time I publish a new article.