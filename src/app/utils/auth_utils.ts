import { randomBytes } from "crypto";
import bcrypt from "bcrypt";

export const generateSessionToken = () => {
    return randomBytes(64).toString('hex');
}

export const generateExpirationDate = () => {
    return new Date(Date.now() + 1000 * 60 * 15).toUTCString();
}

const saltRounds = 12;

// Hashing the password before storing
export const hashPassword = async (plainPassword: string) => {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

// Verifying the password on login
export const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; // true if passwords match
}


