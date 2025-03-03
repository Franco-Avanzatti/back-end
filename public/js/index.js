const socket = io();



function fillProductList() {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';  // Vaciamos la lista

    fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        data.docs.forEach(product => {
            // Creamos la etiqueta li para el producto
            const li = document.createElement('li');
            li.id = `product-${product._id}`;
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Creamos el párrafo con el título y el precio del producto
            const p = document.createElement('p');
            p.innerHTML = `${product.title} - ${product.price}`;

            // Creamos el formulario para agregar al carrito
            const form = document.createElement('form');
            form.action = '/api/carts';  // Ruta para agregar al carrito
            form.method = 'POST';  // Método de envío POST
            
            // Creamos el input hidden con el id del producto
            const inputHidden = document.createElement('input');
            inputHidden.type = 'hidden';
            inputHidden.name = 'productId';  // Nombre del parámetro en el backend
            inputHidden.value = product._id;  // Valor con el id del producto
            form.appendChild(inputHidden);

            // Creamos el botón de submit dentro del formulario
            const buttonAddToCart = document.createElement('button');
            buttonAddToCart.innerHTML = 'Agregar al carrito';
            buttonAddToCart.className = 'btn btn-primary';
            form.appendChild(buttonAddToCart);  // Añadimos el botón al formulario

       

            // Creamos el botón de eliminar
            const buttonDelete = document.createElement('button');
            buttonDelete.innerHTML = 'Eliminar';
            buttonDelete.className = 'deleteButton btn btn-danger';
            buttonDelete.dataset.id = product._id;

            // Añadimos los elementos al li
            li.appendChild(p);
            li.appendChild(form);  // Añadimos el formulario con el botón al producto
            li.appendChild(buttonDelete);

            // Añadimos el producto a la lista
            productList.appendChild(li);
        });
    });
}


window.addEventListener('load', function(event) {
    console.log('entro al document.onload');
    fillProductList();
})  


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
    fillProductList(); 
    // if (productElement) {
    //     productElement.remove();  
            
    // }
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