import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";

const app = express();

/*
|--------------------------------------------------------------------------
| Proxy Configuration
|--------------------------------------------------------------------------
|
| Azure Container Apps places the application behind a reverse proxy.
|
*/

app.set("trust proxy", 1);


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| In production the frontend and backend are served from the same origin,
| so CORS is normally not required.
|
| CORS_ORIGIN can be supplied when a separate frontend needs access.
|
*/

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
}


/*
|--------------------------------------------------------------------------
| Security Headers
|--------------------------------------------------------------------------
*/

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader("X-Frame-Options", "DENY");

  res.setHeader("Referrer-Policy", "no-referrer");

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  next();
});


/*
|--------------------------------------------------------------------------
| Request Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json());


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    emoji: "✅",
  });
});


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use(
  "/api/posts",
  commentRoutes
);


/*
|--------------------------------------------------------------------------
| React Frontend
|--------------------------------------------------------------------------
|
| Docker copies:
|
| apps/frontend/dist
|
| into:
|
| /app/public
|
*/

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(
    process.cwd(),
    "public"
  );

  app.use(
    express.static(frontendPath)
  );

  /*
  | React SPA fallback.
  |
  | Example:
  |
  | /posts/15
  |
  | should return index.html and allow
  | React to handle the route.
  */

  app.get("*", (req, res, next) => {

    /*
    | Don't convert unknown API endpoints
    | into React responses.
    */

    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(
      path.join(frontendPath, "index.html")
    );
  });
}


/*
|--------------------------------------------------------------------------
| Final 404 Handler
|--------------------------------------------------------------------------
*/

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});


/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = Number(
  process.env.PORT || 3000
);

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `🚀 Application listening on port ${PORT}`
    );
  }
);