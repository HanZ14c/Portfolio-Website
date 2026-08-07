const beaconSource = "https://static.cloudflareinsights.com/beacon.min.js";

export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;

  if (process.env.NODE_ENV !== "production" || !token) return null;

  return (
    <script
      defer
      src={beaconSource}
      data-cf-beacon={JSON.stringify({ token, spa: true })}
    />
  );
}
