/* eslint-disable */

import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <div className="flex justify-center items-center w-full my-10">
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      redirectUrl="/channel"
    />
  </div>
);
export default SignUpPage;
