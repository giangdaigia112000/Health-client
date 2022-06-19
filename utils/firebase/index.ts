import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkfIL2oML9Xg1UJoQx3Shty_gCXchRZw0",
  authDomain: "health-client-82dcc.firebaseapp.com",
  projectId: "health-client-82dcc",
  storageBucket: "health-client-82dcc.appspot.com",
  messagingSenderId: "246455209534",
  appId: "1:246455209534:web:90aab380d12205d1574b6f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
