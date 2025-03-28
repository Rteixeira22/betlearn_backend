/*
    Questionnaire:
    get:
    questionnaires/:iduser 


    create
    update
    delete

*/

import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class QuestionnaireController {
    // Get all questionnaire responses by user ID
    async getQuestionnaireByUserId(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const responses = await prisma.questionnaire_Response.findMany({
                where: { ref_id_user: userId },
            });
            res.json(responses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch questionnaire responses' });
        }
    }

    // Get verified questionnaire responses by user ID
    async getVerifiedQuestionnaires(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const responses = await prisma.questionnaire_Response.findMany({
                where: { ref_id_user: userId, verification: true },
            });
            res.json(responses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch verified questionnaire responses' });
        }
    }

    // Get unverified questionnaire responses by user ID
    async getUnverifiedQuestionnaires(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const responses = await prisma.questionnaire_Response.findMany({
                where: { ref_id_user: userId, verification: false },
            });
            res.json(responses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch unverified questionnaire responses' });
        }
    }

    // Get the last questionnaire response by user ID
    async getLastQuestionnaireResponse(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const response = await prisma.questionnaire_Response.findFirst({
                where: { ref_id_user: userId },
                orderBy: { id_questionnaire_response: 'desc' },
            });
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch the last questionnaire response' });
        }
    }

    // Create a new questionnaire response
async createQuestionnaireResponse(req: Request, res: Response) {
    try {
        const { budget, verification, salary, expenses, available_amount, debt, debt_monthly, income_source, ref_id_user } = req.body;
        const newResponse = await prisma.questionnaire_Response.create({
            data: {
                budget,
                verification,
                salary,
                expenses,
                available_amount,
                debt,
                debt_monthly,
                income_source,
                ref_id_user, 
            },
        });
        res.json(newResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create questionnaire response' });
    }
}

    // Update a specific questionnaire response
async updateQuestionnaireResponse(req: Request, res: Response) {
    try {
        const responseId = parseInt(req.params.responseId);
        const { budget, verification, salary, expenses, available_amount, debt, debt_monthly, income_source } = req.body;
        const updatedResponse = await prisma.questionnaire_Response.update({
            where: { id_questionnaire_response: responseId },
            data: {
                budget,
                verification,
                salary,
                expenses,
                available_amount,
                debt,
                debt_monthly,
                income_source,
            },
        });
        res.json(updatedResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update questionnaire response' });
    }
}

    // Delete a specific questionnaire response
    async deleteQuestionnaireResponse(req: Request, res: Response) {
        try {
            const responseId = parseInt(req.params.responseId);
            await prisma.questionnaire_Response.delete({
                where: { id_questionnaire_response: responseId },
            });
            res.json({ message: 'Questionnaire response deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete questionnaire response' });
        }
    }
}