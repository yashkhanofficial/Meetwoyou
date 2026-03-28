// Add 'sendEmailVerification' to your imports at the top
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- SIGNUP LOGIC ---
document.getElementById('signup-btn').onclick = async () => {
    const fName = document.getElementById('signup-first-name').value;
    const lName = document.getElementById('signup-last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if(!fName || !lName || !email || !password) return alert("All fields are required!");
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 1. Set the User's Name
        await updateProfile(userCredential.user, { displayName: `${fName} ${lName}` });
        
        // 2. Send Verification Email
        await sendEmailVerification(userCredential.user);
        
        alert("Account created! A verification link has been sent to your email. Please check your Inbox or Spam folder.");
        showSection('login-section');
    } catch (error) {
        alert("Error: " + error.message);
    }
};
