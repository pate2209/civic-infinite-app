export async function GET(req: Request) {
    const url = new URL(req.url);
    const cursor = parseInt(url.searchParams.get('cursor') || '0', 10); 
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);; 
  
    const rows = Array.from({ length: limit }, (_, i) => cursor + i + 1); 
    const nextCursor = cursor + limit;
  
    return new Response(JSON.stringify({ rows, nextCursor }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }  