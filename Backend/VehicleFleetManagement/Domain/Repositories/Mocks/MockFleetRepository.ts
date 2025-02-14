import { Fleet } from "../../Aggregates/Fleet";
import { IFleetRepository } from "../Interfaces/IFleetRepository";

export class MockFleetRepository implements IFleetRepository {
  private fleets: Fleet[] = [];

  async findById(id: string): Promise<Fleet | undefined> {
    return this.fleets.find((fleet) => fleet.getId() === id);
  }

  async save(fleet: Fleet): Promise<Fleet> {
    this.fleets.push(fleet);
    return fleet;
  }
}
