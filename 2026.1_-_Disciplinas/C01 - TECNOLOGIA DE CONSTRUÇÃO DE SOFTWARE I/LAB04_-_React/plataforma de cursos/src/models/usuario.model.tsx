export interface UsuarioModel {
  idUsuario: string;
  nome: string;
  email: string;
  perfil: 'administrador' | 'instrutor' | 'aluno';
  senhaHash: string;
  ativo: boolean;
  dataCriacao: Date;
  dataAlteracao: Date;
}
