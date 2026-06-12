// Esse é modelo de dados utilizado para definir a estrutura do objeto de usuário no sistema. 
// O modelo pode ser criado na tela de login ou também pode ser utilizado pelo perfil ADM para criar novos usuários.

export interface UsuarioModel {

  // [Preenchimento Automático] Identificador único do usuário
  idUsuario: string;

  // [Preenchimento Manual] Informações pessoais
  nome: string;
  email: string;
  perfil: 'administrador' | 'instrutor' | 'aluno';
  senhaHash: string;

  // [Preenchimento Automático] Status e log de atividades  
  ativo: boolean;
  dataCriacao: Date;
  dataAlteracao: Date;
  
}