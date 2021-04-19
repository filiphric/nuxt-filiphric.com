---
title: "Reading and testing JSON object in Cypress"
date: 2021-04-19
published: true
slug: "reading-and-testing-json-object-in-cypress"
description: "Ever got that frustrating Cannot read property 'x' of undefined error? If you are starting with JSON objects, it is easy to get lost. In this article I hope to shed some light into how to read and test them with Cypress"
tags: ['cypress', 'json', 'data', 'fixtures', 'object']
---
You can start learning Cypress with fairly little knowledge of JavaScript. At least, that was my experience. The first roadblock I hit when I started learning was understanding how to access data in a JSON formatted response. This article is for everyone at the same point of the journey. I hope this will help you get over the roadblock.

## Accessing items in object

Let’s start simple, before we dive into the whole JSON. Let’s say we have a super-simple JSON object, that contains just a couple of keys:

```json [fixtures/cars.json]
{
  "color": "red",
  "id": 4,
  "available": false
}
```

To test such an object we can write a following test. Of course, in real world we would probably not test a fixture, but to demonstrate the point I like to keep things simple. Instead of `.fixture()` you can imagine a `.wait()` command that intercepts a network call.

```js
cy
  .fixture('cars')
  .then( car => {
    expect(car.color).to.eq("red")
    expect(car.id).to.eq(4)
    expect(car.available).to.eq(false)
  })
```

It does not matter what kind of value our object attribute has, we can access it using so-called dot notation. This is the `objectname.attribute` notation, separated by a dot, hence the name. We can use a so called bracket notation, which does exactly the same thing, but with slightly different syntax:

```js
cy
  .fixture('cars')
  .then( car => {
    expect(car['color']).to.eq("red")
    expect(car['id']).to.eq(4)
    expect(car['available']).to.eq(false)
  })
```

You might ask why would anyone choose this syntax over the dot notation which looks much more polished, especially if we were to access an attribute that’s few levels deep. With bracket syntax, you can actually pass a variable, so you can write something like this:

```js
cy
  .fixture('cars')
  .then(car => {

    const attr = 'color'
    expect(car[attr]).to.eq("red")

  })
```

While we are at it, I suggest you look into <nuxt-link to="using-destructuring-in-cypress">my blog on destructuring</nuxt-link>, which has some more tips on how to access properties inside a JSON object.

## Accessing items in array

Let’s now add another item in our `car.json` fixture. This will be a list of feature formatted as an array:

```json {5}
{
  "color": "red",
  "id": 4,
  "available": false,
  "features": ["speed limiter", "panoramic windshield", "automatic transmission"]
}
```

Let’s say we’d like to write a test for couple of these feature items. That test would look something like this.

```js
cy
  .fixture('cars')
  .then( car => {
    expect(car.features[0]).to.eq('speed limiter')
    expect(car.features[1]).to.eq('panoramic windshield')
    expect(car.features[2]).to.eq('automatic transmission')
  })
```

Notice how we use a similar style as the mentioned bracket notation. This is how you access items in and array. However, there is no dot notation for arrays, so attemting to write something like `features.1` would result in an error.

Arrays are widely used and can sometimes contain a lot of information. If you want to test an array for just a single item, you can use `include` assertion:

```js
cy
  .fixture('cars')
  .then(car => {
    expect(car.features).to.include('speed limiter')
  })
```

Fun fact - strings in JavaScript can behave like arrays. That means, we can access each letter using bracket notation, and we can use the same `include` assertion as we did in previous example:

```js
cy
  .fixture('cars')
  .then(car => {
    expect(car.color[0]).to.eq('r') // access first letter in "red"
    expect(car.color).to.include('ed')
  })
```

