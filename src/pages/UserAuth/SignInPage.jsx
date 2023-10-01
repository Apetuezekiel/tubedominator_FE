/* eslint-disable */

import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex justify-center items-center w-full my-10">
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      redirectUrl="/ideation"
    />
  </div>
);
export default SignInPage;
