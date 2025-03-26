import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import { PrismaClient } from '@prisma/client'

class App {
  public app: express.Application
  public prisma: PrismaClient

  constructor() {
    this.app = express()
    this.prisma = new PrismaClient()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.handleUncaughtErrors()
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes() {
    this.app.use('/api/users', userRoutes)
  }

  private handleUncaughtErrors() {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack)
      res.status(500).send('Something broke!')
    })
  }

  public async connectDatabase() {
    try {
      await this.prisma.$connect()
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Failed to connect to database', error)
      process.exit(1)
    }
  }

  public startServer(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}

export default App

