/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: Gestão de desafios
 */

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: Obtém todos os desafios
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Lista de desafios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       500:
 *         description: Erro ao buscar desafios
 */

/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     summary: Obtém um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do desafio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao buscar desafio
 */

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Cria um novo desafio
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Desafio 1"
 *               short_description:
 *                 type: string
 *                 example: "Descrição curta"
 *               long_description:
 *                 type: string
 *                 example: "Descrição longa"
 *               image:
 *                 type: string
 *                 description: URL da imagem do desafio
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Desafio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   $ref: '#/components/schemas/Challenge'
 *                 steps:
 *                   type: array
 *                   description: Lista de passos criados
 *                   items:
 *                     $ref: '#/components/schemas/Step'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar desafio
 */

/**
 * @swagger
 * /challenges/{id}:
 *   patch:
 *     summary: Atualiza um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Desafio Atualizado"
 *               short_description:
 *                 type: string
 *                 example: "Descrição curta atualizada"
 *               long_description:
 *                 type: string
 *                 example: "Descrição longa atualizada"
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Desafio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao atualizar desafio
 */

/**
 * @swagger
 * /challenges/{id}/steps:
 *   get:
 *     summary: Obtém os passos de um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de passos do desafio
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id_step": 1,
 *                   "ref_id_step_video": 1,
 *                   "ref_id_step_bet": null,
 *                   "ref_id_step_view": null,
 *                   "ref_id_step_questionnaire": null,
 *                   "ref_id_challenges": 3,
 *                   "description": "Passo 1 do desafio",
 *                   "order": 1
 *                 },
 *                 {
 *                   "id_step": 2,
 *                   "ref_id_step_video": null,
 *                   "ref_id_step_bet": null,
 *                   "ref_id_step_view": 1,
 *                   "ref_id_step_questionnaire": null,
 *                   "ref_id_challenges": 3,
 *                   "description": "Passo 2 do desafio",
 *                   "order": 2
 *                 }
 *               ]
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao buscar passos
 */
/**
 * @swagger
 * /challenges/count:
 *   get:
 *     summary: Obtém a contagem total de desafios
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Contagem total de desafios
 *         content:
 *           application/json:
 *             example:
 *               count: 10
 *       500:
 *         description: Erro ao buscar a contagem de desafios
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to count challenges"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}:
 *   post:
 *     summary: Cria uma relação entre um utilizador e um desafio
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: Define se o desafio foi completado
 *                 example: false
 *               blocked:
 *                 type: boolean
 *                 description: Define se o desafio está bloqueado
 *                 example: true
 *               detail_seen:
 *                 type: boolean
 *                 description: Define se os detalhes do desafio foram visualizados
 *                 example: false
 *     responses:
 *       201:
 *         description: Relação criada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               ref_id_user: 1
 *               ref_id_challenge: 2
 *               completed: false
 *               blocked: true
 *               detail_seen: false
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required fields: completed, blocked, and detail_seen are required"
 *       404:
 *         description: Utilizador ou desafio não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       409:
 *         description: Relação já existente entre utilizador e desafio
 *         content:
 *           application/json:
 *             example:
 *               error: "This user already has this challenge assigned"
 *       500:
 *         description: Erro ao criar a relação
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to create user has challenge"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/unblock-next:
 *   post:
 *     summary: Desbloqueia o próximo desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio atual
 *         example: 2
 *     responses:
 *       200:
 *         description: Próximo desafio desbloqueado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               ref_id_user: 1
 *               ref_id_challenge: 3
 *               completed: false
 *               blocked: false
 *               detail_seen: false
 *       404:
 *         description: Desafio atual ou próximo desafio não encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "No next challenge found"
 *       500:
 *         description: Erro ao desbloquear o próximo desafio
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to unblock next challenge"
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}:
 *   patch:
 *     summary: Atualiza o campo detail_seen de um desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail_seen:
 *                 type: boolean
 *                 description: Define se os detalhes do desafio foram visualizados
 *                 example: true
 *     responses:
 *       200:
 *         description: Campo detail_seen atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_user: 1
 *               id_challenge: 2
 *               detail_seen: true
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar o campo detail_seen
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/progress:
 *   patch:
 *     summary: Atualiza a percentagem de progresso de um desafio para um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress_percentage:
 *                 type: number
 *                 description: Percentagem de progresso do desafio (0 a 100)
 *                 example: 75
 *     responses:
 *       200:
 *         description: Percentagem de progresso atualizada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id_user: 1
 *               id_challenge: 2
 *               progress_percentage: 75
 *       400:
 *         description: "Dados inválidos (ex.: percentagem fora do intervalo permitido)"
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar a percentagem de progresso
 */
