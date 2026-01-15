import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Thêm dòng này
// import { getAnalytics } from "firebase/analytics"; // Analytics là không bắt buộc cho CRUD

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Realtime Database
const db = getDatabase(app);

// Export db để các file khác sử dụng
export { db };