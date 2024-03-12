import { contentSchema } from './schema';
import { client } from './turso';

export const readContent = async () => {
  const { rows } = await client.execute('');
  const parsedRows = contentSchema.safeParse(rows);
  if (!parsedRows.success) {
    throw new Error('Failed to parse content');
  }

  return rows;
};
