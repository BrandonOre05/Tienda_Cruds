import { Pedido, ItemPedido } from "../models/PedidoModel.js";
import { pedidos } from "../data/PedidoData.js";
import { obtenerProductoPorId } from "./ProductoService.js";
import { obtenerClientePorId } from "./ClienteService.js";

let siguienteId = 1;

export const crearPedido = (
    clienteId: number,
    items: ItemPedido[]
): Pedido | null => {
    try {
        if (!obtenerClientePorId(clienteId)) {
            console.log("Cliente no existe");
            return null;
        }
        
        let total = 0;
        for (const item of items) {
            const producto = obtenerProductoPorId(item.productoId);
            if (!producto) {
                console.log(`Producto ${item.productoId} no existe`);
                return null;
            }
            if (item.cantidad > producto.stock) {
                console.log(`Stock insuficiente para ${producto.nombre}`);
                return null;
            }
            total += producto.precio * item.cantidad;
        }
        
        const pedido: Pedido = {
            id: siguienteId++,
            clienteId,
            items,
            total,
            fecha: new Date(),
            estado: 'pendiente'
        };
        
        for (const item of items) {
            const producto = obtenerProductoPorId(item.productoId);
            if (producto) {
                producto.stock -= item.cantidad;
            }
        }
        
        pedidos.push(pedido);
        return pedido;
    } catch (error) {
        console.log("Error al crear pedido");
        return null;
    }
};

export const obtenerPedidos = (): Pedido[] => {
    try {
        return pedidos;
    } catch (error) {
        console.log("Error al obtener pedidos");
        return [];
    }
};

export const obtenerPedidoPorId = (id: number): Pedido | undefined => {
    try {
        return pedidos.find(p => p.id === id);
    } catch (error) {
        console.log("Error al buscar pedido por ID");
        return undefined;
    }
};

export const obtenerPedidosPorCliente = (clienteId: number): Pedido[] => {
    try {
        return pedidos.filter(p => p.clienteId === clienteId);
    } catch (error) {
        console.log("Error al obtener pedidos por cliente");
        return [];
    }
};

export const actualizarEstadoPedido = (
    id: number,
    estado: 'pendiente' | 'completado' | 'cancelado'
): Pedido | undefined => {
    try {
        const pedido = obtenerPedidoPorId(id);
        if (!pedido) return undefined;
        
        if (estado === 'cancelado' && pedido.estado !== 'cancelado') {
            for (const item of pedido.items) {
                const producto = obtenerProductoPorId(item.productoId);
                if (producto) {
                    producto.stock += item.cantidad;
                }
            }
        }
        
        pedido.estado = estado;
        return pedido;
    } catch (error) {
        console.log("Error al actualizar estado del pedido");
        return undefined;
    }
};

export const eliminarPedido = (id: number): boolean => {
    try {
        const index = pedidos.findIndex(p => p.id === id);
        if (index === -1) return false;
        
        if (pedidos[index].estado === 'pendiente') {
            console.log("No se puede eliminar un pedido pendiente");
            return false;
        }
        
        pedidos.splice(index, 1);
        return true;
    } catch (error) {
        console.log("Error al eliminar pedido");
        return false;
    }
};

export const obtenerEstadisticasPedidos = () => {
    try {
        return {
            total: pedidos.length,
            pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
            completados: pedidos.filter(p => p.estado === 'completado').length,
            cancelados: pedidos.filter(p => p.estado === 'cancelado').length,
            totalVentas: pedidos
                .filter(p => p.estado === 'completado')
                .reduce((sum, p) => sum + p.total, 0)
        };
    } catch (error) {
        console.log("Error al obtener estadisticas");
        return {
            total: 0,
            pendientes: 0,
            completados: 0,
            cancelados: 0,
            totalVentas: 0
        };
    }
};