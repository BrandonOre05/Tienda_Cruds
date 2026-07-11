import PromptSync from "prompt-sync";

import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    buscarProductos
} from "./service/ProductoService.js";

import {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente
} from "./service/ClienteService.js";

import {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoPorId,
    obtenerPedidosPorCliente,
    actualizarEstadoPedido,
    eliminarPedido,
    obtenerEstadisticasPedidos
} from "./service/PedidoService.js";

const prompt = PromptSync();

// ============ FUNCIONES DE AYUDA ============

const leerNumero = (mensaje: string): number => {
    try {
        const valor = prompt(mensaje);
        const numero = Number(valor);
        if (isNaN(numero)) {
            console.log("Error: Debe ingresar un numero valido");
            return 0;
        }
        return numero;
    } catch {
        console.log("Error al leer el numero");
        return 0;
    }
};

const leerTexto = (mensaje: string): string => {
    try {
        return prompt(mensaje) || "";
    } catch {
        console.log("Error al leer el texto");
        return "";
    }
};

const mostrarTitulo = (titulo: string): void => {
    try {
        console.clear();
        console.log("=".repeat(55));
        console.log(`  ${titulo}`);
        console.log("=".repeat(55));
        console.log();
    } catch {
        console.log("Error al mostrar el titulo");
    }
};

const pausa = (): void => {
    try {
        prompt("Presiona Enter para continuar...");
    } catch {
        console.log("Error en la pausa");
    }
};

const mostrarError = (mensaje: string): void => {
    console.log(`\n[ERROR] ${mensaje}`);
};

const mostrarExito = (mensaje: string): void => {
    console.log(`\n[OK] ${mensaje}`);
};

// ============ MENU PRINCIPAL ============

const mostrarMenuPrincipal = (): void => {
    mostrarTitulo("SISTEMA DE GESTION DE TIENDA");
    console.log(" 1. Cliente");
    console.log(" 2. Administrador");
    console.log(" 3. Inventario");
    console.log(" 0. Salir");
    console.log("\n" + "-".repeat(55));
};

// ============ MENU CLIENTE ============

const mostrarMenuCliente = (): void => {
    mostrarTitulo("MENU CLIENTE");
    console.log(" 1. Listar Productos");
    console.log(" 2. Buscar Producto por ID");
    console.log(" 3. Buscar Productos por Nombre");
    console.log(" 4. Hacer Pedido");
    console.log(" 5. Ver mis Pedidos");
    console.log(" 0. Volver");
    console.log("\n" + "-".repeat(55));
};

// ============ MENU ADMINISTRADOR ============

const mostrarSubMenuProductos = (): void => {
    mostrarTitulo("ADMINISTRADOR - GESTION DE PRODUCTOS");
    console.log(" 1. Crear Producto");
    console.log(" 2. Listar Productos");
    console.log(" 3. Buscar Producto por ID");
    console.log(" 4. Buscar Productos por Nombre");
    console.log(" 5. Editar Producto");
    console.log(" 6. Eliminar Producto");
    console.log(" 0. Volver al menu principal");
    console.log("\n" + "-".repeat(55));
};

const mostrarSubMenuClientes = (): void => {
    mostrarTitulo("ADMINISTRADOR - GESTION DE CLIENTES");
    console.log(" 1. Crear Cliente");
    console.log(" 2. Listar Clientes");
    console.log(" 3. Buscar Cliente por ID");
    console.log(" 4. Editar Cliente");
    console.log(" 5. Eliminar Cliente");
    console.log(" 0. Volver al menu principal");
    console.log("\n" + "-".repeat(55));
};

const mostrarSubMenuPedidos = (): void => {
    mostrarTitulo("ADMINISTRADOR - GESTION DE PEDIDOS");
    console.log(" 1. Crear Pedido");
    console.log(" 2. Listar Pedidos");
    console.log(" 3. Buscar Pedido por ID");
    console.log(" 4. Ver Pedidos por Cliente");
    console.log(" 5. Cambiar Estado de Pedido");
    console.log(" 6. Eliminar Pedido");
    console.log(" 0. Volver al menu principal");
    console.log("\n" + "-".repeat(55));
};

