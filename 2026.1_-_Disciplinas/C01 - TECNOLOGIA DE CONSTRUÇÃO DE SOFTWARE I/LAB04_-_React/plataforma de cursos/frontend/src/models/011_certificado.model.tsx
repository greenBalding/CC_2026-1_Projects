import type { CursoModel } from './003_curso.model.tsx';
import type { TrilhaModel } from './009_trilha.model.tsx';
import type { UsuarioModel } from './001_usuario.model.tsx';

export interface CertificadoModel {

  idCertificado: string;
  idUsuario: string;
  idCurso: string;
  idTrilha: string | null;
  usuario?: UsuarioModel;
  curso?: CursoModel;
  trilha?: TrilhaModel | null;
  codigoVerificacao: string;
  dataEmissao: string;
  
}