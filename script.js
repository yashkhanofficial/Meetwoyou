// Login success হওয়ার পর এটি ব্যবহার করুন
alert("Login Successful!");
window.location.href = "dashboard.html";

// ১. সার্ভিস ওয়ার্কার এবং অফলাইন সাপোর্ট
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Meetwoyou PWA Registered');
        });
    });
}

// ২. অটোমেটিক ইনস্টল পপআপ (৫ সেকেন্ড পর)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    setTimeout(() => {
        if (deferredPrompt) {
            Swal.fire({
                title: 'Install Meetwoyou?',
                text: "সরাসরি হোম স্ক্রিন থেকে অ্যাপ হিসেবে ব্যবহার করতে 'Install' এ ক্লিক করুন।",
                imageUrl: 'meetwoyou.png',
                imageWidth: 80,
                showCancelButton: true,
                confirmButtonText: 'Install Now',
                confirmButtonColor: '#0095f6',
                background: '#121212',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => {
                        deferredPrompt = null;
                    });
                }
            });
        }
    }, 5000); // ৫ সেকেন্ড পর
});

// ৩. অফলাইন/অনলাইন স্ট্যাটাস চেক
window.addEventListener('online', () => {
    Swal.fire({ title: 'You are Online!', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
});
window.addEventListener('offline', () => {
    Swal.fire({ title: 'Offline Mode: Using Cached Data', icon: 'warning', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
});
