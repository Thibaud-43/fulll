import { Vehicle } from "../Entities/Vehicle";
import {
  UnauthorizedFleetOperationError,
  VehicleAlreadyInFleetError,
  VehicleNotInFleetError,
} from "../Exceptions/FleetErrors";
import { Location } from "../ValueObjects/Location";

type FleetConstructorParameters = {
  id: string;
  ownerId: string;
};

export class Fleet {
  private id: string;
  private ownerId: string;
  private vehicles: Vehicle[];

  constructor({ id, ownerId }: FleetConstructorParameters) {
    this.id = id;
    this.ownerId = ownerId;
    this.vehicles = [];
  }

  public parkVehicle(
    vehicle: Vehicle,
    location: Location,
    userId: string
  ): Vehicle {
    if (this.ownerId !== userId) {
      throw new UnauthorizedFleetOperationError({ userId, fleetId: this.id });
    }
    if (!this._hasVehicle(vehicle)) {
      throw new VehicleNotInFleetError(
        vehicle.getPlateNumber().getValue(),
        this.id
      );
    }
    return vehicle.park(location);
  }

  public registerVehicle(vehicle: Vehicle, userId: string): Vehicle {
    if (this.ownerId !== userId) {
      throw new UnauthorizedFleetOperationError({ userId, fleetId: this.id });
    }
    if (this._hasVehicle(vehicle)) {
      throw new VehicleAlreadyInFleetError(
        this.id,
        vehicle.getPlateNumber().getValue()
      );
    }
    this.vehicles = [...this.vehicles, vehicle];
    return vehicle;
  }

  public getId(): string {
    return this.id;
  }

  public getOwnerId(): string {
    return this.ownerId;
  }

  public getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  private _hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.some((currentVehicle) =>
      vehicle.equals(currentVehicle)
    );
  }
}
