const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Serve the Three-Farm 3D client under /threefarm with rewritten asset paths
const threeFarmRoot = path.join(
  __dirname,
  "../src/components/three-farm-deploy/client"
);

// HTML route with path rewriting so absolute asset paths are prefixed with /threefarm
function serveThreeFarmIndex(res) {
  try {
    const indexPath = path.join(threeFarmRoot, "index.html");
    if (!fs.existsSync(indexPath)) {
      res.status(404).send("Three Farm client not found");
      return;
    }
    const html = fs.readFileSync(indexPath, "utf8");
    // Prefix all root-relative asset URLs with /threefarm
    let rewritten = html.replace(/(href|src)="\//g, '$1="/threefarm/');
    // Inject a base href to ensure relative paths resolve under /threefarm/
    if (!/\<base\s/i.test(rewritten)) {
      rewritten = rewritten.replace(
        /<head>/i,
        '<head>\n  <base href="/threefarm/">'
      );
    }
    res.setHeader("Content-Type", "text/html");
    res.send(rewritten);
  } catch (err) {
    console.error("Error serving /threefarm:", err);
    res.status(500).send("Internal Server Error");
  }
}

app.get("/threefarm", (req, res) => serveThreeFarmIndex(res));
app.get("/threefarm/", (req, res) => serveThreeFarmIndex(res));

// Static assets for three-farm under the /threefarm prefix
app.use(
  "/threefarm/static",
  express.static(path.join(threeFarmRoot, "static"))
);
app.use(
  "/threefarm/assets",
  express.static(path.join(threeFarmRoot, "assets"))
);
app.use(
  "/threefarm/advanced-camera-controls.js",
  express.static(path.join(threeFarmRoot, "advanced-camera-controls.js"))
);
app.use(
  "/threefarm/integration-helper.js",
  express.static(path.join(threeFarmRoot, "integration-helper.js"))
);
app.use(
  "/threefarm/favicon.ico",
  express.static(path.join(threeFarmRoot, "favicon.ico"))
);
app.use(
  "/threefarm/manifest.json",
  express.static(path.join(threeFarmRoot, "manifest.json"))
);
app.use(
  "/threefarm/asset-manifest.json",
  express.static(path.join(threeFarmRoot, "asset-manifest.json"))
);
app.use(
  "/threefarm/logo192.png",
  express.static(path.join(threeFarmRoot, "logo192.png"))
);
app.use(
  "/threefarm/logo512.png",
  express.static(path.join(threeFarmRoot, "logo512.png"))
);
app.use(
  "/threefarm/robots.txt",
  express.static(path.join(threeFarmRoot, "robots.txt"))
);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
