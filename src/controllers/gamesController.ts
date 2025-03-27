/*
    Games:
    get:
    games
    games/:id 


    create
    criar jogo
    update
        mudar estado no jogo
        mudar estado na bet caso nao existam mais jogos associados 
    delete
*/

import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export class GamesController {

    //Escrever aqui os métodos 

}