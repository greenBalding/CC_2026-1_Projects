import type { AulaModel } from './005_aula.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface ProgressoAulaModel {

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras (Chave composta implícita: idUsuario + idAula)
  idUsuario: string;
  idAula: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  usuario?: UsuarioModel;
  aula?: AulaModel;

  // [Preenchimento Automático] Status e controle de progresso
  dataConclusao: string | null;
  status: 'CONCLUIDO' | 'EM_PROGRESO' | 'NAO_INICIADO';
  
}