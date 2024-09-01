import * as argon2 from 'argon2-browser';

export async function hashPassword(password: string): Promise<string> {
    const result = await argon2.hash({
        pass: password,
        salt: crypto.getRandomValues(new Uint8Array(16)),
        type: argon2.ArgonType.Argon2id,
        memoryCost: 19456,
        timeCost: 2,
        hashLen: 32,
        parallelism: 1
    });
    return result.encoded;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify({
            pass: password,
            encoded: hash,
        });
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}