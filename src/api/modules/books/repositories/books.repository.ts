/* eslint-disable @typescript-eslint/no-explicit-any */

import BaseRepository from '../../../common/repositories/base.repository'
import { type Book, type IBookRepository as IBooksRepository } from '../interfaces'
import type BookModel from '../models/book.model'

class BooksRepository
  extends BaseRepository<Book>
  implements IBooksRepository {
  constructor (model: typeof BookModel) {
    super(model)
  }

  async getBookByName (name: string): Promise<Book> {
    const book = await this.model.findOne({ name })

    if (book == null) throw new Error(`${name} not found!`)

    return await Promise.resolve(book as Book)
  }

  async getAllBooks (name?: string): Promise<Book[]> {
    const queryObject: {
      name?: {
        $regex: any
        $options: string
      }
    } = {}

    if (name !== undefined) {
      queryObject.name = { $regex: name, $options: 'i' }
    }

    const books = await this.model.find(queryObject)
    return books as Book[]
  }
}

export default BooksRepository
