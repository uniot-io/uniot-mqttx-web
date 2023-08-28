import db from '@/database/index'

class ConnectionMessageService {
  public getAll = (id: string): MessageModel[] => {
    const query = db.find<ConnectionModel>('connections', id)
    if (!query) {
      return []
    }
    return query.messages
  }

  public create = (id: string, message: MessageModel): MessageModel => {
    return db.findChild<$TSFixed>('connections', id).get('messages').insert(message).write()
  }

  public delete = (id: string, mid: string): MessageModel => {
    return db.findChild<$TSFixed>('connections', id).get('messages').removeById(mid).write()
  }

  public updatePayloadType = (
    id: string,
    mid: string,
    type: PayloadType,
    convertFunction: (value: Buffer, type: PayloadType) => { payload: string; type: string },
  ): MessageModel => {
    const value = db.findChild<$TSFixed>('connections', id).get('messages').find({ id: mid }).value()
    const converted = convertFunction(Buffer.from(value.originalPayload), type)
    value.payload = converted.payload
    value.encoding = converted.type
    return db.findChild<$TSFixed>('connections', id).get('messages').find({ id: mid }).assign(value).write()
  }
}

export default new ConnectionMessageService()
