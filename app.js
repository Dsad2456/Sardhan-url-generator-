async function generate() {
  const longUrl = document.getElementById("longUrl").value.trim();
  const custom = document.getElementById("custom").value.trim();

  if (!longUrl) {
    document.getElementById("result").innerText = "❌ Enter a URL";
    return;
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl, custom })
  });

  const data = await res.json();

  document.getElementById("result").innerHTML =
    data.shortUrl
      ? `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`
      : `❌ ${data.error}`;
}
