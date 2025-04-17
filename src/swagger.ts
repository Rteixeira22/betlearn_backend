import swaggerJSDoc from "swagger-jsdoc";
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API BetLearn",
    version: "1.0.0",
    description: "API da BetLearn para testar rotas.",
  },
  basePath: "/api",
  servers: [
    {
      url: "https://api-betlearn-wine.vercel.app/api/",
      description: "API hospedada na Vercel",
    },
    /* {
      url: "http://localhost:3000/api/",
      description: "API local para desenvolvimento",
    }, */
  ],
  paths: {
    "/admin": {
      get: {
        summary: "Obtém todos os administradores",
        tags: ["Admins"],
        responses: {
          "200": {
            description: "Lista de administradores",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Admin",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar administradores",
          },
        },
      },
      post: {
        summary: "Cria um novo administrador",
        tags: ["Admins"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Admin Name",
                email: "admin@example.com",
                username: "adminuser",
                password: "securepassword",
                image: "https://example.com/image.jpg",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Administrador criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Admin",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "500": {
            description: "Erro ao criar administrador",
          },
        },
      },
    },
    "/admin/{id}": {
      get: {
        summary: "Obtém um administrador pelo ID",
        tags: ["Admins"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do administrador",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Dados do administrador",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Admin",
                },
              },
            },
          },
          "404": {
            description: "Administrador não encontrado",
          },
          "500": {
            description: "Erro ao buscar administrador",
          },
        },
      },
      put: {
        summary: "Atualiza um administrador existente",
        tags: ["Admins"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do administrador",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                name: "Admin Name",
                email: "admin@example.com",
                username: "adminuser",
                password: "securepassword",
                image: "https://example.com/image.jpg",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Administrador atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Admin",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "404": {
            description: "Administrador não encontrado",
          },
          "500": {
            description: "Erro ao atualizar administrador",
          },
        },
      },
      delete: {
        summary: "Remove um administrador",
        tags: ["Admins"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do administrador",
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Administrador removido com sucesso",
          },
          "404": {
            description: "Administrador não encontrado",
          },
          "500": {
            description: "Erro ao remover administrador",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Realiza o login de um utilizador na plataforma",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Authentication",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Utilizador autenticado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        email: {
                          type: "string",
                        },
                        username: {
                          type: "string",
                        },
                        image: {
                          type: "string",
                        },
                      },
                    },
                    token: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Credenciais inválidas",
          },
          "500": {
            description: "Falha na autenticação",
          },
        },
      },
    },
    "/auth/admin/login": {
      post: {
        summary: "Realiza o login de um administrador na plataforma",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Authentication",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Administrador autenticado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    admin: {
                      type: "object",
                      properties: {
                        id_user: {
                          type: "integer",
                        },
                        name: {
                          type: "string",
                        },
                        email: {
                          type: "string",
                        },
                        username: {
                          type: "string",
                        },
                        birthdate: {
                          type: "string",
                          format: "date-time",
                        },
                        money: {
                          type: "string",
                        },
                        points: {
                          type: "integer",
                        },
                        image: {
                          type: "string",
                        },
                        bets_visibility: {
                          type: "boolean",
                        },
                        tutorial_verification: {
                          type: "boolean",
                        },
                      },
                    },
                    token: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Credenciais inválidas",
          },
          "500": {
            description: "Falha na autenticação",
          },
        },
      },
    },
    "/bets/{id}": {
      get: {
        summary: "Obtém todas as apostas de um Utilizador",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do Utilizador",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Lista de apostas do Utilizador",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bets",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar apostas",
          },
        },
      },
      patch: {
        summary: "Atualiza aposta por id (Estados)",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID da aposta",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  state: {
                    type: "integer",
                    example: 1,
                  },
                  result: {
                    type: "integer",
                    example: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Aposta atualizada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Bets",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar aposta",
          },
        },
      },
      delete: {
        summary: "Remove uma aposta pelo ID",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID da aposta",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Aposta removida com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Bets",
                },
              },
            },
          },
          "500": {
            description: "Erro ao remover aposta",
          },
        },
      },
    },
    "/bets/count/{id}": {
      get: {
        summary: "Conta o número de apostas de um Utilizador",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do Utilizador",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Número de apostas do Utilizador",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: {
                      type: "integer",
                      example: 5,
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao contar apostas",
          },
        },
      },
    },
    "/bets/last/{id}": {
      get: {
        summary: "Obtém a última aposta de um Utilizador",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do Utilizador",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Última aposta do Utilizador",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Bets",
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar a última aposta",
          },
        },
      },
    },
    "/bets/{id_user}/{id_championship}": {
      post: {
        summary: "Cria uma nova aposta para um Utilizador",
        tags: ["Bets"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do Utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_championship",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do Campeonato",
            example: 2,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  type: {
                    type: "integer",
                    example: 1,
                  },
                  amount: {
                    type: "number",
                    "": "Valor apostado",
                    example: 100.5,
                  },
                  potential_earning: {
                    type: "number",
                    example: 200,
                  },
                  odd_bet: {
                    type: "number",
                    example: 2,
                  },
                  ref: {
                    type: "integer",
                    example: 123,
                  },
                  state: {
                    type: "integer",
                    example: 0,
                  },
                  result: {
                    type: "integer",
                    example: 1,
                  },
                  local_team: {
                    type: "string",
                    example: "Team A",
                  },
                  visitor_team: {
                    type: "string",
                    example: "Team B",
                  },
                  schedule: {
                    type: "string",
                    format: "date-time",
                    example: "2025-04-02T15:00:00Z",
                  },
                  betted_team: {
                    type: "string",
                    example: "Team A",
                  },
                  odd_game: {
                    type: "number",
                    example: 1.8,
                  },
                  goals_local_team: {
                    type: "integer",
                    example: 2,
                  },
                  goals_visitor_team: {
                    type: "integer",
                    example: 1,
                  },
                  image: {
                    type: "string",
                    nullable: true,
                    example: "https://example.com/game-image.jpg",
                  },
                  game_state: {
                    type: "integer",
                    example: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Aposta criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bet: {
                      $ref: "#/components/schemas/Bets",
                    },
                    game: {
                      type: "object",
                      description: "Dados do jogo criado",
                      properties: {
                        id_game: {
                          type: "integer",
                          description: "ID do jogo",
                          example: 10,
                        },
                        local_team: {
                          type: "string",
                          description: "Nome da equipa local",
                          example: "Team A",
                        },
                        visitor_team: {
                          type: "string",
                          description: "Nome da equipa visitante",
                          example: "Team B",
                        },
                        schedule: {
                          type: "string",
                          format: "date-time",
                          description: "Data e hora do jogo",
                          example: "2025-04-02T15:00:00Z",
                        },
                      },
                    },
                    betsHasGames: {
                      type: "object",
                      description: "Relação entre aposta, jogo e campeonato",
                      properties: {
                        ref_id_game: {
                          type: "integer",
                          description: "ID do jogo",
                          example: 10,
                        },
                        ref_id_bet: {
                          type: "integer",
                          description: "ID da aposta",
                          example: 5,
                        },
                        ref_id_championship: {
                          type: "integer",
                          description: "ID do campeonato",
                          example: 2,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "500": {
            description: "Erro ao criar aposta",
          },
        },
      },
    },
    "/challenges": {
      get: {
        summary: "Obtém todos os desafios",
        tags: ["Challenges"],
        responses: {
          "200": {
            description: "Lista de desafios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Challenge",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar desafios",
          },
        },
      },
      post: {
        summary: "Cria um novo desafio",
        tags: ["Challenges"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  number: {
                    type: "integer",
                    example: 1,
                  },
                  name: {
                    type: "string",
                    example: "Desafio 1",
                  },
                  short_description: {
                    type: "string",
                    example: "Descrição curta",
                  },
                  long_description: {
                    type: "string",
                    example: "Descrição longa",
                  },
                  image: {
                    type: "string",
                    description: "URL da imagem do desafio",
                    example: "https://example.com/image.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Desafio criado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    challenge: {
                      $ref: "#/components/schemas/Challenge",
                    },
                    steps: {
                      type: "array",
                      description: "Lista de passos criados",
                      items: {
                        $ref: "#/components/schemas/Step",
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "500": {
            description: "Erro ao criar desafio",
          },
        },
      },
    },
    "/challenges/{id}": {
      get: {
        summary: "Obtém um desafio pelo ID",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Dados do desafio",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Challenge",
                },
              },
            },
          },
          "404": {
            description: "Desafio não encontrado",
          },
          "500": {
            description: "Erro ao buscar desafio",
          },
        },
      },
      patch: {
        summary: "Atualiza um desafio pelo ID",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Desafio Atualizado",
                  },
                  short_description: {
                    type: "string",
                    example: "Descrição curta atualizada",
                  },
                  long_description: {
                    type: "string",
                    example: "Descrição longa atualizada",
                  },
                  image: {
                    type: "string",
                    example: "https://example.com/image.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Desafio atualizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Challenge",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "404": {
            description: "Desafio não encontrado",
          },
          "500": {
            description: "Erro ao atualizar desafio",
          },
        },
      },
      delete: {
        summary: "Remove um desafio pelo ID",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Desafio removido com sucesso",
          },
          "404": {
            description: "Desafio não encontrado",
          },
          "500": {
            description: "Erro ao remover desafio",
          },
        },
      },
    },
    "/challenges/{id}/steps": {
      get: {
        summary: "Obtém os passos de um desafio pelo ID",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos do desafio",
            content: {
              "application/json": {
                example: [
                  {
                    id_step: 1,
                    ref_id_step_video: 1,
                    ref_id_step_bet: null,
                    ref_id_step_view: null,
                    ref_id_step_questionnaire: null,
                    ref_id_challenges: 3,
                    description: "Passo 1 do desafio",
                    order: 1,
                  },
                  {
                    id_step: 2,
                    ref_id_step_video: null,
                    ref_id_step_bet: null,
                    ref_id_step_view: 1,
                    ref_id_step_questionnaire: null,
                    ref_id_challenges: 3,
                    description: "Passo 2 do desafio",
                    order: 2,
                  },
                ],
              },
            },
          },
          "404": {
            description: "Desafio não encontrado",
          },
          "500": {
            description: "Erro ao buscar passos",
          },
        },
      },
    },
    "/challenges/count": {
      get: {
        summary: "Obtém a contagem total de desafios",
        tags: ["Challenges"],
        responses: {
          "200": {
            description: "Contagem total de desafios",
            content: {
              "application/json": {
                example: {
                  count: 10,
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar a contagem de desafios",
            content: {
              "application/json": {
                example: {
                  error: "Failed to count challenges",
                },
              },
            },
          },
        },
      },
    },
    "/challenges/{id_user}/{id_challenge}": {
      post: {
        summary: "Cria uma relação entre um utilizador e um desafio",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_challenge",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 2,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  completed: {
                    type: "boolean",
                    description: "Define se o desafio foi completado",
                    example: false,
                  },
                  blocked: {
                    type: "boolean",
                    description: "Define se o desafio está bloqueado",
                    example: true,
                  },
                  detail_seen: {
                    type: "boolean",
                    description:
                      "Define se os detalhes do desafio foram visualizados",
                    example: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Relação criada com sucesso",
            content: {
              "application/json": {
                example: {
                  ref_id_user: 1,
                  ref_id_challenge: 2,
                  completed: false,
                  blocked: true,
                  detail_seen: false,
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos ou campos obrigatórios ausentes",
            content: {
              "application/json": {
                example: {
                  error:
                    "Missing required fields: completed, blocked, and detail_seen are required",
                },
              },
            },
          },
          "404": {
            description: "Utilizador ou desafio não encontrado",
            content: {
              "application/json": {
                example: {
                  error: "User not found",
                },
              },
            },
          },
          "409": {
            description: "Relação já existente entre utilizador e desafio",
            content: {
              "application/json": {
                example: {
                  error: "This user already has this challenge assigned",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar a relação",
            content: {
              "application/json": {
                example: {
                  error: "Failed to create user has challenge",
                },
              },
            },
          },
        },
      },
      patch: {
        summary:
          "Atualiza o campo detail_seen de um desafio para um utilizador",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_challenge",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 2,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  detail_seen: {
                    type: "boolean",
                    description:
                      "Define se os detalhes do desafio foram visualizados",
                    example: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Campo detail_seen atualizado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_user: 1,
                  id_challenge: 2,
                  detail_seen: true,
                },
              },
            },
          },
          "404": {
            description: "Relação entre utilizador e desafio não encontrada",
          },
          "500": {
            description: "Erro ao atualizar o campo detail_seen",
          },
        },
      },
    },
    "/challenges/{id_user}/{id_challenge}/unblock-next": {
      post: {
        summary: "Desbloqueia o próximo desafio para um utilizador",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_challenge",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio atual",
            example: 2,
          },
        ],
        responses: {
          "200": {
            description: "Próximo desafio desbloqueado com sucesso",
            content: {
              "application/json": {
                example: {
                  ref_id_user: 1,
                  ref_id_challenge: 3,
                  completed: false,
                  blocked: false,
                  detail_seen: false,
                },
              },
            },
          },
          "404": {
            description: "Desafio atual ou próximo desafio não encontrado",
            content: {
              "application/json": {
                example: {
                  error: "No next challenge found",
                },
              },
            },
          },
          "500": {
            description: "Erro ao desbloquear o próximo desafio",
            content: {
              "application/json": {
                example: {
                  error: "Failed to unblock next challenge",
                },
              },
            },
          },
        },
      },
    },
    "/challenges/{id_user}/{id_challenge}/progress": {
      patch: {
        summary:
          "Atualiza a percentagem de progresso de um desafio para um utilizador",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_challenge",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 2,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  progress_percentage: {
                    type: "number",
                    description:
                      "Percentagem de progresso do desafio (0 a 100)",
                    example: 75,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Percentagem de progresso atualizada com sucesso",
            content: {
              "application/json": {
                example: {
                  id_user: 1,
                  id_challenge: 2,
                  progress_percentage: 75,
                },
              },
            },
          },
          "400": {
            description:
              "Dados inválidos (ex.: percentagem fora do intervalo permitido)",
          },
          "404": {
            description: "Relação entre utilizador e desafio não encontrada",
          },
          "500": {
            description: "Erro ao atualizar a percentagem de progresso",
          },
        },
      },
    },
    "/challenges/{id_user}/{id_challenge}/state": {
      patch: {
        summary:
          "Atualiza o estado de um ou mais passos de um desafio e calcula a percentagem de progresso",
        tags: ["Challenges"],
        parameters: [
          {
            in: "path",
            name: "id_user",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do utilizador",
            example: 1,
          },
          {
            in: "path",
            name: "id_challenge",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do desafio",
            example: 2,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ref_id_steps: {
                    type: "array",
                    items: {
                      type: "integer",
                    },
                    description: "IDs dos passos a serem atualizados",
                    example: [1, 2, 3],
                  },
                  state: {
                    type: "integer",
                    description:
                      "Novo estado dos passos (0 para incompleto, 1 para completo)",
                    example: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Estado dos passos e percentagem de progresso atualizados com sucesso",
            content: {
              "application/json": {
                example: {
                  message: "Step state updated successfully",
                  progress_percentage: 100,
                  progress_response: {
                    progress_percentage: 100,
                  },
                  updatedStep: {
                    count: 3,
                  },
                },
              },
            },
          },
          "404": {
            description: "Relação entre utilizador e desafio não encontrada",
          },
          "500": {
            description: "Erro ao atualizar o estado dos passos",
          },
        },
      },
    },
    "/championships": {
      get: {
        summary: "Obtém todos os campeonatos",
        tags: ["Championships"],
        responses: {
          "200": {
            description: "Lista de todos os campeonatos",
            content: {
              "application/json": {
                example: [
                  {
                    id_championship: 1,
                    json: "{...}",
                  },
                  {
                    id_championship: 2,
                    json: "{...}",
                  },
                ],
              },
            },
          },
          "500": {
            description: "Erro ao procurar todos os campeonatos",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao procurar todos os campeonatos.",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Cria um novo campeonato",
        tags: ["Championships"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  json: {
                    type: "string",
                    description: "Dados do campeonato em formato JSON",
                    example: "{...}",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Campeonato criado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_championship: 1,
                  json: "{...}",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar campeonato",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao criar campeonato.",
                },
              },
            },
          },
        },
      },
    },
    "/championships/{id}": {
      get: {
        summary: "Obtém um campeonato pelo ID",
        tags: ["Championships"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do campeonato",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Dados do campeonato",
            content: {
              "application/json": {
                example: {
                  id_championship: 1,
                  json: "{...}",
                },
              },
            },
          },
          "500": {
            description: "Erro ao procurar campeonato",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao procurar campeonato.",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualiza um campeonato existente",
        tags: ["Championships"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do campeonato",
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  json: {
                    type: "string",
                    description: "Novos dados do campeonato em formato JSON",
                    example: "{...}",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Campeonato atualizado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_championship: 1,
                  json: "{...}",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar campeonato",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao atualizar campeonato.",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Apaga um campeonato pelo ID",
        tags: ["Championships"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do campeonato",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Campeonato apagado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_championship: 1,
                  json: "{...}",
                },
              },
            },
          },
          "500": {
            description: "Erro ao apagar campeonato",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao apagar campeonato.",
                },
              },
            },
          },
        },
      },
    },
    "/games": {
      get: {
        summary: "Obtém todos os jogos",
        tags: ["Games"],
        responses: {
          "200": {
            description: "Lista de todos os jogos",
            content: {
              "application/json": {
                example: [
                  {
                    id_game: 1,
                    local_team: "Team A",
                    visitor_team: "Team B",
                    schedule: "2025-04-03T15:00:00.000Z",
                    betted_team: "Team A",
                    odd: 1.5,
                    goals_local_team: 2,
                    goals_visitor_team: 1,
                    image: "image_url",
                    game_state: 0,
                  },
                ],
              },
            },
          },
          "500": {
            description: "Erro ao procurar todos os jogos",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao procurar todos os jogos.",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Cria um novo jogo",
        tags: ["Games"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  local_team: {
                    type: "string",
                    description: "Nome da equipa local",
                    example: "Team A",
                  },
                  visitor_team: {
                    type: "string",
                    description: "Nome da equipa visitante",
                    example: "Team B",
                  },
                  schedule: {
                    type: "string",
                    format: "date-time",
                    description: "Data e hora do jogo",
                    example: "2025-04-03T15:00:00.000Z",
                  },
                  betted_team: {
                    type: "string",
                    description: "Equipa apostada",
                    example: "Team A",
                  },
                  odd: {
                    type: "number",
                    description: "Odd do jogo",
                    example: 1.5,
                  },
                  goals_local_team: {
                    type: "integer",
                    description: "Golos da equipa local",
                    example: 2,
                  },
                  goals_visitor_team: {
                    type: "integer",
                    description: "Golos da equipa visitante",
                    example: 1,
                  },
                  image: {
                    type: "string",
                    description: "URL da imagem do jogo",
                    example: "image_url",
                  },
                  game_state: {
                    type: "integer",
                    description: "Estado do jogo (0 = ativo, 1 = concluído)",
                    example: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Jogo criado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_game: 1,
                  local_team: "Team A",
                  visitor_team: "Team B",
                  schedule: "2025-04-03T15:00:00.000Z",
                  betted_team: "Team A",
                  odd: 1.5,
                  goals_local_team: 2,
                  goals_visitor_team: 1,
                  image: "image_url",
                  game_state: 0,
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar o jogo",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao criar o jogo.",
                },
              },
            },
          },
        },
      },
    },
    "/games/{id}": {
      get: {
        summary: "Obtém um jogo pelo ID",
        tags: ["Games"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do jogo",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Dados do jogo",
            content: {
              "application/json": {
                example: {
                  id_game: 1,
                  local_team: "Team A",
                  visitor_team: "Team B",
                  schedule: "2025-04-03T15:00:00.000Z",
                  betted_team: "Team A",
                  odd: 1.5,
                  goals_local_team: 2,
                  goals_visitor_team: 1,
                  image: "image_url",
                  game_state: 0,
                },
              },
            },
          },
          "500": {
            description: "Erro ao procurar o jogo",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao procurar o jogo.",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Apaga um jogo pelo ID",
        tags: ["Games"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do jogo",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Jogo apagado com sucesso",
            content: {
              "application/json": {
                example: {
                  id_game: 1,
                  local_team: "Team A",
                  visitor_team: "Team B",
                  schedule: "2025-04-03T15:00:00.000Z",
                  betted_team: "Team A",
                  odd: 1.5,
                  goals_local_team: 2,
                  goals_visitor_team: 1,
                  image: "image_url",
                  game_state: 0,
                },
              },
            },
          },
          "500": {
            description: "Erro ao apagar o jogo",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao apagar o jogo.",
                },
              },
            },
          },
        },
      },
    },
    "/games/{id}/{betId}": {
      put: {
        summary: "Atualiza o estado de um jogo",
        tags: ["Games"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID do jogo",
            example: 1,
          },
          {
            in: "path",
            name: "betId",
            schema: {
              type: "integer",
            },
            required: true,
            description: "ID da aposta associada",
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Estado do jogo atualizado com sucesso",
            content: {
              "application/json": {
                example: {
                  updatedSingleGame: {
                    id_game: 1,
                    game_state: 1,
                  },
                  updatedBet: {
                    id_bets: 1,
                    state: 1,
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o estado do jogo",
            content: {
              "application/json": {
                example: {
                  error: "Erro ao atualizar o estado do jogo.",
                },
              },
            },
          },
        },
      },
    },
    "/questionnaire": {
      get: {
        summary: "Obtém todas as respostas de questionários.",
        tags: ["Questionnaire"],
        responses: {
          "200": {
            description: "Lista de respostas de questionários.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/QuestionnaireResponse",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar respostas.",
          },
        },
      },
      post: {
        summary: "Cria uma nova resposta de questionário.",
        tags: ["Questionnaire"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  budget: {
                    type: "number",
                    description: "Orçamento do utilizador.",
                  },
                  verification: {
                    type: "boolean",
                    description: "Indica se a resposta foi verificada.",
                  },
                  salary: {
                    type: "number",
                    description: "Salário do utilizador.",
                  },
                  expenses: {
                    type: "number",
                    description: "Despesas do utilizador.",
                  },
                  available_amount: {
                    type: "number",
                    description: "Quantia disponível do utilizador.",
                  },
                  debt: {
                    type: "number",
                    description: "Dívida total do utilizador.",
                  },
                  debt_monthly: {
                    type: "number",
                    description: "Pagamento mensal da dívida.",
                  },
                  income_source: {
                    type: "number",
                    description: "Fonte de renda do utilizador.",
                  },
                  ref_id_user: {
                    type: "integer",
                    description: "ID do utilizador associado à resposta.",
                  },
                },
                required: [
                  "budget",
                  "verification",
                  "salary",
                  "expenses",
                  "available_amount",
                  "debt",
                  "debt_monthly",
                  "income_source",
                  "ref_id_user",
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Resposta criada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id_questionnaire_response: {
                      type: "integer",
                      description: "ID único da resposta criada.",
                    },
                    budget: {
                      type: "number",
                      description: "Orçamento do utilizador.",
                    },
                    verification: {
                      type: "boolean",
                      description: "Indica se a resposta foi verificada.",
                    },
                    salary: {
                      type: "number",
                      description: "Salário do utilizador.",
                    },
                    expenses: {
                      type: "number",
                      description: "Despesas do utilizador.",
                    },
                    available_amount: {
                      type: "number",
                      description: "Quantia disponível do utilizador.",
                    },
                    debt: {
                      type: "number",
                      description: "Dívida total do utilizador.",
                    },
                    debt_monthly: {
                      type: "number",
                      description: "Pagamento mensal da dívida.",
                    },
                    income_source: {
                      type: "string",
                      description: "Fonte de renda do utilizador.",
                    },
                    ref_id_user: {
                      type: "integer",
                      description: "ID do utilizador associado à resposta.",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar a resposta.",
          },
        },
      },
    },
    "/questionnaire/{id}": {
      get: {
        summary: "Obtém uma resposta de questionário pelo ID.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            example: 1,
            schema: {
              type: "integer",
            },
            description: "ID da resposta do questionário.",
          },
        ],
        responses: {
          "200": {
            description: "Resposta do questionário encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuestionnaireResponse",
                },
              },
            },
          },
          "404": {
            description: "Resposta do questionário não encontrada.",
          },
          "500": {
            description: "Erro ao buscar a resposta.",
          },
        },
      },
      put: {
        summary: "Atualiza uma resposta de questionário pelo ID.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da resposta do questionário a ser atualizada.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  budget: {
                    type: "number",
                    description: "Orçamento do utilizador.",
                  },
                  verification: {
                    type: "boolean",
                    description: "Indica se a resposta foi verificada.",
                  },
                  salary: {
                    type: "number",
                    description: "Salário do utilizador.",
                  },
                  expenses: {
                    type: "number",
                    description: "Despesas do utilizador.",
                  },
                  available_amount: {
                    type: "number",
                    description: "Quantia disponível do utilizador.",
                  },
                  debt: {
                    type: "number",
                    description: "Dívida total do utilizador.",
                  },
                  debt_monthly: {
                    type: "number",
                    description: "Pagamento mensal da dívida.",
                  },
                  income_source: {
                    type: "number",
                    description: "Fonte de renda do utilizador.",
                  },
                },
                required: [
                  "budget",
                  "verification",
                  "salary",
                  "expenses",
                  "available_amount",
                  "debt",
                  "debt_monthly",
                  "income_source",
                ],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Resposta atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuestionnaireResponse",
                },
              },
            },
          },
          "404": {
            description: "Resposta do questionário não encontrada.",
          },
          "500": {
            description: "Erro ao atualizar a resposta.",
          },
        },
      },
      delete: {
        summary: "Apaga uma resposta de questionário pelo ID.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da resposta do questionário a ser apagada.",
          },
        ],
        responses: {
          "200": {
            description: "Resposta Apagada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Questionnaire response deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Resposta do questionário não encontrada.",
          },
          "500": {
            description: "Erro ao apagar a resposta.",
          },
        },
      },
    },
    "/questionnaire/user/{userId}": {
      get: {
        summary: "Obtém todas as respostas de questionários de um utilizador.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de respostas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/QuestionnaireResponse",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar respostas.",
          },
        },
      },
    },
    "/questionnaire/verified/{userId}": {
      get: {
        summary:
          "Obtém todas as respostas verificadas de questionários de um utilizador.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de respostas verificadas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/QuestionnaireResponse",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar respostas.",
          },
        },
      },
    },
    "/questionnaire/unverified/{userId}": {
      get: {
        summary:
          "Obtém todas as respostas não verificadas de questionários de um utilizador.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de respostas não verificadas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/QuestionnaireResponse",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao procurar respostas.",
          },
        },
      },
    },
    "/questionnaire/last/{userId}": {
      get: {
        summary: "Obtém a última resposta de questionário de um utilizador.",
        tags: ["Questionnaire"],
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Última resposta do utilizador encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuestionnaireResponse",
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar a última resposta.",
          },
        },
      },
    },
    "/steps": {
      get: {
        summary: "Obtém todos os passos.",
        tags: ["Steps"],
        responses: {
          "200": {
            description: "Lista de passos.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Stepss",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
      post: {
        summary: "Cria um novo passo.",
        tags: ["Steps"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ref_id_step_video: {
                    type: "integer",
                    description: "ID do vídeo associado ao passo.",
                  },
                  ref_id_step_bet: {
                    type: "integer",
                    description: "ID da aposta associada ao passo.",
                  },
                  ref_id_step_view: {
                    type: "integer",
                    description: "ID da visualização associada ao passo.",
                  },
                  ref_id_step_questionnaire: {
                    type: "integer",
                    description: "ID do questionário associado ao passo.",
                  },
                  ref_id_challenges: {
                    type: "integer",
                    description: "ID do desafio associado ao passo.",
                  },
                },
                required: ["ref_id_challenges"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Passo criado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Steps",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar o passo.",
          },
        },
      },
    },
    "/steps/{id}": {
      get: {
        summary: "Obtém um passo pelo ID.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do passo.",
          },
        ],
        responses: {
          "200": {
            description: "Passo encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Stepss",
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar o passo.",
          },
        },
      },
      delete: {
        summary: "Deleta um passo pelo ID.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do passo a ser apagado.",
          },
        ],
        responses: {
          "200": {
            description: "Passo apagado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Step deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao deletar o passo.",
          },
        },
      },
    },
    "/steps/ref_id_challenges/{ref_id_challenges}": {
      get: {
        summary: "Obtém passos por ID de desafio.",
        tags: ["Steps"],
        parameters: [
          {
            name: "ref_id_challenges",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do desafio associado ao passo.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos associados ao desafio.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Steps",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
    },
    "/steps/step_video/{id_video}": {
      get: {
        summary: "Obtém passos por ID de vídeo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_video",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do vídeo associado ao passo.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos associados ao vídeo.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/StepsVideo",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
      put: {
        summary: "Atualiza os detalhes de um vídeo associado a um passo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_video",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do vídeo associado ao passo.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  video_url: {
                    type: "string",
                    description: "URL do vídeo.",
                  },
                  video_description: {
                    type: "string",
                    description: "Descrição do vídeo.",
                  },
                },
                required: ["video_url", "video_description"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Vídeo atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsVideo",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o vídeo.",
          },
        },
      },
    },
    "/steps/step_bet/{id_bet}": {
      get: {
        summary: "Obtém passos por ID de aposta.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_bet",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da aposta associada ao passo.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos associados à aposta.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/StepsBet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
      put: {
        summary: "Atualiza os detalhes de uma aposta associada a um passo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_bet",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da aposta associada ao passo.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bet_description: {
                    type: "string",
                    description: "Descrição da aposta.",
                  },
                  bet_json: {
                    type: "string",
                    description: "JSON com detalhes da aposta.",
                  },
                },
                required: ["bet_description", "bet_json"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Aposta atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsBet",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar a aposta.",
          },
        },
      },
    },
    "/steps/step_view/{id_view}": {
      get: {
        summary: "Obtém passos por ID de visualização.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_view",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da visualização associada ao passo.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos associados à visualização.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/StepsView",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
      put: {
        summary:
          "Atualiza os detalhes de uma visualização associada a um passo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_view",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da visualização associada ao passo.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  view_description: {
                    type: "string",
                    description: "Descrição da visualização.",
                  },
                  view_page: {
                    type: "string",
                    description: "Página associada à visualização.",
                  },
                },
                required: ["view_description", "view_page"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Visualização atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsView",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar a visualização.",
          },
        },
      },
    },
    "/steps/step_questionnaire/{id_questionnaire}": {
      get: {
        summary: "Obtém passos por ID de questionário.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_questionnaire",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do questionário associado ao passo.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de passos associados ao questionário.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/StepsQuestionnaire",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar passos.",
          },
        },
      },
      put: {
        summary:
          "Atualiza os detalhes de um questionário associado a um passo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id_questionnaire",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do questionário associado ao passo.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  questionnaire_description: {
                    type: "string",
                    description: "Descrição do questionário.",
                  },
                  questionnaire_json: {
                    type: "string",
                    description: "JSON com detalhes do questionário.",
                  },
                },
                required: ["questionnaire_description", "questionnaire_json"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Questionário atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsQuestionnaire",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o questionário.",
          },
        },
      },
    },
    "/steps/step_video": {
      post: {
        summary: "Cria um novo vídeo associado a um passo.",
        tags: ["Steps"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  video_url: {
                    type: "string",
                    description: "URL do vídeo.",
                  },
                  video_description: {
                    type: "string",
                    description: "Descrição do vídeo.",
                  },
                },
                required: ["video_url", "video_description"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Vídeo criado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsVideo",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar o vídeo.",
          },
        },
      },
    },
    "/steps/step_bet": {
      post: {
        summary: "Cria uma nova aposta associada a um passo.",
        tags: ["Steps"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bet_description: {
                    type: "string",
                    description: "Descrição da aposta.",
                  },
                  bet_json: {
                    type: "string",
                    description: "JSON com detalhes da aposta.",
                  },
                },
                required: ["bet_description", "bet_json"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Aposta criada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsBet",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar a aposta.",
          },
        },
      },
    },
    "/steps/step_view": {
      post: {
        summary: "Cria uma nova visualização associada a um passo.",
        tags: ["Steps"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  view_description: {
                    type: "string",
                    description: "Descrição da visualização.",
                  },
                  view_page: {
                    type: "string",
                    description: "Página associada à visualização.",
                  },
                },
                required: ["view_description", "view_page"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Visualização criada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsView",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar a visualização.",
          },
        },
      },
    },
    "/steps/step_questionnaire": {
      post: {
        summary: "Cria um novo questionário associado a um passo.",
        tags: ["Steps"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  questionnaire_description: {
                    type: "string",
                    description: "Descrição do questionário.",
                  },
                  questionnaire_json: {
                    type: "string",
                    description: "JSON com detalhes do questionário.",
                  },
                },
                required: ["questionnaire_description", "questionnaire_json"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Questionário criado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/StepsQuestionnaire",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar o questionário.",
          },
        },
      },
    },
    "/steps/progress_percentage/{id}": {
      put: {
        summary: "Atualiza o progresso de um passo.",
        tags: ["Steps"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do desafio associado ao passo.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ref_id_user: {
                    type: "integer",
                    description: "ID do utilizador associado ao desafio.",
                  },
                  progress_percentage: {
                    type: "number",
                    description: "Percentagem de progresso do passo.",
                  },
                },
                required: ["ref_id_user", "progress_percentage"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Progresso do passo atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ref_id_user: {
                      type: "integer",
                      description: "ID do utilizador.",
                    },
                    progress_percentage: {
                      type: "number",
                      description: "Percentagem de progresso atualizada.",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o progresso do passo.",
          },
        },
      },
    },
    "/tips": {
      get: {
        summary: "Obtém todas as dicas.",
        tags: ["Tips"],
        responses: {
          "200": {
            description: "Lista de dicas.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Tips",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar dicas.",
          },
        },
      },
      post: {
        summary: "Cria uma nova dica.",
        tags: ["Tips"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tip: {
                    type: "string",
                    description: "Conteúdo da dica.",
                  },
                },
                required: ["tip"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Dica criada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tips",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar a dica.",
          },
        },
      },
    },
    "/tips/{id}": {
      get: {
        summary: "Obtém uma dica pelo ID.",
        tags: ["Tips"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da dica.",
          },
        ],
        responses: {
          "200": {
            description: "Dica encontrada.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tips",
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar a dica.",
          },
        },
      },
      put: {
        summary: "Atualiza uma dica pelo ID.",
        tags: ["Tips"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da dica a ser atualizada.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tip: {
                    type: "string",
                    description: "Novo conteúdo da dica.",
                  },
                },
                required: ["tip"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Dica atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tips",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar a dica.",
          },
        },
      },
      delete: {
        summary: "Deleta uma dica pelo ID.",
        tags: ["Tips"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID da dica a ser deletada.",
          },
        ],
        responses: {
          "200": {
            description: "Dica deletada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Tip deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao deletar a dica.",
          },
        },
      },
    },
    "/users": {
      get: {
        summary: "Obtém todos os utilizadores.",
        tags: ["Users"],
        responses: {
          "200": {
            description: "Lista de utilizadores.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Users",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar utilizadores.",
          },
        },
      },
      post: {
        summary: "Cria um novo utilizador.",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do utilizador.",
                  },
                  email: {
                    type: "string",
                    description: "Email do utilizador.",
                  },
                  username: {
                    type: "string",
                    description: "Nome de utilizador.",
                  },
                  birthdate: {
                    type: "string",
                    format: "date",
                    description: "Data de nascimento do utilizador.",
                  },
                  password: {
                    type: "string",
                    description: "Senha do utilizador.",
                  },
                  image: {
                    type: "string",
                    description: "URL da imagem do utilizador.",
                  },
                  money: {
                    type: "number",
                    description: "Quantidade de dinheiro do utilizador.",
                  },
                  points: {
                    type: "number",
                    description: "Pontos do utilizador.",
                  },
                  tutorial_verification: {
                    type: "boolean",
                    description: "Verificação do tutorial.",
                  },
                },
                required: [
                  "name",
                  "email",
                  "username",
                  "birthdate",
                  "password",
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Utilizador criado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao criar o utilizador.",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Obtém um utilizador pelo ID.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Utilizador encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar o utilizador.",
          },
        },
      },
      delete: {
        summary: "Deleta um utilizador pelo ID.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "204": {
            description: "Utilizador deletado com sucesso.",
          },
          "500": {
            description: "Erro ao deletar o utilizador.",
          },
        },
      },
    },
    "/users/{id}/challenges": {
      get: {
        summary: "Obtém os desafios de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de desafios do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Challenge",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar desafios do utilizador.",
          },
        },
      },
    },
    "/users/{id}/bets": {
      get: {
        summary: "Obtém o histórico de apostas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Histórico de apostas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar histórico de apostas.",
          },
        },
      },
    },
    "/users/{id}/bets/active": {
      get: {
        summary: "Obtém as apostas ativas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de apostas ativas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar apostas ativas.",
          },
        },
      },
    },
    "/users/{id}/bets/closed": {
      get: {
        summary: "Obtém as apostas fechadas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de apostas fechadas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar apostas fechadas.",
          },
        },
      },
    },
    "/users/{id}/bets/won": {
      get: {
        summary: "Obtém as apostas ganhas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de apostas ganhas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar apostas ganhas.",
          },
        },
      },
    },
    "/users/{id}/bets/lost": {
      get: {
        summary: "Obtém as apostas perdidas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Lista de apostas perdidas do utilizador.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Bet",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar apostas perdidas.",
          },
        },
      },
    },
    "/users/username/{username}": {
      get: {
        summary: "Obtém um utilizador pelo nome de utilizador (username).",
        tags: ["Users"],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "john_doe",
            description: "Nome de utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Utilizador encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "404": {
            description: "Utilizador não encontrado.",
          },
          "500": {
            description: "Erro ao buscar o utilizador.",
          },
        },
      },
    },
    "/users/email/{email}": {
      get: {
        summary: "Obtém um utilizador pelo email.",
        tags: ["Users"],
        parameters: [
          {
            name: "email",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "john.doe@example.com",
            description: "Email do utilizador.",
          },
        ],
        responses: {
          "200": {
            description: "Utilizador encontrado.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "404": {
            description: "Utilizador não encontrado.",
          },
          "500": {
            description: "Erro ao buscar o utilizador.",
          },
        },
      },
    },
    "/users/{id}/password": {
      patch: {
        summary: "Atualiza a senha de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  password: {
                    type: "string",
                    description:
                      "Nova senha do utilizador (mínimo 8 caracteres).",
                  },
                },
                required: ["password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Senha atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Password updated successfully",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "ID inválido ou senha inválida.",
          },
          "404": {
            description: "Utilizador não encontrado.",
          },
          "500": {
            description: "Erro ao atualizar a senha.",
          },
        },
      },
    },
    "/users/{id}/profile": {
      patch: {
        summary: "Atualiza o perfil de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Nome do utilizador.",
                  },
                  email: {
                    type: "string",
                    description: "Email do utilizador.",
                  },
                  username: {
                    type: "string",
                    description: "Nome de utilizador.",
                  },
                  image: {
                    type: "string",
                    description: "URL da imagem do utilizador.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o perfil.",
          },
        },
      },
    },
    "/users/{id}/money": {
      patch: {
        summary: "Atualiza o saldo de dinheiro de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  money: {
                    type: "number",
                    description: "Novo saldo de dinheiro do utilizador.",
                  },
                },
                required: ["money"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Saldo atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar o saldo.",
          },
        },
      },
    },
    "/users/{id}/points": {
      patch: {
        summary: "Atualiza os pontos de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  points: {
                    type: "number",
                    description: "Nova pontuação do utilizador.",
                  },
                },
                required: ["points"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Pontos atualizados com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar os pontos.",
          },
        },
      },
    },
    "/users/{id}/bets-visibility": {
      patch: {
        summary: "Atualiza a visibilidade das apostas de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bets_visibility: {
                    type: "boolean",
                    description:
                      "Nova configuração de visibilidade das apostas.",
                  },
                },
                required: ["bets_visibility"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Visibilidade das apostas atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar a visibilidade das apostas.",
          },
        },
      },
    },
    "/users/{id}/tutorial-verification": {
      patch: {
        summary: "Atualiza a verificação do tutorial de um utilizador.",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
            description: "ID do utilizador.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tutorial_verification: {
                    type: "boolean",
                    description:
                      "Nova configuração de verificação do tutorial.",
                  },
                },
                required: ["tutorial_verification"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Verificação do tutorial atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Users",
                },
              },
            },
          },
          "500": {
            description: "Erro ao atualizar a verificação do tutorial.",
          },
        },
      },
    },
    "/users/classification/all": {
      get: {
        summary: "Obtém o ranking de utilizadores ordenado por pontos.",
        tags: ["Users"],
        responses: {
          "200": {
            description: "Ranking de utilizadores obtido com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Users",
                  },
                },
              },
            },
          },
          "500": {
            description: "Erro ao buscar o ranking.",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Admin: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID do administrador",
            example: 1,
          },
          name: {
            type: "string",
            description: "Nome do administrador",
            example: "Admin Name",
          },
          email: {
            type: "string",
            description: "Email do administrador",
            example: "admin@example.com",
          },
          username: {
            type: "string",
            description: "Nome de usuário do administrador",
            example: "adminuser",
          },
          password: {
            type: "string",
            description: "Senha do administrador",
            example: "securepassword",
          },
          image: {
            type: "string",
            nullable: true,
            description: "URL da imagem do administrador",
            example: "https://example.com/image.jpg",
          },
        },
      },
      Authentication: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: {
            type: "string",
            description: "Nome de utilizador",
            example: "user123",
          },
          password: {
            type: "string",
            description: "Senha do utilizador",
            example: "password123",
          },
        },
      },
      Bets: {
        type: "object",
        properties: {
          id_bets: {
            type: "integer",
            description: "ID da aposta",
            example: 1,
          },
          date: {
            type: "string",
            format: "date-time",
            description: "Data da aposta",
            example: "2025-04-02T12:00:00Z",
          },
          type: {
            type: "integer",
            description: "Tipo da aposta",
            example: 1,
          },
          amount: {
            type: "number",
            description: "Valor apostado",
            example: 100.5,
          },
          potential_earning: {
            type: "number",
            description: "Ganho potencial",
            example: 200,
          },
          odd: {
            type: "number",
            description: "Odd da aposta",
            example: 2,
          },
          ref: {
            type: "integer",
            description: "Referência da aposta",
            example: 123,
          },
          state: {
            type: "integer",
            description: "Estado da aposta (0 para ativa, 1 para concluída)",
            example: 0,
          },
          result: {
            type: "integer",
            description: "Resultado da aposta (1 para vitória, 0 para derrota)",
            example: 1,
          },
          ref_id_user: {
            type: "integer",
            description: "ID do Utilizador associado à aposta",
            example: 1,
          },
        },
      },
      Challenges: {
        type: "object",
        properties: {
          id_challenge: {
            type: "integer",
            description: "ID do desafio",
            example: 1,
          },
          number: {
            type: "integer",
            description: "Número do desafio",
            example: 1,
          },
          name: {
            type: "string",
            description: "Nome do desafio",
            example: "Desafio 1",
          },
          short_description: {
            type: "string",
            description: "Descrição curta do desafio",
            example: "Descrição curta",
          },
          long_description: {
            type: "string",
            description: "Descrição longa do desafio",
            example: "Descrição longa",
          },
          image: {
            type: "string",
            description: "URL da imagem do desafio",
            example: "https://example.com/image.jpg",
          },
        },
      },
      Championships: {
        type: "object",
        properties: {
          id_championship: {
            type: "integer",
            description: "ID único do campeonato",
            example: 1,
          },
          json: {
            type: "string",
            description: "Dados do campeonato em formato JSON",
            example: "{...}",
          },
        },
      },
      Games: {
        type: "object",
        properties: {
          id_game: {
            type: "integer",
            description: "ID único do jogo",
            example: 1,
          },
          local_team: {
            type: "string",
            description: "Nome da equipa local",
            example: "Team A",
          },
          visitor_team: {
            type: "string",
            description: "Nome da equipa visitante",
            example: "Team B",
          },
          schedule: {
            type: "string",
            format: "date-time",
            description: "Data e hora do jogo",
            example: "2025-04-03T15:00:00.000Z",
          },
          betted_team: {
            type: "string",
            description: "Equipa apostada",
            example: "Team A",
          },
          odd: {
            type: "number",
            description: "Odd do jogo",
            example: 1.5,
          },
          goals_local_team: {
            type: "integer",
            description: "Golos da equipa local",
            example: 2,
          },
          goals_visitor_team: {
            type: "integer",
            description: "Golos da equipa visitante",
            example: 1,
          },
          image: {
            type: "string",
            description: "URL da imagem do jogo",
            example: "image_url",
          },
          game_state: {
            type: "integer",
            description: "Estado do jogo (0 = ativo, 1 = concluído)",
            example: 0,
          },
        },
      },
      QuestionnaireResponse: {
        type: "object",
        properties: {
          id_questionnaire_response: {
            type: "integer",
            description: "ID único da resposta do questionário.",
          },
          budget: {
            type: "number",
            description: "Orçamento do utilizador.",
          },
          verification: {
            type: "boolean",
            description: "Indica se a resposta foi verificada.",
          },
          salary: {
            type: "number",
            description: "Salário do utilizador.",
          },
          expenses: {
            type: "number",
            description: "Despesas do utilizador.",
          },
          available_amount: {
            type: "number",
            description: "Quantia disponível do utilizador.",
          },
          debt: {
            type: "number",
            description: "Dívida total do utilizador.",
          },
          debt_monthly: {
            type: "number",
            description: "Pagamento mensal da dívida.",
          },
          income_source: {
            type: "string",
            description: "Fonte de renda do utilizador.",
          },
          ref_id_user: {
            type: "integer",
            description: "ID do utilizador associado à resposta.",
          },
        },
        required: [
          "budget",
          "verification",
          "salary",
          "expenses",
          "available_amount",
          "debt",
          "debt_monthly",
          "income_source",
          "ref_id_user",
        ],
      },
      Steps: {
        type: "object",
        properties: {
          id_step: {
            type: "integer",
            description: "ID único do passo.",
          },
          ref_id_step_video: {
            type: "integer",
            description: "ID do vídeo associado ao passo.",
          },
          ref_id_step_bet: {
            type: "integer",
            description: "ID da aposta associada ao passo.",
          },
          ref_id_step_view: {
            type: "integer",
            description: "ID da visualização associada ao passo.",
          },
          ref_id_step_questionnaire: {
            type: "integer",
            description: "ID do questionário associado ao passo.",
          },
          ref_id_challenges: {
            type: "integer",
            description: "ID do desafio associado ao passo.",
          },
        },
      },
      StepVideo: {
        type: "object",
        properties: {
          id_step_video: {
            type: "integer",
            description: "ID único do vídeo.",
          },
          video_url: {
            type: "string",
            description: "URL do vídeo.",
          },
          video_description: {
            type: "string",
            description: "Descrição do vídeo.",
          },
        },
      },
      StepBet: {
        type: "object",
        properties: {
          id_step_bet: {
            type: "integer",
            description: "ID único da aposta.",
          },
          bet_description: {
            type: "string",
            description: "Descrição da aposta.",
          },
          bet_json: {
            type: "string",
            description: "JSON com detalhes da aposta.",
          },
        },
      },
      StepView: {
        type: "object",
        properties: {
          id_step_view: {
            type: "integer",
            description: "ID único da visualização.",
          },
          view_description: {
            type: "string",
            description: "Descrição da visualização.",
          },
          view_page: {
            type: "string",
            description: "Página associada à visualização.",
          },
        },
      },
      StepQuestionnaire: {
        type: "object",
        properties: {
          id_step_questionnaire: {
            type: "integer",
            description: "ID único do questionário.",
          },
          questionnaire_description: {
            type: "string",
            description: "Descrição do questionário.",
          },
          questionnaire_json: {
            type: "string",
            description: "JSON com detalhes do questionário.",
          },
        },
      },
      Tips: {
        type: "object",
        properties: {
          id_tip: {
            type: "integer",
            description: "ID único da dica.",
          },
          tip: {
            type: "string",
            description: "Conteúdo da dica.",
          },
        },
      },
      Users: {
        type: "object",
        properties: {
          id_user: {
            type: "integer",
            description: "ID único do utilizador.",
          },
          name: {
            type: "string",
            description: "Nome do utilizador.",
          },
          email: {
            type: "string",
            description: "Email do utilizador.",
          },
          username: {
            type: "string",
            description: "Nome de utilizador.",
          },
          birthdate: {
            type: "string",
            format: "date",
            description: "Data de nascimento do utilizador.",
          },
          image: {
            type: "string",
            description: "URL da imagem do utilizador.",
          },
          money: {
            type: "number",
            description: "Quantidade de dinheiro do utilizador.",
          },
          points: {
            type: "number",
            description: "Pontos do utilizador.",
          },
          tutorial_verification: {
            type: "boolean",
            description: "Verificação do tutorial.",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Admins",
      description: "Gestão de administradores",
    },
    {
      name: "Authentication",
      description: "Gestão de autenticação",
    },
    {
      name: "Bets",
      description: "Gestão de apostas",
    },
    {
      name: "Challenges",
      description: "Gestão de desafios",
    },
    {
      name: "Championships",
      description: "Gestão de campeonatos",
    },
    {
      name: "Games",
      description: "Gestão de jogos",
    },
    {
      name: "Questionnaire",
      description: "Gestão do questionário de onboarding",
    },
    {
      name: "Steps",
      description: "Gestão de passos (steps) no sistema",
    },
    {
      name: "Tips",
      description: "Gestão de dicas (tips)",
    },
    {
      name: "Users",
      description: "Gestão de utilizadores no sistema",
    },
  ],
};
//ADAPTA-SE AO AMBIENTE
const options = {
  swaggerDefinition,
  apis: [
    process.env.NODE_ENV === "production"
      ? "./dist/routes/*Routes.js"
      : "src/routes/*Routes.ts",
  ],
};

export const swaggerSpecs = swaggerJSDoc(options);
