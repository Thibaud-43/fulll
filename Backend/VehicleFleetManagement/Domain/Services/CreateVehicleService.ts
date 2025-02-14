import { Vehicle, VehicleType } from "../Entities/Vehicle";
import { IVehicleRepository } from "../Repositories/Interfaces/IVehicleRepository";
import { PlateNumber } from "../ValueObjects/PlateNumber";

type CreateVehicleParams = {
  plateNumber: string;
  type: VehicleType;
};

export class CreateVehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  public async create({
    plateNumber,
    type,
  }: CreateVehicleParams): Promise<Vehicle> {
    const vehicle = new Vehicle({
      plateNumber: new PlateNumber(plateNumber),
      type,
    });

    await this.vehicleRepository.save(vehicle);

    return vehicle;
  }
}
