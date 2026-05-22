Deno.serve(() => {
  return new Response(JSON.stringify({ message: "Hola mundo" }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
});
