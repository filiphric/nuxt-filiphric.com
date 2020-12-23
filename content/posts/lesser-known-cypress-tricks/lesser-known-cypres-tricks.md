---
title: "Lesser known Cypress.io tricks"
date: 2020-09-21
published: true
slug: "lesser-known-cypress-tricks"
---
Cypress.io is pretty amazing, and if you haven’t used it yet and need a jump start, I recommend my super-quick straight-to-the-point course on Udemy. It’s called [Cypress test automation for people in a hurry](https://www.udemy.com/course/cypress-test-automation-for-people-in-a-hurry/?referralCode=21A875FF429457CF641D) and it’s exactly that. Average video length is 2 minutes, and then it’s practical exercises that help you learn more.

As I create my courses and use Cypress on my own, I often come across undocumented or not so widely used features that you might find helpful. Let’s jump into them.

## Routing numbered route

When using .route() command to match your path, you can use wildcards to math the exact api call you need. But sometimes it is just not enough. Your app may call the exact same endpoint twice. To write your test for these types of situations, you can select them both using an array, like this:

```js {15}
cy
  .server()
  .route('POST', '/todos')
  .as('createTodo')

cy
  .visit('/')

// create 2 todos via UI using custom command
cy
  .addTodo()
  .addTodo()

cy
  .wait(['@createTodo', '@createTodo']).then( todos => {

    expect(todos[0].status).to.eq(201)
    expect(todos[1].status).to.eq(201)

  })

```

Instead of using an array though, you can select just the second instance of routed network request. This can be done by appending the index number on to the alias itself, like this:

```js {15}
cy
  .server()
  .route('POST', '/todos')
  .as('createTodo')

cy
  .visit('/')

// create 2 todos via UI using custom command
cy
  .addTodo()
  .addTodo() // we will wait for a request that happens after this action

cy
  .wait('@createTodo.2').then( todos => {
    expect(todos.status).to.eq(201)
  })

```

> *Pro tip: did you know Cypress recently released [experimental full-layer network stubbing](https://docs.cypress.io/api/commands/route2.html)? Besides xhr requests, you can now route images, static files and fetch requests!*

## Aliasing DOM element

Routing your network calls is one of the most powerful features in Cypress. To alias them, you can use .as() command, and then use .wait() or .get() command to write a test for that network request.

You can alias your DOM elements in the same way and then use .get() command to select that element later in your test. This is especially useful when you have a list of items on the same level. For example, when using [cypress-drag-drop](https://github.com/4teamwork/cypress-drag-drop) plugin to drag an element onto another.

```js {4,9}
cy
  .get('.todo')
  .eq(2)
  .as('third')

cy
  .get('.todo')
  .eq(3)
  .as('fourth')

cy
  .get('@third')
  .drag('@fourth')

```

## Custom formatting of .log() messages

I believe that you should write end to end tests as user stories. That is why it is vital that I understand where that story got interrupted on failed test. I have been playing around with [ways to create a custom error message](https://link.medium.com/l0dRBovSX9) for some time now. Mainly because it helps a lot when debugging a failed test from screenshot, or basically captioning an end to end test. There is a way you can customize these messages using markdown formatting syntax.
```js
cy.log('normal')
cy.log('**bold**')
cy.log('_italic_')
cy.log('[blue](<http://example.com>)')
```

## Custom error messages

Beside custom .log() messages, you can customize your error messages too. I was thrilled to find out that expect() function can actually take a second parameter, which will become an error message on failure.
```js
cy
  .get('.todo')
  .then( todo => {
    expect(todo, 'Milk was not found').to.contain.text('Buy milk')
})
```

## Bonus tip: Make your DevTools open automatically in Cypress GUI:

https://twitter.com/filip_hric/status/1240700715854487553