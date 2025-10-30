// Optional Backend for Frontend (BFF) pattern
// This route can be used to proxy requests to external APIs

export async function GET(_request: Request, { params: _params }: { params: { path: string[] } }) {
  // BFF implementation
  return new Response("Not implemented", { status: 501 })
}

export async function POST(_request: Request, { params: _params }: { params: { path: string[] } }) {
  // BFF implementation
  return new Response("Not implemented", { status: 501 })
}
