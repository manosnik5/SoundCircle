import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";


const SignInOAuthButton = () => {
    const {signIn, isLoaded} = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = async () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback"
        });
    };

    return (
        <Button onClick={signInWithGoogle} className="px-2 py-4 bg-black text-white">Continue with Google</Button>
    )
}

export default SignInOAuthButton