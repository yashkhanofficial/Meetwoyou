// Login success হওয়ার পর এটি ব্যবহার করুন
alert("Login Successful!");
window.location.href = "dashboard.html";

// আপনার সঠিক ক্লাউডিনারি ডিটেইলস
const CLOUD_NAME = "dpgawb5sl";
const UPLOAD_PRESET = "Meetwoyou"; // যদি Cloudinary-তে অন্য নাম দিয়ে থাকেন তবে সেটি দিন

document.getElementById('save-btn').onclick = async () => {
    const user = auth.currentUser;
    
    // লগইন চেক (সবচেয়ে জরুরি)
    if (!user) {
        alert("Error: Please Login First!");
        return;
    }

    const name = document.getElementById('user-name').value;
    const bio = document.getElementById('user-bio').value;
    const photoFile = document.getElementById('photo-upload').files[0];

    try {
        let finalPhotoURL = user.photoURL || "";

        // ১. ছবি থাকলে ক্লাউডিনারিতে আপলোড হবে
        if (photoFile) {
            const formData = new FormData();
            formData.append('file', photoFile);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.secure_url) {
                finalPhotoURL = data.secure_url;
            }
        }

        // ২. ফায়ারবেস ফায়ারস্টোরে ডেটা সেভ
        await setDoc(doc(db, "users", user.uid), {
            displayName: name,
            bio: bio,
            photoURL: finalPhotoURL,
            lastUpdated: new Date()
        }, { merge: true });

        alert("Success! Profile updated.");
        location.reload(); // পেজ রিফ্রেশ করে নতুন ডাটা দেখাবে

    } catch (error) {
        console.error("Error details:", error);
        alert("Error: " + error.message);
    }
};
