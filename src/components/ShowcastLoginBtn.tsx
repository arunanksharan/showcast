import React from 'react'
import { SignInButton } from "@farcaster/auth-kit";

const ShowcastLoginBtn: React.FC<any> = props => {
    return (
        <span className="showcast-login-btn">
            <SignInButton {...props} />
        </span>
    )
}

export default ShowcastLoginBtn