import type { CursoModel } from './curso.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

export interface MatriculaModel {
  idMatricula: string;
  idUsuario: string;
  idCurso: string;
  usuario?: UsuarioModel;
  curso?: CursoModel;
  dataMatricula: string;
  dataConclusao: string | null;
}