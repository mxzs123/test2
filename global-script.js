/**
 * 芝生药局 - 全局JavaScript
 * 核心功能和工具函数
 */

// ========== 全局配置 ==========
const APP_CONFIG = {
    name: '芝生药局',
    version: '1.0.0',
    api: {
        baseUrl: '/api',
        timeout: 10000
    },
    storage: {
        prefix: 'zhisheng_',
        cartKey: 'cart_items',
        userKey: 'user_info',
        tokenKey: 'auth_token'
    }
};

// ========== 数据管理 ==========

/**
 * 本地存储管理
 */
const Storage = {
    set(key, value) {
        const fullKey = APP_CONFIG.storage.prefix + key;
        localStorage.setItem(fullKey, JSON.stringify(value));
    },
    
    get(key) {
        const fullKey = APP_CONFIG.storage.prefix + key;
        const value = localStorage.getItem(fullKey);
        try {
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return value;
        }
    },
    
    remove(key) {
        const fullKey = APP_CONFIG.storage.prefix + key;
        localStorage.removeItem(fullKey);
    },
    
    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(APP_CONFIG.storage.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
};

/**
 * 购物车管理
 */
const Cart = {
    items: [],
    
    init() {
        this.items = Storage.get('cart') || [];
        this.updateBadge();
    },
    
    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += (product.quantity || 1);
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity || 1,
                spec: product.spec || '',
                isPrescription: product.isPrescription || false,
                checked: true
            });
        }
        
        this.save();
        this.updateBadge();
        return true;
    },
    
    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateBadge();
    },
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
    },
    
    getTotal() {
        return this.items
            .filter(item => item.checked)
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    clear() {
        this.items = [];
        this.save();
        this.updateBadge();
    },
    
    save() {
        Storage.set('cart', this.items);
    },
    
    updateBadge() {
        const count = this.getCount();
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            if (count > 0) {
                badge.style.display = 'block';
                badge.textContent = count > 99 ? '99+' : count;
            } else {
                badge.style.display = 'none';
            }
        });
    }
};

// ========== UI组件 ==========

/**
 * Toast提示
 */
const Toast = {
    show(message, duration = 2000) {
        // 移除已存在的toast
        const existingToast = document.querySelector('.toast-container');
        if (existingToast) {
            existingToast.remove();
        }
        
        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = 'toast-container';
        toast.innerHTML = `<div class="toast show">${message}</div>`;
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
};

/**
 * Loading加载
 */
const Loading = {
    show(text = '加载中...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.id = 'globalLoading';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <div class="loading-text">${text}</div>
            </div>
        `;
        document.body.appendChild(loading);
    },
    
    hide() {
        const loading = document.getElementById('globalLoading');
        if (loading) {
            loading.remove();
        }
    }
};

/**
 * 模态框
 */
const Modal = {
    show(options) {
        const {
            title = '提示',
            content = '',
            confirmText = '确定',
            cancelText = '取消',
            showCancel = true,
            onConfirm = () => {},
            onCancel = () => {}
        } = options;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    ${showCancel ? `<button class="btn btn-secondary modal-cancel">${cancelText}</button>` : ''}
                    <button class="btn btn-primary modal-confirm">${confirmText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定事件
        const confirmBtn = modal.querySelector('.modal-confirm');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        confirmBtn.onclick = () => {
            onConfirm();
            modal.remove();
        };
        
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                onCancel();
                modal.remove();
            };
        }
        
        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                onCancel();
                modal.remove();
            }
        };
    },
    
    confirm(message, onConfirm) {
        this.show({
            title: '确认',
            content: message,
            onConfirm
        });
    },
    
    alert(message, onConfirm) {
        this.show({
            title: '提示',
            content: message,
            showCancel: false,
            onConfirm
        });
    }
};

// ========== 页面导航 ==========

/**
 * 页面跳转
 */
const Navigation = {
    go(page, params = {}) {
        const queryString = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        const url = queryString ? `${page}.html?${queryString}` : `${page}.html`;
        window.location.href = url;
    },
    
    back() {
        window.history.back();
    },
    
    getParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    }
};

// ========== 表单验证 ==========

/**
 * 表单验证工具
 */
const Validator = {
    rules: {
        required: (value) => {
            return value !== '' && value !== null && value !== undefined;
        },
        
        phone: (value) => {
            return /^1[3-9]\d{9}$/.test(value);
        },
        
        email: (value) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        
        idCard: (value) => {
            return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/.test(value);
        },
        
        minLength: (value, length) => {
            return value && value.length >= length;
        },
        
        maxLength: (value, length) => {
            return !value || value.length <= length;
        }
    },
    
    validate(form, rules) {
        const errors = {};
        
        for (const field in rules) {
            const fieldRules = rules[field];
            const value = form[field];
            
            for (const rule of fieldRules) {
                if (rule.type === 'required' && !this.rules.required(value)) {
                    errors[field] = rule.message || '此项为必填项';
                    break;
                }
                
                if (rule.type === 'phone' && !this.rules.phone(value)) {
                    errors[field] = rule.message || '请输入正确的手机号';
                    break;
                }
                
                if (rule.type === 'custom' && !rule.validator(value)) {
                    errors[field] = rule.message || '验证失败';
                    break;
                }
            }
        }
        
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// ========== 工具函数 ==========

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 格式化价格
 */
function formatPrice(price) {
    return '¥' + Number(price).toFixed(2);
}

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 生成订单号
 */
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}${random}`;
}

// ========== 业务功能 ==========

/**
 * 检查登录状态
 */
function checkLogin() {
    const userInfo = Storage.get('userInfo');
    return userInfo && userInfo.token;
}

/**
 * 处理处方药购买
 */
function handlePrescriptionPurchase(product, callback) {
    Modal.show({
        title: '处方药购买提示',
        content: '处方药需在下单后补充问卷信息，可能产生额外的视频问诊费用。是否继续添加到购物车？',
        confirmText: '继续添加',
        onConfirm: () => {
            if (callback) callback();
        }
    });
}

/**
 * 图片懒加载
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========== 初始化 ==========

/**
 * 应用初始化
 */
function initApp() {
    // 初始化购物车
    Cart.init();
    
    // 初始化懒加载
    if (typeof IntersectionObserver !== 'undefined') {
        document.addEventListener('DOMContentLoaded', lazyLoadImages);
    }
    
    // 处理返回按钮
    const backBtns = document.querySelectorAll('.back-btn, .header-back');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => Navigation.back());
    });
    
    // 阻止默认的链接跳转
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href === '#') {
            e.preventDefault();
        }
    });
    
    // 添加触摸反馈
    document.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('btn') || 
            e.target.classList.contains('card') ||
            e.target.closest('.clickable')) {
            e.target.style.opacity = '0.7';
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (e.target.style.opacity === '0.7') {
            e.target.style.opacity = '';
        }
    });
}

// 启动应用
initApp();

// ========== 导出全局对象 ==========
window.ZhiSheng = {
    Storage,
    Cart,
    Toast,
    Loading,
    Modal,
    Navigation,
    Validator,
    utils: {
        debounce,
        throttle,
        formatPrice,
        formatDate,
        generateOrderNumber
    },
    checkLogin,
    handlePrescriptionPurchase
};