const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.verifyHospital = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admin can verify hospitals"
    );
  }

  const hospitalUid = data.uid;

  await admin.firestore()
    .collection("users")
    .doc(hospitalUid)
    .update({ verified: true });

  await admin.firestore()
    .collection("admin_logs")
    .add({
      adminId: context.auth.uid,
      action: "VERIFY_HOSPITAL",
      targetUserId: hospitalUid,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

  return { success: true };
});
