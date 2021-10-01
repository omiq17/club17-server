import { ObjectId } from "mongodb";

export default class Member {
  constructor(public name: string, public price: number, public category: string, public id?: ObjectId) { }
}