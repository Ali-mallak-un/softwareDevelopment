const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

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
            qrImage: qrImage // این همان رشته‌ای است که در src تصویر قرار می‌گیرد
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'خطا در تولید کد QR'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});