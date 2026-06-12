// Esse é modelo de dados utilizado para definir a estrutura do objeto de usuário no sistema. 
// Os 

export interface UsuarioModel {

  // Identificador único do usuário
  idUsuario: string;

  // Informações pessoais
  nome: string;
  email: string;
  perfil: 'administrador' | 'instrutor' | 'aluno';
  senhaHash: string;

  // Status e log de atividades  
  ativo: boolean;
  dataCriacao: Date;
  dataAlteracao: Date;
  
}