function authentication(context) {
  if (context.request.headers.get("Cookie") == "name1=value1") {
    return context.next();
  }
  else {
    const destinationURL = "https://iopu.pages.dev/tab?id="+encodeURIComponent(context.request.url);
    const statusCode = 301;
    return Response.redirect(destinationURL, statusCode);
  }
}

export const onRequest = [authentication];
