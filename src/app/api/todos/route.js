import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST - create new todo
export async function POST(req) {
  const body = await req.json();
  console.log("POST /api/todos called with body:", body); // Debug log
  const { data, error } = await supabase
    .from('todos')
    .insert([
      {
        title: body.title || "",
        description: body.description || "",
        done : false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    
    return Response.json({ error: error.message }, { status: 500 });
    
  }
  return Response.json(data, { status: 201 });
}

// GET - return all todos
export async function GET() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data); 
  }


// DELETE - clear all todos
export async function DELETE() {
  const { error } = await supabase
    .from('todos')
    .delete()
    .not('id', 'is', null);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ message: "All todos deleted" });
}
