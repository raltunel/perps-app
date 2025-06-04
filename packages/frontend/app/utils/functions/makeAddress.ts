// thank you claude

export default function makeAddress(format: 'eth' | 'sol'): string {
    if (format === 'eth') {
        const randomBytes = new Uint8Array(20);
        crypto.getRandomValues(randomBytes);
        const hexString = Array.from(randomBytes)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
        return `0x${hexString}`;
    } else if (format === 'sol') {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);
        return base58Encode(randomBytes);
    } throw new Error(`Unsupported format: ${format}`);
    }

    function base58Encode(bytes: Uint8Array): string {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    
    let num = 0n;
    for (let i = 0; i < bytes.length; i++) {
        num = num * 256n + BigInt(bytes[i]);
    }
    
    let result = '';
    while (num > 0n) {
        const remainder = num % 58n;
        result = alphabet[Number(remainder)] + result;
        num = num / 58n;
    }
    
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
        result = '1' + result;
    }
    
    return result;
}