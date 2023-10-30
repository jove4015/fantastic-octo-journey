## Intro
We are facing a problem with Clerk where it generates a lot of unhandled exceptions from TRPC whenever there is a stale JWT. We have TRPC listed in our publicRoutes. The goal is for authenticaton to take place, and for the Clerk session to be set up, but for TRPC to be the one to actually send the 401 response. When TRPC returns the 401, it will also return a well-formed TRPCError object, which the client can then handle. This is the expected behavior.

What happens now is, Clerk short-circuits the requests and sends a null response directly back once it realizes the JWT is stale. No other handlers are fired in between, there's nowhere to intercept this and redirect thse behavior. Once this gets to the client side, the TRPC client (who made the request) gets back the 401 and runs its callbacks, and the first step of that is decoding the response, which it just assumes is a valid JSON representing a TRPCError. It expects all errors that it gets to be fully formed TRPCErrors.

## To reproduce:

1. Open this page. A TRPC query is running whose output is displayed at the bottom of the page, along with a button where this query can be refetched manually at any time.
2. To create a stale JWT: figure out what domain Clerk is being served from. In our case clerk pulls its tokens from clerk.renewing.oryx-46.lcl.dev. Use your system's host file to redirect this domain to a random address (ie, 169.254.5.5).
3. Now that access to Clerk is blocked, wait 2-3 minutes for the JWT in the cache to expire. Open your developer console, and click the refetch button until it starts returning 401 errors.
4. In your console, you will see an unhandled exception.
5. Follow the path of the request through the code below, and you'll see that the request is short-circuited.

## To run:

1. cd app/packages/kiefa-cultivator
2. docker-compose up -d
3. Go to http://localhost:3000/

[See more images and explanation by running the demo!](https://github.com/jove4015/fantastic-octo-journey/blob/f6b4a6d2c99741b5bffc73ff576b1392dc390f08/app/packages/kiefa-cultivator/src/pages/index.tsx#L21)https://github.com/jove4015/fantastic-octo-journey/blob/f6b4a6d2c99741b5bffc73ff576b1392dc390f08/app/packages/kiefa-cultivator/src/pages/index.tsx#L21

[Link to your local](http://localhost:3000/)
