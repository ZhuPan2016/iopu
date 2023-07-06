export async function onRequestPost(context) {
  try {
    let input = await context.request.formData();
    let output = {};
    for (let [key, value] of input) {
      let tmp = output[key];
      if (tmp === undefined) {
        output[key] = value;
      } else {
        output[key] = [].concat(tmp, value);
      }
    }
    let redir_url = decodeURIComponent(output["refer"]);
    
    let pretty2 = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>这是一个HTML5的网页</title>
</head>
<body>
<p>Hello HTML5</p>

<script type="text/javascript">window.location.href = '${redir_url}'; </script>

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
