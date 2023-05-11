/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */


    
    async agregarProducto(sku, cantidad) {

        console.log(`Agregando ${cantidad} ${sku}`);
        
        // Busco el producto en la "base de datos"
        
        try{
            const producto = await findProductBySku(sku);
            console.log("Producto encontrado", producto);

            //Controlo si ya esta en el carrito el producto
            
            const indexProdExistente = this.productos.findIndex(el => el.sku === producto.sku);
            
            if(indexProdExistente >=0){
                //Si existe le sumo la cantidad al mismo producto y actualizo el precio

                /* No se si es necesario validad el stock, por las dudas lo hice y lo dejo comentado

                
                 if((this.productos[indexProdExistente].cantidad+cantidad)>producto.stock){

                     throw ("La cantidad seleccionada es mayor al stock disponible");
                 } */
                
                
                this.productos[indexProdExistente].cantidad += cantidad;


                this.precioTotal += producto.precio * cantidad;
            }
            else{
                /* No se si es necesario validad el stock, por las dudas lo hice y lo dejo comentado

                if(cantidad>producto.stock){

                    throw ("La cantidad seleccionada es mayor al stock disponible");
                }*/
                
                // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
                this.precioTotal = this.precioTotal + (producto.precio * cantidad);
                
                //Si no existe la categoria la agrego

                if(!this.categorias.includes(producto.categoria)){
    
                    this.categorias.push(producto.categoria);
                }
            }
        }
        catch(error){
            //En caso de no encontrarse el producto muestro el error

            console.error(error);
        }
    }

   

    async eliminarProducto(sku, cantidad){
        
        const producto = await findProductBySku(sku);
        
        return new Promise((resolve, reject) => {

           
                //Valida la cantidad

               if(cantidad<1) reject("La cantidad a eliminar debe ser mayor a 0");

               //Se comprueba que el producto exista en el carrito

                const indexProdCarrito = this.productos.findIndex(el => el.sku === sku);
    
                if(indexProdCarrito>=0){
                    
                    const productoEnCarrito = this.productos[indexProdCarrito];
                    
                    //Si la cantidad a eliminar es menor que la cantidad total del producto en el carrito se resta.
                    //Y se actualiza el precio

                    if(cantidad < productoEnCarrito.cantidad){
    
                       this.productos[indexProdCarrito].cantidad -= cantidad;
                       
                       this.precioTotal -= producto.precio * cantidad;
                       
                        let strUnidad = "unidades";

                        if(cantidad===1) strUnidad = "unidad";

                       resolve(`Se eliminó con éxito ${cantidad} ${strUnidad} del producto '${productoEnCarrito.nombre}' SKU: ${sku} `);
                    }
                    else{

                        //Si la cantidad es mayor o igual, se elimina el producto y se actualiza el precio
                        this.productos.splice(indexProdCarrito,1);
                        this.precioTotal -= producto.precio * productoEnCarrito.cantidad;
                        
                        resolve(`Se ha eliminado con éxito el producto "${productoEnCarrito.nombre}" SKU: ${sku} del carrito. `)                        
                    }
    
                }
                else{
                    //Si el producto no se encuentra en el carrito se retorna un error

                   reject(`No existe un producto con sku "${sku}" en el carrito`);
                }
    
    
           });
                



    }




}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}







async function main(){

    const carrito = new Carrito();
    
    //Realizando pruebas
    await carrito.agregarProducto('WE328NJ', 2);
    
    await carrito.agregarProducto('WE328NJ', 10);
    
    await carrito.agregarProducto('KS944RUR',10);
    
    await carrito.agregarProducto('OL883YE', 10);
    
    console.log(carrito); //En este punto ya se descuenta la cantidad del producto que se va a eliminar en la linea siguiente, creo que es 
                          //porque no se pasa el valor, sino la referencia del array(Porque en el precio total, se descuenta despues de ejecutar el metodo
                          //para eliminar los productos), pero nose como solucionarlo.
                          
    
    await carrito.eliminarProducto('KS944RUR',1)
    .then(res => console.log(res))
    .catch(error => console.error(error));

    console.log(carrito);
}

main();








