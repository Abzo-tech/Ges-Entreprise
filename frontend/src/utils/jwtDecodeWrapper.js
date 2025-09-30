export async function jwtDecodeWrapper(token) {
  const module = await import('jwt-decode');
  const decode = module.jwtDecode || module.default;
  if (typeof decode !== 'function') {
    throw new Error('Unable to find jwtDecode function in jwt-decode module');
  }
  return decode(token);
}
