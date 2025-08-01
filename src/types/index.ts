export interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Medico {
  id: number;
  matricula: string;
}

export interface Pedido {
  id: number;
  nombre: string;
  beneficiario: Beneficiario;
  dni: number;
  telefono: number;
  empresa: string;
  delegacion: string;
  fechaIngreso: string;
  estado: string;
  medico: Medico;
}

export interface Documento {
  id: number;
  nombre: string;
  fecha: string;
  tipo: string;
  pedidoId: number;
}

export interface Movimiento {
  id: number;
  pedidoId: number;
  descripcion: string;
  fecha: string;
}