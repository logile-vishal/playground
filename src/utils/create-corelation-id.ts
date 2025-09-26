function generateShortUUID () {
  return Math.random().toString(36).substring(2, 10);
}

export function createCorrelationId () {
  const timestamp = new Date().getTime();
  const randomPart = generateShortUUID();
  return `${timestamp}-${randomPart}`;
}