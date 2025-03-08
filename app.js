// Data storage
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let brands = JSON.parse(localStorage.getItem('brands')) || [];
let deliveryGuys = JSON.parse(localStorage.getItem('deliveryGuys')) || [];

// Authentication
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function login(username, password) {
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
}

function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = 'login.html';
}

// Check if user is logged in
if (!isLoggedIn() && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
}

// DOM Elements
const loginLogoutBtn = document.getElementById('loginLogout');
const perfumeForm = document.getElementById('perfumeForm');
const orderForm = document.getElementById('orderForm');
const customerForm = document.getElementById('customerForm');
const brandForm = document.getElementById('brandForm');
const deliveryGuyForm = document.getElementById('deliveryGuyForm');
const loginForm = document.getElementById('loginForm');

// Event Listeners
if (loginLogoutBtn) {
    loginLogoutBtn.addEventListener('click', () => {
        if (isLoggedIn()) {
            logout();
        } else {
            window.location.href = 'login.html';
        }
    });
}

if (perfumeForm) perfumeForm.addEventListener('submit', addPerfume);
if (orderForm) orderForm.addEventListener('submit', addOrder);
if (customerForm) customerForm.addEventListener('submit', addCustomer);
if (brandForm) brandForm.addEventListener('submit', addBrand);
if (deliveryGuyForm) deliveryGuyForm.addEventListener('submit', addDeliveryGuy);

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });
}

// CRUD functions
function addPerfume(e) {
    e.preventDefault();
    const name = document.getElementById('perfumeName').value;
    const price = document.getElementById('perfumePrice').value;
    const brand = document.getElementById('perfumeBrand').value;
    const stock = document.getElementById('perfumeStock').value;
    const note = document.getElementById('perfumeNote').value;
    const sales = document.getElementById('perfumeSales').value;
    perfumes.push({ name, price, brand, stock, note, sales });
    saveData('perfumes', perfumes);
    updatePerfumeTable();
    updateCounters();
    updateCharts();
    perfumeForm.reset();
}

function addOrder(e) {
    e.preventDefault();
    const customer = document.getElementById('orderCustomer').value;
    const perfume = document.getElementById('orderPerfume').value;
    const quantity = document.getElementById('orderQuantity').value;
    const date = new Date().toISOString().split('T')[0]; // Get current date
    const deliveryGuy = document.getElementById('orderDeliveryGuy').value;
    orders.push({ customer, perfume, quantity, date, deliveryGuy });
    saveData('orders', orders);
    updateOrderTable();
    updateCounters();
    updateCharts();
    orderForm.reset();
}

function addCustomer(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    customers.push({ name, email });
    saveData('customers', customers);
    updateCustomerTable();
    updateCounters();
    updateCharts();
    customerForm.reset();
}

function addBrand(e) {
    e.preventDefault();
    const name = document.getElementById('brandName').value;
    brands.push({ name });
    saveData('brands', brands);
    updateBrandTable();
    updateCounters();
    brandForm.reset();
}

function addDeliveryGuy(e) {
    e.preventDefault();
    const name = document.getElementById('deliveryGuyName').value;
    const rating = document.getElementById('deliveryGuyRating').value;
    deliveryGuys.push({ name, rating });
    saveData('deliveryGuys', deliveryGuys);
    updateDeliveryGuyTable();
    updateCounters();
    deliveryGuyForm.reset();
}

