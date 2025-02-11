const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event)=> {
    event.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key)=> {
        productData[key]= value;
    });


    // enviamos los datos del producto al servidor
    socket.emit("newProduct",  productData);
});

socket.on("productAdded", (newProduct)=> {
    const productList = document.getElementById("productList");
    productList.innerHTML += `<li>${newProduct.title} - ${newProduct.price}</li>`

});


    document.getElementById('productList').addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const productId = event.target.getAttribute('data-id');
        socket.emit('deleteProduct', productId);  
    }
});


socket.on('productDeleted', (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();  
    }
});


// Actualizar la lista de productos en todos los clientes cuando se reciba el evento
socket.on('productListUpdated', (updatedProducts) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';  // Limpiar la lista existente
    
    updatedProducts.forEach((product) => {
      // Agregar los productos actualizados
      productList.innerHTML += `
        <li id="product-${product.id}">
          ${product.title} - ${product.price}
          <button class="deleteButton" data-id="${product.id}">Eliminar</button>
        </li>`;
    });
  });