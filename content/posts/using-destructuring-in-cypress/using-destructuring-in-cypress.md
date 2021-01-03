---
slug: using-destructuring-in-cypress
date: 2020-11-02
title: 'Using destructuring in Cypress'
published: true
description: 'Short explanation on destructuring in JavaScript and its application in your Cypress tests.'
tags: ['basics', 'javascript', 'cypress', 'beginner']
---
I often learn something new because I need to solve some kind of problem. Once that is solved, I move on to the next one. I spend a lot of time reading, thinking, trying stuff and trying to make sense of it all. One downside of my learning style is that sometimes I miss some basic stuff. This is a blog about one particular topic. Destructuring.

I have seen destructuring many times when reading someone else’s code, and I had a hard time wrapping my head around it. Mostly because I had no use for it when writing tests in Cypress, which is something I do most of the time. If you are using Cypress as well and you are still learning JavaScript, this blog may be for you.

Let’s say you have a simple object like this:

```js {7}
const car = {
  color: 'red',
  type: 'combi',
  autopilot: false
}

const color = car.color

console.log(color) // 'red'

```
In your code, you may want to use properties of this object. Let’s say you are going to use the color `red` a lot in your code. You might want to assign it to a separate variable like you can see on line 7.

Whenever you now reference the `color` variable, it will return `red`. Notice that the name of our newly declared variable is the same as the name of the key of our object. To do the same thing, but using destructuring, you can do following:

```js {7}
const car = {
  color: 'red',
  type: 'combi',
  autopilot: false
}

const { color } = car

console.log(color) // 'red'
```
Notice how the result is exactly the same. We have created a variable with a name `color`, that will have a value of `red` when we call it.

Now let’s say we want to create a function, that will take a single argument. Inside this function, we have a simple `console.log`, that will output `color` and `type` attributes of a given object. The function looks like this:

```js {5}
const func = (param) => {
  console.log(param.color, param.type)
}

func(car) // red combi
```

We’ll pass our `car` object from before to this function, and you can notice the result on line 5. Notice how we create a `param` for our function, which is later used inside the body of the function. Now that we know how destructuring works for objects, we can use it and refactor our function like this:

```js
const func = ({ color, type }) => {
  console.log(color, type)
}

func(car) // red combi
```
We did the exact thing as in our first example, but this time we used destructuring inside our function parameter. Go back and look at how similar these examples are. The cool thing about using destructuring like this is that we can avoid creating a generic parameter like `param` in our function.

The most common use for destructuring in Cypress tests is for situations where I’m passing a yielded object to a `.then()` command:

```js {6-9}
it('creates a todo', () => {

  cy.intercept('POST', '/todos').as('createTodo')
  cy.visit('/')
  cy.addTodo('buy milk') // create a todo via UI using custom command
  cy.wait('@createTodo').then( todos => {
      expect(todos.status).to.eq(201)
      expect(todos.responseBody).to.deep.eq({ title: 'buy milk' })
    })

})
```
Notice how I create a `todos` parameter, similar to our `params` from previous example. I use that to make my assertions inside `.then()` command. Instead of doing this, I can refactor this code using destructuring:
```js {6-9}
it('creates a todo', () => {

  cy.intercept('POST', '/todos').as('createTodo')
  cy.visit('/')
  cy.addTodo('buy milk') // create a todo via UI using custom command
  cy.wait('@createTodo').then( { status, responseBody } => {
      expect(status).to.eq(201)
      expect(responseBody).to.deep.eq({ title: 'buy milk' })
    })

})
```
I think this is pretty neat. I don’t use extra parameters in my code and I can clearly see what I am testing inside my `.then()` command. I bet there are tons of great use cases for destructuring in Cypress that I’m still about to discover. If you know of any, don’t forget to [let me know on Twitter](https://twitter.com/filip_hric), I’d love for you to share your knowledge with me.

Hope this helps. Check out my other blogs and if you like these, feel free to subscribe. You’ll get notified whenever I publish another blog.