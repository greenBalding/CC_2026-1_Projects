import type { CursoModel } from './003_curso.model.tsx';
import type { TrilhaModel } from './009_trilha.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface CertificadoModel {

  // [Preenchimento Automático] Identificador único
  idCertificado: string;

  // [Preenchimento Automático] Dados de autenticidade e emissão
  codigoVerificacao: string;
  dataEmissao: string;

  // [Preenchimento Manual] Relacionamentos e chaves estrangeiras (Pode ser associado a um Curso ou a uma Trilha)
  idUsuario: string;
  idCurso: string;
  idTrilha: string | null;

  // [Preenchimento Automático] Objetos aninhados populados pela API
  usuario?: UsuarioModel;
  curso?: CursoModel;
  trilha?: TrilhaModel | null;
  
}