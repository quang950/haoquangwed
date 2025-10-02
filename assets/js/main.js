document.addEventListener('DOMContentLoaded', () => {
    // Load sản phẩm từ admin trước
    loadAdminProducts();
    
    // Xử lý điều hướng mượt mà khi click vào menuhttp://127.0.0.1:3000/login.html
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Ẩn tất cả các section
            document.querySelectorAll('.brand-container').forEach(container => {
                container.style.display = 'none';
            });
            
            // Hiển thị section được chọn với animation
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.style.opacity = '0';
                
                // Animation hiển thị mượt mà
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.5s ease';
                    targetSection.style.opacity = '1';
                    
                    // Cuộn đến section được chọn
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });

    // Hiển thị tất cả section khi load trang
    function showAllSections() {
        document.querySelectorAll('.brand-container').forEach(container => {
            container.style.display = 'block';
            container.style.opacity = '1';
        });
    }

    // Nút "Xem tất cả" trong dropdown (chỉ trên trang có dropdown)
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown) {
        const showAllLink = document.createElement('a');
        showAllLink.href = '#';
        showAllLink.textContent = 'Xem tất cả';
        showAllLink.classList.add('show-all');
        showAllLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAllSections();
        });
        dropdown.appendChild(showAllLink);
    }

    // Hiển thị tất cả section mặc định (chỉ trang có brand)
    if (document.querySelector('.brand-container')) {
        showAllSections();
    }

    // Slider theo trang: ">" lướt sang trái để hiển thị 5 mẫu xe kế tiếp, "Xem thêm" hiển thị toàn bộ
    function initBrandPagination() {
        document.querySelectorAll('.brand-container').forEach(brand => {
            const container = brand.querySelector('.car-container');
            if (!container) return;
            const cards = Array.from(container.querySelectorAll('.car-card'));
            const step = 5;
            const total = cards.length;
            const totalPages = Math.max(1, Math.ceil(total / step));
            let page = 0;
            let expanded = false;

            function showPage(p, animate = true) {
                if (expanded) {
                    cards.forEach(c => c.style.display = '');
                    return;
                }
                const newPage = ((p % totalPages) + totalPages) % totalPages;
                const start = newPage * step;
                const end = Math.min(start + step, total);

                if (animate) {
                    container.classList.remove('slide-in-right');
                    container.classList.add('slide-out-left');
                    const onOut = () => {
                        container.removeEventListener('animationend', onOut);
                        // cập nhật trang sau khi out
                        cards.forEach((card, idx) => {
                            card.style.display = (idx >= start && idx < end) ? '' : 'none';
                        });
                        container.classList.remove('slide-out-left');
                        container.classList.add('slide-in-right');
                        container.addEventListener('animationend', () => {
                            container.classList.remove('slide-in-right');
                        }, { once: true });
                    };
                    container.addEventListener('animationend', onOut);
                } else {
                    cards.forEach((card, idx) => {
                        card.style.display = (idx >= start && idx < end) ? '' : 'none';
                    });
                }
                page = newPage;
            }

            function setMoreLinkLabel(moreLink) {
                if (!moreLink) return;
                const icon = moreLink.querySelector('i');
                moreLink.textContent = expanded ? 'Thu gọn ' : 'Xem thêm ';
                if (icon) moreLink.appendChild(icon);
            }

            // Khởi tạo: nếu tổng <= 5 hiển thị tất cả, ngược lại hiển thị trang 0
            if (total <= step) {
                cards.forEach(c => c.style.display = '');
                return;
            } else {
                showPage(0, false);
            }

            const nextBtn = brand.querySelector('.slider-arrow.next');
            const moreLink = brand.querySelector('.view-more');

            nextBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                if (expanded) {
                    expanded = false;
                    setMoreLinkLabel(moreLink);
                    if (nextBtn) nextBtn.style.display = '';
                    showPage(0, false);
                } else {
                    showPage(page + 1, true);
                }
            });

            moreLink?.addEventListener('click', (e) => {
                e.preventDefault();
                expanded = !expanded;
                setMoreLinkLabel(moreLink);
                if (expanded) {
                    cards.forEach(c => c.style.display = '');
                    if (nextBtn) nextBtn.style.display = 'none';
                } else {
                    showPage(page, false);
                    if (nextBtn) nextBtn.style.display = '';
                }
            });

            setMoreLinkLabel(moreLink);
            if (nextBtn) nextBtn.style.display = '';
        });
    }
    initBrandPagination();

    // Xử lý active menu
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Xóa class active từ tất cả các link
            navLinks.forEach(l => l.classList.remove('active'));
            // Thêm class active vào link được click
            e.target.classList.add('active');
        });
    });

    // Xử lý active menu dựa trên vị trí scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Kiểm tra nếu ở đầu trang thì active menu Trang chủ
        if (scrollPosition < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            });
        }
    });

        // Cập nhật số lượng giỏ hàng trên navbar khi load trang
        updateCartCount();

        // Nếu đang ở trang giỏ hàng thì load dữ liệu
        if (document.getElementById('cart-body')) {
                loadCart();
        }

        // Thiết lập hành vi cho nút xem chi tiết -> mở modal
        setupCarDetailsModal();

        // Gán lại sự kiện cho nút Mua hàng để đảm bảo lấy đúng ảnh/tên/giá
        document.querySelectorAll('.car-card').forEach(card => {
            const btn = card.querySelector('.buy-btn');
            if (!btn) return;
            const name = card.querySelector('h3')?.textContent?.trim() || '';
            const price = parseCurrencyToNumber(card.querySelector('.price')?.textContent);
            const img = card.querySelector('img')?.getAttribute('src') || '';
            btn.onclick = (e) => {
                e?.preventDefault?.();
                addToCart(name, price, img);
            };
        });

        // Nút Thanh toán trên cart.html
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const stored = JSON.parse(localStorage.getItem('cart')) || [];
                if (!stored.length) {
                    showToast('Giỏ hàng trống!', 'error');
                    return;
                }

                // Giả lập thanh toán thành công
                showToast('Thanh toán thành công! Cảm ơn bạn.');
                localStorage.removeItem('cart');
                cart = [];
                loadCart();
                updateCartCount();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            });
        }
});

