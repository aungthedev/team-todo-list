let todos = []; // Shared in-memory store (same file assumed to be reused)

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1)
    return Response.json({ error: "Not found" }, { status: 404 });

  todos[index] = {
    ...todos[index],
    ...body,
    updatedAt: Date.now(),
  };
  return Response.json(todos[index]);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1)
    return Response.json({ error: "Not found" }, { status: 404 });

  todos.splice(index, 1);
  return Response.json({ message: "Todo deleted", id });
}
