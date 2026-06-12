import type { PlanoModel } from './012_plano.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface AssinaturaModel {

  // [Preenchimento Automático] Identificador único
  idAssinatura: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras (Quem assinou e qual foi o plano)
  idUsuario: string;
  idPlano: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  usuario?: UsuarioModel;
  plano?: PlanoModel;

  // [Preenchimento Automático] Período de vigência do plano contratado
  dataInicio: string;
  dataFim: string;
  
}