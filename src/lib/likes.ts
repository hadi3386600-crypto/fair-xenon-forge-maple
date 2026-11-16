import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export const getLikes = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ count: number }>`select count from site_likes where id = 1`;
  return { count: Number(rows[0]?.count ?? 0) };
});

export const changeLike = createServerFn({ method: "POST" })
  .validator((input: { delta: number }) => {
    const delta = input.delta === -1 ? -1 : 1;
    return { delta };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ count: number }>`
      update site_likes
      set count = greatest(0, count + ${data.delta})
      where id = 1
      returning count
    `;
    return { count: Number(rows[0]?.count ?? 0) };
  });
