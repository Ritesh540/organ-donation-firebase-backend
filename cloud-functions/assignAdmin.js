const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.assignAdmin = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.superAdmin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only super admin can assign admins"
    );
  }

  const uid = data.uid;

  await admin.auth().setCustomUserClaims(uid, {
    admin: true
  });

  await admin.firestore()
    .collection("users")
    .doc(uid)
    .update({ role: "admin" });

  await admin.firestore()
    .collection("admin_logs")
    .add({
      adminId: context.auth.uid,
      action: "ASSIGN_ADMIN",
      targetUserId: uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

  return { success: true };
});
