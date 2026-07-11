import { Cliente } from "../models/ClienteModel.js";
import { clientes } from "../data/ClienteData.js";
import { pedidos } from "../data/PedidoData.js";

let siguienteId = 1;

export const crearCliente = (
    nombre: string,
    email: string,
    telefono: string
): Cliente => {
    try {
        const cliente: Cliente = { id: siguienteId++, nombre, email, telefono };
        clientes.push(cliente);
        return cliente;
    } catch (error) {
        console.log("Error al crear cliente");
        throw error;
    }
};

export const obtenerClientes = (): Cliente[] => {
    try {
        return clientes;
    } catch (error) {
        console.log("Error al obtener clientes");
        return [];
    }
};

export const obtenerClientePorId = (id: number): Cliente | undefined => {
    try {
        return clientes.find(c => c.id === id);
    } catch (error) {
        console.log("Error al buscar cliente por ID");
        return undefined;
    }
};

export const actualizarCliente = (
    id: number,
    nombre: string,
    email: string,
    telefono: string
): Cliente | undefined => {
    try {
        const cliente = obtenerClientePorId(id);
        if (!cliente) return undefined;
        
        cliente.nombre = nombre;
        cliente.email = email;
        cliente.telefono = telefono;
        return cliente;
    } catch (error) {
        console.log("Error al actualizar cliente");
        return undefined;
    }
};

export const eliminarCliente = (id: number): boolean => {
    try {
        const index = clientes.findIndex(c => c.id === id);
        if (index === -1) return false;
        
        const tienePedidos = pedidos.some(p => p.clienteId === id);
        if (tienePedidos) {
            console.log("No se puede eliminar: el cliente tiene pedidos");
            return false;
        }
        
        clientes.splice(index, 1);
        return true;
    } catch (error) {
        console.log("Error al eliminar cliente");
        return false;
    }
};