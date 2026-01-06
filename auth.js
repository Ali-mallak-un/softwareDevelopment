let isLogin = true;

// section one : toggling between login and registration forms
const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const authTitle = document.getElementById('authTitle');
const submitBtn = document.getElementById('submitBtn');
const nameGroup = document.getElementById('nameGroup');
const authMessage = document.getElementById('authMessage');

registerToggle.onclick = () => {
    isLogin = false;
    loginToggle.classList.remove('active');
    registerToggle.classList.add('active');
    authTitle.innerText = "ساخت حساب جدید";
    submitBtn.innerText = "ثبت‌نام";
    nameGroup.style.display = "block";
    authMessage.innerText = "";
};

loginToggle.onclick = () => {
    isLogin = true;
    registerToggle.classList.remove('active');
    loginToggle.classList.add('active');
    authTitle.innerText = "خوش آمدید";
    submitBtn.innerText = "ورود به حساب";
    nameGroup.style.display = "none";
    authMessage.innerText = "";
};

//section two : managing form submission for login and registration
document.getElementById('authForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? '/login' : '/register';
    const payload = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fullName: document.getElementById('fullName').value
    };

    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            authMessage.innerText = result.message;
            authMessage.style.color = "#116860";

            if (isLogin) {
                console.log("ورود موفقیت‌آمیز، در حال انتقال...");
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
            }
        } else {
            authMessage.innerText = result.message || "خطایی رخ داد";
            authMessage.style.color = "orange";
        }

    } catch (error) {
        console.error("Fetch error:", error);
        authMessage.innerText = "ارتباط با سرور برقرار نشد. لطفاً وضعیت اینترنت را چک کنید.";
        authMessage.style.color = "red";
    }
};
