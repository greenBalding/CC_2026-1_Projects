import type { AulaModel } from './005_aula.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface ProgressoAulaModel {

  idUsuario: string;
  idAula: string;
  usuario?: UsuarioModel;
  aula?: AulaModel;
  dataConclusao: string | null;
  status: 'CONCLUIDO' | 'EM_PROGRESO' | 'NAO_INICIADO';
  
}