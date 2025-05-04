import { db } from "../db";

export async function getMyTags(userId: string) {
  const tags = await db.query.tag.findMany({
    where(fields, operators) {
      return operators.eq(fields.ownerId, userId);
    },
  });

  return tags;
}
