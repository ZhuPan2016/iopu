export default {
  async fetch(request) {
    // You will need some super-secret data to use as a symmetric key.
    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode("my secret symmetric key");

    // Convert a ByteString (a string whose code units are all in the range
    // [0, 255]), to a Uint8Array. If you pass in a string with code units larger
    // than 255, their values will overflow.
    function byteStringToUint8Array(byteString) {
      const ui = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; ++i) {
        ui[i] = byteString.charCodeAt(i);
      }
      return ui;
    }

    const url = new URL(request.url);

    // If the path does not begin with our protected prefix, pass the request through
    if (!url.pathname.startsWith("/verify/")) {
      return fetch(request);
    }

    // Make sure you have the minimum necessary query parameters.
    if (!url.searchParams.has("mac") || !url.searchParams.has("expiry")) {
      return new Response("Missing query parameter", { status: 403 });
    }

    const key = await crypto.subtle.importKey(
      "raw",
      secretKeyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Extract the query parameters we need and run the HMAC algorithm on the
    // parts of the request we are authenticating: the path and the expiration
    // timestamp. It is crucial to pad the input data, for example, by adding a symbol
    // in-between the two fields that can never occur on the right side. In this
    // case, use the @ symbol to separate the fields.
    const expiry = Number(url.searchParams.get("expiry"));
    const dataToAuthenticate = `${url.pathname}@${expiry}`;

    // The received MAC is Base64-encoded, so you have to go to some trouble to
    // get it into a buffer type that crypto.subtle.verify() can read.
    const receivedMacBase64 = url.searchParams.get("mac");
    const receivedMac = byteStringToUint8Array(atob(receivedMacBase64));

    // Use crypto.subtle.verify() to guard against timing attacks. Since HMACs use
    // symmetric keys, you could implement this by calling crypto.subtle.sign() and
    // then doing a string comparison -- this is insecure, as string comparisons
    // bail out on the first mismatch, which leaks information to potential
    // attackers.
    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      receivedMac,
      encoder.encode(dataToAuthenticate)
    );

    if (!verified) {
      const body = "Invalid MAC";
      return new Response(body, { status: 403 });
    }

    if (Date.now() > expiry) {
      const body = `URL expired at ${new Date(expiry)}`;
      return new Response(body, { status: 403 });
    }

    // you have verified the MAC and expiration time; you can now pass the request
    // through.
    return fetch(request);
  },
};
