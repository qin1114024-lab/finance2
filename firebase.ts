import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 注意：在實際佈署時，應將這些資訊放在環境變數中
// 此處預留給使用者填寫其 Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "wealth-wisdom-ai.firebaseapp.com",
  projectId: "wealth-wisdom-ai",
  storageBucket: "wealth-wisdom-ai.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 如果沒有配置，這裡會拋出提示，但在開發環境我們會回退到 mock 邏輯
let app, auth, db;

try {
  // 檢查是否已填寫真實配置，若無則暫時不初始化
  if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase config missing. Using local storage mode.");
}

export { auth, db };