// Giỏ hàng (nếu có trong localStorage thì lấy ra, nếu chưa thì mảng rỗng)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Định dạng tiền VNĐ
function formatCurrency(value) {
    try {
        return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
    } catch (e) {
        return value + ' VNĐ';
    }
}

// Parse chuỗi tiền tệ thành số
function parseCurrencyToNumber(text) {
    if (!text) return 0;
    return Number(String(text).replace(/[^0-9]/g, '')) || 0;
}

// Cập nhật badge số lượng giỏ hàng
function updateCartCount() {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    const count = stored.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = count;
}

// Toast thông báo
function getToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
    }
    return c;
}

function showToast(message, type = 'success') {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    // Tự động ẩn
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 220);
    }, 1800);
}

// Hàm thêm vào giỏ hàng
function addToCart(name, price, img) {
    // Cố gắng lấy thông tin trực tiếp từ thẻ sản phẩm nếu có
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
    const card = activeEl && activeEl.closest ? activeEl.closest('.car-card') : null;

    if (card) {
        const titleFromDOM = card.querySelector('h3')?.textContent?.trim();
        const priceFromDOM = parseCurrencyToNumber(card.querySelector('.price')?.textContent);
        const imgFromDOM = card.querySelector('img')?.getAttribute('src');
        if (titleFromDOM) name = titleFromDOM;
        if (priceFromDOM) price = priceFromDOM;
        if (imgFromDOM) img = imgFromDOM;
    }

    // Fallback tên/giá
    if (!name) name = 'Sản phẩm';
    if (!price || isNaN(price)) price = 0;

    // Fallback ảnh
    if (!img) img = 'assets/images/hero-bg.jpg';

    let existing = cart.find(product => product.name === name);
    if (existing) {
        existing.quantity = (existing.quantity || 0) + 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
        showToast('Đã thêm vào giỏ hàng!');
}

// Hàm xóa sản phẩm trong giỏ
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Hàm load giỏ hàng (dùng trong cart.html)
function loadCart() {
    const tbody = document.getElementById('cart-body');
    const totalEl = document.getElementById('cart-total');
    const stored = JSON.parse(localStorage.getItem('cart')) || [];

    if (!tbody) return; // không phải trang giỏ hàng

    if (stored.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Giỏ hàng trống</td></tr>';
        if (totalEl) totalEl.textContent = 'Tổng cộng: 0 VNĐ';
        updateCartCount();
        return;
    }

    let rows = '';
    let total = 0;
    stored.forEach((item, idx) => {
        const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
        total += lineTotal;
        const imgSrc = item.img || 'assets/images/hero-bg.jpg';
        rows += `
            <tr>
                <td><img src="${imgSrc}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <button class="remove-btn" onclick="changeQuantity(${idx}, -1)">-</button>
                    <span style="display:inline-block;min-width:32px;">${item.quantity}</span>
                    <button class="remove-btn" style="background:#28a745" onclick="changeQuantity(${idx}, 1)">+</button>
                    <button class="remove-btn" style="margin-left:8px" onclick="removeFromCart(${idx})">Xóa</button>
                </td>
            </tr>`;
    });
    tbody.innerHTML = rows;
    if (totalEl) totalEl.textContent = `Tổng cộng: ${formatCurrency(total)}`;
    updateCartCount();
}

// Tăng/giảm số lượng
function changeQuantity(index, delta) {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    if (!stored[index]) return;
    stored[index].quantity = (Number(stored[index].quantity) || 0) + delta;
    if (stored[index].quantity <= 0) stored.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(stored));
    cart = stored;
    loadCart();
}

