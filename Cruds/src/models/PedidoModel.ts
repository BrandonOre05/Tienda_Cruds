export interface ItemPedido {
    productoId: number;
    cantidad: number;
}

export interface Pedido {
    id: number;
    clienteId: number;
    items: ItemPedido[];
    total: number;
    fecha: Date;
    estado: 'pendiente' | 'completado' | 'cancelado';
}