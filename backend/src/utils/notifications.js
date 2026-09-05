/**
 * Push notification abstraction.
 *
 * This intentionally does NOT hard-require firebase-admin, so the whole
 * backend still runs fine with zero notification setup while you're
 * building — it just logs instead of sending. Once you have a Firebase
 * project:
 *   1. npm install firebase-admin
 *   2. Download your service account JSON from Firebase console
 *   3. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env to that file's path
 *   4. Uncomment the firebase-admin block below
 *
 * Call sendPushToAll() any time a notice is created (see noticeController.js
 * for the exact hook point) or wire it into a node-cron job for reminders.
 */

let firebaseReady = false;
let admin = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    admin = require("firebase-admin");
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    firebaseReady = true;
  }
} catch (err) {
  console.warn(
    "[notifications] Firebase not configured yet — pushes will be logged only:",
    err.message
  );
}

/**
 * @param {string[]} tokens - device tokens to notify (fetch these from a
 *   `device_tokens` table you add once the frontend registers for push)
 * @param {{title: string, body: string}} payload
 */
async function sendPush(tokens, payload) {
  if (!firebaseReady) {
    console.log(`[notifications:stub] Would push to ${tokens.length} devices:`, payload);
    return { sent: 0, stub: true };
  }

  const message = {
    notification: { title: payload.title, body: payload.body },
    tokens,
  };
  const response = await admin.messaging().sendEachForMulticast(message);
  return { sent: response.successCount, failed: response.failureCount };
}

module.exports = { sendPush, firebaseReady };
