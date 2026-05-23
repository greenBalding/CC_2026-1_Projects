import type { PlanoModel } from './plano.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

export interface AssinaturaModel {
  idAssinatura: string;
  idUsuario: string;
  idPlano: string;
  usuario?: UsuarioModel;
  plano?: PlanoModel;
  dataInicio: string;
  dataFim: string;
}