import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const MAX_IMAGES = 10;

const uploadImagesSchema = z.object({
  "images[]": z
    .custom<FileList>()
    .refine((files) => Array.isArray(files) && files.length <= MAX_IMAGES, {
      message: `More than ${MAX_IMAGES} are not allowed`,
    }),
});

const app = new Hono()
  .post("/upload", async (c) => {
    const body = await c.req.parseBody();

    console.log(body);

    return c.json({ ok: true }, 200);
  })
  .post(
    "/validate-upload",
    zValidator("form", uploadImagesSchema),
    async (c) => {
      const body = await c.req.valid("form");

      console.log(body, "validated body");

      return c.json({ ok: true }, 200);
    }
  );

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
