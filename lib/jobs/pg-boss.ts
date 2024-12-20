import PgBoss from "pg-boss";

// Singleton pattern for PgBoss instance
let pgBossInstance: PgBoss | null = null;

export async function getPgBoss() {
  if (!pgBossInstance) {
    pgBossInstance = new PgBoss(process.env.DATABASE_URL!);
    await pgBossInstance.start();
  }
  return pgBossInstance;
}
