let wishlistTab = document.querySelector('.wishlistTab');
let closeWishlistTabButton = document.querySelector('.closeWishlistTab');
let wishlistIcon = document.querySelector('.icon-wishlist');


wishlistIcon.onclick = function() {
    wishlistTab.classList.add('open');
}
closeWishlistTabButton.onclick = function() {
    wishlistTab.classList.remove('open');
}



// add products system
let cartTap = document.querySelector('.cartTab');
let closeButton = document.querySelector('.close');
let cartIcon = document.querySelector('.icon-cart');


cartIcon.onclick = function() {
    cartTap.classList.add('open');
}
closeButton.onclick = function() {
    cartTap.classList.remove('open');
}




// العناصر في HTML
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let listProductHTML = document.querySelector('.listProduct');

let allProducts = []; // جميع المنتجات من جميع الأقسام
let products = []; // المنتجات الخاصة بالقسم الحالي
let cart = []; // السلة

 
// تعديل addDataToHTML لإضافة حدث النقر على المنتج
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; // تفريغ المحتويات السابقة

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
    
        // إضافة التقييم باستخدام وظيفة getStars
        const ratingStars = getStars(product.ratings);

        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">
                <span>LE ${product.price}.00</span>
                <span class="before-sale">LE ${product.beforeSale}</span>
            </div>
            <div class="rating">
                ${ratingStars} <!-- عرض النجوم بدون الرقم -->
            </div>
    
            <button class="addWishlist" onclick="addToWishlist(${product.id}, this)">
                <i class="fa-regular fa-heart"></i>
            </button>
            <button class="addCart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        listProductHTML.appendChild(productItem);
    });
}


// إضافة منتج إلى السلة
const addToCart = (productId) => {
    const product = allProducts.find(p => p.id === productId); // البحث في جميع المنتجات
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    const existingItem = cart.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product_id: productId,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // حفظ السلة في localStorage
    addCartToHTML(); // تحديث عرض السلة
    showAddedToCartMessage(); // إظهار رسالة تأكيد الإضافة
}

// حفظ السلة في localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// عرض جميع المنتجات في السلة معًا
const addCartToHTML = () => {
    listCartHTML.innerHTML = ''; // تفريغ المحتويات السابقة
    let totalQuantity = 0;

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.product_id); // البحث في جميع المنتجات
        if (!product) return;

        totalQuantity += item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.dataset.id = product.id;
        itemDiv.innerHTML = `
            <div class="img">
                <img src="${product.image}" alt="">
            </div>
            <div class="name">${product.description}</div>
            <div class="totalPrice">${product.price * item.quantity} LE</div>
            <div class="quantity product-count">
                <button class="minus">-</button>
                <div class="count">${item.quantity}</div>
                <button class="plus">+</button>
            </div>
        `;
        listCartHTML.appendChild(itemDiv);

        // إضافة مستمعي الأحداث بعد إضافة العنصر إلى HTML
        itemDiv.querySelector('.minus').addEventListener('click', () => changeQuantityCart(product.id, 'minus'));
        itemDiv.querySelector('.plus').addEventListener('click', () => changeQuantityCart(product.id, 'plus'));
    });

    iconCartSpan.innerHTML = totalQuantity; // تحديث عدد المنتجات في السلة
}


// تغيير كمية المنتج في السلة
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex(value => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}
// إظهار رسالة "Added to Cart"
const showAddedToCartMessage = () => {
    const message = document.createElement('div');
    message.classList.add('cart-message');
    message.innerText = 'Added to Cart';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 2000); // اختفاء الرسالة بعد 2 ثانية
}

// تحميل السلة عند بداية الصفحة
window.onload = () => {
    addCartToHTML(); // عرض المنتجات في السلة عند بداية الصفحة
};

// العناصر في HTML
let listWishlistHTML = document.querySelector('.listWishlist');
let iconWishlistSpan = document.querySelector('.icon-wishlist span');

