<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyBn3x2qSo8k6a9wrxNfLmVliWMmsUk8wfY",
        authDomain: "meetwoyou-436a2.firebaseapp.com",
        projectId: "meetwoyou-436a2",
        storageBucket: "meetwoyou-436a2.firebasestorage.app",
        messagingSenderId: "612788132077",
        appId: "1:612788132077:web:0a8b92edf26778efd4d4e4"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Force link to your specific site
    const actionCodeSettings = {
        url: 'https://yashkhanofficial.github.io/',
        handleCodeInApp: true,
    };

    // --- FORGOT PASSWORD ---
    document.getElementById('reset-btn').onclick = async () => {
        const email = document.getElementById('forgot-email').value;
        if(!email) return alert("Please enter your email!");
        try {
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            alert("Success! Check your Inbox and SPAM folder now.");
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    };

    // --- SIGNUP LOGIC ---
    document.getElementById('signup-btn').onclick = async () => {
        const fName = document.getElementById('signup-first-name').value;
        const lName = document.getElementById('signup-last-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: `${fName} ${lName}` });
            
            // Sending verification with settings
            await sendEmailVerification(userCredential.user, actionCodeSettings);
            
            alert("Verification email sent! Check your inbox.");
        } catch (error) {
            alert(error.message);
        }
    };

    // (Add your Login and Google Login logic below as before...)
</script>