const mostrarMenuAdmin = (): void => {
    mostrarTitulo("MENU ADMINISTRADOR");
    console.log(" 1. Gestion de Productos");
    console.log(" 2. Gestion de Clientes");
    console.log(" 3. Gestion de Pedidos");
    console.log(" 0. Volver");
    console.log("\n" + "-".repeat(55));
};

// ============ FUNCIONES CLIENTE ============

const clienteListarProductos = (): void => {
    try {
        const productos = obtenerProductos();
        if (productos.length === 0) {
            mostrarError("No hay productos disponibles.");
            pausa();
            return;
        }
        console.log("\nPRODUCTOS DISPONIBLES");
        console.table(productos);
        pausa();
    } catch {
        mostrarError("Error al listar productos");
        pausa();
    }
};

const clienteBuscarProductoPorId = (): void => {
    try {
        const id = leerNumero("Ingrese el ID del producto: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const producto = obtenerProductoPorId(id);
        if (!producto) {
            mostrarError("Producto no encontrado.");
            pausa();
            return;
        }
        console.log("\nPRODUCTO ENCONTRADO");
        console.table(producto);
        pausa();
    } catch {
        mostrarError("Error al buscar producto");
        pausa();
    }
};

const clienteBuscarProductosPorNombre = (): void => {
    try {
        const termino = leerTexto("Ingrese el nombre a buscar: ");
        if (!termino) {
            mostrarError("Termino de busqueda vacio");
            pausa();
            return;
        }
        const resultados = buscarProductos(termino);
        if (resultados.length === 0) {
            mostrarError("No se encontraron productos.");
            pausa();
            return;
        }
        console.log(`\nResultados (${resultados.length}):`);
        console.table(resultados);
        pausa();
    } catch {
        mostrarError("Error al buscar productos");
        pausa();
    }
};

const clienteHacerPedido = (): void => {
    try {
        mostrarTitulo("HACER PEDIDO");
        
        const productos = obtenerProductos();
        
        if (productos.length === 0) {
            mostrarError("No hay productos disponibles.");
            pausa();
            return;
        }
        
        const clienteId = leerNumero("Ingrese su ID de cliente: ");
        if (clienteId <= 0) {
            mostrarError("ID de cliente invalido");
            pausa();
            return;
        }
        
        if (!obtenerClientePorId(clienteId)) {
            mostrarError("Cliente no existe. Contacte al administrador.");
            pausa();
            return;
        }
        
        const items: { productoId: number; cantidad: number }[] = [];
        let agregarMas = true;
        
        while (agregarMas) {
            try {
                console.log("\nPRODUCTOS DISPONIBLES:");
                console.log("-".repeat(40));
                productos.forEach(p => console.log(`  ${p.id}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})`));
                console.log("-".repeat(40));
                
                const productoId = leerNumero("ID del producto (0 para terminar): ");
                if (productoId === 0) break;
                
                if (productoId <= 0) {
                    mostrarError("ID de producto invalido");
                    continue;
                }
                
                const producto = obtenerProductoPorId(productoId);
                if (!producto) {
                    mostrarError("Producto no existe.");
                    continue;
                }
                
                const cantidad = leerNumero(`Cantidad (max ${producto.stock}): `);
                if (cantidad <= 0 || cantidad > producto.stock) {
                    mostrarError("Cantidad invalida.");
                    continue;
                }
                
                items.push({ productoId, cantidad });
                mostrarExito(`${producto.nombre} x${cantidad} agregado al pedido`);
                
                const continuar = leerTexto("Agregar otro producto? (s/n): ");
                agregarMas = continuar.toLowerCase() === 's';
            } catch {
                mostrarError("Error al agregar producto al pedido");
                agregarMas = false;
            }
        }
        
        if (items.length === 0) {
            mostrarError("No se agregaron productos.");
            pausa();
            return;
        }
        
        const pedido = crearPedido(clienteId, items);
        if (pedido) {
            console.log("\n" + "=".repeat(55));
            console.log("  PEDIDO CREADO EXITOSAMENTE");
            console.log("=".repeat(55));
            console.log(`  Numero de pedido: #${pedido.id}`);
            console.log(`  Total: $${pedido.total.toFixed(2)}`);
            console.log(`  Estado: ${pedido.estado.toUpperCase()}`);
            console.log("\n  DETALLE DEL PEDIDO:");
            console.log("-".repeat(40));
            pedido.items.forEach(item => {
                const producto = obtenerProductoPorId(item.productoId);
                console.log(`    - ${producto?.nombre || 'Desconocido'} x${item.cantidad}`);
            });
            console.log("-".repeat(40));
        }
        pausa();
    } catch {
        mostrarError("Error al hacer el pedido");
        pausa();
    }
};

const clienteVerPedidos = (): void => {
    try {
        const clienteId = leerNumero("Ingrese su ID de cliente: ");
        if (clienteId <= 0) {
            mostrarError("ID de cliente invalido");
            pausa();
            return;
        }
        const pedidos = obtenerPedidosPorCliente(clienteId);
        if (pedidos.length === 0) {
            mostrarError("No tienes pedidos.");
            pausa();
            return;
        }
        console.log(`\nMIS PEDIDOS`);
        console.log("=".repeat(55));
        pedidos.forEach(pedido => {
            const estado = pedido.estado === 'completado' ? '[COMPLETADO]' :
                          pedido.estado === 'cancelado' ? '[CANCELADO]' : '[PENDIENTE]';
            console.log(`\n${estado} Pedido #${pedido.id}`);
            console.log(`  Fecha: ${pedido.fecha.toLocaleDateString()}`);
            console.log(`  Total: $${pedido.total.toFixed(2)}`);
            console.log(`  Productos:`);
            pedido.items.forEach(item => {
                const producto = obtenerProductoPorId(item.productoId);
                console.log(`    - ${producto?.nombre || 'Desconocido'} x${item.cantidad}`);
            });
            console.log("-".repeat(40));
        });
        pausa();
    } catch {
        mostrarError("Error al ver pedidos");
        pausa();
    }
};

// ============ FUNCIONES ADMIN - PRODUCTOS ============

const adminCrearProducto = (): void => {
    try {
        mostrarTitulo("CREAR PRODUCTO");
        const nombre = leerTexto("Nombre: ");
        if (!nombre) {
            mostrarError("El nombre es requerido");
            pausa();
            return;
        }
        const precio = leerNumero("Precio: ");
        if (precio <= 0) {
            mostrarError("El precio debe ser mayor a 0");
            pausa();
            return;
        }
        const stock = leerNumero("Stock: ");
        if (stock < 0) {
            mostrarError("El stock no puede ser negativo");
            pausa();
            return;
        }
        
        const producto = crearProducto(nombre, precio, stock);
        mostrarExito("PRODUCTO CREADO");
        console.table(producto);
        pausa();
    } catch {
        mostrarError("Error al crear producto");
        pausa();
    }
};

const adminListarProductos = (): void => {
    try {
        const productos = obtenerProductos();
        if (productos.length === 0) {
            mostrarError("No hay productos.");
            pausa();
            return;
        }
        console.log("\nLISTA DE PRODUCTOS");
        console.table(productos);
        pausa();
    } catch {
        mostrarError("Error al listar productos");
        pausa();
    }
};

const adminBuscarProductoPorId = (): void => {
    try {
        const id = leerNumero("Ingrese el ID: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const producto = obtenerProductoPorId(id);
        if (!producto) {
            mostrarError("Producto no encontrado.");
            pausa();
            return;
        }
        console.log("\nPRODUCTO ENCONTRADO");
        console.table(producto);
        pausa();
    } catch {
        mostrarError("Error al buscar producto");
        pausa();
    }
};

const adminBuscarProductosPorNombre = (): void => {
    try {
        const termino = leerTexto("Ingrese el nombre a buscar: ");
        if (!termino) {
            mostrarError("Termino de busqueda vacio");
            pausa();
            return;
        }
        const resultados = buscarProductos(termino);
        if (resultados.length === 0) {
            mostrarError("No se encontraron productos.");
            pausa();
            return;
        }
        console.log(`\nResultados (${resultados.length}):`);
        console.table(resultados);
        pausa();
    } catch {
        mostrarError("Error al buscar productos");
        pausa();
    }
};

const adminEditarProducto = (): void => {
    try {
        const id = leerNumero("Ingrese el ID a editar: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const producto = obtenerProductoPorId(id);
        if (!producto) {
            mostrarError("Producto no encontrado.");
            pausa();
            return;
        }
        
        console.log(`\nEditando: ${producto.nombre}`);
        const nombre = leerTexto(`Nuevo nombre (${producto.nombre}): `) || producto.nombre;
        const precio = leerNumero(`Nuevo precio (${producto.precio}): `) || producto.precio;
        const stock = leerNumero(`Nuevo stock (${producto.stock}): `) || producto.stock;
        
        if (precio <= 0) {
            mostrarError("El precio debe ser mayor a 0");
            pausa();
            return;
        }
        if (stock < 0) {
            mostrarError("El stock no puede ser negativo");
            pausa();
            return;
        }
        
        const actualizado = actualizarProducto(id, nombre, precio, stock);
        mostrarExito("PRODUCTO ACTUALIZADO");
        console.table(actualizado);
        pausa();
    } catch {
        mostrarError("Error al editar producto");
        pausa();
    }
};

const adminEliminarProducto = (): void => {
    try {
        const id = leerNumero("Ingrese el ID a eliminar: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        if (eliminarProducto(id)) {
            mostrarExito("Producto eliminado.");
        } else {
            mostrarError("Producto no encontrado o esta en un pedido.");
        }
        pausa();
    } catch {
        mostrarError("Error al eliminar producto");
        pausa();
    }
};

// ============ FUNCIONES ADMIN - CLIENTES ============

const adminCrearCliente = (): void => {
    try {
        mostrarTitulo("CREAR CLIENTE");
        const nombre = leerTexto("Nombre: ");
        if (!nombre) {
            mostrarError("El nombre es requerido");
            pausa();
            return;
        }
        const email = leerTexto("Email: ");
        if (!email || !email.includes('@')) {
            mostrarError("Email invalido");
            pausa();
            return;
        }
        const telefono = leerTexto("Telefono: ");
        if (!telefono) {
            mostrarError("El telefono es requerido");
            pausa();
            return;
        }
        
        const cliente = crearCliente(nombre, email, telefono);
        mostrarExito("CLIENTE CREADO");
        console.table(cliente);
        pausa();
    } catch {
        mostrarError("Error al crear cliente");
        pausa();
    }
};

const adminListarClientes = (): void => {
    try {
        const clientes = obtenerClientes();
        if (clientes.length === 0) {
            mostrarError("No hay clientes.");
            pausa();
            return;
        }
        console.log("\nLISTA DE CLIENTES");
        console.table(clientes);
        pausa();
    } catch {
        mostrarError("Error al listar clientes");
        pausa();
    }
};

const adminBuscarClientePorId = (): void => {
    try {
        const id = leerNumero("Ingrese el ID: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const cliente = obtenerClientePorId(id);
        if (!cliente) {
            mostrarError("Cliente no encontrado.");
            pausa();
            return;
        }
        console.log("\nCLIENTE ENCONTRADO");
        console.table(cliente);
        pausa();
    } catch {
        mostrarError("Error al buscar cliente");
        pausa();
    }
};

const adminEditarCliente = (): void => {
    try {
        const id = leerNumero("Ingrese el ID a editar: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const cliente = obtenerClientePorId(id);
        if (!cliente) {
            mostrarError("Cliente no encontrado.");
            pausa();
            return;
        }
        
        console.log(`\nEditando: ${cliente.nombre}`);
        const nombre = leerTexto(`Nuevo nombre (${cliente.nombre}): `) || cliente.nombre;
        const email = leerTexto(`Nuevo email (${cliente.email}): `) || cliente.email;
        if (email && !email.includes('@')) {
            mostrarError("Email invalido");
            pausa();
            return;
        }
        const telefono = leerTexto(`Nuevo telefono (${cliente.telefono}): `) || cliente.telefono;
        
        const actualizado = actualizarCliente(id, nombre, email, telefono);
        mostrarExito("CLIENTE ACTUALIZADO");
        console.table(actualizado);
        pausa();
    } catch {
        mostrarError("Error al editar cliente");
        pausa();
    }
};

const adminEliminarCliente = (): void => {
    try {
        const id = leerNumero("Ingrese el ID a eliminar: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        if (eliminarCliente(id)) {
            mostrarExito("Cliente eliminado.");
        } else {
            mostrarError("Cliente no encontrado o tiene pedidos.");
        }
        pausa();
    } catch {
        mostrarError("Error al eliminar cliente");
        pausa();
    }
};

// ============ FUNCIONES ADMIN - PEDIDOS ============

const adminCrearPedido = (): void => {
    try {
        mostrarTitulo("CREAR PEDIDO");
        
        const clientes = obtenerClientes();
        const productos = obtenerProductos();
        
        if (clientes.length === 0) {
            mostrarError("No hay clientes. Cree uno primero.");
            pausa();
            return;
        }
        if (productos.length === 0) {
            mostrarError("No hay productos. Cree uno primero.");
            pausa();
            return;
        }
        
        console.log("\nCLIENTES:");
        console.log("-".repeat(40));
        clientes.forEach(c => console.log(`  ${c.id}. ${c.nombre}`));
        console.log("-".repeat(40));
        
        const clienteId = leerNumero("ID del cliente: ");
        if (clienteId <= 0) {
            mostrarError("ID de cliente invalido");
            pausa();
            return;
        }
        if (!obtenerClientePorId(clienteId)) {
            mostrarError("Cliente no existe.");
            pausa();
            return;
        }
        
        const items: { productoId: number; cantidad: number }[] = [];
        let agregarMas = true;
        
        while (agregarMas) {
            try {
                console.log("\nPRODUCTOS:");
                console.log("-".repeat(40));
                productos.forEach(p => console.log(`  ${p.id}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})`));
                console.log("-".repeat(40));
                
                const productoId = leerNumero("ID del producto (0 para terminar): ");
                if (productoId === 0) break;
                
                if (productoId <= 0) {
                    mostrarError("ID de producto invalido");
                    continue;
                }
                
                const producto = obtenerProductoPorId(productoId);
                if (!producto) {
                    mostrarError("Producto no existe.");
                    continue;
                }
                
                const cantidad = leerNumero(`Cantidad (max ${producto.stock}): `);
                if (cantidad <= 0 || cantidad > producto.stock) {
                    mostrarError("Cantidad invalida.");
                    continue;
                }
                
                items.push({ productoId, cantidad });
                mostrarExito(`${producto.nombre} x${cantidad} agregado`);
                
                const continuar = leerTexto("Agregar otro? (s/n): ");
                agregarMas = continuar.toLowerCase() === 's';
            } catch {
                mostrarError("Error al agregar producto");
                agregarMas = false;
            }
        }
        
        if (items.length === 0) {
            mostrarError("No se agregaron productos.");
            pausa();
            return;
        }
        
        const pedido = crearPedido(clienteId, items);
        if (pedido) {
            console.log("\n" + "=".repeat(55));
            console.log("  PEDIDO CREADO");
            console.log("=".repeat(55));
            console.log(`  ID: ${pedido.id}`);
            console.log(`  Total: $${pedido.total.toFixed(2)}`);
            console.log(`  Estado: ${pedido.estado.toUpperCase()}`);
        }
        pausa();
    } catch {
        mostrarError("Error al crear pedido");
        pausa();
    }
};

const adminListarPedidos = (): void => {
    try {
        const pedidos = obtenerPedidos();
        if (pedidos.length === 0) {
            mostrarError("No hay pedidos.");
            pausa();
            return;
        }
        console.log("\nLISTA DE PEDIDOS");
        console.log("=".repeat(55));
        pedidos.forEach(pedido => {
            const estado = pedido.estado === 'completado' ? '[COMPLETADO]' :
                          pedido.estado === 'cancelado' ? '[CANCELADO]' : '[PENDIENTE]';
            const cliente = obtenerClientePorId(pedido.clienteId);
            console.log(`\n${estado} Pedido #${pedido.id}`);
            console.log(`  Cliente: ${cliente?.nombre || 'Desconocido'}`);
            console.log(`  Fecha: ${pedido.fecha.toLocaleDateString()}`);
            console.log(`  Total: $${pedido.total.toFixed(2)}`);
            console.log("-".repeat(40));
        });
        pausa();
    } catch {
        mostrarError("Error al listar pedidos");
        pausa();
    }
};

const adminBuscarPedidoPorId = (): void => {
    try {
        const id = leerNumero("Ingrese el ID: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const pedido = obtenerPedidoPorId(id);
        if (!pedido) {
            mostrarError("Pedido no encontrado.");
            pausa();
            return;
        }
        const cliente = obtenerClientePorId(pedido.clienteId);
        console.log("\nPEDIDO ENCONTRADO");
        console.log("=".repeat(55));
        console.log(`  ID: ${pedido.id}`);
        console.log(`  Cliente: ${cliente?.nombre || 'Desconocido'}`);
        console.log(`  Fecha: ${pedido.fecha.toLocaleDateString()}`);
        console.log(`  Estado: ${pedido.estado.toUpperCase()}`);
        console.log(`  Total: $${pedido.total.toFixed(2)}`);
        console.log("\n  PRODUCTOS:");
        console.log("-".repeat(40));
        pedido.items.forEach(item => {
            const producto = obtenerProductoPorId(item.productoId);
            console.log(`    - ${producto?.nombre || 'Desconocido'} x${item.cantidad}`);
        });
        console.log("-".repeat(40));
        pausa();
    } catch {
        mostrarError("Error al buscar pedido");
        pausa();
    }
};

const adminVerPedidosPorCliente = (): void => {
    try {
        const clienteId = leerNumero("Ingrese el ID del cliente: ");
        if (clienteId <= 0) {
            mostrarError("ID de cliente invalido");
            pausa();
            return;
        }
        const pedidos = obtenerPedidosPorCliente(clienteId);
        if (pedidos.length === 0) {
            mostrarError(`Cliente #${clienteId} no tiene pedidos.`);
            pausa();
            return;
        }
        const cliente = obtenerClientePorId(clienteId);
        console.log(`\nPEDIDOS DE ${cliente?.nombre || 'Cliente'}`);
        console.log("=".repeat(55));
        pedidos.forEach(pedido => {
            const estado = pedido.estado === 'completado' ? '[COMPLETADO]' :
                          pedido.estado === 'cancelado' ? '[CANCELADO]' : '[PENDIENTE]';
            console.log(`\n${estado} Pedido #${pedido.id}`);
            console.log(`  Fecha: ${pedido.fecha.toLocaleDateString()}`);
            console.log(`  Total: $${pedido.total.toFixed(2)}`);
            console.log("-".repeat(40));
        });
        pausa();
    } catch {
        mostrarError("Error al ver pedidos por cliente");
        pausa();
    }
};

const adminCambiarEstadoPedido = (): void => {
    try {
        const id = leerNumero("Ingrese el ID del pedido: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        const pedido = obtenerPedidoPorId(id);
        if (!pedido) {
            mostrarError("Pedido no encontrado.");
            pausa();
            return;
        }
        
        console.log(`\nPedido #${pedido.id}`);
        console.log(`  Estado actual: ${pedido.estado.toUpperCase()}`);
        console.log("\n  ESTADOS DISPONIBLES:");
        console.log("  1. pendiente");
        console.log("  2. completado");
        console.log("  3. cancelado");
        console.log("-".repeat(40));
        
        const opcion = leerNumero("Seleccione (1-3): ");
        let nuevoEstado: 'pendiente' | 'completado' | 'cancelado';
        switch (opcion) {
            case 1: nuevoEstado = 'pendiente'; break;
            case 2: nuevoEstado = 'completado'; break;
            case 3: nuevoEstado = 'cancelado'; break;
            default:
                mostrarError("Opcion invalida.");
                pausa();
                return;
        }
        
        const actualizado = actualizarEstadoPedido(id, nuevoEstado);
        if (actualizado) {
            mostrarExito(`Estado cambiado a: ${nuevoEstado.toUpperCase()}`);
        }
        pausa();
    } catch {
        mostrarError("Error al cambiar estado del pedido");
        pausa();
    }
};

const adminEliminarPedido = (): void => {
    try {
        const id = leerNumero("Ingrese el ID a eliminar: ");
        if (id <= 0) {
            mostrarError("ID invalido");
            pausa();
            return;
        }
        if (eliminarPedido(id)) {
            mostrarExito("Pedido eliminado.");
        } else {
            mostrarError("Pedido no encontrado o esta pendiente.");
        }
        pausa();
    } catch {
        mostrarError("Error al eliminar pedido");
        pausa();
    }
};

// ============ INVENTARIO ============

const mostrarInventario = (): void => {
    try {
        mostrarTitulo("INVENTARIO");
        
        const productos = obtenerProductos();
        const clientes = obtenerClientes();
        const estadisticas = obtenerEstadisticasPedidos();
        
        console.log("PRODUCTOS:");
        console.log("  Total: " + productos.length);
        if (productos.length > 0) {
            const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);
            const precioPromedio = productos.reduce((sum, p) => sum + p.precio, 0) / productos.length;
            console.log(`  Stock total: ${stockTotal}`);
            console.log(`  Precio promedio: $${precioPromedio.toFixed(2)}`);
        }
        
        console.log("\nCLIENTES:");
        console.log(`  Total: ${clientes.length}`);
        
        console.log("\nPEDIDOS:");
        console.log(`  Total: ${estadisticas.total}`);
        console.log(`  Pendientes: ${estadisticas.pendientes}`);
        console.log(`  Completados: ${estadisticas.completados}`);
        console.log(`  Cancelados: ${estadisticas.cancelados}`);
        console.log(`  Total ventas: $${estadisticas.totalVentas.toFixed(2)}`);
        
        pausa();
    } catch {
        mostrarError("Error al mostrar inventario");
        pausa();
    }
};

// ============ MANEJADORES DE MENUS ============

const manejarCliente = (): void => {
    try {
        let opcion = 1;
        while (opcion !== 0) {
            mostrarMenuCliente();
            opcion = leerNumero("Opcion: ");
            switch (opcion) {
                case 0: break;
                case 1: clienteListarProductos(); break;
                case 2: clienteBuscarProductoPorId(); break;
                case 3: clienteBuscarProductosPorNombre(); break;
                case 4: clienteHacerPedido(); break;
                case 5: clienteVerPedidos(); break;
                default: mostrarError("Opcion invalida."); pausa();
            }
        }
    } catch {
        mostrarError("Error en el menu cliente");
        pausa();
    }
};

// ============ SUBMENUS ADMINISTRADOR ============

const manejarSubMenuProductos = (): void => {
    let opcion = 1;
    while (opcion !== 0) {
        mostrarSubMenuProductos();
        opcion = leerNumero("Opcion: ");
        switch (opcion) {
            case 0: break;
            case 1: adminCrearProducto(); break;
            case 2: adminListarProductos(); break;
            case 3: adminBuscarProductoPorId(); break;
            case 4: adminBuscarProductosPorNombre(); break;
            case 5: adminEditarProducto(); break;
            case 6: adminEliminarProducto(); break;
            default: mostrarError("Opcion invalida."); pausa();
        }
    }
};

const manejarSubMenuClientes = (): void => {
    let opcion = 1;
    while (opcion !== 0) {
        mostrarSubMenuClientes();
        opcion = leerNumero("Opcion: ");
        switch (opcion) {
            case 0: break;
            case 1: adminCrearCliente(); break;
            case 2: adminListarClientes(); break;
            case 3: adminBuscarClientePorId(); break;
            case 4: adminEditarCliente(); break;
            case 5: adminEliminarCliente(); break;
            default: mostrarError("Opcion invalida."); pausa();
        }
    }
};

const manejarSubMenuPedidos = (): void => {
    let opcion = 1;
    while (opcion !== 0) {
        mostrarSubMenuPedidos();
        opcion = leerNumero("Opcion: ");
        switch (opcion) {
            case 0: break;
            case 1: adminCrearPedido(); break;
            case 2: adminListarPedidos(); break;
            case 3: adminBuscarPedidoPorId(); break;
            case 4: adminVerPedidosPorCliente(); break;
            case 5: adminCambiarEstadoPedido(); break;
            case 6: adminEliminarPedido(); break;
            default: mostrarError("Opcion invalida."); pausa();
        }
    }
};

const manejarAdmin = (): void => {
    try {
        let opcion = 1;
        while (opcion !== 0) {
            mostrarMenuAdmin();
            opcion = leerNumero("Opcion: ");
            switch (opcion) {
                case 0: break;
                case 1: manejarSubMenuProductos(); break;
                case 2: manejarSubMenuClientes(); break;
                case 3: manejarSubMenuPedidos(); break;
                default: mostrarError("Opcion invalida."); pausa();
            }
        }
    } catch {
        mostrarError("Error en el menu administrador");
        pausa();
    }
};

// ============ DATOS DE EJEMPLO ============

const cargarDatosEjemplo = (): void => {
    try {
        console.log("Cargando datos de ejemplo...");
        
        crearProducto("Laptop", 1200, 10);
        crearProducto("Mouse", 25, 50);
        crearProducto("Teclado", 45, 30);
        crearProducto("Monitor", 350, 15);
        crearProducto("Auriculares", 80, 20);
        
        crearCliente("Juan Perez", "juan@email.com", "555-1234");
        crearCliente("Maria Gomez", "maria@email.com", "555-5678");
        crearCliente("Carlos Lopez", "carlos@email.com", "555-9012");
        
        console.log(`${obtenerProductos().length} productos cargados`);
        console.log(`${obtenerClientes().length} clientes cargados`);
        console.log();
    } catch {
        console.log("Error al cargar datos de ejemplo");
    }
};

// ============ PROGRAMA PRINCIPAL ============

const main = (): void => {
    try {
        console.log("BIENVENIDO AL SISTEMA DE GESTION");
        cargarDatosEjemplo();

        let opcionPrincipal = 1;
        while (opcionPrincipal !== 0) {
            mostrarMenuPrincipal();
            opcionPrincipal = leerNumero("Opcion: ");
            
            switch (opcionPrincipal) {
                case 0:
                    console.log("\n" + "=".repeat(55));
                    console.log("  PROGRAMA FINALIZADO");
                    console.log("  Gracias por usar el sistema");
                    console.log("=".repeat(55));
                    break;
                case 1:
                    manejarCliente();
                    break;
                case 2:
                    manejarAdmin();
                    break;
                case 3:
                    mostrarInventario();
                    break;
                default:
                    mostrarError("Opcion invalida.");
                    pausa();
            }
        }
    } catch {
        console.log("Error en la aplicacion");
        pausa();
    }
};

main();