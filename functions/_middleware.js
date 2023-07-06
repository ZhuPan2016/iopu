async function errorHandling(context) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}

function authentication(context) {
  if (context.request.headers.get("Cookie") == "name1=value1") {
    return context.next();
  }
  if (context.request.headers.get("x-email") != "admin@example.com") {
    const headers = new Headers({"Set-Cookie": "name1=value1;Max-Age=300"});
    return new Response("https://iopu.pages.dev/tab?id=hfjdks", { status: 301, headers:headers });
  }

  return context.next();
}

export const onRequest = [errorHandling, authentication];
