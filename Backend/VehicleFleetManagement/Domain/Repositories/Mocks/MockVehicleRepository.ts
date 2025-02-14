import { Vehicle } from "../../Entities/Vehicle";
import { IVehicleRepository } from "../Interfaces/IVehicleRepository";

export class MockVehicleRepository implements IVehicleRepository {
  private vehicles: Vehicle[] = [];

  async findById(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.find(
      (vehicle) => vehicle.getPlateNumber().getValue() === id
    );
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    this.vehicles.push(vehicle);
    return vehicle;
  }
}
