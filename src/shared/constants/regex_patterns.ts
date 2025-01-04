export const patternNoScript: RegExp = new RegExp(
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
);

export const patternEmailIsValid: RegExp = new RegExp(
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
);