// قائمة Wishlist
let wishlist = [];

// إضافة منتج إلى الـ Wishlist
const addToWishlist = (productId, buttonElement) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }

    const existingItem = wishlist.find(item => item.product_id === productId);

    if (existingItem) {
        // إزالة المنتج من الـ Wishlist
        wishlist = wishlist.filter(item => item.product_id !== productId);

        // تغيير الأيقونة إلى فارغة
        buttonElement.querySelector('i').classList.remove('fa-solid');
        buttonElement.querySelector('i').classList.add('fa-regular');
        
    } else {
        // إضافة المنتج إلى الـ Wishlist
        wishlist.push({
            product_id: productId,
        });

        // تغيير الأيقونة إلى مملوءة
        buttonElement.querySelector('i').classList.remove('fa-regular');
        buttonElement.querySelector('i').classList.add('fa-solid');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // حفظ الـ Wishlist في localStorage
    addWishlistToHTML(); // تحديث عرض الـ Wishlist
}




// عرض المنتجات في الـ Wishlist
const addWishlistToHTML = () => {
    listWishlistHTML.innerHTML = ''; // تفريغ المحتويات السابقة
    wishlist.forEach(item => {
        const product = allProducts.find(p => p.id === item.product_id);
        if (!product) return;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.dataset.id = product.id;
        itemDiv.innerHTML = `
            <div class="img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="name">${product.description}</div>
            <button class="removeWishlist">Remove</button>
            <button class="addToCart">Add to Cart</button>
        `;
        listWishlistHTML.appendChild(itemDiv);

        // إضافة مستمعات الأحداث للأزرار
        itemDiv.querySelector('.removeWishlist').addEventListener('click', () => removeFromWishlist(product.id));
        itemDiv.querySelector('.addToCart').addEventListener('click', () => {
            removeFromWishlist(product.id); 
            addToCart(product.id);
        });
    });

    iconWishlistSpan.innerHTML = wishlist.length; // تحديث عدد المنتجات في الـ Wishlist
}

// إزالة منتج من الـ Wishlist
const removeFromWishlist = (productId) => {
    wishlist = wishlist.filter(item => item.product_id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // تحديث الـ Wishlist في localStorage

    // استرجاع لون الأيقونة إلى حالتها الأصلية
    const wishlistButton = document.querySelector(`.addWishlist[onclick="addToWishlist(${productId}, this)"] i`);
    if (wishlistButton) {
        wishlistButton.classList.remove('fa-solid');
        wishlistButton.classList.add('fa-regular');
    }

    addWishlistToHTML(); // تحديث عرض الـ Wishlist
}





// وظيفة لإظهار النجوم بناءً على التقييم
function getStars(ratings) {
    const maxStars = 5;
    let stars = '';
    for (let i = 0; i < maxStars; i++) {
        // إضافة فئات CSS لتلوين النجوم
        stars += i < ratings ? '<span class="star filled">★</span>' : '<span class="star">☆</span>';
    }
    return stars;
}


// تعديل تهيئة التطبيق لإضافة تقييمات المنتجات
const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // دمج جميع المنتجات في قائمة واحدة
        allProducts = [];
        for (const section in data) {
            if (data.hasOwnProperty(section)) {
                allProducts.push(...data[section]);
            }
        }

        // تحديد القسم بناءً على اسم الصفحة أو معلمة URL
        let section = '';
        if (window.location.pathname.includes('beads-necklace.html')) {
            section = 'Beads_Necklace';
        } else if (window.location.pathname.includes('phone-charm.html')) {
            section = 'Phone_Charm';
        } else if (window.location.pathname.includes('bracelet.html')) {
            section = 'Beads_Bracelet';
        }
        // التأكد من أن القسم موجود في ملف JSON
        if (data[section]) {
            products = data[section]; // تعيين المنتجات للقسم المحدد فقط
            addDataToHTML(); // عرض المنتجات في HTML حسب القسم
        }

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML(); // عرض المنتجات في السلة
        }
        if (localStorage.getItem('wishlist')) {
            wishlist = JSON.parse(localStorage.getItem('wishlist'));
            addWishlistToHTML(); // عرض المنتجات في الـ Wishlist

            // تحديث لون الأيقونات الخاصة بالمنتجات في الـ Wishlist
            wishlist.forEach(item => {
                const wishlistButton = document.querySelector(`.addWishlist[onclick="addToWishlist(${item.product_id}, this)"] i`);
                if (wishlistButton) {
                    wishlistButton.classList.remove('fa-regular');
                    wishlistButton.classList.add('fa-solid');
                }
            });
        }
    });
}
initApp();


