import app from "./index";
import http from "http";
import { setupSocketServer } from "./ws";

const PORT = 3000;

const server = http.createServer(app);
setupSocketServer(server);

app.listen(PORT, () => {
  console.log(`API server listening on port: ${PORT}`);
});
