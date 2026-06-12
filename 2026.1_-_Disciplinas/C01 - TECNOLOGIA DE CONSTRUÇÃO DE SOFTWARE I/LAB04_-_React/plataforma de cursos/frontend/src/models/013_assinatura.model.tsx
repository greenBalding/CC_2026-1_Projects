import type { PlanoModel } from './012_plano.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface AssinaturaModel {

  idAssinatura: string;
  idUsuario: string;
  idPlano: string;
  usuario?: UsuarioModel;
  plano?: PlanoModel;
  dataInicio: string;
  dataFim: string;
  
}