import { type Request, type Response } from 'express'

const notFound = (req: Request, res: Response) =>
  res.status(404).send('Route does not exist')

export default notFound
