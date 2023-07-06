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
    const destinationURL = "https://example.com";
    const statusCode = 301;
    return Response.redirect(destinationURL, statusCode);
    const headers = new Headers({"Set-Cookie": "name1=value1;Max-Age=300"});
    let res = new Response("", { status: 301, headers:headers });
    return res.redirect('https://www.oecom.cn/api/post');
  }

  return context.next();
}

export const onRequest = [errorHandling, authentication];
