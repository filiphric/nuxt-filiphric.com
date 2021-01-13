---
title: "Playing with experimental network stubbing feature in Cypress"
date: 2020-09-28
published: true
slug: "playing-with-experimental-network-stubbing"
description: "Exploring the capabilities of new .route2() command that was released with Cypress version 5.1.0"
author: "Filip Hric"
tags: ['intercept', 'network', 'cypress']
---
>EDIT: Experimental network stubbing was released with v6 and `.route2()` command was renamed to `.intercept()`. Also, `.route()` command was deprecated in this version. To see how you can migrate your `.route()` commands to `.intercept()`, I recommend [reading my blogpost](/migrating-route-to-intercept-in-cypress) on it. You’ll find examples and many useful links there.

In the beginning of September, Cypress released a new experimental feature called `experimentalNetworkStubbing`. I was watching development on Github for a while and was really excited when I started seeing some [rapid movement on the issue](https://github.com/cypress-io/cypress/issues/687). I decided to have a closer look into what it does. I share code examples here, but if you want to play with this I have put together a [quick and dirty repo](https://github.com/filiphric/route2-showcase). Clone → npm install, → npm start → npx cypress open and you’re good to go.

With version 5.1.0 or higher, you can enable this feature by adding following line into your cypress.json file:

```json
{
	"experimentalNetworkStubbing": true
}
```

This enables you to use `.route2()` command which is [described in Cypress documentation](https://docs.cypress.io/api/commands/route2.html). Imagine  `.route()` command, but on steroids.  You’ll see in a minute.

## The power of .route()

If anyone ever asked me about my favourite command in Cypress, it would be `.route()`. With a simple syntax you can watch your api call being made:

```js
cy
  .server()
  .route({
    method: 'GET',
    url: '/todos'
  }).as('todoslist');

cy
  .visit('/'); // open page

cy
  .wait('@todoslist'); // items load from server via api
```

After our app is opened, it loads a list of items from database. To do that, it calls a `GET` request to the  `/todos` url. Response comes back as a simple json file which is then rendered in our app. If you want to change this response and provide your app with your own json list of items, just add another parameter:

```js {6}
cy
  .server()
  .route({
    method: 'GET',
    url: '/todos',
    response: 'fx:items' // fixtures/items.json
  }).as('todoslist');

cy
  .visit('/'); // open page

cy
  .wait('@todoslist'); // items load from server via api
```

This is simple, yet very powerful thing you do to test your application. `.route()` command enables you to look into any xhr request your application makes and test it. You can combine your api and ui tests into one.

The problem with this command though, is that you can only work with xhr requests. This rules out fetch requests, or other assets loaded via network. If you tried to route fetch request, you would end up like this:

<v-video alt="Fetch requests not working in Cypress" src="fetch_requests_not_working_in_cypress.mp4"></v-video>

## The power of .route2()

With `.route2()` command you can route fetch requests just as you would do with XHR. Pretty neat.

```js {15}
cy
  .route2({
    method: 'POST',
    path: '/todos'
  })
  .as('createTodo');

cy
  .visit('/');

cy
  .addItem('new todo item'); // fetch request fired when adding item

cy
  .wait('@createTodo'); // it works!!
```

That’s not all though. You can route static files such as css or images. This can become super handy if you want to test a website with lazy loaded images:

```js {2, 6}
cy
  .route2('/vendor/index.css')
  .as('css');

cy
  .route2('/vendor/cypress-icon.png')
  .as('logo');

cy
  .visit('/');

cy
  .wait('@css')
  .wait('@logo');
```

But there’s more! With `.route2()` command you can not only change response of your api call, but also request itself. Let’s say we want to add a custom header to our request to let the server know that these are coming from application that is being tested at the moment. You can manipulate your request headers like this:

```js {6}
cy
  .route2({
    method: 'POST',
    path: '/todos'
  }, (req) => {
    req.headers['Mr-Meeseeks'] = 'Look at me!!';
  })
  .as('createTodo');

cy
  .visit('/');

cy
  .addItem('new todo item');
```

This new header cannot be observed in network panel in DevTools, because the request manipulation actually happens outside of browser - before the request is sent to the server. Because of that, DevTools show the original request headers. But in the terminal where you ran your `npm start` command, you can see that I’m logging all request headers for `POST /todos` request and our newly added header is visible there:

```bash {16}
{
  connection: 'keep-alive',
  host: 'localhost:3000',
  'proxy-connection': 'keep-alive',
  'content-length': '61',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
  'content-type': 'application/json',
  accept: '*/*',
  origin: 'http://localhost:3000',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  referer: 'http://localhost:3000/',
  'accept-encoding': 'gzip',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'mr-meeseeks': 'Look at me!!'
}
```

In the same way we have changed our headers, we are able to change request body. Our application takes title of todo item from our text input. Once we hit enter key, that input is sent via fetch request to our server. When using `.route2()` we can actually change what is being sent to server, or even add our own data.

```js
cy
  .route2({
    method: 'POST',
    path: '/todos'
  }, (req) => {
    const requestBody = JSON.parse(req.body);

    req.body = JSON.stringify({
      ...requestBody,
      title: 'Wubba Lubba Dub Dub!'
    });
  })
  .as('createTodo');

cy
  .visit('/');

cy
  .addItem('new todo item');
```
<v-video alt="Changing network request body in Cypress" src="changing_network_request_body_in_cypress.mp4"></v-video>

All these examples can be found in a [repo that I have put together for this blog](https://github.com/filiphric/route2-showcase). Feel free to play around with it and [let me know on twitter](https://twitter.com/filip_hric), what you think of this new feature. In my perspective Cypress team has done amazing job here, and I’m excited about possibilities this change will bring.

>EDIT: [Gleb Bahmutov](https://twitter.com/bahmutov) from Cypress [wrote a really cool blog](https://glebbahmutov.com/blog/cy-route-vs-route2/) on differences between `.route()` and `.route2()` commands, where he demonstrates some cool stuff you can do with `.route2()`. You should definitely check it out.