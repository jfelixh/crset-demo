import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const publicPaths = ['/api/generateWalletUrl', '/api/callback','/images','/api/presentCredential','/api/clientMetadata','/api/authorizationCheck','/credentialIssuance'];
    //console.log("logging middleware")

    const pathname = req.nextUrl.pathname;
    //console.log('Request pathname:', pathname); // Debug log
    for (const path of publicPaths) {
        if (pathname.startsWith(path) || pathname ==="/") {
            return NextResponse.next();
        }
    }
    const cookies = req.headers.get('cookie');
    let authToken = null;

    if (cookies) {
        // Parse the cookies to find the authToken
        const cookieArray = cookies.split(';').map(cookie => cookie.trim());
        authToken = cookieArray.find(cookie => cookie.startsWith('authToken='));
    }
    console.log("authToken: ", authToken)

    if (!authToken) {
        console.log("redirected to homepage")
        return NextResponse.redirect(new URL('/', req.url));
    }

}
export const config = {
    matcher: [ '/api/:path*', '/((?!api|_next|public).*)'], // Protect these routes
};