// إزالة السلة من localStorage (للاختبار فقط)
// localStorage.removeItem('cart');
// add products system




window.onscroll = function () {
    let windowHeight = this.innerHeight;
    let windowScrollTop = this.scrollY;


    let products = document.querySelector('.products')
    let productsTop = products.offsetTop;
    let productsHeight = products.offsetHeight;
    if (windowScrollTop > (productsTop + productsHeight - windowHeight -1600)) {
        let allProducts = document.querySelectorAll('.prod');
        allProducts.forEach((e) => {
            e.classList.add('translate')
        })
    }


    let products2Top = products.offsetTop;
    let products2Height = products.offsetHeight;
    if (windowScrollTop > (products2Top + products2Height - windowHeight -5800)) {
        let allProducts2 = document.querySelectorAll('.prod');
        allProducts2.forEach((e) => {
            e.classList.add('translate2')
        })
    }
    
    
    let features = document.querySelector('.features');
    let features2Top = features.offsetTop;
    let features2Height = features.offsetHeight;
    if (windowScrollTop > (features2Top + features2Height - windowHeight -800)) {
        let allFeat = document.querySelectorAll('.feat');
        allFeat.forEach((e)=> {
            e.classList.add('translate2');
        })
    }
}


window.addEventListener('scroll', function() {
    let landing = this.document.querySelector('.landing');
    let  header = document.querySelector('.header');
    let button = document.querySelectorAll('.head-button')
    let allA = this.document.querySelectorAll('.ul li a');
    if (window.scrollY > 4) {
        header.classList.add('translate');
        landing.classList.add('translate')
        button.forEach((b)=> {
            b.classList.add('translate');
        })
        allA.forEach((e) => {
            e.classList.add('change-color')
        })
    } else {
        header.classList.remove('translate');
        landing.classList.remove('translate')
        button.forEach((b)=> {
            b.classList.remove('translate');
        })     
        allA.forEach((e) => {
            e.classList.remove('change-color')
        })
    }
});



setTimeout(function() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}, 1000); // 5000 milliseconds = 5 seconds



let links = document.querySelector('.icon');
let menu = document.querySelector('.menu');
let menuX = document.querySelector('.x');
let allA = document.querySelector('.Phone-ul');




links.onclick = function() {
    menu.classList.toggle('active');
}
menuX.onclick = function() {
    menu.classList.toggle('active');
}
allA.onclick = function() {
    menu.classList.toggle('active');
}


let about = document.querySelector('.about');
let aside = document.querySelector('.aside');
about.onclick = function() {
    aside.classList.toggle('open')
}

document.addEventListener('DOMContentLoaded', function () {
    let count = 0; // الرقم الابتدائي
    const counter = document.getElementById('counter');

    function countdown() {
        counter.textContent = count + "+"; // إضافة علامة "+"
        if (count < 300) {
            count++;
            setTimeout(countdown, 1); // زمن التحديث
        }
    }

    countdown();
});

