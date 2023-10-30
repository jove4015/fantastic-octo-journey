import * as React from "react";
import type { NextPage } from "next";
import { trpc } from "~/utils/trpc";
import Image from "next/image";
import step1 from "../../public/authMiddleware - step 1.png";
import step2 from "../../public/authenticateRequest - step 2.png";
import step3 from "../../public/utils - step 3.png";
import step4 from "../../public/trpc httpLink - step 4.png";
import step5 from "../../public/transformResult - step 5.png";
import hosts from "../../public/hosts.png";
import unhandled from "../../public/unhandled.png";

const Home: NextPage = () => {
  const [showImages, setShowImages] = React.useState(false);
  const testQuery = trpc.test.test.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  return (
    <div>
      <h1>Intro</h1>
      <p>
        We are facing a problem with Clerk where it generates a lot of unhandled
        exceptions from TRPC whenever there is a stale JWT. We have TRPC listed
        in our publicRoutes. The goal is for authenticaton to take place, and
        for the Clerk session to be set up, but for TRPC to be the one to
        actually send the 401 response. When TRPC returns the 401, it will also
        return a well-formed TRPCError object, which the client can then handle.
        This is the expected behavior.
      </p>
      <p>
        What happens now is,{" "}
        <a
          href="https://github.com/clerkinc/javascript/blob/e5598cfb1f4d5e608650402f43bbd6d85e04d9b4/packages/nextjs/src/server/utils.ts#L219"
          target="_blank"
        >
          Clerk short-circuits the requests
        </a>{" "}
        and sends a null response directly back once it realizes the JWT is
        stale. No other handlers are fired in between, there's nowhere to
        intercept this and redirect thse behavior. Once this gets to the client
        side, the TRPC client (who made the request) gets back the 401 and runs
        its callbacks, and the first step of that is decoding the response,
        which it just assumes is a valid JSON representing a TRPCError. It
        expects all errors that it gets to be fully formed TRPCErrors.
      </p>
      <p>
        <strong>To reproduce:</strong>
      </p>
      <ol>
        <li>
          Open this page. A TRPC query is running whose output is displayed at
          the bottom of the page, along with a button where this query can be
          refetched manually at any time.
        </li>
        <li>
          To create a stale JWT: figure out what domain Clerk is being served
          from. In our case clerk pulls its tokens from
          clerk.renewing.oryx-46.lcl.dev. Use your system's host file to
          redirect this domain to a random address (ie, 169.254.5.5).
        </li>
        <Image src={hosts} alt="Hosts file example" width={500} />
        <li>
          Now that access to Clerk is blocked, wait 2-3 minutes for the JWT in
          the cache to expire. Open your developer console, and click the
          refetch button until it starts returning 401 errors.
        </li>
        <li>In your console, you will see an unhandled exception:</li>
        <Image src={unhandled} alt="Unhandled Exception" width={500} />
      </ol>
      <p
        onClick={() => setShowImages((s) => !s)}
        style={{
          textDecoration: "underline",
          color: "blue",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Follow the path of the request through the code below, and you'll see
        that the request is short-circuited.
      </p>
      <ol style={{ display: showImages ? "block" : "none" }}>
        <li>
          <Image src={step1} alt="authMiddleware - step 1" />
        </li>
        <li>
          <Image src={step2} alt="authenticateRequest - step 2" />
        </li>
        <li>
          <Image src={step3} alt="utils - step 3" />
        </li>
        <li>
          <Image src={step4} alt="trpc httpLink - step 4" />
        </li>
        <li>
          <Image src={step5} alt="transformResult - step 5" />
        </li>
      </ol>
      <p>
        Output from testQuery: {testQuery.data?.message} /{" "}
        {testQuery.data?.user} / {testQuery.data?.org}
      </p>
      <p>Last updated: {new Date(testQuery.dataUpdatedAt).toLocaleString()}</p>
      <button onClick={() => testQuery.refetch()}>
        Refetch testQuery manually
      </button>
    </div>
  );
};

export default Home;
