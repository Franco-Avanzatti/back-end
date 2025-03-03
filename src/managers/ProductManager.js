import fs from 'fs';

/**
 * @deprecated use ProductManagerMongo instead
 */
class ProductManager {
  constructor() {
    this.filePath = './src/data/products.json';
  }

  // Leer todos los productos
  async getAll() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al leer los productos');
    }
  }

  // Obtener un producto por ID
  async getById(id) {
    try {
      const products = await this.getAll();
      return products.find(product => product.id === id);
    } catch (error) {
      throw new Error('Error al obtener el producto');
    }
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    try {
      const products = await this.getAll();
      const newProduct = {
        id: Date.now().toString(), // ID generado automáticamente
        ...productData,
        status: productData.status ?? true,
      };
      products.push(newProduct);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error('Error al agregar el producto');
    }
  }

  // Actualizar un producto
  async updateProduct(id, updatedData) {
    try {
      const products = await this.getAll();
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return null; // Producto no encontrado

      products[index] = { ...products[index], ...updatedData };
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      let products = await this.getAll();
      products = products.filter(product => product.id !== id);
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
}

export default ProductManager;