/**
 * @swagger
 * /challenges/{id_user}/{id_challenge}/state:
 *   patch:
 *     summary: Atualiza o estado de um ou mais passos de um desafio e calcula a percentagem de progresso
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *       - in: path
 *         name: id_challenge
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ref_id_steps:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs dos passos a serem atualizados
 *                 example: [1, 2, 3]
 *               state:
 *                 type: integer
 *                 description: Novo estado dos passos (0 para incompleto, 1 para completo)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Estado dos passos e percentagem de progresso atualizados com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Step state updated successfully"
 *               progress_percentage: 100
 *               progress_response:
 *                 progress_percentage: 100
 *               updatedStep:
 *                 count: 3
 *       404:
 *         description: Relação entre utilizador e desafio não encontrada
 *       500:
 *         description: Erro ao atualizar o estado dos passos
 */
/**
 * @swagger
 * /challenges/{id}:
 *   delete:
 *     summary: Remove um desafio pelo ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do desafio
 *         example: 1
 *     responses:
 *       204:
 *         description: Desafio removido com sucesso
 *       404:
 *         description: Desafio não encontrado
 *       500:
 *         description: Erro ao remover desafio
 */

/**
 * @swagger
 * /challenges/completed/{id_user}:
 *   get:
 *     summary: Lista todos os desafios completos por um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 123
 *     responses:
 *       200:
 *         description: Lista de desafios completados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ref_id_user:
 *                     type: integer
 *                   ref_id_challenge:
 *                     type: integer
 *                   completed:
 *                     type: boolean
 *                   challenge:
 *                     type: object
 *                     description: Dados completos do desafio relacionado
 *       404:
 *         description: Utilizador não encontrado ou sem desafios completados
 *       500:
 *         description: Erro ao buscar desafios completados
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Challenges:
 *       type: object
 *       properties:
 *         id_challenge:
 *           type: integer
 *           description: ID do desafio
 *           example: 1
 *         number:
 *           type: integer
 *           description: Número do desafio
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome do desafio
 *           example: "Desafio 1"
 *         short_description:
 *           type: string
 *           description: Descrição curta do desafio
 *           example: "Descrição curta"
 *         long_description:
 *           type: string
 *           description: Descrição longa do desafio
 *           example: "Descrição longa"
 *         image:
 *           type: string
 *           description: URL da imagem do desafio
 *           example: "https://example.com/image.jpg"
 */

/**
 * @swagger
 * /challenges/in-progress/{id}:
 *   get:
 *     summary: Obtém o desafio em progresso de um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Dados do desafio em progresso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   $ref: '#/components/schemas/Challenge'
 *                 progress:
 *                   type: object
 *                   properties:
 *                     progress_percentage:
 *                       type: number
 *                       example: 75
 *                     detail_seen:
 *                       type: boolean
 *                       example: true
 *                 steps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DetailedStep'
 *       404:
 *         description: Nenhum desafio em progresso encontrado para este utilizador
 *       500:
 *         description: Erro ao ir buscar desafio em progresso
 */

/**
 * @swagger
 * /challenges/full:
 *   post:
 *     summary: Cria um desafio completo com todos os passos
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challenge:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Desafio Completo"
 *                   short_description:
 *                     type: string
 *                     example: "Descrição curta"
 *                   long_description:
 *                     type: string
 *                     example: "Descrição longa detalhada"
 *                   image:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [video, bet, view, questionnaire]
 *                       example: "video"
 *                     data:
 *                       type: object
 *                       properties:
 *                         video_url:
 *                           type: string
 *                           example: "https://example.com/video.mp4"
 *                         video_description:
 *                           type: string
 *                           example: "Descrição do vídeo"
 *                         bet_description:
 *                           type: string
 *                           example: "Descrição da aposta"
 *                         bet_json:
 *                           type: string
 *                           example: "{\"options\":[\"Opção 1\",\"Opção 2\"]}"
 *                         view_description:
 *                           type: string
 *                           example: "Descrição da visualização"
 *                         view_page:
 *                           type: string
 *                           example: "page_content_html"
 *                         questionnaire_description:
 *                           type: string
 *                           example: "Descrição do questionário"
 *                         questionnaire_json:
 *                           type: string
 *                           example: "{\"questions\":[{\"text\":\"Pergunta 1\",\"options\":[\"Opção 1\",\"Opção 2\"]}]}"
 *     responses:
 *       201:
 *         description: Desafio criado com sucesso com todos os passos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Challenge created successfully with all steps"
 *                 data:
 *                   type: object
 *                   properties:
 *                     challenge:
 *                       $ref: '#/components/schemas/Challenge'
 *                     steps:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Step'
 *       400:
 *         description: Dados inválidos 
 *       500:
 *         description: Erro ao criar desafio completo
 */


