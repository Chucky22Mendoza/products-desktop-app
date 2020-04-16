const { remote } = require('electron');
const main = remote.require('./main')

const productForm = document.getElementById('productForm');

const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productsList = document.getElementById('products');

let products = [];
let editingStatus = false;
let editProductId = '';

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }

    if (!editingStatus) {
        await main.createProduct(newProduct);
    } else {
        await main.updateProduct(editProductId, newProduct)
        editingStatus = false;
        editProductId = '';
    }

    productForm.reset();
    productName.focus();

    getProducts();

});

function renderProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        productsList.innerHTML += `
            <div class="card card-body my-2 animated fadeInLeft">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>$ ${product.price}</h3>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                        DELETE
                    </button>
                    <button class="btn btn-dark" onclick="editProduct('${product.id}')">
                        EDIT
                    </button>
                </p>
            </div>
        `
    });
}

const getProducts = async () => {
    products = await main.getProducts();
    renderProducts(products);
}


async function deleteProduct(id) {
    const response = confirm('Are you sure you want to delete it?');

    if (response) {
        await main.deleteProduct(id);
        await getProducts();
    }

    return;
}

async function editProduct(id) {
    const product = await main.getProductById(id);

    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description;

    editingStatus = true;
    editProductId = product.id;
}

async function init() {
    await getProducts();
}

init();