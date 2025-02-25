## Funcionalidades e Regras

# Gerenciadores
- [x]  Deve ser possível cadastrar novos gerenciadores(helpdesk / coordenador)
    - [x]  Deve ser feito o hash da senha do gerenciador
    - [x]  Não deve ser possível cadastrar gerenciador com e-mail duplicado
    - [x]  Não deve ser possível cadastrar gerenciador com id da empresa duplicado
- [x]  Deve ser possível atualizar os dados do gerenciador
    - [x]  Deve ser feito o hash da senha do usuário
    - [x]  Não deve ser possível atualizar para um e-mail duplicado
- [x]  Deve ser possível obter o token de autenticação
    - [x]  Não deve ser possível se autenticar com credenciais incorretas

# Colaboradores
- [x]  Deve ser possível criar e editar um colaborador
    - [x]  Não deve ser possível criar/editar um colaborador com um id inexistente
- [x]  Deve ser possível obter dados de  um colaborador
    - [x]  Qualquer usuário deve poder obter dados do colaborador
- [x]  Deve ser possível registrar o último dia do colaborador na empresa.
- [x]  Deve ser possível registrar os empréstimos e devoluções de cada colaborador
  - [x]  Não deve ser possível emprestar para colaboradores inexistentes
  - [x] Deve ser possível fazer o upload do pdf assinado para cada registro de emprestimo e devolução
- [x]  Deve ser possível criar tipificações para cada colaborador
    - [x]  Não deve ser possível criar uma tipificação com um id de colaborador inexistente
    - [x] Não deve ser possivel criar uma tipificação com um manager inexistente
- [x]  Deve ser possível listar todos os emprestimos de um colaborador
    - [x]  Não deve ser possível listar os emprestimos de um colaborador inexistente
    - [x]  Deve ser possível filtrar pelo Status
    - [ ]  Deve ser possível configurar alertas automáticos para devoluções pendentes.
- [x]  Deve ser possível listar todos os colaboradores por ordem de criação (mais recente)
    - [x]  Qualquer usuário deve poder obter a lista de colaboradores
    - [x]  Deve ser possível realizar paginação pela lista de colaboradores
    - [x]  Deve ser possível filtrar pelo Status
    - [x]  Deve ser possível buscar pelo nome ou pelo id do colaborador


# Equipamentos
- [x]  Deve ser possível registrar equipamentos
    - [x]  Não deve ser possível criar um equipamento com um S/N duplicado
    - [x]  Deve ser possível registrar o equipamento como avariado e ter o motivo


- [x]  Deve ser possível realizar o upload de arquivos
- [x]  Métricas
    - [x]  Deve ser possível obter a métrica de emprestimos realizados nos últimos 30 dias
    - [x]  Deve ser possível obter a métrica de emprestimos devolvidos nos últimos 30 dias
    - [ ]  Deve ser possível obter a métrica de colaboradores ativos
    - [ ]  Deve ser possível obter a métrica de colaboradores inativos 