import { Fleet } from "../Aggregates/Fleet";
import { IFleetRepository } from "../Repositories/Interfaces/IFleetRepository";

type CreateFleetParams = {
  id: string;
  ownerId: string;
};

export class CreateFleetService {
  constructor(private readonly fleetRepository: IFleetRepository) {}

  public async create({ id, ownerId }: CreateFleetParams): Promise<Fleet> {
    const fleet = new Fleet({ id, ownerId });

    await this.fleetRepository.save(fleet);

    return fleet;
  }
}