/**
 * @swagger
 * /challenges/user/{id_user}:
 *   get:
 *     summary: Obtém todos os desafios de um utilizador
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do utilizador
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de desafios do utilizador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ref_id_user:
 *                     type: integer
 *                     example: 1
 *                   ref_id_challenge:
 *                     type: integer
 *                     example: 3
 *                   completed:
 *                     type: boolean
 *                     example: false
 *                   blocked:
 *                     type: boolean
 *                     example: false
 *                   detail_seen:
 *                     type: boolean
 *                     example: true
 *                   progress_percentage:
 *                     type: number
 *                     example: 50
 *                   challenge:
 *                     $ref: '#/components/schemas/Challenge'
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro ao ir buscar desafios do utilizador
 */


/**
 * @swagger
 * /challenges/most-completed-today:
 *   get:
 *     summary: Obtém o desafio mais completado hoje
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Desafio mais completado hoje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mostCompleted:
 *                   type: object
 *                   $ref: '#/components/schemas/Challenge'
 *                   nullable: true
 *                 completionCount:
 *                   type: integer
 *                   example: 15
 *                   description: Número de vezes que o desafio foi completado hoje
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2023-11-15"
 *       500:
 *         description: Erro ao ir buscar desafio mais completado
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Step:
 *       type: object
 *       properties:
 *         id_step:
 *           type: integer
 *           description: ID do passo
 *           example: 1
 *         ref_id_step_video:
 *           type: integer
 *           description: ID do vídeo associado (se houver)
 *           example: 2
 *           nullable: true
 *         ref_id_step_bet:
 *           type: integer
 *           description: ID da aposta associada (se houver)
 *           example: null
 *           nullable: true
 *         ref_id_step_view:
 *           type: integer
 *           description: ID da visualização associada (se houver)
 *           example: null
 *           nullable: true
 *         ref_id_step_questionnaire:
 *           type: integer
 *           description: ID do questionário associado (se houver)
 *           example: null
 *           nullable: true
 *         ref_id_challenges:
 *           type: integer
 *           description: ID do desafio ao qual este passo pertence
 *           example: 1
 *     DetailedStep:
 *       type: object
 *       properties:
 *         ref_user_has_Challenges_id_user:
 *           type: integer
 *           example: 1
 *         ref_user_has_Challenges_id_challenge:
 *           type: integer
 *           example: 2
 *         ref_id_steps:
 *           type: integer
 *           example: 3
 *         state:
 *           type: integer
 *           description: Estado do passo (0 = incompleto, 1 = completo)
 *           example: 1
 *         step:
 *           type: object
 *           properties:
 *             id_step:
 *               type: integer
 *               example: 3
 *             ref_id_step_video:
 *               type: integer
 *               nullable: true
 *             ref_id_step_bet:
 *               type: integer
 *               nullable: true
 *             ref_id_step_view:
 *               type: integer
 *               nullable: true
 *             ref_id_step_questionnaire:
 *               type: integer
 *               nullable: true
 *             ref_id_challenges:
 *               type: integer
 *               example: 2
 *             Step_Video:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id_step_video:
 *                   type: integer
 *                 video_url:
 *                   type: string
 *                 video_description:
 *                   type: string
 *             Step_Bet:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id_step_bet:
 *                   type: integer
 *                 bet_description:
 *                   type: string
 *                 bet_json:
 *                   type: string
 *             Step_View:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id_step_view:
 *                   type: integer
 *                 view_description:
 *                   type: string
 *                 view_page:
 *                   type: string
 *             Step_Questionnaire:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id_step_questionnaire:
 *                   type: integer
 *                 questionnaire_description:
 *                   type: string
 *                 questionnaire_json:
 *                   type: string
 *     Challenge:
 *       type: object
 *       properties:
 *         id_challenge:
 *           type: integer
 *           description: ID do desafio
 *           example: 1
 *         number:
 *           type: integer
 *           description: Número do desafio
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome do desafio
 *           example: "Desafio 1"
 *         short_description:
 *           type: string
 *           description: Descrição curta do desafio
 *           example: "Descrição curta"
 *         long_description:
 *           type: string
 *           description: Descrição longa do desafio
 *           example: "Descrição longa detalhada do desafio"
 *         image:
 *           type: string
 *           description: URL da imagem do desafio
 *           example: "https://example.com/image.jpg"
 */





