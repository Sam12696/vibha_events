/**
 * Generates a bcrypt hash for the admin password.
 * Usage: npm run hash -- yourpassword
 *
 * Copy the output into your .env file as ADMIN_PASSWORD_HASH
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash -- <password>');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log('\nAdd this to your .env file:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('');
