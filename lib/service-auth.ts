import jwt from "jsonwebtoken";

export function createServiceToken(payload: {
  repositoryId: string;
  userId: string;
  githubUrl: string;
}) {
  const secret = process.env.SERVICE_JWT_SECRET;

  if (!secret) {
    throw new Error("ENV SERVICE_JWT_SECRET is required.");
  }

  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

export function createCleanJobsToken(payload: { userId: string }) {
  const secret = process.env.SERVICE_JWT_SECRET;

  if (!secret) {
    throw new Error("ENV SERVICE_JWT_SECRET is required.");
  }

  console.log("payload is ", payload);

  const tokenGenerated = jwt.sign(payload, secret, { expiresIn: "15m" });

  console.log("tokenGenerated is ", tokenGenerated);

  return tokenGenerated;
}
