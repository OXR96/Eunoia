const bs58 = (() => {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const ALPHABET_MAP = {};

    for (let i = 0; i < ALPHABET.length; i++) {
        ALPHABET_MAP[ALPHABET.charAt(i)] = i;
    }

    const BASE = 58;

    function encode(buffer) {
        if (buffer.length === 0) return '';

        let i, j, digits = [0];

        for (i = 0; i < buffer.length; i++) {
            for (j = 0; j < digits.length; j++) digits[j] <<= 8;
            digits[0] += buffer[i];
            let carry = 0;
            for (j = 0; j < digits.length; ++j) {
                digits[j] += carry;
                carry = (digits[j] / BASE) | 0;
                digits[j] %= BASE;
            }
            while (carry) {
                digits.push(carry % BASE);
                carry = (carry / BASE) | 0;
            }
        }

        for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);

        return digits
            .reverse()
            .map((digit) => ALPHABET[digit])
            .join('');
    }

    function decode(string) {
        if (string.length === 0) return new Uint8Array();

        let i, j, bytes = [0];
        for (i = 0; i < string.length; i++) {
            const c = string[i];
            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');

            for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
            bytes[0] += ALPHABET_MAP[c];
            let carry = 0;
            for (j = 0; j < bytes.length; ++j) {
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff;
            }
            while (carry) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }

        for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0);

        return new Uint8Array(bytes.reverse());
    }

    return { encode, decode };
})();

if (typeof chrome === 'undefined') {
    var chrome = {};
}

class WalletManager {
    constructor() {
        this.init();
    }

    async init() {
        await this.checkExistingWallet();
        this.setupEventListeners();
    }

    async checkExistingWallet() {
        try {
            const result = await chrome.storage.local.get(['encryptedWallet']);
            if (result.encryptedWallet) {
                await this.displayWallet();
            } else {
                this.showWalletSetup();
            }
        } catch (error) {
            console.error('Error checking wallet:', error);
            this.showWalletSetup();
        }
    }

    showWalletSetup() {
        document.getElementById('walletSetup').style.display = 'block';
        document.getElementById('walletDisplay').style.display = 'none';
    }

    async displayWallet() {
        try {
            const walletData = await this.getWalletData();
            if (walletData) {
                document.getElementById('walletAddress').textContent = walletData.publicKey;
                document.getElementById('walletSetup').style.display = 'none';
                document.getElementById('walletDisplay').style.display = 'block';

                await this.refreshBalance();
            } else {
                this.showWalletSetup();
            }
        } catch (error) {
            console.error('Error displaying wallet:', error);
            this.showWalletSetup();
        }
    }

    async saveWallet(privateKeyString) {
        try {
            const privateKeyBytes = bs58.decode(privateKeyString.trim());

            if (privateKeyBytes.length !== 64) {
                throw new Error('Invalid private key length');
            }

            const publicKeyBytes = privateKeyBytes.slice(32, 64);
            const publicKey = bs58.encode(publicKeyBytes);

            const encryptedPrivateKey = await this.encryptData(privateKeyString);

            await chrome.storage.local.set({
                encryptedWallet: {
                    privateKey: encryptedPrivateKey,
                    publicKey: publicKey,
                    timestamp: Date.now(),
                },
            });

            return { publicKey };
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async getWalletData() {
        try {
            const result = await chrome.storage.local.get(['encryptedWallet']);
            if (result.encryptedWallet) {
                return {
                    publicKey: result.encryptedWallet.publicKey,
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting wallet data:', error);
            return null;
        }
    }

    async getPrivateKey() {
        try {
            const result = await chrome.storage.local.get(['encryptedWallet']);
            if (result.encryptedWallet) {
                return await this.decryptData(result.encryptedWallet.privateKey);
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async removeWallet() {
        try {
            await chrome.storage.local.remove(['encryptedWallet']);
            this.showWalletSetup();
            this.clearForm();
        } catch (error) {
            console.error(error);
        }
    }

    async refreshBalance() {
        const walletData = await this.getWalletData();
        if (walletData) {
            document.getElementById('refreshText').style.display = 'none';
            document.getElementById('refreshLoading').style.display = 'inline-block';

            try {
                const balance = await this.getBalance(walletData.publicKey);
                document.getElementById('balanceAmount').textContent = balance.toFixed(3);
            } catch (error) {
                console.error('Balance fetch error:', error);
                document.getElementById('balanceAmount').textContent = '0.000';
            } finally {
                document.getElementById('refreshText').style.display = 'inline';
                document.getElementById('refreshLoading').style.display = 'none';
            }
        }
    }

    async getBalance(publicKey) {
        try {
            const response = await fetch('https://mainnet.helius-rpc.com/?api-key=89338e16-66cf-4a67-9b9e-eb1f66411557', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getBalance',
                    params: [publicKey],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`RPC error: ${data.error.message}`);
            }

            if (data.result && typeof data.result.value === 'number') {
                return data.result.value / 1000000000;
            }

            return 0;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async encryptData(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        const password = 'eunoia-wallet-key';
        const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
            'deriveKey',
        ]);

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('eunoia-salt'),
                iterations: 100000,
                hash: 'SHA-256',
            }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, dataBuffer);

        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return Array.from(combined);
    }

    async decryptData(encryptedArray) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const encryptedData = new Uint8Array(encryptedArray);
        const iv = encryptedData.slice(0, 12);
        const data = encryptedData.slice(12);

        const password = 'eunoia-wallet-key';
        const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
            'deriveKey',
        ]);

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('eunoia-salt'),
                iterations: 100000,
                hash: 'SHA-256',
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt'],
        );

        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, data);

        return decoder.decode(decrypted);
    }

    clearForm() {
        document.getElementById('privateKey').value = '';
        document.getElementById('privateKeyError').textContent = '';
        document.getElementById('privateKeySuccess').textContent = '';
    }

    showError(message) {
        document.getElementById('privateKeyError').textContent = message;
        document.getElementById('privateKeySuccess').textContent = '';
    }

    showSuccess(message) {
        document.getElementById('privateKeySuccess').textContent = message;
        document.getElementById('privateKeyError').textContent = '';
    }

    setupEventListeners() {
        document.getElementById('saveWalletBtn').addEventListener('click', async () => {
            const privateKey = document.getElementById('privateKey').value.trim();

            if (!privateKey) {
                this.showError('Please enter a private key');
                return;
            }

            document.getElementById('saveWalletText').style.display = 'none';
            document.getElementById('saveWalletLoading').style.display = 'inline-block';
            document.getElementById('saveWalletBtn').disabled = true;

            try {
                await this.saveWallet(privateKey);
                this.showSuccess('Wallet saved successfully');
                setTimeout(() => {
                    this.displayWallet();
                }, 1000);
            } catch (error) {
                this.showError(error.message);
            } finally {
                document.getElementById('saveWalletText').style.display = 'inline';
                document.getElementById('saveWalletLoading').style.display = 'none';
                document.getElementById('saveWalletBtn').disabled = false;
            }
        });

        document.getElementById('refreshBalanceBtn').addEventListener('click', () => {
            this.refreshBalance();
        });

        document.getElementById('removeWalletBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to remove your wallet? This action cannot be undone!')) {
                this.removeWallet();
            }
        });

        document.getElementById('privateKey').addEventListener('input', () => {
            document.getElementById('privateKeyError').textContent = '';
            document.getElementById('privateKeySuccess').textContent = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WalletManager();
});