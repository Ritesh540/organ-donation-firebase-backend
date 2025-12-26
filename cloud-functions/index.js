const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.verifyHospital = require("./verifyHospital").verifyHospital;
exports.assignAdmin = require("./assignAdmin").assignAdmin;
