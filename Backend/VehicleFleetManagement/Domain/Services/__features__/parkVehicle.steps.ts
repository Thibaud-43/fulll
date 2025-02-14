import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { ParkVehicleService } from "../ParkVehicleService";
import { Location } from "../../ValueObjects/Location";
import { MockVehicleRepository } from "../../Repositories/Mocks/MockVehicleRepository";
import { MockFleetRepository } from "../../Repositories/Mocks/MockFleetRepository";
import { CreateFleetService } from "../CreateFleetService";
import { CreateVehicleService } from "../CreateVehicleService";
import assert from "assert";

const ownerId = "1";
const fleetId = "1";
const plateNumber = "AB-123-CD";
const location = {
  latitude: 48.8584,
  longitude: 2.2945,
  altitude: 500,
};

Before(function () {
  const vehicleRepository = new MockVehicleRepository();
  const fleetRepository = new MockFleetRepository();

  this.createFleetService = new CreateFleetService(fleetRepository);
  this.createVehicleService = new CreateVehicleService(vehicleRepository);

  this.parkVehicleService = new ParkVehicleService(
    vehicleRepository,
    fleetRepository
  );
});

After(function () {
  this.fleet = null;
  this.vehicle = null;
  this.locationVO = null;
  this.error = null;
});

Given("my fleet", async function () {
  this.fleet = await this.createFleetService.create({ id: fleetId, ownerId });
});

Given("a vehicle", async function () {
  this.vehicle = await this.createVehicleService.create({
    plateNumber,
    type: "car",
  });
});

Given("I have registered this vehicle into my fleet", function () {
  this.fleet.registerVehicle(this.vehicle, ownerId);
});

Given("a location", function () {
  this.locationVO = new Location(location);
});

Given("my vehicle has been parked into this location", async function () {
  await this.parkVehicleService.park({
    userId: ownerId,
    vehicleId: plateNumber,
    fleetId,
    location,
  });
});

When("I park my vehicle at this location", async function () {
  await this.parkVehicleService.park({
    userId: ownerId,
    vehicleId: plateNumber,
    fleetId,
    location,
  });
});

When("I try to park my vehicle at this location", async function () {
  try {
    await this.parkVehicleService.park({
      userId: ownerId,
      vehicleId: plateNumber,
      fleetId,
      location,
    });
  } catch (error) {
    this.error = error;
  }
});

Then(
  "the known location of my vehicle should verify this location",
  function () {
    const expectedLocation = new Location(location);
    assert.strictEqual(
      this.vehicle.getLocation().toString(),
      expectedLocation.toString()
    );
  }
);

Then(
  "I should be informed that my vehicle is already parked at this location",
  function () {
    assert.strictEqual(
      this.error.message,
      "The Vehicle AB-123-CD is already parked at (48.8584, 2.2945, 500m)"
    );
  }
);