There are tons of different assertions you can use with arrays, and I suggest you [check out the documentation](https://docs.cypress.io/guides/references/assertions) to learn more.

## Array of objects
Let’s now combine arrays and object. Our car fixture will now have multiple objects inside it - a common situation when working with api that returns a list of items. Our JSON file will look something like this:

```json [fixtures/cars.json]
[
  {
    "color": "red",
    "id": 4,
    "available": false,
    "features": ["speed limiter", "panoramic windshield", "automatic transmission"]
  },
  {
    "color": "blue",
    "id": 7,
    "available": true,
    "features": ["speed limiter", "automatic transmission"]
  }
]
```

To test e.g. the color of our second item, we will to combine two mentioned approaches - referencing array item & referencing object key:

```js
cy
  .fixture('cars')
  .then(cars => {
    expect(cars[1].color).to.eq('blue')
  })
```

With `cars[1]`, we are selecting the second item from our array of objects, and within that object, we are using `.color` to select the proper value from that object. In other words, we are travelling through the JSON structure. We could of course also use bracket notation and write the same thing like this:

```js
cy
  .fixture('cars')
  .then(cars => {
    expect(car[1]['color']).to.eq('blue')
  })
```

These combinations can be overwhelming at first, but they become natural after a while. Chrome DevTools can be a great help here. Right click on a JSON object can trigger a menu from where you can copy an attribute path to a given value. This works across many places in Chrome DevTools.

<v-img alt="Copy property path in DevTools" src="devtools.png"></v-img>


## Common error #1 - Comparing arrays
While trying to find your way around JSON objects, you might come across different errors. For example, there’s this strange behavior when you try to compare our `car.features` array to another array. Let’s say we have an assertion like this:

```js
cy
  .fixture('cars')
  .then(cars => {
    expect(cars[0].features).to.eq(["speed limiter", "panoramic windshield", "automatic transmission"])
  })
```

Although it looks like it should definitely pass, our test will fail. What’s even weirder, is the error in the console:

<v-img alt="Equal does not work" src="equal.png"></v-img>

Everything looks the same, so why does the test fail?

The reason why this is happening is because of how comparison is made in JavaScript. It is very similar to the reason why `'1' == 1` will return `true`, but `'1' === 1` will return `false`. The difference is connected to how strict that comparison is. When comparing two arrays, we need to use `deep.eq` instead of `eq` in our test.

## Common error #2 - Cannot read property 'x' of undefined

Mistakes happen while figuring out the proper path to a property. You may have already encountered an error similar to the one mentioned in subheading. This error can get super confusing and does not tell us a whole lot about what is the problem.

To dive deeper into the problem, let’s expand our JSON file with some extra attributes:
```json [fixtures/cars.json]
[
  {
    "color": "red",
    "id": 4,
    "available": false,
    "features": ["speed limiter", "panoramic windshield", "automatic transmission"],
    "engine": {
      "horsepower": 134,
      "rpm": 6000,
      "fueling system": "turbo/GDI"
    }
  },
  {
    "color": "blue",
    "id": 7,
    "available": true,
    "features": ["speed limiter", "automatic transmission"],
    "engine": {
      "horsepower": 175,
      "rpm": 6000,
      "fueling system": "MPI"
    }
  }
]
```

We’ve added some `engine` attributes, so let’s test them with following test:

```js
cy
  .fixture('car')
  .then(cars => {
    expect(cars[0].engines.horsepower).to.eq(134)
  })
```

This test will fail with a following error:

<v-img alt="Cannot read property 'x' of undefined" src="cannot-read-property-x-of-undefined.png" shadow="shadow-md"></v-img>

The reason why this test fails is that the `horsepower` key cannot be found. The `of undefined` part points us closer to the reason. It seems that key that should be inside `engines` attribute is not defined.

What I usually do in these types of cases is that instead of the whole path, I try to `console.log()` out the parent attribute and then continue up with each parent until I find something that can help me find a way.

If I do it in this case, I quickly realize that I made a typo and instead of `engines` I should have typed `engine`. This seems like an obvious mistake in this example. But things can get pretty tricky with huge payloads that contain multiple levels of information.

I hope this will help you with working with JSON objects. I write a blog like this every week, so if you’d like to get notified, signup for the newlsetter (form is in footer) and follow me on [Twitter](https://twitter.com/filip_hric/) or [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/).