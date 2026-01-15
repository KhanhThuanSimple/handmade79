const fs = require('fs');
const path = require('path');

const mockDataDir = path.join(__dirname, '../src/mock-data');
const dbFile = path.join(__dirname, '../db.json');

// --- CẤU HÌNH: Những bảng nào muốn giữ lại dữ liệu cũ từ db.json ---
const KEEP_KEYS = ['reviews', 'orders', 'users', 'messages'];

// 1. Đọc dữ liệu hiện có từ db.json để không bị mất khi chạy dev
let existingDb = {};
if (fs.existsSync(dbFile)) {
    try {
        existingDb = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    } catch (e) {
        existingDb = {};
    }
}

// Khởi tạo db dựa trên dữ liệu cũ thay vì mảng rỗng
const db = {
    products: [],
    messages: existingDb.messages || [],
    faq: existingDb.faq || [],
    vouchers: existingDb.vouchers || [],
    prizes: existingDb.prizes || [],
    reviews: existingDb.reviews || [],
    ...existingDb // Giữ lại tất cả các bảng khác như orders, users...
};

if (!fs.existsSync(mockDataDir)) {
    console.error(`❌ Thư mục ${mockDataDir} không tồn tại!`);
    process.exit(1);
}

// 2. Hàm đọc file JSON an toàn (Giữ nguyên của bạn)
const readJsonFile = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (!fileContent.trim()) return [];
        const data = JSON.parse(fileContent);
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error(`⚠️ Lỗi cú pháp trong file "${path.basename(filePath)}". Bỏ qua.`);
        return [];
    }
};

// 3. Quét và Merge dữ liệu
const items = fs.readdirSync(mockDataDir);

items.forEach(item => {
    const itemPath = path.join(mockDataDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && item === 'products') {
        console.log('📂 Đang quét thư mục products...');
        const productFiles = fs.readdirSync(itemPath);
        db.products = []; // Sản phẩm thì làm mới từ mock-data
        productFiles.forEach(file => {
            if (path.extname(file) === '.json') {
                const data = readJsonFile(path.join(itemPath, file));
                db.products.push(...data);
            }
        });
    } 
    else if (stat.isFile() && path.extname(item) === '.json') {
        const resourceName = path.basename(item, '.json');
        const finalKey = resourceName === 'massage' ? 'messages' : resourceName;
        const mockData = readJsonFile(itemPath);

        // CHỈNH SỬA TẠI ĐÂY: Nếu key nằm trong danh sách cần giữ, ta merge chứ không ghi đè
        if (KEEP_KEYS.includes(finalKey) && db[finalKey]) {
            const existingIds = new Set(db[finalKey].map(i => String(i.id)));
            const newItems = mockData.filter(i => !existingIds.has(String(i.id)));
            db[finalKey] = [...db[finalKey], ...newItems];
        } else {
            // Các bảng khác (faq, vouchers...) thì cập nhật theo mock-data
            db[finalKey] = mockData;
        }
    }
});

// 4. Ghi file db.json (Giữ nguyên của bạn)
let oldData = null;
if (fs.existsSync(dbFile)) {
    try {
        oldData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    } catch (e) { oldData = null; }
}

if (JSON.stringify(db) !== JSON.stringify(oldData)) {
    try {
        fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
        console.log(`✅ Merge thành công! (Dữ liệu người dùng được bảo toàn)`);
        console.log(`   - Tổng sản phẩm: ${db.products.length}`);
        console.log(`   - Endpoints: ${Object.keys(db).map(k => '/' + k).join(', ')}`);
    } catch (error) {
        console.error('❌ Lỗi khi ghi file db.json:', error);
    }
} else {
    console.log(`ℹ️ Dữ liệu không thay đổi.`);
}