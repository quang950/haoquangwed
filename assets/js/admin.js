// Admin Panel JavaScript

// Dữ liệu sản phẩm được lưu trong localStorage
let products = JSON.parse(localStorage.getItem('products')) || [];

// Hiển thị/ẩn các section
function showSection(sectionName) {
    // Ẩn tất cả sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Ẩn tất cả menu items
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Hiển thị section được chọn
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Đánh dấu menu item active
    event.target.closest('li').classList.add('active');
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    }
}

// Hiển thị modal thêm sản phẩm
function showAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

// Đóng modal thêm sản phẩm
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
    // Ẩn preview ảnh
    document.getElementById('imagePreview').style.display = 'none';
}

// Preview ảnh khi chọn file
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
        
        // Xóa URL nếu có file upload
        document.getElementById('productImageUrl').value = '';
    } else {
        preview.style.display = 'none';
    }
}

// Preview ảnh khi nhập URL
function previewUrlImage(input) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (input.value) {
        previewImg.src = input.value;
        preview.style.display = 'block';
        
        // Xóa file nếu có URL
        document.getElementById('productImage').value = '';
    } else {
        preview.style.display = 'none';
    }
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('addProductModal');
    if (event.target == modal) {
        closeAddProductModal();
    }
}

// Thêm sản phẩm mới
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const imageFile = formData.get('productImage');
    const imageUrl = formData.get('productImageUrl');
    
    // Function để xử lý khi có ảnh
    function processProduct(finalImageUrl) {
        const newProduct = {
            id: Date.now(), // ID duy nhất
            name: formData.get('productName'),
            brand: formData.get('productBrand'),
            price: parseInt(formData.get('productPrice')),
            year: parseInt(formData.get('productYear')),
            fuel: formData.get('productFuel'),
            transmission: formData.get('productTransmission'),
            image: finalImageUrl,
            description: formData.get('productDescription') || 'Xe chất lượng cao, đáng tin cậy',
            dateAdded: new Date().toISOString()
        };
        
        // Thêm sản phẩm vào mảng
        products.push(newProduct);
        
        // Lưu vào localStorage
        localStorage.setItem('products', JSON.stringify(products));
        
        // Cập nhật hiển thị
        loadProducts();
        updateStats();
        
        // Đóng modal
        closeAddProductModal();
        
        // Hiển thị thông báo thành công
        alert('Đã thêm sản phẩm thành công!');
    }
    
    // Xử lý ảnh
    if (imageUrl) {
        // Nếu có URL, sử dụng trực tiếp
        processProduct(imageUrl);
    } else if (imageFile && imageFile.size > 0) {
        // Nếu có file upload, chuyển thành base64 để lưu
        const reader = new FileReader();
        reader.onload = function(e) {
            // Lưu ảnh dưới dạng base64
            const base64Image = e.target.result;
            processProduct(base64Image);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Sử dụng hình ảnh mặc định dựa trên thương hiệu
        const brand = formData.get('productBrand');
        const finalImageUrl = `assets/images/logo-${brand}.png`;
        processProduct(finalImageUrl);
    }
});

// Tải và hiển thị danh sách sản phẩm
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="empty-state">Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</div>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/logo-${product.brand}.png'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand.toUpperCase()}</p>
                <p class="price">${formatPrice(product.price)} VNĐ</p>
                <div class="product-details">
                    <span><i class="fas fa-calendar"></i> ${product.year}</span>
                    <span><i class="fas fa-gas-pump"></i> ${product.fuel}</span>
                    <span><i class="fas fa-cogs"></i> ${product.transmission}</span>
                </div>
                <div class="product-actions">
                    <button onclick="editProduct(${product.id})" class="edit-btn">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Xóa sản phẩm
function deleteProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        updateStats();
        showNotification('Xóa sản phẩm thành công!', 'success');
    }
}

// Sửa sản phẩm (chức năng cơ bản)
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Điền thông tin vào form
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productYear').value = product.year;
        document.getElementById('productFuel').value = product.fuel;
        document.getElementById('productTransmission').value = product.transmission;
        document.getElementById('productImageUrl').value = product.image;
        document.getElementById('productDescription').value = product.description;
        
        // Thay đổi form để chế độ chỉnh sửa
        const form = document.getElementById('addProductForm');
        form.dataset.editId = productId;
        
        // Thay đổi nút submit
        const submitBtn = form.querySelector('.save-btn');
        submitBtn.textContent = 'Cập nhật sản phẩm';
        
        // Thay đổi tiêu đề modal
        document.querySelector('.modal-header h3').textContent = 'Chỉnh sửa sản phẩm';
        
        showAddProductModal();
    }
}

// Cập nhật thống kê
function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    
    // Tính tổng lượt xem (giả lập)
    const totalViews = products.reduce((sum, product) => sum + (product.views || Math.floor(Math.random() * 100)), 0);
    document.getElementById('total-views').textContent = totalViews;
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Thêm vào body
    document.body.appendChild(notification);
    
    // Hiển thị với animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Xử lý form submit để phân biệt thêm mới và chỉnh sửa
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    if (this.dataset.editId) {
        e.preventDefault();
        
        const productId = parseInt(this.dataset.editId);
        const formData = new FormData(this);
        const imageFile = formData.get('productImage');
        const imageUrl = formData.get('productImageUrl');
        
        // Tìm sản phẩm cần cập nhật
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            // Tạo URL hình ảnh
            let finalImageUrl = products[productIndex].image; // Giữ ảnh cũ nếu không có ảnh mới
            if (imageUrl) {
                finalImageUrl = imageUrl;
            } else if (imageFile && imageFile.size > 0) {
                finalImageUrl = URL.createObjectURL(imageFile);
            }
            
            // Cập nhật thông tin sản phẩm
            products[productIndex] = {
                ...products[productIndex],
                name: formData.get('productName'),
                brand: formData.get('productBrand'),
                price: parseInt(formData.get('productPrice')),
                year: parseInt(formData.get('productYear')),
                fuel: formData.get('productFuel'),
                transmission: formData.get('productTransmission'),
                image: finalImageUrl,
                description: formData.get('productDescription') || 'Xe chất lượng cao, đáng tin cậy'
            };
            
            // Lưu vào localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Cập nhật hiển thị
            loadProducts();
            updateStats();
            
            // Reset form
            delete this.dataset.editId;
            document.querySelector('.save-btn').textContent = 'Lưu sản phẩm';
            document.querySelector('.modal-header h3').textContent = 'Thêm sản phẩm mới';
            
            // Đóng modal
            closeAddProductModal();
            
            // Hiển thị thông báo
            showNotification('Cập nhật sản phẩm thành công!', 'success');
        }
    }
});

// Export dữ liệu cho trang index
function exportProductsForIndex() {
    return products;
}

// Làm cho function có thể truy cập globally
window.exportProductsForIndex = exportProductsForIndex;