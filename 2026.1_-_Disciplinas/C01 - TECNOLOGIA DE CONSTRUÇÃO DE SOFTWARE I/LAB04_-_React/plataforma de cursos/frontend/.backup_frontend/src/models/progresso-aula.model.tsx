import type { AulaModel } from './aula.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

export interface ProgressoAulaModel {
  idUsuario: string;
  idAula: string;
  usuario?: UsuarioModel;
  aula?: AulaModel;
  dataConclusao: string | null;
  status: 'CONCLUIDO' | 'EM_PROGRESO' | 'NAO_INICIADO';
}