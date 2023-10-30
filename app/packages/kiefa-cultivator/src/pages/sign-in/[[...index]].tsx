import { SignIn, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";
import * as React from "react";

const SignInPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const { signIn, setActive } = useSignIn();

  React.useEffect(() => {
    if (signIn && token && typeof token == "string") {
      signIn
        .create({
          strategy: "ticket",
          ticket: "signInToken",
        })
        .then((signInRes) => {
          setActive({
            session: signInRes.createdSessionId,
          });
        });
    }
  }, [signIn, setActive, token]);

  return <SignIn />;
};

export default SignInPage;
