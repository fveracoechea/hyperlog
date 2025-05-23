import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server.browser";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

// Reject all pending promises from handler functions after 5 seconds
export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, streamTimeout + 1000);

  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: controller.signal,
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) console.error(error);
      },
    },
  );

  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await stream.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(stream, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
