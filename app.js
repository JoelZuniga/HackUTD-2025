const http = require("http");
const DownDetector = require("./downdetector");

const port = 3333;

const server = http.createServer((req, res) => {
  console.log("[+] New Connection");

  // Ignore favicon noise from browsers
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }

  const site = "t-mobile"; // always scrape T-Mobile

  // IMPORTANT: create a fresh instance per request
  const detector = new DownDetector();

  detector.detect(site);

  // Use .once so we don't accumulate listeners across requests
  detector.once("response", ([code, message]) => {
    if (code !== 200 || !message) {
      console.error("Error fetching T-Mobile, code:", code);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Error fetching T-Mobile from DownDetector" })
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(message, null, 2));
  });
});

server.listen(port, (err) => {
  if (err) {
    console.error("ERROR\n" + err);
  } else {
    console.log("[+] Server ready:", `http://localhost:${port}`);
    console.log(`[+] T-Mobile endpoint: GET http://localhost:${port}`);
  }
});
