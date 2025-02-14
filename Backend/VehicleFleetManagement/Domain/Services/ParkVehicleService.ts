import { Fleet } from "../Aggregates/Fleet";
import { Vehicle } from "../Entities/Vehicle";
import { FleetNotFoundError } from "../Exceptions/FleetErrors";
import { VehicleNotFoundError } from "../Exceptions/VehiculeErrors";
import { IFleetRepository } from "../Repositories/Interfaces/IFleetRepository";
import { IVehicleRepository } from "../Repositories/Interfaces/IVehicleRepository";
import { Location as LocationVO } from "../ValueObjects/Location";

type Location = { latitude: number; longitude: number; altitude?: number };

export class ParkVehicleService {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
    private readonly fleetRepository: IFleetRepository
  ) {}

  public async park({
    userId,
    vehicleId,
    fleetId,
    location,
  }: {
    userId: string;
    vehicleId: string;
    fleetId: string;
    location: Location;
  }): Promise<Vehicle> {
    const fleet = await this.fleetRepository.findById(fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(fleetId);
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError(vehicleId);
    }

    const locationVO = new LocationVO(location);

    const vehicleParked = fleet.parkVehicle(vehicle, locationVO, userId);

    return this.vehicleRepository.save(vehicleParked);
  }
}
