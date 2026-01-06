require('dotenv').config();
const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./User');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// connect to database
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log("✅ connected to MongoDB"))
    .catch(err => console.error("❌oh, can not connect to DB", err));

app.use(express.static(__dirname));

app.post('/generateQR', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ 
                success: false,
                error: 'لطفاً لینک را وارد کنید' 
            });
        }

        const qrImage = await QRCode.toDataURL(url);
        
        res.json({
            success: true,
            qrImage: qrImage
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'خطا در تولید کد QR'
        });
    }
});
// path register
app.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "ایمیل و رمز عبور الزامی است" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.json({ success: true, message: "ثبت‌ نام با موفقیت انجام شد" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(400).json({ success: false, message: "ایمیل تکراری است" });
    }
});

// path login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "کاربری با این مشخصات پیدا نشد" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "رمز عبور اشتباه است" });
        }
        res.json({ success: true, message: "ورود موفقیت‌آمیز بود" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "خطای داخلی سرور" });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});