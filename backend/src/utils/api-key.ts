
import { randomBytes, createHash } from "node:crypto";

export function generateApiKey() {
  const secret = randomBytes(32).toString("hex");

  return {
    apiKey: `ea_live_${secret}`,
    keyHash: createHash("sha256")
      .update(`ea_live_${secret}`)
      .digest("hex"),
  };
}
