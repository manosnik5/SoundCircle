import crypto from "node:crypto";
import { Buffer } from "node:buffer";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set in .env");
  return Buffer.from(key, "hex");
}

export function encrypt(text) {
  const KEY = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText) {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;

  const [ivHex, authTagHex, dataHex] = encryptedText.split(":");
  if (!ivHex || !authTagHex || !dataHex) return encryptedText;

  const KEY = getKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
}