document.addEventListener('DOMContentLoaded', function () {
    let count = 0; // الرقم الابتدائي
    const counter = document.getElementById('counter2');

    function countdown() {
        counter.textContent = count + "+"; // إضافة علامة "+"
        if (count < 100) {
            count++;
            setTimeout(countdown, 2); // زمن التحديث
        }
    }

    countdown();
});


document.addEventListener('DOMContentLoaded', function () {
    let count = 0; // الرقم الابتدائي
    const counter = document.getElementById('counter3');

    function countdown() {
        counter.textContent = count + "+"; // إضافة علامة "+"
        if (count < 50) {
            count++;
            setTimeout(countdown, 8); // زمن التحديث
        }
    }

    countdown();
});



window.onscroll = function () {
    let windowHeight = this.innerHeight;
    let windowScrollTop = this.scrollY;
    // start aboutus section animation


    let gallery = document.querySelector('.gallery');
    let galleryTop = gallery.offsetTop;
    let galleryHeight = gallery.offsetHeight;
    if (windowScrollTop > (galleryTop + galleryHeight - windowHeight -200)) {
        let galleryBoxes = document.querySelectorAll('.gallery-box');
        galleryBoxes.forEach((e) => {
                e.classList.add('translate')
        })
    }
    let services = document.querySelector('.services');
    let servicesTop = services.offsetTop;
    let servicesHeight = services.offsetHeight;
    if (windowScrollTop > (servicesTop + servicesHeight - windowHeight -250)) {
        let model2 = document.querySelector('.model-container .model2');
        model2.classList.add('translate');

        let allServ = document.querySelectorAll('.serv');
        allServ.forEach((e)=> {
            e.classList.add('translate');
        })

        let servP = document.querySelectorAll('.serv-p');
        servP.forEach((e)=> {
            e.classList.add('translate');
        })
    }

    let features = document.querySelector('.features');
    let featuresTop = features.offsetTop;
    let featuresHeight = features.offsetHeight;
    if (windowScrollTop > (featuresTop + featuresHeight - windowHeight -100)) {
        let allFeat = document.querySelectorAll('.feat');
        allFeat.forEach((e)=> {
            e.classList.add('translate');
        })
    }


    //  gallery section animation translate fom small screen
    let gallery2Top = gallery.offsetTop;
    let gallery2Height = gallery.offsetHeight;
    if (windowScrollTop > (gallery2Top + gallery2Height - windowHeight -800)) {
        let galleryBoxes = document.querySelectorAll('.gallery-box');
        galleryBoxes.forEach((e) => {
                e.classList.add('translate2')
        })
    }
    //  service section animation translate fom small screen
    let servicesTop2 = services.offsetTop;
    let servicesHeight2 = services.offsetHeight;
    if (windowScrollTop > (servicesTop2 + servicesHeight2 - windowHeight -1300)) {
        let allServ = document.querySelectorAll('.serv');
        allServ.forEach((e)=> {
            e.classList.add('translate2');
        })
        let servP = document.querySelectorAll('.serv-p');
        servP.forEach((e)=> {
            e.classList.add('translate2');
        })
    }
    let servicesTop3 = services.offsetTop;
    let servicesHeight3 = services.offsetHeight;
    if (windowScrollTop > (servicesTop3 + servicesHeight3 - windowHeight -800)) {
        let model2 = document.querySelector('.model-container .model2');
        model2.classList.add('translate3');

    //  features section animation translate fom small screen
    let features2Top = features.offsetTop;
    let features2Height = features.offsetHeight;
    if (windowScrollTop > (features2Top + features2Height - windowHeight -800)) {
        let allFeat = document.querySelectorAll('.feat');
        allFeat.forEach((e)=> {
            e.classList.add('translate2');
        })
    }
    }
}




let videoIcon = document.querySelector(".video");
let video = document.querySelector('.video .video-container');
let x = document.querySelector('.x');
videoIcon.onclick = function () {
    video.classList.toggle("block")
    x.classList.toggle("block")
} 