// Update UI functions
function updatePerfumeTable() {
    const tbody = document.querySelector('#perfumeTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    perfumes.forEach((perfume, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${perfume.name}</td>
            <td>${perfume.price}</td>
            <td>${perfume.brand}</td>
            <td>${perfume.stock}</td>
            <td>${perfume.note}</td>
            <td>${perfume.sales}</td>
            <td>
                <button class="edit-btn" onclick="editPerfume(${index})">Edit</button>
                <button class="delete-btn" onclick="deletePerfume(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateOrderTable() {
    const tbody = document.querySelector('#orderTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.customer}</td>
            <td>${order.perfume}</td>
            <td>${order.quantity}</td>
            <td>${order.date}</td>
            <td>${order.deliveryGuy}</td>
            <td>
                <button class="edit-btn" onclick="editOrder(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteOrder(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Populate the delivery guy dropdown
    const deliveryGuySelect = document.getElementById('orderDeliveryGuy');
    if (deliveryGuySelect) {
        deliveryGuySelect.innerHTML = '<option value="">Select Delivery Guy</option>';
        deliveryGuys.forEach(dg => {
            const option = document.createElement('option');
            option.value = dg.name;
            option.textContent = dg.name;
            deliveryGuySelect.appendChild(option);
        });
    }
}

function updateCustomerTable() {
    const tbody = document.querySelector('#customerTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    customers.forEach((customer, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>
                <button class="edit-btn" onclick="editCustomer(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteCustomer(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateBrandTable() {
    const tbody = document.querySelector('#brandTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    brands.forEach((brand, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${brand.name}</td>
            <td>
                <button class="edit-btn" onclick="editBrand(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteBrand(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateDeliveryGuyTable() {
    const tbody = document.querySelector('#deliveryGuyTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    deliveryGuys.forEach((deliveryGuy, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${deliveryGuy.name}</td>
            <td>${deliveryGuy.rating}</td>
            <td>
                <button class="edit-btn" onclick="editDeliveryGuy(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteDeliveryGuy(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit and Delete functions
function editPerfume(index) {
    const perfume = perfumes[index];
    document.getElementById('perfumeName').value = perfume.name;
    document.getElementById('perfumePrice').value = perfume.price;
    document.getElementById('perfumeBrand').value = perfume.brand;
    document.getElementById('perfumeStock').value = perfume.stock;
    document.getElementById('perfumeNote').value = perfume.note;
    document.getElementById('perfumeSales').value = perfume.sales;
    perfumes.splice(index, 1);
    updatePerfumeTable();
    updateCounters();
    updateCharts();
}

function deletePerfume(index) {
    perfumes.splice(index, 1);
    saveData('perfumes', perfumes);
    updatePerfumeTable();
    updateCounters();
    updateCharts();
}

function editOrder(index) {
    const order = orders[index];
    document.getElementById('orderCustomer').value = order.customer;
    document.getElementById('orderPerfume').value = order.perfume;
    document.getElementById('orderQuantity').value = order.quantity;
    document.getElementById('orderDeliveryGuy').value = order.deliveryGuy;
    orders.splice(index, 1);
    updateOrderTable();
    updateCounters();
    updateCharts();
}

function deleteOrder(index) {
    orders.splice(index, 1);
    saveData('orders', orders);
    updateOrderTable();
    updateCounters();
    updateCharts();
}

function editCustomer(index) {
    const customer = customers[index];
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    customers.splice(index, 1);
    updateCustomerTable();
    updateCounters();
    updateCharts();
}

function deleteCustomer(index) {
    customers.splice(index, 1);
    saveData('customers', customers);
    updateCustomerTable();
    updateCounters();
    updateCharts();
}

function editBrand(index) {
    const brand = brands[index];
    document.getElementById('brandName').value = brand.name;
    brands.splice(index, 1);
    updateBrandTable();
    updateCounters();
}

function deleteBrand(index) {
    brands.splice(index, 1);
    saveData('brands', brands);
    updateBrandTable();
    updateCounters();
}

function editDeliveryGuy(index) {
    const deliveryGuy = deliveryGuys[index];
    document.getElementById('deliveryGuyName').value = deliveryGuy.name;
    document.getElementById('deliveryGuyRating').value = deliveryGuy.rating;
    deliveryGuys.splice(index, 1);
    updateDeliveryGuyTable();
    updateCounters();
}

function deleteDeliveryGuy(index) {
    deliveryGuys.splice(index, 1);
    saveData('deliveryGuys', deliveryGuys);
    updateDeliveryGuyTable();
    updateCounters();
}

// Helper functions
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function updateUI() {
    updatePerfumeTable();
    updateOrderTable();
    updateCustomerTable();
    updateBrandTable();
    updateDeliveryGuyTable();
    updateCounters();
    updateCharts();
    updateLoginLogoutBtn();
}

function updateCounters() {
    document.querySelector('#perfumeCounter p').textContent = perfumes.length;
    document.querySelector('#orderCounter p').textContent = orders.length;
    document.querySelector('#customerCounter p').textContent = customers.length;
    document.querySelector('#brandCounter p').textContent = brands.length;
    document.querySelector('#deliveryGuyCounter p').textContent = deliveryGuys.length;
}

// Chart functions
function updateCharts() {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        updateSalesByPerfumeChart();
        updatePerfumePopularityChart();
        updateCustomerLoyaltyChart();
        updatePerfumeNotesChart();
        updateDeliveryGuyChart();
    }
}

function updateSalesByPerfumeChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    const labels = perfumes.map(perfume => perfume.name);
    const data = perfumes.map(perfume => parseInt(perfume.sales));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales by Perfume',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Sales'
                    }
                }
            }
        }
    });
}

