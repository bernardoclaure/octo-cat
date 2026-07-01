export const getDbPath = () => process.env.DB_PATH || 'data/copinmersive.db';
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
