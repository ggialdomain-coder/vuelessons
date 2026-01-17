# ShopVue - Ecommerce Project Documentation

A complete Vue.js ecommerce application built with Vue 3 CDN. This documentation is designed for HTML developers with minimal Vue.js knowledge.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Understanding Vue.js in This Project](#understanding-vuejs-in-this-project)
4. [Getting Started](#getting-started)
5. [How to Edit Existing Features](#how-to-edit-existing-features)
6. [How to Add New Features](#how-to-add-new-features)
7. [How to Create New Pages](#how-to-create-new-pages)
8. [How to Create New Components](#how-to-create-new-components)
9. [Styling Guide](#styling-guide)
10. [Common Tasks](#common-tasks)
11. [Troubleshooting](#troubleshooting)
12. [Django Backend Integration](#django-backend-integration)

---

## Project Overview

This is a complete ecommerce application with the following features:

- ✅ **Homepage** with categories
- ✅ **Product Listing** page with filtering
- ✅ **Product Detail** modal
- ✅ **Shopping Cart** (sidebar + full page)
- ✅ **Checkout** page with payment options
- ✅ **User Authentication** (Login/Signup)
- ✅ **User Account** page with orders, addresses, settings
- ✅ **Address Management** (Add/Edit)
- ✅ **Search Functionality**
- ✅ **Account Sidebar** overlay
- ✅ **Currency**: KWD (Kuwaiti Dinar)

---

## Project Structure

```
ecommerce/
├── index.html                    # Homepage
├── products.html                 # Product listing page
├── cart.html                    # Shopping cart page
├── checkout.html                # Checkout page
├── auth.html                    # Login/Signup page
├── account.html                 # User account page
├── address-form.html            # Add/Edit address page
├── search.html                  # Search results page
├── assets/
│   ├── css/
│   │   └── main.css            # All styles (3300+ lines)
│   └── js/
│       ├── app.js              # Homepage Vue app
│       ├── products-app.js    # Products page Vue app
│       ├── cart-app.js        # Cart page Vue app
│       ├── checkout-app.js    # Checkout page Vue app
│       ├── auth-app.js        # Auth page Vue app
│       ├── account-app.js     # Account page Vue app
│       ├── address-form-app.js # Address form Vue app
│       ├── search-app.js      # Search page Vue app
│       ├── components/        # Reusable Vue components
│       │   ├── Header.js      # Site header
│       │   ├── Footer.js      # Site footer
│       │   ├── CategoryCard.js # Category display card
│       │   ├── ProductCard.js  # Product display card
│       │   ├── ProductModal.js # Product detail modal
│       │   ├── CartSidebar.js  # Cart sidebar overlay
│       │   └── AccountSidebar.js # Account sidebar overlay
│       └── services/
│           └── api.js         # API service (mock data)
└── README.md
```

---

## Understanding Vue.js in This Project

### What is Vue.js?

Vue.js is a JavaScript framework that makes it easy to create interactive web pages. In this project, we use Vue 3 via CDN (no installation needed).

### Key Vue Concepts Used

#### 1. **Vue App Instance**

Each HTML page has its own Vue app instance. For example, `index.html` uses `app.js`:

```javascript
const app = createApp({
    data() {
        return {
            // Your data here
            categories: [],
            loading: false
        };
    },
    methods: {
        // Your functions here
        loadCategories() {
            // Function code
        }
    }
});

app.mount('#app'); // Connects Vue to the HTML element with id="app"
```

#### 2. **Data Binding**

Vue uses `{{ }}` to display data in HTML:

```html
<h1>{{ pageTitle }}</h1>  <!-- Shows the value of pageTitle -->
```

#### 3. **Directives**

- `v-if="condition"` - Shows/hides element based on condition
- `v-for="item in items"` - Loops through items
- `v-model="variable"` - Two-way binding for inputs
- `@click="functionName"` - Calls function on click
- `:prop="value"` - Passes data to components

#### 4. **Components**

Components are reusable pieces. They're registered and used like HTML tags:

```html
<!-- In HTML -->
<header-component :cart-count="cartCount"></header-component>
```

```javascript
// In JavaScript
components: {
    'header-component': Header  // Register component
}
```

---

## Getting Started

### 1. Opening the Project

Simply open any HTML file in your browser:
- `index.html` - Homepage
- `products.html` - Products page
- `cart.html` - Cart page
- etc.

**No server needed!** Just double-click the HTML file.

### 2. Making Changes

1. Edit the file you want to change
2. Save the file
3. **Refresh your browser** (Ctrl + Shift + R for hard refresh)
4. See your changes

**Important**: If changes don't appear, do a hard refresh (Ctrl + Shift + R) to clear browser cache.

---

## How to Edit Existing Features

### Changing Text Content

#### Example 1: Change Page Title

**File**: `index.html`

Find this line:
```html
<h1 class="page-title">Welcome to ShopVue</h1>
```

Change to:
```html
<h1 class="page-title">Welcome to My Store</h1>
```

#### Example 2: Change Button Text

**File**: `cart.html`

Find:
```html
<button @click="proceedToCheckout" class="btn-checkout">
    Proceed to Checkout
</button>
```

Change to:
```html
<button @click="proceedToCheckout" class="btn-checkout">
    Go to Payment
</button>
```

### Changing Colors

**File**: `assets/css/main.css`

Find the `:root` section at the top (around line 1-50):

```css
:root {
    --primary-color: #42b983;      /* Main brand color */
    --secondary-color: #667eea;    /* Secondary color */
    --text-color: #333;            /* Text color */
    --bg-color: #ffffff;           /* Background color */
    /* ... more variables */
}
```

Change any color value:
```css
--primary-color: #ff0000;  /* Change to red */
--text-color: #000000;     /* Change to black */
```

**All buttons, links, and accents will update automatically!**

### Changing Company Information

**File**: `assets/js/components/Footer.js`

Find the `data()` function (around line 50-80):

```javascript
data() {
    return {
        companyName: 'ShopVue',
        contactEmail: 'info@shopvue.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Main Street, City, Country'
    };
}
```

Change the values:
```javascript
companyName: 'My Store',
contactEmail: 'contact@mystore.com',
contactPhone: '+965 1234 5678',
address: 'Kuwait City, Kuwait'
```

### Changing Logo

**Option 1: Use Image Logo**

1. Add your logo image to `assets/images/logo.png`
2. Open `assets/js/app.js` (or any page's app file)
3. Find:
```javascript
logoImage: '' // Set to your logo image path
```
4. Change to:
```javascript
logoImage: 'assets/images/logo.png'
```

**Option 2: Use Text Logo**

1. Open `assets/js/components/Header.js`
2. Find:
```javascript
logoText: 'ShopVue'
```
3. Change to:
```javascript
logoText: 'My Store'
```

### Changing Default Delivery Address

**File**: `assets/js/components/Header.js`

Find:
```javascript
deliveryAddress: 'New York, NY 10001'
```

Change to:
```javascript
deliveryAddress: 'Kuwait City, Kuwait'
```

### Adding/Removing Navigation Menu Items

**File**: `assets/js/components/Header.js`

Find the navigation section (around line 35-42):

```html
<ul class="nav-list">
    <li><a href="#" @click.prevent="navigate('home')">Home</a></li>
    <li><a href="#" @click.prevent="navigate('products')">Products</a></li>
    <li><a href="#" @click.prevent="navigate('categories')">Categories</a></li>
    <li><a href="#" @click.prevent="navigate('about')">About</a></li>
    <li><a href="#" @click.prevent="navigate('contact')">Contact</a></li>
</ul>
```

**To add a new item:**
```html
<li><a href="#" @click.prevent="navigate('newpage')">New Page</a></li>
```

**To remove an item:**
Just delete the entire `<li>` line.

**Important**: You also need to handle the navigation in the app file. See "Adding New Pages" section below.

---

## How to Add New Features

### Adding a New Button

**Step 1**: Add the button in HTML

**File**: `index.html` (or any page)

```html
<button @click="handleNewButton" class="btn-primary">
    Click Me
</button>
```

**Step 2**: Add the function in JavaScript

**File**: `assets/js/app.js` (or the page's app file)

In the `methods` section, add:

```javascript
methods: {
    // ... existing methods ...
    
    handleNewButton() {
        alert('Button clicked!');
        // Add your code here
    }
}
```

### Adding a New Data Field

**Step 1**: Add to data

**File**: `assets/js/app.js`

In the `data()` function:

```javascript
data() {
    return {
        // ... existing data ...
        newField: 'Hello World'
    };
}
```

**Step 2**: Display in HTML

**File**: `index.html`

```html
<p>{{ newField }}</p>
```

### Adding a New Input Field

**Step 1**: Add input in HTML

**File**: `index.html`

```html
<input type="text" v-model="userInput" placeholder="Enter text">
<p>You typed: {{ userInput }}</p>
```

**Step 2**: Add to data

**File**: `assets/js/app.js`

```javascript
data() {
    return {
        userInput: ''  // Initialize as empty string
    };
}
```

**That's it!** The `v-model` automatically connects the input to the data.

---

## How to Create New Pages

### Step-by-Step Guide

Let's create a new "About" page as an example:

#### Step 1: Create the HTML File

Create `about.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShopVue - About</title>
    <link rel="stylesheet" href="assets/css/main.css?v=14">
</head>
<body>
    <div id="app">
        <!-- Header Component -->
        <header-component 
            :cart-count="cartCount"
            :current-page="currentPage"
            :logo-image="logoImage"
            :is-logged-in="isLoggedIn"
            :user-email="userEmail"
            @navigate="handleNavigate"
            @search="handleSearch"
            @login="handleLogin"
            @logout="handleLogout"
            @open-account="openAccountSidebar"
            @change-address="handleChangeAddress"
        ></header-component>

        <!-- Main Content -->
        <main class="main-content">
            <section class="hero-section">
                <h1 class="page-title">About Us</h1>
                <p class="page-subtitle">Learn more about our company</p>
            </section>

            <section class="about-section">
                <h2>Our Story</h2>
                <p>Add your content here...</p>
            </section>
        </main>

        <!-- Footer Component -->
        <footer-component 
            @navigate="handleNavigate"
            @social-click="handleSocialClick"
        ></footer-component>

        <!-- Account Sidebar (if needed) -->
        <account-sidebar
            :show="showAccountSidebar"
            :user-data="userData"
            @close="closeAccountSidebar"
            @navigate-account="handleNavigateAccount"
            @logout="handleLogout"
        ></account-sidebar>
    </div>

    <!-- Vue 3 CDN -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    
    <!-- API Service -->
    <script src="assets/js/services/api.js?v=3"></script>
    
    <!-- Components -->
    <script src="assets/js/components/Header.js?v=6"></script>
    <script src="assets/js/components/Footer.js?v=3"></script>
    <script src="assets/js/components/AccountSidebar.js?v=1"></script>
    
    <!-- About App -->
    <script src="assets/js/about-app.js?v=1"></script>
</body>
</html>
```

#### Step 2: Create the Vue App File

Create `assets/js/about-app.js`:

```javascript
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            cartCount: 0,
            currentPage: 'about',
            logoImage: '',
            isLoggedIn: false,
            userEmail: '',
            userData: {},
            showAccountSidebar: false
        };
    },
    components: {
        'header-component': Header,
        'footer-component': Footer,
        'account-sidebar': AccountSidebar
    },
    mounted() {
        this.checkAuthStatus();
        this.loadCartCount();
    },
    methods: {
        checkAuthStatus() {
            const userData = localStorage.getItem('shopvue_user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    this.isLoggedIn = true;
                    this.userEmail = user.email;
                    this.userData = user;
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }
        },
        loadCartCount() {
            const savedCart = localStorage.getItem('shopvue_cart');
            if (savedCart) {
                try {
                    const cartItems = JSON.parse(savedCart);
                    this.cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
        },
        openAccountSidebar() {
            this.showAccountSidebar = true;
        },
        closeAccountSidebar() {
            this.showAccountSidebar = false;
        },
        handleNavigateAccount(tab) {
            window.location.href = `account.html?tab=${tab}`;
        },
        handleNavigate(page) {
            if (page === 'home') {
                window.location.href = 'index.html';
            } else if (page === 'products') {
                window.location.href = 'products.html';
            } else if (page === 'cart') {
                window.location.href = 'cart.html';
            }
        },
        handleSearch(query) {
            if (query && query.trim()) {
                window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
            }
        },
        handleLogin() {
            window.location.href = 'auth.html';
        },
        handleLogout() {
            localStorage.removeItem('shopvue_user');
            localStorage.removeItem('shopvue_remember_me');
            this.isLoggedIn = false;
            this.userEmail = '';
            window.location.href = 'index.html';
        },
        handleChangeAddress() {
            console.log('Change delivery address');
        },
        handleSocialClick(platform) {
            console.log('Social click:', platform);
        }
    }
});

app.mount('#app');
```

#### Step 3: Add Navigation Link

**File**: `assets/js/components/Header.js`

The navigation already includes "About", but if you need to add it to handleNavigate:

**File**: `assets/js/app.js` (and other app files)

In the `handleNavigate` method:

```javascript
handleNavigate(page) {
    if (page === 'home') {
        window.location.href = 'index.html';
    } else if (page === 'about') {
        window.location.href = 'about.html';  // Add this line
    } else if (page === 'products') {
        window.location.href = 'products.html';
    }
}
```

**That's it!** Your new page is ready.

---

## How to Create New Components

### Step-by-Step Guide

Let's create a "Banner" component as an example:

#### Step 1: Create Component File

Create `assets/js/components/Banner.js`:

```javascript
/**
 * Banner Component
 * Displays promotional banners
 */

const Banner = {
    template: `
        <div class="banner">
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
            <button @click="handleClick" class="btn-banner">
                {{ buttonText }}
            </button>
        </div>
    `,
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        buttonText: {
            type: String,
            default: 'Learn More'
        }
    },
    methods: {
        handleClick() {
            this.$emit('banner-click');
        }
    }
};
```

#### Step 2: Use Component in HTML

**File**: `index.html`

Before the closing `</div>` of `#app`, add:

```html
<banner-component 
    title="Special Offer!"
    description="Get 50% off on all products"
    button-text="Shop Now"
    @banner-click="handleBannerClick"
></banner-component>
```

#### Step 3: Register Component

**File**: `assets/js/app.js`

In the `components` section:

```javascript
components: {
    'header-component': Header,
    'footer-component': Footer,
    'category-card': CategoryCard,
    'banner-component': Banner  // Add this line
}
```

#### Step 4: Load Component Script

**File**: `index.html`

Before `app.js`, add:

```html
<script src="assets/js/components/Banner.js?v=1"></script>
<script src="assets/js/app.js?v=5"></script>
```

#### Step 5: Add Handler Method

**File**: `assets/js/app.js`

In the `methods` section:

```javascript
methods: {
    // ... existing methods ...
    
    handleBannerClick() {
        window.location.href = 'products.html';
    }
}
```

#### Step 6: Add Styles (Optional)

**File**: `assets/css/main.css`

Add at the end:

```css
/* Banner Component Styles */
.banner {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-lg);
    text-align: center;
    border-radius: var(--border-radius);
    margin: var(--spacing-lg) 0;
}

.btn-banner {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: white;
    color: var(--primary-color);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
}
```

**Your component is ready to use!**

---

## Styling Guide

### Understanding CSS Variables

All colors and spacing use CSS variables for easy customization.

**File**: `assets/css/main.css`

```css
:root {
    /* Colors */
    --primary-color: #42b983;      /* Main brand color */
    --primary-dark: #35a372;      /* Darker shade of primary */
    --secondary-color: #667eea;    /* Secondary color */
    --text-color: #333;           /* Main text color */
    --text-light: #666;           /* Light text color */
    --bg-color: #ffffff;          /* Background color */
    --bg-light: #f8f9fa;          /* Light background */
    --border-color: #e0e0e0;      /* Border color */
    
    /* Spacing */
    --spacing-xs: 0.25rem;        /* 4px */
    --spacing-sm: 0.5rem;          /* 8px */
    --spacing-md: 1rem;            /* 16px */
    --spacing-lg: 1.5rem;          /* 24px */
    --spacing-xl: 2rem;            /* 32px */
    
    /* Other */
    --border-radius: 8px;         /* Border radius */
    --transition: all 0.3s ease;  /* Transitions */
    --shadow: 0 2px 4px rgba(0,0,0,0.1);  /* Box shadow */
}
```

### Changing Colors Globally

To change the primary color site-wide:

1. Open `assets/css/main.css`
2. Find `--primary-color: #42b983;`
3. Change to your color: `--primary-color: #ff0000;`
4. Save and refresh

**All buttons, links, and accents update automatically!**

### Adding Custom Styles

**File**: `assets/css/main.css`

Add your styles at the end of the file:

```css
/* My Custom Styles */
.my-custom-class {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
}
```

### Responsive Design

The project uses media queries for responsive design:

```css
/* Tablet and below */
@media (max-width: 768px) {
    .my-element {
        /* Styles for tablets */
    }
}

/* Mobile */
@media (max-width: 480px) {
    .my-element {
        /* Styles for mobile */
    }
}
```

---

## Common Tasks

### Task 1: Change Button Color

**Method 1: Change Primary Color (All Buttons)**

**File**: `assets/css/main.css`

```css
:root {
    --primary-color: #ff0000;  /* Change to red */
}
```

**Method 2: Change Specific Button**

**File**: `assets/css/main.css`

Add:
```css
.btn-checkout {
    background: #ff0000;  /* Red background */
}
```

### Task 2: Add a New Product Field

**Step 1**: Update API Service

**File**: `assets/js/services/api.js`

In the product objects (around line 95-250), add your field:

```javascript
{
    id: 1,
    name: 'Wireless Headphones',
    // ... existing fields ...
    newField: 'New Value'  // Add your field
}
```

**Step 2**: Display in ProductCard

**File**: `assets/js/components/ProductCard.js`

In the template, add:

```html
<p class="product-new-field">{{ product.newField }}</p>
```

**Step 3**: Add Styles

**File**: `assets/css/main.css`

```css
.product-new-field {
    color: var(--text-light);
    font-size: var(--font-size-sm);
}
```

### Task 3: Change Currency Symbol

**File**: `assets/js/components/ProductCard.js`

Find:
```html
<span class="price-current">{{ formatPrice(product.price) }} KWD</span>
```

Change `KWD` to your currency:
```html
<span class="price-current">{{ formatPrice(product.price) }} USD</span>
```

**Repeat this in all files that display prices:**
- `ProductCard.js`
- `ProductModal.js`
- `CartSidebar.js`
- `cart.html`
- `checkout.html`

### Task 4: Add a New Category

**File**: `assets/js/services/api.js`

In the `getCategories()` method (around line 15-80), add:

```javascript
{
    id: 9,
    name: 'New Category',
    description: 'Description of new category',
    image: 'https://images.unsplash.com/photo-...',
    slug: 'new-category'
}
```

### Task 5: Change Page Layout

**File**: `assets/css/main.css`

Find the section styles (e.g., `.hero-section`):

```css
.hero-section {
    padding: var(--spacing-xl) var(--spacing-md);
    text-align: center;
}
```

Modify as needed:
```css
.hero-section {
    padding: var(--spacing-lg) var(--spacing-md);
    text-align: left;  /* Change alignment */
    background: var(--bg-light);  /* Add background */
}
```

### Task 6: Add Social Media Links

**File**: `assets/js/components/Footer.js`

In the `data()` function, find `socialLinks`:

```javascript
socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/yourpage' },
    { platform: 'twitter', url: 'https://twitter.com/yourpage' },
    // Add more:
    { platform: 'instagram', url: 'https://instagram.com/yourpage' }
]
```

### Task 7: Change Font Sizes

**File**: `assets/css/main.css`

Find font size variables:

```css
:root {
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.25rem;    /* 20px */
    --font-size-xl: 1.5rem;     /* 24px */
    --font-size-2xl: 2rem;      /* 32px */
}
```

Change values as needed.

### Task 8: Add Image to Category

**File**: `assets/js/services/api.js`

In category objects, change the `image` field:

```javascript
{
    id: 1,
    name: 'Electronics',
    image: 'https://your-image-url.com/image.jpg',  // Change this
    // ...
}
```

Or use a local image:
```javascript
image: 'assets/images/electronics.jpg'
```

---

## Troubleshooting

### Problem: Changes Don't Appear

**Solution 1: Hard Refresh**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

**Solution 2: Clear Browser Cache**
- Open browser settings
- Clear browsing data
- Check "Cached images and files"
- Clear data

**Solution 3: Check File Paths**
- Make sure file paths are correct
- Check for typos in file names
- Verify file extensions (.html, .js, .css)

### Problem: Component Not Showing

**Check 1: Component Registration**

**File**: Your app file (e.g., `app.js`)

Make sure component is registered:

```javascript
components: {
    'my-component': MyComponent  // Must match
}
```

**Check 2: Component Script Loaded**

**File**: Your HTML file

Make sure script is loaded before app.js:

```html
<script src="assets/js/components/MyComponent.js"></script>
<script src="assets/js/app.js"></script>
```

**Check 3: Component Name**

In HTML, use kebab-case:
```html
<my-component></my-component>  <!-- Correct -->
<MyComponent></MyComponent>    <!-- Wrong -->
```

### Problem: JavaScript Errors

**Check Browser Console**
1. Press `F12` to open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Read the error message - it tells you what's wrong

**Common Errors:**

**Error: "Header is not defined"**
- Solution: Make sure `Header.js` is loaded before `app.js`

**Error: "Cannot read property of undefined"**
- Solution: Check if data exists before using it
- Use `v-if` to check: `v-if="product && product.name"`

**Error: "Unexpected token"**
- Solution: Check for missing commas, brackets, or quotes
- Use a code editor with syntax highlighting

### Problem: Styles Not Applying

**Check 1: CSS File Loaded**

**File**: Your HTML file

Make sure CSS is loaded:
```html
<link rel="stylesheet" href="assets/css/main.css?v=14">
```

**Check 2: Class Name**

Make sure class name matches:
```html
<div class="my-class">  <!-- HTML -->
```
```css
.my-class {  /* CSS - must match exactly */
    color: red;
}
```

**Check 3: CSS Specificity**

If styles don't apply, make selector more specific:
```css
/* Instead of */
.my-class { color: red; }

/* Use */
.main-content .my-class { color: red; }
```

### Problem: Data Not Updating

**Check 1: Vue Reactivity**

Make sure data is in `data()` function:

```javascript
// Correct
data() {
    return {
        myData: 'value'
    };
}

// Wrong
data: {
    myData: 'value'  // Missing function
}
```

**Check 2: Direct Assignment**

For arrays/objects, use Vue methods:

```javascript
// Wrong
this.items[0] = newValue;

// Correct
this.$set(this.items, 0, newValue);
// Or
this.items = [...this.items];  // Create new array
```

### Problem: Navigation Not Working

**Check handleNavigate Method**

**File**: Your app file

Make sure the page is handled:

```javascript
handleNavigate(page) {
    if (page === 'newpage') {
        window.location.href = 'newpage.html';  // Add this
    }
}
```

---

## Django Backend Integration

### Connecting to Django API

**File**: `assets/js/services/api.js`

**Step 1**: Change API Base URL

Find (around line 5):
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Change to your Django server URL:
```javascript
const API_BASE_URL = 'https://yourdomain.com/api';
```

**Step 2**: Replace Mock Data with Real API Calls

**Example: Get Categories**

Find `getCategories()` method:

```javascript
async getCategories() {
    // Replace this:
    // return mockCategories;
    
    // With this:
    return fetch(`${API_BASE_URL}/categories/`)
        .then(res => res.json())
        .catch(error => {
            console.error('API Error:', error);
            return [];  // Return empty array on error
        });
}
```

**Example: Get Products**

Find `getProducts()` method:

```javascript
async getProducts() {
    return fetch(`${API_BASE_URL}/products/`)
        .then(res => res.json())
        .catch(error => {
            console.error('API Error:', error);
            return [];
        });
}
```

**Example: Search Products**

Find `searchProducts()` method:

```javascript
async searchProducts(query) {
    if (!query || !query.trim()) {
        return [];
    }
    
    return fetch(`${API_BASE_URL}/products/search/?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .catch(error => {
            console.error('API Error:', error);
            return [];
        });
}
```

### Expected API Endpoints

Your Django backend should provide:

- `GET /api/categories/` - Returns list of categories
- `GET /api/products/` - Returns all products
- `GET /api/products/search/?q=query` - Returns search results
- `GET /api/categories/{slug}/products/` - Returns products by category
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/user/profile/` - Get user profile
- `POST /api/orders/` - Create order
- `GET /api/user/orders/` - Get user orders

### Data Structure Examples

**Category Structure:**
```json
{
    "id": 1,
    "name": "Electronics",
    "description": "Latest gadgets and electronics",
    "image": "https://example.com/image.jpg",
    "slug": "electronics"
}
```

**Product Structure:**
```json
{
    "id": 1,
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling headphones",
    "image": "https://example.com/product.jpg",
    "price": 199.99,
    "originalPrice": 249.99,
    "discount": 20,
    "category": "electronics",
    "slug": "wireless-headphones"
}
```

### Handling Authentication

**File**: `assets/js/auth-app.js`

Replace mock authentication with API calls:

```javascript
async handleLoginSubmit() {
    // Replace localStorage check with API call:
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.loginForm.email,
            password: this.loginForm.password
        })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        // Save token
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('shopvue_user', JSON.stringify(data.user));
        
        // Redirect
        window.location.href = 'account.html';
    } else {
        this.loginError = data.message || 'Login failed';
    }
}
```

---

## File Reference Guide

### HTML Files

| File | Purpose | Vue App File |
|------|---------|--------------|
| `index.html` | Homepage | `app.js` |
| `products.html` | Product listing | `products-app.js` |
| `cart.html` | Shopping cart | `cart-app.js` |
| `checkout.html` | Checkout | `checkout-app.js` |
| `auth.html` | Login/Signup | `auth-app.js` |
| `account.html` | User account | `account-app.js` |
| `address-form.html` | Add/Edit address | `address-form-app.js` |
| `search.html` | Search results | `search-app.js` |

### Component Files

| File | Purpose | Used In |
|------|---------|---------|
| `Header.js` | Site header | All pages |
| `Footer.js` | Site footer | All pages |
| `CategoryCard.js` | Category display | Homepage |
| `ProductCard.js` | Product display | Products, Search |
| `ProductModal.js` | Product details | Products, Search |
| `CartSidebar.js` | Cart overlay | Products, Search |
| `AccountSidebar.js` | Account menu | All pages |

### App Files

| File | Purpose | HTML File |
|------|---------|-----------|
| `app.js` | Homepage logic | `index.html` |
| `products-app.js` | Products logic | `products.html` |
| `cart-app.js` | Cart logic | `cart.html` |
| `checkout-app.js` | Checkout logic | `checkout.html` |
| `auth-app.js` | Auth logic | `auth.html` |
| `account-app.js` | Account logic | `account.html` |
| `address-form-app.js` | Address form logic | `address-form.html` |
| `search-app.js` | Search logic | `search.html` |

---

## Quick Reference: Vue Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `{{ }}` | Display data | `{{ product.name }}` |
| `v-if` | Show/hide | `v-if="isLoggedIn"` |
| `v-for` | Loop | `v-for="item in items"` |
| `v-model` | Two-way binding | `v-model="searchQuery"` |
| `@click` | Click event | `@click="handleClick"` |
| `:prop` | Pass data | `:product="item"` |
| `@event` | Listen to event | `@close="closeModal"` |

---

## Tips for HTML Developers

### 1. Start Small

Don't try to understand everything at once. Start by:
- Changing text content
- Changing colors
- Adding simple buttons

### 2. Use Browser Console

Press `F12` to open Developer Tools:
- **Console**: See JavaScript errors and logs
- **Elements**: Inspect HTML and CSS
- **Network**: See API calls

### 3. Comment Your Code

Add comments to remember what code does:

```javascript
// This function loads products from the API
async loadProducts() {
    // Show loading message
    this.loading = true;
    
    // Get products from API
    this.products = await apiService.getProducts();
    
    // Hide loading message
    this.loading = false;
}
```

### 4. Test Frequently

After each change:
1. Save the file
2. Refresh browser
3. Test the feature
4. Check console for errors

### 5. Copy and Modify

When adding new features:
1. Find similar existing code
2. Copy it
3. Modify for your needs
4. Test thoroughly

### 6. Use Existing Patterns

The project follows consistent patterns. When adding features:
- Follow the same structure
- Use the same naming conventions
- Use the same CSS classes
- Use the same component patterns

---

## Need Help?

### Common Questions

**Q: How do I add a new page?**
A: See "How to Create New Pages" section above.

**Q: How do I change a button's color?**
A: See "Changing Colors" in "How to Edit Existing Features" section.

**Q: How do I add a new product field?**
A: See "Task 2: Add a New Product Field" in "Common Tasks" section.

**Q: My changes don't appear. Why?**
A: See "Problem: Changes Don't Appear" in "Troubleshooting" section.

**Q: How do I connect to Django backend?**
A: See "Django Backend Integration" section above.

---

## Summary

This project uses Vue.js 3 via CDN, making it easy to edit without build tools. Key points:

1. **Each HTML page has its own Vue app** in a corresponding `.js` file
2. **Components are reusable** and stored in `components/` folder
3. **Data is stored in `data()` function** and displayed with `{{ }}`
4. **Functions are in `methods` section** and called with `@click` or `@event`
5. **Styles use CSS variables** for easy customization
6. **Always hard refresh** (Ctrl + Shift + R) after changes

Start with small changes and gradually work your way up to bigger modifications. The code is well-commented and follows consistent patterns, making it easy to understand and modify.

Happy coding! 🚀
