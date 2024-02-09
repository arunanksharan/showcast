import React from 'react'
import { SignInButton } from "@farcaster/auth-kit";
import classNames from 'classnames';

const ShowcastLoginBtn: React.FC<any> = ({ fullWidth, className, ...props }) => {
    return (
        <span className={classNames(
            "showcast-login-btn",
            fullWidth ? "w-full" : "w-auto",
            className
        )}>
            <SignInButton {...props} />
        </span>
    )
}

export default ShowcastLoginBtn