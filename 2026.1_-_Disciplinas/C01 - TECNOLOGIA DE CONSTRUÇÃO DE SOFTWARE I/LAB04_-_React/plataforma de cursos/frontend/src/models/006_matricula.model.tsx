import type { CursoModel } from './003_curso.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface MatriculaModel {

  // [Preenchimento Automático] Identificadores únicos (id interno do json-server e idMatricula de negócio)
  id?: string;
  idMatricula: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras
  idUsuario: string;
  idCurso: string;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  usuario?: UsuarioModel;
  curso?: CursoModel;

  // [Preenchimento Automático] Datas e controle de progresso
  dataMatricula: string;
  dataConclusao: string | null;
  
}