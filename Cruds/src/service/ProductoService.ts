import { Producto } from "../models/ProductoModel.js";
import { productos } from "../data/ProductoData.js";
import { pedidos } from "../data/PedidoData.js";

let siguienteId = 1;

export const crearProducto = (
    nombre: string,
    precio: number,
    stock: number
): Producto => {
    try {
        const producto: Producto = { id: siguienteId++, nombre, precio, stock };
        productos.push(producto);
        return producto;
    } catch (error) {
        console.log("Error al crear producto");
        throw error;
    }
};

export const obtenerProductos = (): Producto[] => {
    try {
        return productos;
    } catch (error) {
        console.log("Error al obtener productos");
        return [];
    }
};

export const obtenerProductoPorId = (id: number): Producto | undefined => {
    try {
        return productos.find(p => p.id === id);
    } catch (error) {
        console.log("Error al buscar producto por ID");
        return undefined;
    }
};

export const actualizarProducto = (
    id: number,
    nombre: string,
    precio: number,
    stock: number
): Producto | undefined => {
    try {
        const producto = obtenerProductoPorId(id);
        if (!producto) return undefined;
        
        producto.nombre = nombre;
        producto.precio = precio;
        producto.stock = stock;
        return producto;
    } catch (error) {
        console.log("Error al actualizar producto");
        return undefined;
    }
};

export const eliminarProducto = (id: number): boolean => {
    try {
        const index = productos.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        const enPedido = pedidos.some(p => p.items.some(i => i.productoId === id));
        if (enPedido) {
            console.log("No se puede eliminar: el producto esta en un pedido");
            return false;
        }
        
        productos.splice(index, 1);
        return true;
    } catch (error) {
        console.log("Error al eliminar producto");
        return false;
    }
};

export const buscarProductos = (termino: string): Producto[] => {
    try {
        if (!termino) return [];
        return productos.filter(p => 
            p.nombre.toLowerCase().includes(termino.toLowerCase())
        );
    } catch (error) {
        console.log("Error al buscar productos");
        return [];
    }
};