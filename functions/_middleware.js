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
    var html = `<!DOCTYPE html>
		<body>
    <form method="POST" action="/submit">
    <input type="text" name="fullname" pattern="[A-Za-z]+" required />
    <input type="hidden" name="refer" id="demo" pattern="[A-Za-z]+" required />
    <button type="submit">Submit</button>
  </form>
  <script language="javascript">
    function getReferer(){
        if(document.referrer){
                return document.referrer;
        }else{
                return false;
        }
}
    document.getElementById("demo").value= getReferer();
  </script>
  </body>`
    const headers = new Headers({"Set-Cookie": "name1=value1;Max-Age=300"});
    return new Response(html, { status: 200, headers:headers });
  }

  return context.next();
}

export const onRequest = [errorHandling, authentication];
