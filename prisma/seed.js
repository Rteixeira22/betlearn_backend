// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // Criando Admin
    const adminPassword = await bcrypt.hash('12345.qwert', 10);
    const admin = await prisma.admin.create({
      data: {
        name: 'admin',
        email: 'admin@example.com',
        username: 'admin',
        password: adminPassword,
        image: '/images/admin/profile.jpg'
      }
    });
    console.log('Admin criado:', admin.username);

    // Criando Utilizadores
    const userPassword = await bcrypt.hash('password123', 10);
    
    const users = await Promise.all([
      prisma.users.create({
        data: {
          name: 'João Silva',
          email: 'joao@example.com',
          username: 'joaosilva',
          birthdate: new Date('1990-05-15'),
          money: 1500.50,
          points: 250,
          image: '/images/users/joao.jpg',
          bets_visibility: true,
          tutorial_verification: true,
          password: userPassword
        }
      }),
      prisma.users.create({
        data: {
          name: 'Maria Santos',
          email: 'maria@example.com',
          username: 'mariasantos',
          birthdate: new Date('1988-10-22'),
          money: 2300.75,
          points: 320,
          image: '/images/users/maria.jpg',
          bets_visibility: true,
          tutorial_verification: true,
          password: userPassword
        }
      }),
      prisma.users.create({
        data: {
          name: 'Pedro Costa',
          email: 'pedro@example.com',
          username: 'pedrocosta',
          birthdate: new Date('1995-03-10'),
          money: 750.25,
          points: 120,
          image: '/images/users/pedro.jpg',
          bets_visibility: false,
          tutorial_verification: false,
          password: userPassword
        }
      })
    ]);
    console.log('Utilizadores criados:', users.length);

    // Criando Questionários de Resposta para cada utilizador
    const questionnaireResponses = await Promise.all(users.map((user, index) => {
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
          ref_id_user: user.id_user
        }
      });
    }));
    console.log('Questionários criados:', questionnaireResponses.length);

    // Criando Desafios
    const challenges = await Promise.all([
      prisma.challenges.create({
        data: {
          number: 1,
          name: 'Gerenciamento Financeiro',
          short_description: 'Aprenda a gerenciar seu orçamento de apostas',
          long_description: 'Este desafio visa ensinar como gerenciar efetivamente seu orçamento para apostas esportivas, estabelecendo limites e estratégias para maximizar ganhos e minimizar perdas.',
          image: '/images/challenges/financial.jpg'
        }
      }),
      prisma.challenges.create({
        data: {
          number: 2,
          name: 'Apostas Inteligentes',
          short_description: 'Estratégias para apostas com maior probabilidade de sucesso',
          long_description: 'Aprenda técnicas avançadas para identificar oportunidades de apostas com valor, analisando estatísticas e tendências para tomar decisões mais informadas.',
          image: '/images/challenges/smart-betting.jpg'
        }
      }),
      prisma.challenges.create({
        data: {
          number: 3,
          name: 'Análise de Mercados',
          short_description: 'Como analisar diferentes mercados de apostas',
          long_description: 'Este desafio ensina como analisar diferentes tipos de mercados de apostas, entendendo as nuances de cada um e como explorar oportunidades específicas em cada contexto.',
          image: '/images/challenges/market-analysis.jpg'
        }
      })
    ]);
    console.log('Desafios criados:', challenges.length);

    // Criando Steps para os Desafios
    // Primeiro, criar os tipos específicos de Steps
    const stepVideo = await prisma.step_Video.create({
      data: {
        video_url: 'https://example.com/videos/intro.mp4',
        video_description: 'Introdução ao gerenciamento financeiro'
      }
    });

    const stepBet = await prisma.step_Bet.create({
      data: {
        bet_description: 'Faça sua primeira aposta controlada',
        bet_json: '{"type":"single","minOdds":1.5,"maxAmount":100}'
      }
    });

    const stepQuestionnaire = await prisma.step_Questionnaire.create({
      data: {
        questionnaire_description: 'Avalie seu conhecimento sobre apostas',
        questionnaire_json: '{"questions":5,"passingScore":70}'
      }
    });

    const stepView = await prisma.step_View.create({
      data: {
        view_description: 'Revise o histórico de apostas',
        view_page: '/history'
      }
    });

    // Agora criar os Steps e associá-los aos desafios
    const steps = await Promise.all([
      // Steps para o primeiro desafio
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideo.id_step_video,
          ref_id_challenges: challenges[0].id_challenge
        }
      }),
      prisma.steps.create({
        data: {
          ref_id_step_questionnaire: stepQuestionnaire.id_step_questionnaire,
          ref_id_challenges: challenges[0].id_challenge
        }
      }),
      // Steps para o segundo desafio
      prisma.steps.create({
        data: {
          ref_id_step_bet: stepBet.id_step_bet,
          ref_id_challenges: challenges[1].id_challenge
        }
      }),
      prisma.steps.create({
        data: {
          ref_id_step_view: stepView.id_step_view,
          ref_id_challenges: challenges[1].id_challenge
        }
      }),
      // Steps para o terceiro desafio
      prisma.steps.create({
        data: {
          ref_id_step_video: stepVideo.id_step_video,
          ref_id_challenges: challenges[2].id_challenge
        }
      }),
      prisma.steps.create({
        data: {
          ref_id_step_bet: stepBet.id_step_bet,
          ref_id_challenges: challenges[2].id_challenge
        }
      })
    ]);
    console.log('Steps criados:', steps.length);

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
          progress_percentage: 50
        }
      }),
      // Associar segundo utilizador ao segundo desafio
      prisma.user_has_Challenges.create({
        data: {
          ref_id_user: users[1].id_user,
          ref_id_challenge: challenges[1].id_challenge,
          completed: true,
          blocked: false,
          detail_seen: true,
          progress_percentage: 100
        }
      }),
      // Associar terceiro utilizador ao terceiro desafio
      prisma.user_has_Challenges.create({
        data: {
          ref_id_user: users[2].id_user,
          ref_id_challenge: challenges[2].id_challenge,
          completed: false,
          blocked: true,
          detail_seen: false,
          progress_percentage: 0
        }
      })
    ]);
    console.log('Associações de utilizadores com desafios criadas:', userChallenges.length);

    // Associar utilizador-desafio-steps
    await Promise.all([
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[0].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[0].id_step,
          state: 2 // Completo
        }
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[0].id_user,
          ref_user_has_Challenges_id_challenge: challenges[0].id_challenge,
          ref_id_steps: steps[1].id_step,
          state: 1 // Em progresso
        }
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[1].id_user,
          ref_user_has_Challenges_id_challenge: challenges[1].id_challenge,
          ref_id_steps: steps[2].id_step,
          state: 2 // Completo
        }
      }),
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: users[1].id_user,
          ref_user_has_Challenges_id_challenge: challenges[1].id_challenge,
          ref_id_steps: steps[3].id_step,
          state: 2 // Completo
        }
      })
    ]);
    console.log('Associações de passos com utilizadores e desafios criadas');

    // Criar campeonatos
    const championships = await Promise.all([
      prisma.championship.create({
        data: {
          json: 'premier-league.json'
        }
      }),
      prisma.championship.create({
        data: {
          json: 'liga-portuguesa.json'
        }
      }),
      prisma.championship.create({
        data: {
          json: 'la-liga.json'
        }
      })
    ]);
    console.log('Campeonatos criados:', championships.length);

    // Criar jogos
    const games = await Promise.all([
      prisma.games.create({
        data: {
          local_team: 'Benfica',
          visitor_team: 'Porto',
          schedule: new Date('2023-11-10T20:00:00Z'),
          betted_team: 'Benfica',
          odd: 1.75,
          goals_local_team: 2,
          goals_visitor_team: 1,
          image: '/images/games/benfica-porto.jpg',
          game_state: 2 // Finalizado
        }
      }),
      prisma.games.create({
        data: {
          local_team: 'Sporting',
          visitor_team: 'Braga',
          schedule: new Date('2023-11-12T15:30:00Z'),
          betted_team: 'Sporting',
          odd: 1.90,
          goals_local_team: 3,
          goals_visitor_team: 0,
          image: '/images/games/sporting-braga.jpg',
          game_state: 2 // Finalizado
        }
      }),
      prisma.games.create({
        data: {
          local_team: 'Man City',
          visitor_team: 'Liverpool',
          schedule: new Date('2023-11-15T17:00:00Z'),
          betted_team: 'Liverpool',
          odd: 2.50,
          goals_local_team: 1,
          goals_visitor_team: 1,
          image: '/images/games/mancity-liverpool.jpg',
          game_state: 2 // Finalizado
        }
      }),
      prisma.games.create({
        data: {
          local_team: 'Barcelona',
          visitor_team: 'Real Madrid',
          schedule: new Date('2023-11-20T20:45:00Z'),
          betted_team: 'Barcelona',
          odd: 1.85,
          goals_local_team: 0,
          goals_visitor_team: 0,
          image: '/images/games/barcelona-realmadrid.jpg',
          game_state: 1 // Em andamento
        }
      })
    ]);
    console.log('Jogos criados:', games.length);

    // Criar apostas
    const bets = await Promise.all([
      prisma.bets.create({
        data: {
          date: new Date('2023-11-09T10:00:00Z'),
          type: 1, // simples
          amount: 50.00,
          potential_earning: 87.50,
          odd: 1.75,
          ref: 1,
          state: 1, // Aceita
          result: 2, // Ganhou
          ref_id_user: users[0].id_user
        }
      }),
      prisma.bets.create({
        data: {
          date: new Date('2023-11-11T12:30:00Z'),
          type: 1, // simples
          amount: 100.00,
          potential_earning: 190.00,
          odd: 1.90,
          ref: 2,
          state: 1, // Aceita
          result: 2, // Ganhou
          ref_id_user: users[1].id_user
        }
      }),
      prisma.bets.create({
        data: {
          date: new Date('2023-11-14T09:15:00Z'),
          type: 1, // simples
          amount: 75.00,
          potential_earning: 187.50,
          odd: 2.50,
          ref: 3,
          state: 1, // Aceita
          result: 1, // Perdeu
          ref_id_user: users[2].id_user
        }
      }),
      prisma.bets.create({
        data: {
          date: new Date('2023-11-19T18:30:00Z'),
          type: 2, // múltipla
          amount: 30.00,
          potential_earning: 55.50,
          odd: 1.85,
          ref: 4,
          state: 0, // Pendente
          result: 0, // Pendente
          ref_id_user: users[0].id_user
        }
      })
    ]);
    console.log('Apostas criadas:', bets.length);

    // Associar apostas, jogos e campeonatos
    await Promise.all([
      prisma.bets_has_Games.create({
        data: {
          ref_id_bet: bets[0].id_bets,
          ref_id_game: games[0].id_game,
          ref_id_championship: championships[1].id_championship
        }
      }),
      prisma.bets_has_Games.create({
        data: {
          ref_id_bet: bets[1].id_bets,
          ref_id_game: games[1].id_game,
          ref_id_championship: championships[1].id_championship
        }
      }),
      prisma.bets_has_Games.create({
        data: {
          ref_id_bet: bets[2].id_bets,
          ref_id_game: games[2].id_game,
          ref_id_championship: championships[0].id_championship
        }
      }),
      prisma.bets_has_Games.create({
        data: {
          ref_id_bet: bets[3].id_bets,
          ref_id_game: games[3].id_game,
          ref_id_championship: championships[2].id_championship
        }
      })
    ]);
    console.log('Associações de apostas com jogos e campeonatos criadas');

    // Criar dicas
    await Promise.all([
      prisma.tips.create({
        data: {
          tip: 'Estabeleça um orçamento para apostas e cumpra-o.',
          active: 1
        }
      }),
      prisma.tips.create({
        data: {
          tip: 'Pesquise bem antes de apostar em qualquer jogo.',
          active: 1
        }
      }),
      prisma.tips.create({
        data: {
          tip: 'Nunca aposte mais do que pode perder.',
          active: 1
        }
      }),
      prisma.tips.create({
        data: {
          tip: 'Apostas múltiplas têm risco maior, mas retorno potencial maior.',
          active: 0
        }
      }),
      prisma.tips.create({
        data: {
          tip: 'Mantenha um registro de todas as suas apostas.',
          active: 1
        }
      })
    ]);
    console.log('Dicas criadas');

    console.log('Seed completo com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

