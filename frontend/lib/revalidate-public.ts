export async function revalidatePublicProject(slug: string): Promise<void> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

    if (secret) {
      headers['x-revalidate-secret'] = secret;
    }

    await fetch('/api/revalidate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        paths: [`/projets/${slug}`, '/projets', '/'],
      }),
    });
  } catch {
    // La page est en force-dynamic ; la revalidation est un bonus.
  }
}
