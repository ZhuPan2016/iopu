export async function onRequestPost(context) {
  try {
    let input = await context.request.formData();
    let pretty = JSON.stringify([...input], null, 2);
    let pretty2 = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>这是一个HTML5的网页</title>
</head>
<body>
<p>Hello HTML5</p>
<form action="https://iopu.pages.dev/resources/re.txt" method="get" name="myform"></form>
<script type="text/javascript"> document.myform.submit(); </script>

</body>
</html>`
    return new Response(pretty2, {
      headers: {
        "Set-Cookie": "name1=value1;Max-Age=300",
        "Content-Type": "text/html; charset=utf-8"
      },
    });
  } catch (err) {
    return new Response('Error parsing JSON content', { status: 400 });
  }
}
