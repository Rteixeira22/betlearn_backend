import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import axios from "axios";

const prisma = new PrismaClient();

interface CreateChallengeRequest {
  challenge: {
    number: number;
    name: string;
    short_description: string;
    long_description: string;
    image: string;
  };
  steps: Array<{
    type: 'video' | 'bet' | 'view' | 'questionnaire';
    data: {
      // Dados específicos de cada tipo de step
      video_url?: string;
      video_description?: string;
      bet_description?: string;
      bet_json?: string;
      view_description?: string;
      view_page?: string;
      questionnaire_description?: string;
      questionnaire_json?: string;
    };
  }>;
}

export class ChallengesController {
  // Get all challenges
 
async getAllChallenges(req: Request, res: Response) {
  try {
    const minNumber = typeof req.query.minNumber === 'string' ? parseInt(req.query.minNumber) : undefined;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined;
    const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;

    // Get challenges with filters, optional limit, and optional offset
    const challenges = await prisma.challenges.findMany({
      where: minNumber ? {
        number: {
          gte: minNumber
        }
      } : {},
      orderBy: {
        number: 'asc'
      },
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {})
    });

    // Get total count for pagination metadata
    const totalChallenges = await prisma.challenges.count({
      where: minNumber ? {
        number: {
          gte: minNumber
        }
      } : {}
    });

    // Determine if there are more challenges for the next page
    const hasNextPage = limit 
      ? (offset + challenges.length) < totalChallenges 
      : false;

    res.json({
      challenges,
      pagination: {
        total: totalChallenges,
        limit: limit,
        offset: offset || 0,
        hasNextPage
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
}
  // Get challenge by ID
  async getChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
        include: {
          Steps: {
            include: {
              Step_Video: true,
              Step_Bet: true,
              Step_View: true,
              Step_Questionnaire: true,
            },
          },
        },
      });
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenge" });
    }
  }

  //Get count of challenges
  async countChallenges(req: Request, res: Response) {
    try {
      const count = await prisma.challenges.count();
      console.log("Count fetched successfully:", count);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to count challenges" });
    }
  }

  // create challenge
  async createChallenge(req: Request, res: Response) {
    try {
      const { number, name, short_description, long_description, image } =
        req.body;
      const newChallenge = await prisma.challenges.create({
        data: {
          number,
          name,
          short_description,
          long_description,
          image,
        },
      });
      res.status(201).json(newChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to create challenge" });
    }
  }

  //search steps by challenge id
  async getStepsByChallengeId(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const steps = await prisma.steps.findMany({
        where: { ref_id_challenges: challengeId },
      });
      res.json(steps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch steps" });
    }
  }

  async getCountChallengesByDate(req: Request, res: Response) {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); 
        
        const bets = await prisma.user_has_Challenges.count({
          where: {
            date: {
              gte: today,
              lt: tomorrow
            }
          }
        });
        
        res.json({ count: bets });
      } catch (error) {
        console.error("Erro ao ir buscar desafios de hoje:", error);
        res.status(500).json({ error: "Failed to fetch today's bets" });
      }
    }

    async getMostCompletedChallengeToday(req: Request, res: Response) {
      try {
        // Set date range for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Get all challenges completed today and group by challenge ID
        const completedChallenges = await prisma.user_has_Challenges.groupBy({
          by: ['ref_id_challenge'],
          where: {
            date: {
              gte: today,
              lt: tomorrow
            },
            completed: true
          },
          _count: {
            ref_id_user: true
          },
          orderBy: {
            _count: {
              ref_id_user: 'desc'
            }
          },
          take: 1 
        });
        
        if (completedChallenges.length === 0) {
          return res.json({ 
            message: "No challenges were completed today",
            mostCompleted: null
          });
        }
        
        // Get the most completed challenge ID
        const mostCompletedChallengeId = completedChallenges[0].ref_id_challenge;
        const completionCount = completedChallenges[0]._count.ref_id_user ;
        
        // Get full details of the most completed challenge
        const challengeDetails = await prisma.challenges.findUnique({
          where: { id_challenge: mostCompletedChallengeId }
        });
        
        // Return the result
        res.json({
          mostCompleted: challengeDetails,
          completionCount: completionCount,
          date: today.toISOString().split('T')[0]
        });
        
      } catch (error) {
        console.error("Error fetching most completed challenge:", error);
        res.status(500).json({ 
          error: "Failed to fetch most completed challenge today",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }


  // Get ghallenge by user id
  async getChallengeByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: userId },
        include: { challenge: true },
        orderBy: {
          challenge: {
            number: "asc",
          },
        },
      });
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  }



  //get challenges completed by user
  
  async getAllChallengesCompletedByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const challenges = await prisma.user_has_Challenges.findMany({
        where: { ref_id_user: userId, completed: true },
        include: { challenge: true },
        orderBy: {
          challenge: {
            number: "asc",
          },
        },
      });
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  }

  // Update challenge
  async updateChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      const { name, short_description, long_description, image } = req.body;
      const updatedChallenge = await prisma.challenges.update({
        where: { id_challenge: challengeId },
        data: {
          name,
          short_description,
          long_description,
          image,
        },
      });
      res.json(updatedChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update challenge" });
    }
  }
  // Delete challenge
  async deleteChallengeById(req: Request, res: Response) {
    try {
      const challengeId = parseInt(req.params.id);
      await prisma.challenges.delete({
        where: { id_challenge: challengeId },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete challenge" });
    }
  }

  //Create user has challenges
  async createUserHasChallenges(req: Request, res: Response) {
    try {
      const { completed, blocked, detail_seen } = req.body;

      // Ensure all required fields are provided
      if (
        completed === undefined ||
        blocked === undefined ||
        detail_seen === undefined
      ) {
        res.status(400).json({
          error:
            "Missing required fields: completed, blocked, and detail_seen are required",
        });
      }

      // Validate IDs
      const userId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);

      if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({
          error: "Invalid user ID or challenge ID",
        });
      }

      // Check if user and challenge exist
      const userExists = await prisma.users.findUnique({
        where: { id_user: userId },
      });

      const challengeExists = await prisma.challenges.findUnique({
        where: { id_challenge: challengeId },
      });

      if (!userExists || !challengeExists) {
        res.status(404).json({
          error: !userExists ? "User not found" : "Challenge not found",
        });
      }

      // Try to create the record
      const newUserHasChallenge = await prisma.user_has_Challenges.create({
        data: {
          ref_id_user: userId,
          ref_id_challenge: challengeId,
          completed,
          blocked,
          detail_seen,
          // progress_percentage will use its default value
        },
      });

      //Pra ir buscar os passos do desafio
      const steps = await prisma.steps.findMany({
        where: { ref_id_challenges: challengeId },
      });

      // Cria relação de cada step para este user/challenge
    const stepsToCreate = steps.map((step) =>
      prisma.user_has_Challenges_has_Steps.create({
        data: {
          ref_user_has_Challenges_id_user: userId,
          ref_user_has_Challenges_id_challenge: challengeId,
          ref_id_steps: step.id_step,
          state: 0, 
        },
      })
    );

    await Promise.all(stepsToCreate); // executa tudo em paralelo

      res.status(201).json(newUserHasChallenge);
    } catch (error) {
      console.error("Error details:", error);

      // Check for specific error types
      if ((error as any).code === "P2002") {
        res.status(409).json({
          error: "This user already has this challenge assigned",
        });
      }

      res.status(500).json({
        error: "Failed to create user has challenge",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  //update user has challenges blocked
  async unblockNextChallenge(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const currentChallengeId = parseInt(req.params.id_challenge);

      // First, get the current challenge to find its number
      const currentChallenge = await prisma.challenges.findUnique({
        where: { id_challenge: currentChallengeId },
      });

      if (!currentChallenge) {
        res.status(404).json({ error: "Current challenge not found" });
      }

      // Find the next challenge based on the number field
      const nextChallenge = await prisma.challenges.findFirst({
        where: {
          number: {
            gt: currentChallenge?.number,
          },
        },
        orderBy: {
          number: "asc",
        },
      });

      if (!nextChallenge) {
        res.status(404).json({ error: "No next challenge found" });
      }

      // Check if a relationship already exists for the user and next challenge
      const existingRelationship = await prisma.user_has_Challenges.findUnique({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: nextChallenge?.id_challenge ?? 0,
          },
        },
      });

      if (existingRelationship) {
        // Update the existing relationship to unblock it
        const updatedUserHasChallenge = await prisma.user_has_Challenges.update(
          {
            where: {
              ref_id_user_ref_id_challenge: {
                ref_id_user: userId,
                ref_id_challenge: nextChallenge?.id_challenge ?? 0,
              },
            },
            data: {
              blocked: false,
            },
          }
        );

        res.json(updatedUserHasChallenge);
      } else {
        // Create a new relationship with the next challenge (unblocked)
        const newUserHasChallenge = await prisma.user_has_Challenges.create({
          data: {
            ref_id_user: userId,
            ref_id_challenge: nextChallenge?.id_challenge ?? 0,
            completed: false,
            blocked: false,
            detail_seen: false,
          },
        });

        res.status(201).json(newUserHasChallenge);
      }
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({
        error: "Failed to unblock next challenge",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  //update user has challenges detail_seen
  async updateUserHasChallengesDetailSeen(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id_user);
      const challengeId = parseInt(req.params.id_challenge);
      const { detail_seen } = req.body;
      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: challengeId,
          },
        },
        data: {
          detail_seen,
        },
      });
      res.json(updatedUserHasChallenge);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user has challenge" });
    }
  }


  //update user has challenges progress_percentage
  async updateUserHasChallengesProgressPercentage(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id_user);
      const challengeId = Number(req.params.id_challenge);
      const { progress_percentage } = req.body;

      // Verificação básica de IDs
      if (isNaN(userId) || isNaN(challengeId)) {
        res.status(400).json({ error: "Invalid user or challenge ID" });
      }

      // Verificação do progresso
      if (
        typeof progress_percentage !== "number" ||
        progress_percentage < 0 ||
        progress_percentage > 100
      ) {
        res.status(400).json({ error: "Invalid progress percentage" });
      }

      // Atualizar o progresso
      const updatedUserHasChallenge = await prisma.user_has_Challenges.update({
        where: {
          ref_id_user_ref_id_challenge: {
            ref_id_user: userId,
            ref_id_challenge: challengeId,
          },
        },
        data: {
          progress_percentage,
        },
      });

      // Se completou o desafio (progress_percentage == 100)
      if (progress_percentage === 100) {
        // Atualizar como completado
        await prisma.user_has_Challenges.update({
          where: {
            ref_id_user_ref_id_challenge: {
              ref_id_user: userId,
              ref_id_challenge: challengeId,
            },
          },
          data: {
            completed: true,
          },
        });

        // Desbloquear o próximo desafio chamando diretamente a função (se possível)
        try {
          await axios.post(
            `http://localhost:3000/api/challenges/${userId}/${challengeId}/unblock-next`
          );
        } catch (axiosError) {
          console.error("Failed to unblock next challenge:", axiosError);
        }
      }

      res.json(updatedUserHasChallenge);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res
        .status(500)
        .json({ error: "Failed to update user challenge progress" });
    }
  }

  
 async updateUserHasStepState(req: Request, res: Response) {
  const { id_user, id_challenge, id_step } = req.params;
  const { state } = req.body;

  const debugLogs: string[] = [];

  try {
    debugLogs.push(`Starting update for user: ${id_user}, challenge: ${id_challenge}, step: ${id_step}, state: ${state}`);

    if (!id_user || !id_challenge || !id_step) {
      debugLogs.push("Missing required parameters");
      return res.status(400).json({ error: "Missing parameters", debug_logs: debugLogs });
    }

    const userId = parseInt(id_user);
    const challengeId = parseInt(id_challenge);
    const stepId = parseInt(id_step);

    const existingRecord = await prisma.user_has_Challenges_has_Steps.findFirst({
      where: {
        ref_user_has_Challenges_id_user: userId,
        ref_user_has_Challenges_id_challenge: challengeId,
        ref_id_steps: stepId,
      },
    });

    if (!existingRecord) {
      debugLogs.push("Step record not found");
      return res.status(404).json({ error: "Step not found", debug_logs: debugLogs });
    }

    debugLogs.push(`Existing state: ${existingRecord.state}, New state: ${state}`);

    if (existingRecord.state === state) {
      debugLogs.push("State is already up to date");
      return res.status(200).json({
        message: "Step already updated",
        progress_percentage: 0,
        debug_logs: debugLogs,
      });
    }

    // Atualizar o estado do step
    const updatedStep = await prisma.user_has_Challenges_has_Steps.updateMany({
      where: {
        ref_user_has_Challenges_id_user: userId,
        ref_user_has_Challenges_id_challenge: challengeId,
        ref_id_steps: stepId,
      },
      data: {
        state: state,
      },
    });

    

    debugLogs.push(`Updated ${updatedStep.count} step(s)`);

    // Recalcular percentagem
    const totalSteps = await prisma.user_has_Challenges_has_Steps.count({
      where: {
        ref_user_has_Challenges_id_user: userId,
        ref_user_has_Challenges_id_challenge: challengeId,
      },
    });

    const completedSteps = await prisma.user_has_Challenges_has_Steps.count({
      where: {
        ref_user_has_Challenges_id_user: userId,
        ref_user_has_Challenges_id_challenge: challengeId,
        state: 1,
      },
    });

    const stepPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    debugLogs.push(`Completed Steps: ${completedSteps}, Total Steps: ${totalSteps}, Progress: ${stepPercentage}%`);

    // Atualizar a tabela user_has_Challenges com a percentagem
    const progressUpdate = await prisma.user_has_Challenges.updateMany({
      where: {
        ref_id_user: userId,
        ref_id_challenge: challengeId,
      },
      data: {
        progress_percentage: stepPercentage,
      },
    });

    // Se completou o desafio (progress_percentage == 100)
      if (stepPercentage === 100) {
        // Atualizar como completado
        await prisma.user_has_Challenges.update({
          where: {
            ref_id_user_ref_id_challenge: {
              ref_id_user: userId,
              ref_id_challenge: challengeId,
            },
          },
          data: {
            completed: true,
          },
        });

        // Desbloquear o próximo desafio chamando diretamente a função (se possível)
        try {
          await axios.post(
            `http://localhost:3000/api/challenges/${userId}/${challengeId}/unblock-next`
          );
        } catch (axiosError) {
          console.error("Failed to unblock next challenge:", axiosError);
        }
      }

    debugLogs.push(`Updated user_has_Challenges: ${progressUpdate.count} record(s)`);

    res.status(200).json({
      message: "Step updated and progress recalculated",
      progress_percentage: stepPercentage,
      updatedStep,
      total_steps: totalSteps,
      debug_logs: debugLogs,
    });

  } catch (error) {
    debugLogs.push(`Main error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Error:", error);

    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
      debug_logs: debugLogs,
    });
  }
}


//Função para ir buscar o desafio em progresso
async getChallengeInProgress(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    
    // Verifica se o ID do utilizador é válido
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    // Vai buscar um desafio que tenha progress_percentage >= 0 e < 100 (em progresso)
    // e que não esteja completado (completed = false)
    const challengeInProgress = await prisma.user_has_Challenges.findFirst({
      where: {
        ref_id_user: userId,
        completed: false,
        blocked: false,
        progress_percentage: {
          gte: 0,
          lt: 100
        }
      },
      include: {
        challenge: true 
      },
    });
    
    if (!challengeInProgress) {
      return res.status(404).json({ 
        message: "No challenge in progress found for this user"
      });
    }
    
    // Vai buscar os steps do desafio em progresso
    const steps = await prisma.user_has_Challenges_has_Steps.findMany({
      where: {
        ref_user_has_Challenges_id_user: userId,
        ref_user_has_Challenges_id_challenge: challengeInProgress.ref_id_challenge
      },
      include: {
        step: {
          include: {
            Step_Video: true,
            Step_Bet: true,
            Step_View: true,
            Step_Questionnaire: true
          }
        }
      },
      orderBy: {
        ref_id_steps: 'asc'
      }
    });
    
    // Retorna o desafio com sua informação de progresso e steps
    res.json({
      challenge: challengeInProgress.challenge,
      progress: {
        progress_percentage: challengeInProgress.progress_percentage,
        detail_seen: challengeInProgress.detail_seen,
      },
      steps: steps
    });
    
  } catch (error) {
    console.error("Error fetching challenge in progress:", error);
    res.status(500).json({ 
      error: "Failed to fetch challenge in progress",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

async createFullChallenge(req: Request, res: Response) {
  const data = req.body as CreateChallengeRequest;
  
  try {
    // Usar transação para garantir que todas as operações sejam bem-sucedidas
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar o challenge
      const challenge = await tx.challenges.create({
        data: {
          number: data.challenge.number,
          name: data.challenge.name,
          short_description: data.challenge.short_description,
          long_description: data.challenge.long_description,
          image: data.challenge.image,
        },
      });
      
      // 2. Criar cada step do challenge
      const createdSteps = [];
      
      for (const stepData of data.steps) {
        let stepVideoId = null;
        let stepBetId = null;
        let stepViewId = null;
        let stepQuestionnaireId = null;
        
        // Criar o tipo específico de step
        if (stepData.type === 'video' && stepData.data.video_url && stepData.data.video_description) {
          const video = await tx.step_Video.create({
            data: {
              video_url: stepData.data.video_url,
              video_description: stepData.data.video_description,
            },
          });
          stepVideoId = video.id_step_video;
        } 
        else if (stepData.type === 'bet' && stepData.data.bet_description && stepData.data.bet_json) {
          const bet = await tx.step_Bet.create({
            data: {
              bet_description: stepData.data.bet_description,
              bet_json: stepData.data.bet_json,
            },
          });
          stepBetId = bet.id_step_bet;
        }
        else if (stepData.type === 'view' && stepData.data.view_description && stepData.data.view_page) {
          const view = await tx.step_View.create({
            data: {
              view_description: stepData.data.view_description,
              view_page: stepData.data.view_page,
            },
          });
          stepViewId = view.id_step_view;
        }
        else if (stepData.type === 'questionnaire' && stepData.data.questionnaire_description && stepData.data.questionnaire_json) {
          const questionnaire = await tx.step_Questionnaire.create({
            data: {
              questionnaire_description: stepData.data.questionnaire_description,
              questionnaire_json: stepData.data.questionnaire_json,
            },
          });
          stepQuestionnaireId = questionnaire.id_step_questionnaire;
        }
        
        // Criar o registro na tabela Steps
        const step = await tx.steps.create({
          data: {
            ref_id_step_video: stepVideoId,
            ref_id_step_bet: stepBetId,
            ref_id_step_view: stepViewId,
            ref_id_step_questionnaire: stepQuestionnaireId,
            ref_id_challenges: challenge.id_challenge,
          },
        });
        
        createdSteps.push(step);
      }
      
      // Retornar todos os dados criados
      return {
        challenge,
        steps: createdSteps
      };
    });
    
    res.status(201).json({
      message: "Challenge created successfully with all steps",
      data: result
    });
    
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ 
      error: "Failed to create challenge with steps",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}



}
