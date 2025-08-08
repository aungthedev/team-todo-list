export let todos = [];

// POST - create new todo
export async function POST(req) {
  const body = await req.json();
  const newTodo = {
    id: Date.now().toString(),
    title: body.title || "",
    description: body.description || "",
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  todos.push(newTodo);
  return Response.json(newTodo, { status: 201 });
}

// GET - return all todos
export async function GET() {
  return Response.json(todos);
}

// DELETE - clear all todos
export async function DELETE() {
  todos = [];
  return Response.json({ message: "All todos deleted" });
}
