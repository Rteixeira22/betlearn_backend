/*
    Steps:
    get:
    steps
    steps/:id 
    steps/ref_id_challenges →step onde estou
    step/video/:id_video
    step/bet/:id_bet
    step/view/:id_view
    step/questionnaire/:id_questionnaire


    create
    update
    progresso---- x/total
    delete
*/

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export class StepsController {

    //Get Steps
    async getSteps(req: Request, res: Response) {
        try{
            const steps = await prisma.steps.findMany()
            res.json(steps)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch steps' })
        }
    }

    //Get Step by ID
     async getStepById(req: Request, res: Response) {
        try{
            const stepId = parseInt(req.params.id)
            const step = await prisma.steps.findUnique({
                where: { id_step: stepId }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    } 

    //Get Step by ref_id_challenges
    async getStepByRefIdChallenges(req: Request, res: Response) {
        try{
            const refIdChallenges = parseInt(req.params.ref_id_challenges)
            const step = await prisma.steps.findMany({
                where: { ref_id_challenges: refIdChallenges }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    }

    //Get Step by video ID
    async getStepByVideoId(req: Request, res: Response) {
        try{
            const videoId = parseInt(req.params.id_video)
            const step = await prisma.step_Video.findMany({
                where: { id_step_video: videoId }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    }

    //Get Step by bet ID
    async getStepByBetId(req: Request, res: Response) {
        try{
            const betId = parseInt(req.params.id_bet)
            const step = await prisma.step_Bet.findMany({
                where: { id_step_bet: betId }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    }

    //Get Step by view ID
    async getStepByViewId(req: Request, res: Response) {
        try{
            const viewId = parseInt(req.params.id_view)
            const step = await prisma.step_View.findMany({
                where: { id_step_view: viewId }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    }

    //Get Step by questionnaire ID
    async getStepByQuestionnaireId(req: Request, res: Response) {
        try{
            const questionnaireId = parseInt(req.params.id_questionnaire)
            const step = await prisma.step_Questionnaire.findMany({
                where: { id_step_questionnaire: questionnaireId }
            })
            res.json(step)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch step' })
        }
    }


    //Create New Video
    async createNewVideo(req: Request, res: Response) {
        try{
            const {video_url, video_description} = req.body
        
            const newVideo = await prisma.step_Video.create({
                data: {
                    video_url,
                    video_description
                }
            })

            res.json(newVideo)

        } catch (error) {
            res.status(500).json({ error: 'Failed to create step' })
        }
    }

    //Create New Step Bet
    async createNewStepBet(req: Request, res: Response) {
        try{
            const {bet_description, bet_json} = req.body
        
            const newStepBet = await prisma.step_Bet.create({
                data: {
                    bet_description,
                    bet_json
                }
            })

            res.json(newStepBet)

        } catch (error) {
            res.status(500).json({ error: 'Failed to create step' })
        }
    }

    //Create New Step View
    async createNewStepView(req: Request, res: Response) {
        try{
            const {view_description, view_page} = req.body
        
            const newStepView = await prisma.step_View.create({
                data: {
                    view_description,
                    view_page
                }
            })

            res.json(newStepView)

        } catch (error) {
            res.status(500).json({ error: 'Failed to create step' })
        }
    }

    //Create New Step Questionnaire
    async createNewStepQuestionnaire(req: Request, res: Response) {
        try{
            const {questionnaire_description, questionnaire_json} = req.body
        
            const newStepQuestionnaire = await prisma.step_Questionnaire.create({
                data: {
                    questionnaire_description,
                    questionnaire_json
                }
            })

            res.json(newStepQuestionnaire)

        } catch (error) {
            res.status(500).json({ error: 'Failed to create step' })
        }
    }

    //Create New Step
    async createNewStep(req: Request, res: Response) {
        try{
            const {ref_id_step_video, ref_id_step_bet, ref_id_step_view, ref_id_step_questionnaire, ref_id_challenges } = req.body
        
            const newStep = await prisma.steps.create({
                data: {
                    ref_id_step_video,
                    ref_id_step_bet,
                    ref_id_step_view,
                    ref_id_step_questionnaire,
                    ref_id_challenges
                }
            })

            res.json(newStep)

        } catch (error) {
            res.status(500).json({ error: 'Failed to create step' })
        }
    }

    //Update progress_percentage of Step
    async updateStepProgress(req: Request, res: Response) {
        try{
            const stepId = parseInt(req.params.id)
            const { progress_percentage } = req.body
        
            const updatedStep = await prisma.user_has_Challenges.update({
                where: { ref_id_user_ref_id_challenge: { ref_id_challenge: stepId, ref_id_user: req.body.ref_id_user } },
                data: { progress_percentage }
            })

            res.json(updatedStep)

        } catch (error) {
            res.status(500).json({ error: 'Failed to update step' })
        }
    }

    //Update Step Video
    async updateStepVideo(req: Request, res: Response) {
        try{
            const videoId = parseInt(req.params.id_video)
            const { video_url, video_description } = req.body
        
            const updatedStepVideo = await prisma.step_Video.update({
                where: { id_step_video: videoId },
                data: { video_url, video_description }
            })

            res.json(updatedStepVideo)

        } catch (error) {
            res.status(500).json({ error: 'Failed to update step' })
        }
    }

    //Update Step Bet
    async updateStepBet(req: Request, res: Response) {
        try{
            const betId = parseInt(req.params.id_bet)
            const { bet_description, bet_json } = req.body
        
            const updatedStepBet = await prisma.step_Bet.update({
                where: { id_step_bet: betId },
                data: { bet_description, bet_json }
            })

            res.json(updatedStepBet)

        } catch (error) {
            res.status(500).json({ error: 'Failed to update step' })
        }
    }

    //Update Step View
    async updateStepView(req: Request, res: Response) {
        try{
            const viewId = parseInt(req.params.id_view)
            const { view_description, view_page } = req.body
        
            const updatedStepView = await prisma.step_View.update({
                where: { id_step_view: viewId },
                data: { view_description, view_page }
            })

            res.json(updatedStepView)

        } catch (error) {
            res.status(500).json({ error: 'Failed to update step' })
        }
    }

    //Update Step Questionnaire
    async updateStepQuestionnaire(req: Request, res: Response) {
        try{
            const questionnaireId = parseInt(req.params.id_questionnaire)
            const { questionnaire_description, questionnaire_json } = req.body
        
            const updatedStepQuestionnaire = await prisma.step_Questionnaire.update({
                where: { id_step_questionnaire: questionnaireId },
                data: { questionnaire_description, questionnaire_json }
            })

            res.json(updatedStepQuestionnaire)

        } catch (error) {
            res.status(500).json({ error: 'Failed to update step' })
        }
    }

    //Delete Step
    async deleteStep(req: Request, res: Response) {
        try{
            const stepId = parseInt(req.params.id)
            const deletedStep = await prisma.steps.delete({
                where: { id_step: stepId }
            })
            res.json({ message: 'Step deleted successfully', deletedStep })
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete step' })
        }
    }


}