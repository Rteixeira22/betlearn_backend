// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Iniciar seed da BD...");

    // Criar Admin
    const adminPassword = await bcrypt.hash("12345.qwert", 10);
    const admin = await prisma.admin.create({
      data: {
        name: "admin",
        email: "admin@ua.pt",
        username: "admin",
        password: adminPassword,
        image: null,
      },
    });
    console.log("Admin criado:", admin.username);

    // Criar Utilizadores
    const userPassword_1 = await bcrypt.hash("joao12345", 10);
    const userPassword_2 = await bcrypt.hash("maria12345", 10);
    const userPassword_3 = await bcrypt.hash("pedro12345", 10);

    const users = await Promise.all([
      prisma.users.create({
        data: {
          name: "João Silva",
          email: "joao@ua.pt",
          username: "joaosilva",
          birthdate: new Date("1990-05-15"),
          money: 1200.5,
          points: 250,
          image:
            "https://cdn.pixabay.com/photo/2016/11/29/12/52/face-1869641_960_720.jpg",
          bets_visibility: true,
          tutorial_verification: true,
          password: userPassword_1,
          has_accepted_terms: true,
        },
      }),
      prisma.users.create({
        data: {
          name: "Maria Santos",
          email: "maria@ua.pt",
          username: "mariasantos",
          birthdate: new Date("1988-10-22"),
          money: 300.75,
          points: 320,
          image:
            "https://cdn.pixabay.com/photo/2018/01/03/19/54/fashion-3059143_960_720.jpg",
          bets_visibility: true,
          tutorial_verification: true,
          password: userPassword_2,
          has_accepted_terms: true,
        },
      }),
      prisma.users.create({
        data: {
          name: "Pedro Costa",
          email: "pedro@ua.pt",
          username: "pedrocosta",
          birthdate: new Date("1995-03-10"),
          money: 750.25,
          points: 120,
          image:
            "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_960_720.jpg",
          bets_visibility: false,
          tutorial_verification: false,
          password: userPassword_3,
          has_accepted_terms: true,
        },
      }),
    ]);
    console.log("Utilizadores criados:", users.length);

    // Criar Resposta de Questionários para cada utilizador
    const questionnaireResponses = await Promise.all(
      users.map((user, index) => {
        return prisma.questionnaire_Response.create({
          data: {
            budget: (1000 + index * 500).toFixed(2),
            verification: index < 2,
            salary: 2000 + index * 500,
            expenses: 1000 + index * 200,
            available_amount: 1000 + index * 300,
            debt: index + 1,
            debt_monthly: (200 + index * 100).toFixed(2),
            income_source: index + 1,
            ref_id_user: user.id_user,
          },
        });
      })
    );
    console.log("Questionários criados:", questionnaireResponses.length);

    // Criar Desafios
    const challenges = await Promise.all([
      prisma.challenges.create({
        data: {
          number: 1,
          name: "Navegação",
          short_description: "Descubra como navegar na plataforma",
          long_description:
            "Este desafio é uma introdução à plataforma, ensina como navegar e utilizar as principais funcionalidades disponíveis.",
          image: "https://res.cloudinary.com/dw3aj5xgm/image/upload/v1748471464/9746403_w0o9p8.png",
        },
      }),
      prisma.challenges.create({
        data: {
          number: 2,
          name: "Gestão de Banca e Emocional",
          short_description: "Aprenda a gerir sua banca e emoções",
          long_description:
            "Este desafio foca na importância da gestão de banca e emocional ao fazer apostas. Aprenda a controlar as suas emoções e a tomar decisões racionais.",
          image: "https://res.cloudinary.com/dw3aj5xgm/image/upload/v1748471606/4838640_lzve8c.png",
        },
      }),
      prisma.challenges.create({
        data: {
          number: 3,
          name: "O que sao Odds?",
          short_description: "Entenda o que são odds e como funcionam",
          long_description:
            "Neste desafio, você aprenderá o que são odds, como funcionam e como utilizá-las a seu favor nas apostas.",
          image: "https://res.cloudinary.com/dw3aj5xgm/image/upload/v1748465719/challenge2_yfhsme.png",
        },
      }),

      prisma.challenges.create({
        data: {
          number: 4,
          name: "Aposta Simples",
          short_description: "Aposte num evento simples",
          long_description:
            "Neste desafio, aprenderá a fazer uma aposta simples num evento desportivo. Aprenda a escolher o evento certo e a calcular as suas odds.",
          image: "https://res.cloudinary.com/dw3aj5xgm/image/upload/v1748471810/8959073_qa8fqk.png",
        },
      }),
    ]);
    console.log("Desafios criados:", challenges.length);

    // Criar Steps para os Desafios
    // Primeiro, criar os tipos específicos de Steps

    const stepVideos = await Promise.all([
      prisma.step_Video.create({
        data: {
          video_url: "https://www.youtube.com/watch?v=oOrLdaEgqsU",
          video_description: "Observar o video de Navegação na plataforma",
        },
      }),
      prisma.step_Video.create({
        data: {
          video_url: "https://www.youtube.com/watch?v=KLb6vuO_UW4",
          video_description: "Gestão de banca e emocional",
        },
      }),
      prisma.step_Video.create({
        data: {
          video_url: "https://www.youtube.com/watch?v=FFqhv7zuoN0",
          video_description: "O que são odds?",
        },
      }),
      prisma.step_Video.create({
        data: {
          video_url: "https://www.youtube.com/watch?v=lw1oPDARuaQ",
          video_description: "Aprenda a fazer uma aposta simples",
        },
      }),
    ]);

    console.log("Videos criados:", stepVideos.length);

    const stepBet = await prisma.step_Bet.create({
      data: {
        bet_description: "Faça sua primeira aposta controlada",
      },
    });

    const stepQuestionnaire = await prisma.step_Questionnaire.create({
      data: {
        questionnaire_description: "Avalie seu conhecimento sobre apostas",
        questionnaire_json: JSON.stringify({
          question: "O que significam odds decimais de 2.00 nas apostas?",
          options: [
            "Você duplica o valor apostado se ganhar",
            "Você perde metade do valor apostado",
            "Você triplica o valor apostado se ganhar",
            "Você perde todo o valor apostado",
          ],
          correctAnswer: "Você duplica o valor apostado se ganhar",
        }),
      },
    });

    const stepView = await prisma.step_View.create({
      data: {
        view_description: "Veja o histórico de apostas ",
        view_page: "/historico",
      },
    });

    // Agora criar os Steps e associá-los aos desafios
    const steps = await Promise.all([
      // Steps para o primeiro desafio_ Navegação
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideos[0].id_step_video,
          ref_id_challenges: challenges[0].id_challenge,
        },
      }),
      prisma.steps.create({
        data: {
          ref_id_step_view: stepView.id_step_view,
          ref_id_challenges: challenges[0].id_challenge,
        },
      }),
      // Steps para o segundo desafio_gestão de banca e emocional
      prisma.steps.create({
        data: {
          ref_id_step_questionnaire: stepQuestionnaire.id_step_questionnaire,
          ref_id_challenges: challenges[1].id_challenge,
        },
      }),
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideos[1].id_step_video,
          ref_id_challenges: challenges[1].id_challenge,
        },
      }),
      // Steps para o terceiro desafio_ o que são odds?
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideos[2].id_step_video,
          ref_id_challenges: challenges[2].id_challenge,
        },
      }),
      prisma.steps.create({
        data: {
          ref_id_step_questionnaire: stepQuestionnaire.id_step_questionnaire,
          ref_id_challenges: challenges[2].id_challenge,
        },
      }),
      // Steps para o quarto desafio_ aposta simples
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideos[3].id_step_video,
          ref_id_challenges: challenges[3].id_challenge,
        },
      }),
      prisma.steps.create({
        data: {
          ref_id_step_bet: stepBet.id_step_bet,
          ref_id_challenges: challenges[3].id_challenge,
        },
      }),
    ]);
    console.log("Steps criados e associados aos challenges:", steps.length);

    // Associar Utilizadores a Desafios
    const userChallenges = await Promise.all([
      // Associar primeiro utilizador ao primeiro desafio
      prisma.user_has_Challenges.create({
        data: {
          ref_id_user: users[0].id_user,
          ref_id_challenge: challenges[0].id_challenge,
          completed: false,
          blocked: false,
          detail_seen: true,
          progress_percentage: 50,
        },
      }),
      // Associar segundo utilizador ao primeiro desafio
      prisma.user_has_Challenges.create({
        data: {
          ref_id_user: users[1].id_user,
          ref_id_challenge: challenges[0].id_challenge,
          completed: false,
          blocked: false,
          detail_seen: true,
          progress_percentage: 50,
        },
      }),
      // Associar terceiro utilizador ao primeiro desafio
      prisma.user_has_Challenges.create({
        data: {
          ref_id_user: users[2].id_user,
          ref_id_challenge: challenges[0].id_challenge,
          completed: false,
          blocked: false,
          detail_seen: false,
          progress_percentage: 0,
        },
      }),
    ]);
    console.log(
      "Associações de utilizadores com desafios criados:",
      userChallenges.length
    );

    // Associar utilizador-desafio-steps
    await Promise.all([
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[0].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[0].id_step,
          state: 1, // Completo
        },
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[0].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[1].id_step,
          state: 0, // Em progresso
        },
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[1].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[0].id_step,
          state: 1, // Completo
        },
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[1].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[1].id_step,
          state: 0, // Em progresso
        },
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[2].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[0].id_step,
          state: 0, // Em progresso
        },
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[2].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[1].id_step,
          state: 0, // Em progresso
        },
      }),
    ]);
    console.log("Associações de passos com utilizadores e desafios criadas");

    // Criar campeonatos
    // Criar campeonatos
    const championships = await Promise.all([
      prisma.championship.create({
        data: {
          json: JSON.stringify({
            championship_id: "FC-2025",
            championship_name: "Liga Fictícia de Ouro",
            round: 14,
            generated_at: "2025-04-07",
            classification: [
              {
                position: 1,
                team: "Atlético Solaris",
                points: 34,
                wins: 11,
                draws: 1,
                losts: 2,
                goals_for: 29,
                goals_against: 10,
                goals_difference: 19,
              },
              {
                position: 2,
                team: "Tempestade Azul",
                points: 31,
                wins: 10,
                draws: 1,
                losts: 3,
                goals_for: 27,
                goals_against: 13,
                goals_difference: 14,
              },
              {
                position: 3,
                team: "Vulcânicos FC",
                points: 29,
                wins: 9,
                draws: 2,
                losts: 3,
                goals_for: 26,
                goals_against: 15,
                goals_difference: 11,
              },
              {
                position: 4,
                team: "Leões de Prata",
                points: 26,
                wins: 8,
                draws: 2,
                losts: 4,
                goals_for: 24,
                goals_against: 16,
                goals_difference: 8,
              },
              {
                position: 5,
                team: "Estrela do Norte",
                points: 24,
                wins: 7,
                draws: 3,
                losts: 4,
                goals_for: 22,
                goals_against: 18,
                goals_difference: 4,
              },
              {
                position: 6,
                team: "Dragões do Vale",
                points: 22,
                wins: 6,
                draws: 4,
                losts: 4,
                goals_for: 20,
                goals_against: 17,
                goals_difference: 3,
              },
              {
                position: 7,
                team: "Falcões Rubros",
                points: 21,
                wins: 6,
                draws: 3,
                losts: 5,
                goals_for: 19,
                goals_against: 17,
                goals_difference: 2,
              },
              {
                position: 8,
                team: "Maré Alta FC",
                points: 19,
                wins: 5,
                draws: 4,
                losts: 5,
                goals_for: 17,
                goals_against: 18,
                goals_difference: -1,
              },
              {
                position: 9,
                team: "Raios de Aço",
                points: 17,
                wins: 5,
                draws: 2,
                losts: 7,
                goals_for: 16,
                goals_against: 20,
                goals_difference: -4,
              },
              {
                position: 10,
                team: "Cavaleiros do Sul",
                points: 16,
                wins: 4,
                draws: 4,
                losts: 6,
                goals_for: 15,
                goals_against: 20,
                goals_difference: -5,
              },
              {
                position: 11,
                team: "Lobos da Serra",
                points: 15,
                wins: 4,
                draws: 3,
                losts: 7,
                goals_for: 14,
                goals_against: 21,
                goals_difference: -7,
              },
              {
                position: 12,
                team: "Real Aurora",
                points: 14,
                wins: 3,
                draws: 5,
                losts: 6,
                goals_for: 13,
                goals_against: 20,
                goals_difference: -7,
              },
              {
                position: 13,
                team: "Troncos Verdes",
                points: 13,
                wins: 3,
                draws: 4,
                losts: 7,
                goals_for: 12,
                goals_against: 22,
                goals_difference: -10,
              },
              {
                position: 14,
                team: "Montanha FC",
                points: 12,
                wins: 3,
                draws: 3,
                losts: 8,
                goals_for: 11,
                goals_against: 23,
                goals_difference: -12,
              },
              {
                position: 15,
                team: "Lendas Urbanas",
                points: 11,
                wins: 2,
                draws: 5,
                losts: 7,
                goals_for: 10,
                goals_against: 22,
                goals_difference: -12,
              },
              {
                position: 16,
                team: "Pioneiros FC",
                points: 10,
                wins: 2,
                draws: 4,
                losts: 8,
                goals_for: 9,
                goals_against: 24,
                goals_difference: -15,
              },
              {
                position: 17,
                team: "Meteoros do Sul",
                points: 8,
                wins: 2,
                draws: 2,
                losts: 10,
                goals_for: 8,
                goals_against: 26,
                goals_difference: -18,
              },
              {
                position: 18,
                team: "Império Sombrio",
                points: 6,
                wins: 1,
                draws: 3,
                losts: 10,
                goals_for: 7,
                goals_against: 28,
                goals_difference: -21,
              },
            ],
            games: [
              {
                id: 1,
                local_team: "Atlético Solaris",
                visitor_team: "Império Sombrio",
                odds: { 1: 1.25, 2: 9.5, x: 5 },
                goals_local_team: 3,
                goals_visitor_team: 0,
                schedule: "15:00",
              },
              {
                id: 2,
                local_team: "Tempestade Azul",
                visitor_team: "Meteoros do Sul",
                odds: { 1: 1.35, 2: 8, x: 4.4 },
                goals_local_team: 2,
                goals_visitor_team: 0,
                schedule: "17:00",
              },
              {
                id: 3,
                local_team: "Vulcânicos FC",
                visitor_team: "Pioneiros FC",
                odds: { 1: 1.4, 2: 7.5, x: 4.2 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "19:00",
              },
              {
                id: 4,
                local_team: "Leões de Prata",
                visitor_team: "Lendas Urbanas",
                odds: { 1: 1.7, 2: 5.25, x: 3.6 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "16:30",
              },
              {
                id: 5,
                local_team: "Estrela do Norte",
                visitor_team: "Montanha FC",
                odds: { 1: 1.85, 2: 4.5, x: 3.3 },
                goals_local_team: 1,
                goals_visitor_team: 0,
                schedule: "18:45",
              },
              {
                id: 6,
                local_team: "Dragões do Vale",
                visitor_team: "Troncos Verdes",
                odds: { 1: 2, 2: 3.8, x: 3.2 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "14:00",
              },
              {
                id: 7,
                local_team: "Falcões Rubros",
                visitor_team: "Real Aurora",
                odds: { 1: 2.1, 2: 3.6, x: 3.1 },
                goals_local_team: 0,
                goals_visitor_team: 1,
                schedule: "20:00",
              },
              {
                id: 8,
                local_team: "Maré Alta FC",
                visitor_team: "Lobos da Serra",
                odds: { 1: 2.25, 2: 3.4, x: 3 },
                goals_local_team: 2,
                goals_visitor_team: 2,
                schedule: "13:30",
              },
              {
                id: 9,
                local_team: "Raios de Aço",
                visitor_team: "Cavaleiros do Sul",
                odds: { 1: 2.5, 2: 3, x: 2.9 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "21:15",
              },
            ],
          }),
        },
      }),
      prisma.championship.create({
        data: {
          json: JSON.stringify({
            championship_id: "LX-0912",
            championship_name: "Super Liga Lendária",
            round: 21,
            generated_at: "2025-04-07",
            classification: [
              {
                position: 1,
                team: "Fúria Boreal",
                points: 47,
                wins: 15,
                draws: 2,
                losts: 3,
                goals_for: 41,
                goals_against: 18,
                goals_difference: 23,
              },
              {
                position: 2,
                team: "Titãs do Mar",
                points: 44,
                wins: 14,
                draws: 2,
                losts: 4,
                goals_for: 39,
                goals_against: 21,
                goals_difference: 18,
              },
              {
                position: 3,
                team: "Relâmpago Azul",
                points: 42,
                wins: 13,
                draws: 3,
                losts: 4,
                goals_for: 37,
                goals_against: 22,
                goals_difference: 15,
              },
              {
                position: 4,
                team: "Águias Imperiais",
                points: 38,
                wins: 12,
                draws: 2,
                losts: 6,
                goals_for: 33,
                goals_against: 24,
                goals_difference: 9,
              },
              {
                position: 5,
                team: "Búfalos de Prata",
                points: 36,
                wins: 11,
                draws: 3,
                losts: 6,
                goals_for: 31,
                goals_against: 23,
                goals_difference: 8,
              },
              {
                position: 6,
                team: "Falcões do Oeste",
                points: 34,
                wins: 10,
                draws: 4,
                losts: 6,
                goals_for: 30,
                goals_against: 25,
                goals_difference: 5,
              },
              {
                position: 7,
                team: "Corvos Noturnos",
                points: 30,
                wins: 9,
                draws: 3,
                losts: 7,
                goals_for: 28,
                goals_against: 26,
                goals_difference: 2,
              },
              {
                position: 8,
                team: "Estrela do Deserto",
                points: 28,
                wins: 8,
                draws: 4,
                losts: 7,
                goals_for: 26,
                goals_against: 27,
                goals_difference: -1,
              },
              {
                position: 9,
                team: "Tempestade Negra",
                points: 27,
                wins: 8,
                draws: 3,
                losts: 8,
                goals_for: 25,
                goals_against: 27,
                goals_difference: -2,
              },
              {
                position: 10,
                team: "Gladiadores do Norte",
                points: 25,
                wins: 7,
                draws: 4,
                losts: 8,
                goals_for: 23,
                goals_against: 28,
                goals_difference: -5,
              },
              {
                position: 11,
                team: "Lobos do Crepúsculo",
                points: 23,
                wins: 6,
                draws: 5,
                losts: 8,
                goals_for: 22,
                goals_against: 29,
                goals_difference: -7,
              },
              {
                position: 12,
                team: "Tribo Celeste",
                points: 21,
                wins: 6,
                draws: 3,
                losts: 10,
                goals_for: 21,
                goals_against: 30,
                goals_difference: -9,
              },
              {
                position: 13,
                team: "Dracos de Ferro",
                points: 20,
                wins: 5,
                draws: 5,
                losts: 9,
                goals_for: 20,
                goals_against: 31,
                goals_difference: -11,
              },
              {
                position: 14,
                team: "Cometas do Sul",
                points: 18,
                wins: 5,
                draws: 3,
                losts: 11,
                goals_for: 18,
                goals_against: 32,
                goals_difference: -14,
              },
              {
                position: 15,
                team: "Fúria do Leste",
                points: 17,
                wins: 4,
                draws: 5,
                losts: 10,
                goals_for: 17,
                goals_against: 33,
                goals_difference: -16,
              },
              {
                position: 16,
                team: "Cavaleiros da Névoa",
                points: 15,
                wins: 4,
                draws: 3,
                losts: 12,
                goals_for: 15,
                goals_against: 34,
                goals_difference: -19,
              },
              {
                position: 17,
                team: "Sentinelas do Vento",
                points: 13,
                wins: 3,
                draws: 4,
                losts: 12,
                goals_for: 14,
                goals_against: 36,
                goals_difference: -22,
              },
              {
                position: 18,
                team: "Ordem Carmesim",
                points: 11,
                wins: 2,
                draws: 5,
                losts: 12,
                goals_for: 13,
                goals_against: 38,
                goals_difference: -25,
              },
            ],
            games: [
              {
                id: 1,
                local_team: "Fúria Boreal",
                visitor_team: "Ordem Carmesim",
                odds: { 1: 1.2, 2: 10, x: 5.2 },
                goals_local_team: 3,
                goals_visitor_team: 0,
                schedule: "15:00",
              },
              {
                id: 2,
                local_team: "Titãs do Mar",
                visitor_team: "Sentinelas do Vento",
                odds: { 1: 1.3, 2: 8.2, x: 4.6 },
                goals_local_team: 2,
                goals_visitor_team: 0,
                schedule: "17:00",
              },
              {
                id: 3,
                local_team: "Relâmpago Azul",
                visitor_team: "Cavaleiros da Névoa",
                odds: { 1: 1.35, 2: 7.5, x: 4.3 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "18:30",
              },
              {
                id: 4,
                local_team: "Águias Imperiais",
                visitor_team: "Fúria do Leste",
                odds: { 1: 1.5, 2: 6, x: 3.8 },
                goals_local_team: 2,
                goals_visitor_team: 0,
                schedule: "20:00",
              },
              {
                id: 5,
                local_team: "Búfalos de Prata",
                visitor_team: "Cometas do Sul",
                odds: { 1: 1.65, 2: 5, x: 3.5 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "14:00",
              },
              {
                id: 6,
                local_team: "Falcões do Oeste",
                visitor_team: "Dracos de Ferro",
                odds: { 1: 1.75, 2: 4.4, x: 3.3 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "19:00",
              },
              {
                id: 7,
                local_team: "Corvos Noturnos",
                visitor_team: "Tribo Celeste",
                odds: { 1: 1.95, 2: 3.9, x: 3.2 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "16:00",
              },
              {
                id: 8,
                local_team: "Estrela do Deserto",
                visitor_team: "Lobos do Crepúsculo",
                odds: { 1: 2.1, 2: 3.6, x: 3.1 },
                goals_local_team: 0,
                goals_visitor_team: 1,
                schedule: "13:30",
              },
              {
                id: 9,
                local_team: "Tempestade Negra",
                visitor_team: "Gladiadores do Norte",
                odds: { 1: 2.3, 2: 3.3, x: 3 },
                goals_local_team: 1,
                goals_visitor_team: 2,
                schedule: "21:15",
              },
            ],
          }),
        },
      }),
      prisma.championship.create({
        data: {
          json: JSON.stringify({
            championship_id: "4",
            championship_name: "Liga Estelar",
            round: 14,
            generated_at: "2025-04-11",
            classification: [
              {
                position: 1,
                team: "Astro FC",
                points: 34,
                wins: 11,
                draws: 1,
                losts: 2,
                goals_for: 29,
                goals_against: 12,
                goals_difference: 17,
                total_matches: 14,
                form: ["V", "V", "E", "V", "V"],
              },
              {
                position: 2,
                team: "Cometa Azul",
                points: 30,
                wins: 9,
                draws: 3,
                losts: 2,
                goals_for: 25,
                goals_against: 14,
                goals_difference: 11,
                total_matches: 14,
                form: ["V", "V", "V", "D", "E"],
              },
              {
                position: 3,
                team: "Meteoros Unidos",
                points: 28,
                wins: 8,
                draws: 4,
                losts: 2,
                goals_for: 22,
                goals_against: 15,
                goals_difference: 7,
                total_matches: 14,
                form: ["E", "V", "E", "V", "V"],
              },
              {
                position: 4,
                team: "Orion FC",
                points: 26,
                wins: 8,
                draws: 2,
                losts: 4,
                goals_for: 20,
                goals_against: 17,
                goals_difference: 3,
                total_matches: 14,
                form: ["D", "V", "V", "D", "V"],
              },
              {
                position: 5,
                team: "Planeta 9",
                points: 24,
                wins: 7,
                draws: 3,
                losts: 4,
                goals_for: 21,
                goals_against: 18,
                goals_difference: 3,
                total_matches: 14,
                form: ["E", "V", "D", "V", "V"],
              },
              {
                position: 6,
                team: "Galáxia Norte",
                points: 22,
                wins: 6,
                draws: 4,
                losts: 4,
                goals_for: 18,
                goals_against: 16,
                goals_difference: 2,
                total_matches: 14,
                form: ["V", "E", "D", "V", "D"],
              },
              {
                position: 7,
                team: "Vórtice FC",
                points: 21,
                wins: 6,
                draws: 3,
                losts: 5,
                goals_for: 20,
                goals_against: 20,
                goals_difference: 0,
                total_matches: 14,
                form: ["E", "V", "D", "E", "V"],
              },
              {
                position: 8,
                team: "Nebulosa FC",
                points: 19,
                wins: 5,
                draws: 4,
                losts: 5,
                goals_for: 17,
                goals_against: 18,
                goals_difference: -1,
                total_matches: 14,
                form: ["D", "E", "V", "D", "V"],
              },
              {
                position: 9,
                team: "Estrelas do Sul",
                points: 18,
                wins: 5,
                draws: 3,
                losts: 6,
                goals_for: 16,
                goals_against: 19,
                goals_difference: -3,
                total_matches: 14,
                form: ["V", "D", "E", "V", "D"],
              },
              {
                position: 10,
                team: "Satélite FC",
                points: 17,
                wins: 5,
                draws: 2,
                losts: 7,
                goals_for: 15,
                goals_against: 21,
                goals_difference: -6,
                total_matches: 14,
                form: ["D", "V", "D", "E", "D"],
              },
              {
                position: 11,
                team: "Aurora Boreal",
                points: 16,
                wins: 4,
                draws: 4,
                losts: 6,
                goals_for: 14,
                goals_against: 20,
                goals_difference: -6,
                total_matches: 14,
                form: ["V", "E", "D", "D", "E"],
              },
              {
                position: 12,
                team: "Explosão Solar",
                points: 15,
                wins: 4,
                draws: 3,
                losts: 7,
                goals_for: 13,
                goals_against: 19,
                goals_difference: -6,
                total_matches: 14,
                form: ["D", "D", "V", "V", "D"],
              },
              {
                position: 13,
                team: "Buraco Negro",
                points: 14,
                wins: 4,
                draws: 2,
                losts: 8,
                goals_for: 12,
                goals_against: 21,
                goals_difference: -9,
                total_matches: 14,
                form: ["V", "D", "D", "D", "E"],
              },
              {
                position: 14,
                team: "Raios Cósmicos",
                points: 13,
                wins: 3,
                draws: 4,
                losts: 7,
                goals_for: 12,
                goals_against: 23,
                goals_difference: -11,
                total_matches: 14,
                form: ["E", "E", "D", "D", "V"],
              },
              {
                position: 15,
                team: "Andrômeda FC",
                points: 12,
                wins: 3,
                draws: 3,
                losts: 8,
                goals_for: 10,
                goals_against: 24,
                goals_difference: -14,
                total_matches: 14,
                form: ["D", "V", "D", "E", "D"],
              },
              {
                position: 16,
                team: "Zona Alfa",
                points: 11,
                wins: 2,
                draws: 5,
                losts: 7,
                goals_for: 11,
                goals_against: 26,
                goals_difference: -15,
                total_matches: 14,
                form: ["E", "D", "E", "D", "D"],
              },
              {
                position: 17,
                team: "Cosmos Antares",
                points: 10,
                wins: 2,
                draws: 4,
                losts: 8,
                goals_for: 10,
                goals_against: 27,
                goals_difference: -17,
                total_matches: 14,
                form: ["D", "E", "D", "V", "D"],
              },
              {
                position: 18,
                team: "Núcleo FC",
                points: 9,
                wins: 2,
                draws: 3,
                losts: 9,
                goals_for: 9,
                goals_against: 28,
                goals_difference: -19,
                total_matches: 14,
                form: ["D", "D", "E", "D", "D"],
              },
            ],
            games: [
              {
                id: 1,
                local_team: "Astro FC",
                visitor_team: "Núcleo FC",
                odds: { 1: 1.25, 2: 7, x: 4.75 },
                goals_local_team: 3,
                goals_visitor_team: 0,
                schedule: "15:00",
              },
              {
                id: 2,
                local_team: "Cometa Azul",
                visitor_team: "Cosmos Antares",
                odds: { 1: 1.4, 2: 6, x: 4.2 },
                goals_local_team: 2,
                goals_visitor_team: 0,
                schedule: "17:00",
              },
              {
                id: 3,
                local_team: "Meteoros Unidos",
                visitor_team: "Zona Alfa",
                odds: { 1: 1.65, 2: 5.5, x: 3.6 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "19:00",
              },
              {
                id: 4,
                local_team: "Orion FC",
                visitor_team: "Andrômeda FC",
                odds: { 1: 1.7, 2: 4.8, x: 3.4 },
                goals_local_team: 1,
                goals_visitor_team: 0,
                schedule: "14:00",
              },
              {
                id: 5,
                local_team: "Planeta 9",
                visitor_team: "Raios Cósmicos",
                odds: { 1: 1.95, 2: 3.8, x: 3.3 },
                goals_local_team: 2,
                goals_visitor_team: 2,
                schedule: "16:00",
              },
              {
                id: 6,
                local_team: "Galáxia Norte",
                visitor_team: "Buraco Negro",
                odds: { 1: 2.1, 2: 3.5, x: 3.2 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "18:00",
              },
              {
                id: 7,
                local_team: "Vórtice FC",
                visitor_team: "Explosão Solar",
                odds: { 1: 1.9, 2: 4, x: 3.4 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "13:00",
              },
              {
                id: 8,
                local_team: "Nebulosa FC",
                visitor_team: "Aurora Boreal",
                odds: { 1: 2.2, 2: 3.3, x: 3.1 },
                goals_local_team: 1,
                goals_visitor_team: 1,
                schedule: "20:00",
              },
              {
                id: 9,
                local_team: "Estrelas do Sul",
                visitor_team: "Satélite FC",
                odds: { 1: 2.1, 2: 3.2, x: 3.3 },
                goals_local_team: 2,
                goals_visitor_team: 1,
                schedule: "21:00",
              },
            ],
          }),
        },
      }),
    ]);
    console.log("Campeonatos criados:", championships.length);

    // Criar dicas
    await Promise.all([
      prisma.tips.create({
        data: {
          tip: "Estabeleça um orçamento para apostas e cumpra-o.",
          active: 0,
        },
      }),
      prisma.tips.create({
        data: {
          tip: "Pesquise bem antes de apostar em qualquer jogo.",
          active: 0,
        },
      }),
      prisma.tips.create({
        data: {
          tip: "Nunca aposte mais do que pode perder.",
          active: 0,
        },
      }),
      prisma.tips.create({
        data: {
          tip: "Apostas múltiplas têm risco maior, mas retorno potencial maior.",
          active: 0,
        },
      }),
      prisma.tips.create({
        data: {
          tip: "Mantenha um registro de todas as suas apostas.",
          active: 1,
        },
      }),
    ]);
    console.log("Dicas criadas");

    console.log("Seed completo com sucesso!");
  } catch (error) {
    console.error("Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