// Modal chi tiết xe
function setupCarDetailsModal() {
    const modal = document.getElementById('carModal');
    if (!modal) return; // không ở index
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const addBtn = document.getElementById('addToCartBtn');
    const buyBtn = document.getElementById('buyNowBtn');
    const closeBtn = modal.querySelector('.close-btn');

    const open = () => modal.classList.add('show');
    const close = () => modal.classList.remove('show');

    // Gán sự kiện cho các link "Chi tiết"
    document.querySelectorAll('.car-card .view-details').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const card = a.closest('.car-card');
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const img = card.querySelector('img')?.getAttribute('src') || '';
            const priceText = card.querySelector('.price')?.textContent || '';
            const price = parseCurrencyToNumber(priceText);

            modalImg.src = img;
            modalTitle.textContent = title;
            modalPrice.textContent = formatCurrency(price);
            modalDesc.textContent = 'Thông tin chi tiết sẽ được cập nhật.';

            // Gán hành vi nút
            addBtn.onclick = () => {
                addToCart(title, price, img);
                close();
            };
            buyBtn.onclick = () => {
                addToCart(title, price, img);
                window.location.href = 'cart.html';
            };

            open();
        });
    });

    closeBtn?.addEventListener('click', () => close());
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Hàm load sản phẩm từ admin
function loadAdminProducts() {
    const adminProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (adminProducts.length === 0) {
        return; // Không có sản phẩm từ admin
    }
    
    // Nhóm sản phẩm theo thương hiệu
    const productsByBrand = {};
    adminProducts.forEach(product => {
        const brand = product.brand.toLowerCase();
        if (!productsByBrand[brand]) {
            productsByBrand[brand] = [];
        }
        productsByBrand[brand].push(product);
    });
    
    // Thêm sản phẩm vào từng section thương hiệu
    Object.keys(productsByBrand).forEach(brand => {
        const brandSection = document.getElementById(brand);
        if (brandSection) {
            const carContainer = brandSection.querySelector('.car-container');
            if (carContainer) {
                productsByBrand[brand].forEach(product => {
                    const carCard = createCarCard(product);
                    carContainer.appendChild(carCard);
                });
            }
        }
    });
    
    // Khởi tạo lại pagination sau khi thêm sản phẩm
    setTimeout(() => {
        initBrandPagination();
        setupCarDetailsModal();
    }, 100);
}

// Hàm tạo card sản phẩm
function createCarCard(product) {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    
    const imageSrc = product.image || `assets/images/logo-${product.brand}.png`;
    
    carCard.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" onerror="this.src='assets/images/logo-${product.brand}.png'">
        <h3>${product.name}</h3>
        <p class="price">${formatCurrency(product.price)}</p>
        <button onclick="addToCart('${product.name}', ${product.price}, '${imageSrc}')" class="buy-btn">Mua hàng</button>
        <a href="#" class="view-details">Chi tiết</a>
    `;
    
    return carCard;
}



