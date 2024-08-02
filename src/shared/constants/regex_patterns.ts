export const patternNoScript: RegExp = new RegExp(
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
);