import express from "express";
import { ChallengesController } from "../controllers/challengesController";
import { requireAPIKey } from "../middleware/auth";
import { verifyJWT } from '../middleware/verifyJWT';
import authorize from '../middleware/authorize';

const router = express.Router();
const challengeController = new ChallengesController();

//GET METHOTHDS
// Get count of challenges
router.get("/count", requireAPIKey, verifyJWT, challengeController.countChallenges);

// Get all challenges
router.get("/", requireAPIKey, verifyJWT, challengeController.getAllChallenges);

// Get Count of challenges today
router.get("/count-today", requireAPIKey, verifyJWT, authorize('admin'), challengeController.getCountChallengesByDate);

// GET most completed challenge today
router.get("/most-completed-today", requireAPIKey, verifyJWT, authorize('admin'), challengeController.getMostCompletedChallengeToday);

// Get challenge by ID
router.get("/:id",  requireAPIKey, verifyJWT, challengeController.getChallengeById);

// Get steps by challenge ID
router.get("/:id/steps",  requireAPIKey, verifyJWT, challengeController.getStepsByChallengeId);

// Get Challenge in progress
router.get('/:id/in-progress',  requireAPIKey, verifyJWT, challengeController.getChallengeInProgress);
//POST METHOTDS

// Get all challenges by user ID
router.get("/user/:id_user",  requireAPIKey, verifyJWT, challengeController.getChallengeByUserId);

//get all challenges completed by user ID
router.get(
  "/completed/:id_user",
   requireAPIKey, verifyJWT,
  challengeController.getAllChallengesCompletedByUserId
);


// Create a new challenge
router.post("/", requireAPIKey, verifyJWT, authorize('admin'), challengeController.createChallenge);

//create full challenge
router.post("/full",  requireAPIKey, verifyJWT, authorize('admin'), challengeController.createFullChallenge);

//create user has challenge
router.post(
  "/:id_user/:id_challenge",  requireAPIKey, verifyJWT,
  challengeController.createUserHasChallenges
);



// umblock next challenge
router.post(
  "/:id_user/:id_challenge/unblock-next",
   requireAPIKey, verifyJWT,
  challengeController.unblockNextChallenge
);

//UPDATE METHOTDS

//update challenge by ID
router.patch("/:id",  requireAPIKey, verifyJWT, authorize('admin'), challengeController.updateChallengeById);

//update user has challenges detail_seen
router.patch(
  "/:id_user/:id_challenge",
   requireAPIKey, verifyJWT,
  challengeController.updateUserHasChallengesDetailSeen
);

//update user has challenges progress_percentage
//este vai fazer com que o umblock next challenge seja chamado
router.patch(
  "/:id_user/:id_challenge/progress",
   requireAPIKey, verifyJWT,
  challengeController.updateUserHasChallengesProgressPercentage
);

//update state dos challenges and update of progress_percentage  (aqui ter em atenção que recebe um array de steps- podemos atualizar o state de todos os steps de uma vez - depois de estarem todos ele vai puxar percentage atualize e se for 100 vai fazer o unblock next challenge)
router.patch(
  "/:id_user/:id_challenge/:id_step/state",
   requireAPIKey, verifyJWT,
  challengeController.updateUserHasStepState
);

//DELETE METHOTDS

//delete challenge by ID
router.delete("/:id",  requireAPIKey, verifyJWT, authorize('admin'), challengeController.deleteChallengeById);

export default router;
