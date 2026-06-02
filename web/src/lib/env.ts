export function getAuthSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "fuzz-dev-secret-change-in-production",
  );
}
