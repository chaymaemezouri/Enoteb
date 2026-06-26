import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (secret) {
    const auth = request.headers.get('x-revalidate-secret');
    if (auth !== secret) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }
  }

  let body: { paths?: string[] };

  try {
    body = (await request.json()) as { paths?: string[] };
  } catch {
    return NextResponse.json({ message: 'Corps de requête invalide' }, { status: 400 });
  }

  const paths = body.paths?.filter((path) => typeof path === 'string' && path.startsWith('/'));

  if (!paths?.length) {
    return NextResponse.json({ message: 'Aucun chemin à revalider' }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: paths });
}
