---
title: "Migrating .route() to .intercept() in Cypress"
date: 2020-12-07
published: true
slug: "migrating-route-to-intercept-in-cypress"
description: "With version 6.0.0 of Cypress.io, the network layer was completely rewritten. This post will guide you through the process of migration to the new experience."
tags: ['network', 'guides', 'testing', 'cypress']
---
With version 6.0.0 a new command by the name of `.intercept()` has been landed to Cypress.io. [I have written a blog about this](/playing-with-experimental-network-stubbing) command while it was still called `.route2` and it was available as an experimental feature. You can judge by the name, that there was clearly an intent to substitute the old command with the new one. Once the newest version came out, deprecating of `.route()` command was announced. It will no longer be supported as of version 7.0.0, which means we all have some migrating to do.

## Reasons to migrate
First of all, the new `.intercept()` command is awesome. It supports fetch, it can intercept both request and response of your app API calls and so much more. The other reason why you should consider migrating your `.route()` to `.intercept()` right now becomes apparent when you look into [Cypress roadmap](https://docs.cypress.io/guides/references/roadmap.html#Upcoming-features). Cypress is currently working on multi-domain support (OMG!) and plans to implement other cool features as [Session API](https://docs.cypress.io/guides/references/roadmap.html#Upcoming-features), file download and iframe support. You definitely don’t want to miss these, so keeping up with latest version is a good idea.

## Syntax differences
Looking into documentation, you can find some obvious differences between `.route()` and `.intercept()`:

```ts
cy.route(url)
cy.route(url, response)
cy.route(method, url)
cy.route(method, url, response)
cy.route(callbackFn)
cy.route(options)
```

```ts
cy.intercept(url, routeHandler?)
cy.intercept(method, url, routeHandler?)
cy.intercept(routeMatcher, routeHandler?)
```
The coolest additions to `.intercept()` command are `routeMatcher` and `routeHandler` arguments.

`routeMatcher` unleashes some amazing capabilities of matching your application API calls. Besides minimatch and RegEx, you can now specify your match by query, headers or even port or just path without query parameters. That is some power!

`routeHandler` gives you some amazing options on intercepting and stubbing API responses. You can use `.intercept()` command to stub your responses, but you can do so much more! You can change headers on your API calls, dynamically change just parts of your response or your request. It really seems like there’s not much you cannot do with your network calls.

To make these cool new features available to you, you should slowly start to migrate your `.route()` commands to `.intercept()`. Once you are done, you can completely delete any `.server()` command call as this is deprecated too.

## Simple use cases
If you used `.route()` command just for routing and waiting for your API calls, then the migration should be pretty easy for you.

These commands:
```ts
cy.route('/boards').as('getBoards')
cy.route('POST', '/lists').as('createList')
cy.route('PATCH', '/tasks/*').as('updateTask')
```
Can easily just become these:
```ts
cy.intercept('/boards').as('getBoards')
cy.intercept('POST', '/lists').as('createList')
cy.intercept('PATCH', '/tasks/*').as('updateTask')
```
For cases like these, you just need to change the name of your commands. But there are some slight differences when you start testing matched API calls.

## Testing routed API calls
I often used `.wait()` command to check a status, response and/or request body. My assertions often looked like this:
```ts
cy.route('POST', '/boards').as('createBoard')

// ...

cy
  .wait('@createBoard')
  .then(({ requestBody, responseBody, status }) => {

    expect(status).to.eq(201);
    expect(requestBody.name).to.eq('new board');
    expect(responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
    expect(responseBody.name).to.eq('new board');
    expect(responseBody.starred).to.be.false;

  });
```
With `.intercept()` the yielded API call body is slightly different. The biggest change is that `status` is now `statusCode` and is part of `response` object, and there are no longer `requestBody`, `responseBody` shorthands. They were probably not widely used, but I’ll miss them. With API call matched by `.intercept()` command, the same assertion would look something like this:
```ts
cy.intercept('POST', '/boards').as('createBoard')

// ...

cy
  .wait('@createBoard')
  .then(({ request, response }) => {

    expect(response.statusCode).to.eq(201);
    expect(request.body.name).to.eq('new board');
    expect(response.body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
    expect(response.body.name).to.eq('new board');
    expect(response.body.starred).to.be.false;

  });
```
## Stubbing your responses
With `.route()` you could pass your JSON file as a third argument. This would effectively use this JSON as a response of routed request. With `.intercept()` you’ll need to rewrite this command. The old route command:
```ts
cy.route('GET', '/boards', 'fx:boardList')
```
Needs to become:
```ts
cy.intercept('GET', '/boards', {
  fixture: 'boardList'
})
```
You can of course still pass an object or array as a response. In that case, you would use `body` instead of `fixture`:
```ts {12}
const customResponse = [
    {
      "name": "new board",
      "id": 2,
      "starred": false,
      "created": "2020-12-07"
    }
  ]

cy.intercept('GET', '/boards', {
  body: customResponse,
  status: 500
})
```
As you can see in example, you can still change status code and even headers, just as you could with `.route()`. Everything you need just needs to be passed to the `routeHandler` object.

## There is so much more
Migrating your `.route()` to `.intercept()` is just a first step. Network handling was completely rewritten with v6 and it enables you do much more. I will be exploring the possibilities of this new command on my next [Twitch stream](https://www.twitch.tv/filip_hric), which you can catch later on my [YouTube channel](https://www.youtube.com/channel/UCDOCAVIhSh5VpJMEfdak1OA). In the meantime, if you want to learn more, I recommend reading my [older blog](https://filiphric.com/playing-with-experimental-network-stubbing) on capabilities of `.intercept()` command (which was then called `.route2()`).

I also recommend checking out blogs by [Gleb Bahmutov](https://twitter.com/bahmutov), who [wrote a summary blog](https://glebbahmutov.com/blog/cy-route-vs-route2/) on differences between these commands, [made a video about it](https://www.youtube.com/watch?v=_wfKbYQlP_Y) and again, [wrote a blog](https://glebbahmutov.com/blog/smart-graphql-stubbing/) on how you can use this new command for stubbing GraphQL. That guy is on fire 🔥

If you are on a reading spree, I also recommend reading a [great blog](https://www.cypress.io/blog/2020/11/24/introducing-cy-intercept-next-generation-network-stubbing-in-cypress-6-0/) by [Amir Rustamzadeh](https://twitter.com/amirrustam) that came out with Cypress v6 release.

And don’t forget the [documentation](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route).