import type { CursoModel } from './003_curso.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface MatriculaModel {

  id?: string;
  idMatricula: string;
  idUsuario: string;
  idCurso: string;
  usuario?: UsuarioModel;
  curso?: CursoModel;
  dataMatricula: string;
  dataConclusao: string | null;
  
}