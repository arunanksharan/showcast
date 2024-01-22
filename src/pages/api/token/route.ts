import { AccessToken, Role } from '@huddle01/server-sdk/auth';
import * as jose from 'jose';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Get roomId and appPubKey from request body
  const { roomId, appPubKey } = await request.json();

  // Get idToken from request header
  const idToken = request.headers.get('authorization')?.split(' ')[1];

  if (!idToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Need to understand this better - where to generate a jwks?
  const jwks = jose.createRemoteJWKSet(
    new URL('https://api-auth.web3auth.io/jwks')
  );

  // algorithms to use to verify the jwt
  const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
    algorithms: ['ES256'],
  });

  // Verify that decoded jwt has the same appPubKey as the one sent from client
  if ((jwtDecoded.payload as any).wallets[0].public_key === appPubKey) {
    // Generate Access Token if verification is successful
    const accessToken = new AccessToken({
      apiKey: process.env.API_KEY!,
      roomId: roomId as string,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
      options: {
        metadata: {
          displayName: (jwtDecoded.payload as any).name,
        },
      },
    });
    const token = await accessToken.toJwt();
    return new Response(token, { status: 200 });
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
