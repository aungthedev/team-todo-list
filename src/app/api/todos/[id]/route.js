import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PATCH(req, { params }) {
  const {id} = await params;
  const body = await req.json();
  console.log("PATCH /api/todos/[id] called with id:", id, "body:", body);

  const { data, error } = await supabase
    .from('todos')
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return Response.json({ error: error?.message || "Not found" }, { status: 404 });
  }
  return Response.json(data);
}

export async function DELETE(req, { params }) {
  const {id}= await params;

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    return Response.json({ error: error.message }, { status: 404 });
  }
  return Response.json({ message: "Todo deleted", id });
}

