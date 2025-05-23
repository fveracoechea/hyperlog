import { hc } from "hono/client";
import type { HonoApp } from "@hyperlog/backend";
import { redirect } from "react-router";

export const client = hc<HonoApp>("http://localhost:8080/", {
  fetch: (
    async (input, init) => {
      const res = await fetch(input, {
        ...init,
        credentials: "include", // Required for sending cookies cross-origin
      });

      if (res.status === 401) {
        throw redirect("/login");
      }

      return res;
    }
  ) satisfies typeof fetch,
});
