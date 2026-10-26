import { createApp } from "./app.js";

/**
 * Ponto de entrada (Frameworks & Drivers): lê a configuração do ambiente e
 * sobe o servidor HTTP. PORT=0 escolhe uma porta livre (usado nos testes e2e).
 */
const port = Number(process.env.PORT ?? 3001);

const logger = {
  info: (message) => console.log(`[movies-catalog] ${message}`),
  error: (error) => console.error("[movies-catalog]", error)
};

const server = createApp({ logger });

server.listen(port, () => {
  const { port: actualPort } = server.address();
  console.log(`[movies-catalog] ouvindo em http://localhost:${actualPort}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
