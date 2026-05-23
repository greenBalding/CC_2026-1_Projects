import type { CursoModel } from './curso.model.tsx';
import type { TrilhaModel } from './trilha.model.tsx';
import type { UsuarioModel } from './usuario.model.tsx';

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