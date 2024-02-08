import axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';

const baseAppUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export const farcasterConfig = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: 'https://relay.farcaster.xyz',
  // rpcUrl: 'https://mainnet.optimism.io',
  rpcUrl:
    'https://opt-mainnet.g.alchemy.com/v2/TcSIWI9vCZw_u6ztvDp0DC2UFl5pgxap',
  // domain: baseAppUrl,
  // siweUri: 'https://example.com/login',
  // domain: 'http://localhost:3000',
  // siweUri: `${baseAppUrl}/login`,
  domain: 'https://showcast.vercel.app',
  siweUri: 'https://showcast.vercel.app/login',
};

console.log(
  'process.env.NEXT_PUBLIC_BASE_URL',
  process.env.NEXT_PUBLIC_BASE_URL
);

console.log('farcasterConfig', farcasterConfig);

/** Entire Cookies section has been disabled
 * ToDo: Enable cookies
 */
const setHeaders = (apiKey?: string) => {
  const additionalHeaders: Record<string, string> = {};
  additionalHeaders['Content-Type'] = 'application/json';
  additionalHeaders['Accept'] = 'application/json';

  if (apiKey) {
    additionalHeaders['apiKey'] = apiKey;
  }

  //   const cookies = new Cookies();
  //   const authCookie = cookies.get(AUTH_TOKEN_LABEL);
  //   if (authCookie && !secretKey) {
  //     additionalHeaders['Authorization'] = 'Bearer ' + authCookie;
  //   }
  //   if (secretKey && body) {
  //     const { signature, nonce, timestamp } = getExternalAPISignature(
  //       body,
  //       secretKey
  //     );
  //     additionalHeaders['signature'] = signature;
  //     additionalHeaders['timestamp'] = timestamp.toString();
  //     additionalHeaders['nonce'] = nonce;
  //   }

  return additionalHeaders;
};

export const postRequest = (
  url: string,
  data: any,
  apiKey?: string
): AxiosRequestConfig => {
  const options: AxiosRequestConfig = {
    method: 'POST',
    baseURL: baseAppUrl,
    url,
    data,
    headers: setHeaders(apiKey),
  };
  if (data) {
    options.data = data;
  }

  options.headers = setHeaders(apiKey);

  return options;
};

export const getRequest = (url: string, apiKey?: string) => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    baseURL: baseAppUrl,
    url,
  };
  options.headers = setHeaders(apiKey);

  return options;
};

export const putRequest = (url: string, data: any): AxiosRequestConfig => {
  const options: AxiosRequestConfig = {
    method: 'PUT',
    baseURL: baseAppUrl,
    url: url,
  };

  if (data) {
    options.data = data;
  }

  options.headers = setHeaders();

  return options;
};

export const deleteRequest = (url: string, data: any) => {
  const options: AxiosRequestConfig = {
    method: 'DELETE',
    baseURL: baseAppUrl,
    url: url,
  };
  if (data) {
    options.data = data;
  }
  options.headers = setHeaders();
  return options;
};

export const patchRequest = (url: string, data: any) => {
  const options: AxiosRequestConfig = {
    method: 'PATCH',
    baseURL: baseAppUrl,
    url: url,
  };
  if (data) {
    options.data = data;
  }
  options.headers = setHeaders();
  return options;
};

/** xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
/** xxxxxxxxxxxxx Ignore :: Not relevant for Huddle API xxxxxxxxxxxxx */
export const getExternalAPISignature = (
  body: Record<any, any>,
  secretKey: string
) => {
  const date = new Date();
  const timestamp = Math.floor(date.getTime() / 1000) * 1000;

  const nonceLengthBytes = 32; // Adjust the length as needed

  // Generate a random nonce as a hexadecimal string
  const randomNonceBuffer = crypto.randomBytes(nonceLengthBytes);
  const nonce = randomNonceBuffer.toString('hex');

  const payload = timestamp + '\n' + nonce + '\n' + JSON.stringify(body) + '\n';

  const hmac = crypto.createHmac('sha512', secretKey);
  hmac.update(payload);

  const signature = hmac.digest('hex').toUpperCase();

  console.log({ secretKey, body, nonce, timestamp, signature, payload });

  return { signature, nonce, timestamp };
};
