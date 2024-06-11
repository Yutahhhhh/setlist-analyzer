import dayjs from 'dayjs'

export default class Model {
  constructor() {}

  public assignValues(values: any) {
    if (values == null || typeof values !== 'object') {
      return
    }
    const me: any = this as any
    const excludedKeys = ['createdAt', 'updatedAt']
    Object.keys(values).forEach((key: string) => {
      if (excludedKeys.includes(key)) {
        return
      }
      me[key] = values[key]
    })
  }
}

export interface ITimestampsModel {
  createdAt: string
  updatedAt: string
}

export class TimestampsModel extends Model {
  createdAt: Date
  updatedAt: Date

  constructor(initValues: Partial<ITimestampsModel>) {
    super()
    this.createdAt = dayjs(initValues.createdAt).toDate()
    this.updatedAt = dayjs(initValues.updatedAt).toDate()
  }
}
