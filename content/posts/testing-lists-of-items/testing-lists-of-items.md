---
title: "Testing lists of items"
date: 2020-04-06
published: true
slug: "testing-lists-of-items"
description: "Short description of various ways of testing list of items using Cypress, utilizing Cypress’ retryability."
tags: ['cypress', 'commands', 'retryability']
---

## TL;DR:

- *you can test your lists using .then() or .each()*
- *Cypress retries can help you test changes in your app*
- *you can pass a function to .should() command*


> You can try out all the examples in this blog by [cloning my repo](https://github.com/filiphric/testing-lists). The app is there too.

Hello everyone 👋 We are going to test a list of todo items today. In my job as QA in [Slido](https://www.sli.do/), I test lists a lot. In this blog I’m sharing some of my tips on how to that.

We can start by testing a list with two items. In a situation where we test a couple of items, the testing flow can be pretty straightforward. In our first test, we use **.get()** to select our todo items and then **.eq()** to filter the item we want to work with. Code looks something like this:
``` js
const todos = require('../fixtures/twoTodos')

beforeEach( () => {
  cy
    .request('POST', '/todos/seed', todos)
  cy
    .visit('localhost:3000');
});

it('Checks texts of todo items', () => {
  cy
    .get('.todo')
    .eq(0)
    .should('contain.text', 'buy milk');
  cy
    .get('.todo')
    .eq(1)
    .should('contain.text', 'wash dishes');
});

```

<v-video alt="Selecting each item individually" src="selecting_each_item_individually.mp4"></v-video>

We can make this code more compact. Instead of selecting each element individually, we can select them both and make a single assertion using [.then()](https://docs.cypress.io/api/commands/then.html). When **.get()** command finds multiple elements it returns an array. This means we can reference each item as we would in an array, using **items[i]** where **i** is the index number.

```js
it('Checks texts of todos items', () => {

  cy
    .get('.todo').then( items => {

      expect(items[0]).to.contain.text('buy milk')
      expect(items[1]).to.contain.text('wash dishes')

    })

});
```

<v-video alt="Selecting both items and making a single assertion" src="selecting_both_items_and_making_a_single_assertion.mp4"></v-video>

## Testing longer lists

While this approach is nice, we might get into a situation where want to test longer lists. With 10 or more items, our code might get repetitive. So instead, we can select our todo items, and then use [.each()](https://docs.cypress.io/api/commands/each.html#Syntax) command. This command works very similarly to a **[array.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)** function and it enables us to work with items that are yielded via **.get()** command.

```js
it('Checks texts of todos item', () => {

  const todosTitles = ["buy milk", "wash dishes", "clean windows", "clean up bedroom", "wash clothes"]

  cy
    .get('.todo').each( (item, index) => {

      cy
        .wrap(item)
       .should('contain.text', todosTitles[index])

    })

});

```

<v-video alt="Testing a longer todo list using .each() command" src="testing_a_longer_todo_list_using_each_command.mp4"></v-video>

## Checking position of a certain todo item

Now let’s say, we want to check an item being on a first position, but our test starts with a different state. Imagine this is a live collaborative todo list and that we want to test a scenario where another user changes the todo list.

Here we have a test, that should have an item with the text „wash dishes“ on a first position. Our test starts with the item on second position, and during the test, we delete the first item.

```js
it('Has first todo item with text "wash dishes"', () => {

  cy
    .get('.todo')
    .eq(0)
    .should('contain.text', 'wash dishes');

});
```

<v-video alt="Failed test" src="failed_test.mp4"></v-video>

But this test fails! The reason is that Cypress’ automatic retries don’t query the whole command chain, only the last command. In other words, our **.eq(0)** is retried, but our **.get('.todo')** command is not. This means we are stuck with 3 todo items even after we delete the first one. See how the little blue “number 3" does not change after we delete the first todo item. There is a great article about this in **[Cypress documentation](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried)**. To solve this problem, we can add an assertion for the length after our **.get('.todo')** command, so that we first assert the correct number of todo items and then assert the text of the first one.

```js
it('Has first todo item with text "wash dishes"', () => {

  cy
  .get('.todo')
  .should('have.length', 2)
  .eq(0)
  .should('contain.text', 'wash dishes');

});
```

<v-video alt="Our test moves to next command only after assertion passes" src="our_test_moves_to_next_command_only_after_assertion_passes.mp4"></v-video>

This solution is not really satisfying, is it? We may be facing a situation where the *number of our items does not change*, but only the order of our items changes. Because we can use drag and drop in our app 😎. In that case, we can use **.should()** command and pass a function into it. There are many [cool examples in the documentation](https://docs.cypress.io/api/commands/should.html#Function) on this. The final code looks very similar to when we are using .then(). The main difference is, that **.should()** commands uses retries logic, but **.then()** not use retry.

```js
it('Has first todo item with text "wash dishes"', () => {

  cy
    .get('.todo').should( items => {

      expect(items[0]).to.contain.text('wash dishes')
      expect(items[1]).to.contain.text('buy milk')

    })

});
```

<v-video alt="Passing test" src="passing_test.mp4"></v-video>

That’s it. Hope you enjoyed this.