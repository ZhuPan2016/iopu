export async function onRequestPost(context) {
  try {
    let input = await context.request.formData();
    let pretty = JSON.stringify([...input], null, 2);
    let pretty = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>这是一个HTML5的网页</title>
</head>
<body>
<p>Hello HTML5</p>
</body>
</html>`
    return new Response(pretty2, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        "Set-Cookie": "name1=value1;Max-Age=300"
      },
    });
  } catch (err) {
    return new Response('Error parsing JSON content', { status: 400 });
  }
}