function updatePerfumePopularityChart() {
    const ctx = document.getElementById('ordersChart').getContext('2d');

    // Count orders per perfume
    const ordersByPerfume = orders.reduce((acc, order) => {
        acc[order.perfume] = (acc[order.perfume] || 0) + parseInt(order.quantity);
        return acc;
    }, {});

    const labels = Object.keys(ordersByPerfume);
    const data = Object.values(ordersByPerfume);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Perfume Popularity',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Perfume Popularity (Units Sold)'
                }
            }
        }
    });
}

function updateCustomerLoyaltyChart() {
    const ctx = document.getElementById('customersChart').getContext('2d');

    // Count orders per customer
    const ordersByCustomer = orders.reduce((acc, order) => {
        acc[order.customer] = (acc[order.customer] || 0) + 1;
        return acc;
    }, {});

    // Categorize customers based on number of orders
    const customerCategories = {
        'New (1 order)': 0,
        'Returning (2-3 orders)': 0,
        'Loyal (4+ orders)': 0
    };

    Object.values(ordersByCustomer).forEach(orderCount => {
        if (orderCount === 1) {
            customerCategories['New (1 order)']++;
        } else if (orderCount >= 2 && orderCount <= 3) {
            customerCategories['Returning (2-3 orders)']++;
        } else {
            customerCategories['Loyal (4+ orders)']++;
        }
    });

    const labels = Object.keys(customerCategories);
    const data = Object.values(customerCategories);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Customer Loyalty',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Customer Loyalty Distribution'
                }
            }
        }
    });
}

function updatePerfumeNotesChart() {
    const ctx = document.getElementById('brandChart').getContext('2d');
    
    // Count perfumes by notes
    const perfumesByNote = perfumes.reduce((acc, perfume) => {
        acc[perfume.note] = (acc[perfume.note] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(perfumesByNote);
    const data = Object.values(perfumesByNote);

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Perfumes by Note',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Perfume Notes Distribution'
                }
            }
        }
    });
}

function updateDeliveryGuyChart() {
    const ctx = document.getElementById('deliveryGuyChart').getContext('2d');

    // Calculate average rating and total deliveries for each delivery guy
    const deliveryGuyPerformance = deliveryGuys.map(dg => {
        const totalDeliveries = orders.filter(order => order.deliveryGuy === dg.name).length;
        return {
            name: dg.name,
            rating: parseFloat(dg.rating),
            deliveries: totalDeliveries
        };
    });

    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Delivery Guy Performance',
                data: deliveryGuyPerformance.map(dg => ({
                    x: dg.deliveries,
                    y: dg.rating,
                    r: dg.deliveries * 2 + 5 // Adjust bubble size based on deliveries
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Total Deliveries'
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Rating'
                    },
                    min: 0,
                    max: 5
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const dg = deliveryGuyPerformance[context.dataIndex];
                            return `${dg.name}: ${dg.deliveries} deliveries, ${dg.rating.toFixed(1)} rating`;
                        }
                    }
                }
            }
        }
    });
}

function updateLoginLogoutBtn() {
    if (loginLogoutBtn) {
        loginLogoutBtn.textContent = isLoggedIn() ? 'Logout' : 'Login';
    }
}

// Initialize the UI
updateUI();


