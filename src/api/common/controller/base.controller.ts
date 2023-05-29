import * as express from 'express'

export default class ControllerBase {
  public path = '/'
  public router = express.Router()
}
