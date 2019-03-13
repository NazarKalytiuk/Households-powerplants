class Household {
	constructor() {
		this.powerplants = new Set();
		this.households = new Set();
	}

	connectToPowerPlant(powerPlant) {
		this.powerplants.add(powerPlant);
	}

	disconnectFromPowerPlant(powerPlant) {
		this.powerplants.delete(powerPlant);
	}

	connectToHouseHold(household) {
		this.households.add(household);
	}

	disconnectFromHouseHold(household) {
		this.households.delete(household);
	}

	hasAlivePowerplant() {
  	return [...this.powerplants].some(e => e.alive)
  }

	hasElectricity(visitedHouseholds = new Set()) {
		if (visitedHouseholds.has(this)) {
			return false;
		}
		visitedHouseholds.add(this);
		if (this.hasAlivePowerplant()) {
			return true;
		} else {
			// recursive travel to all connected households
			const paths = [];
			this.households.forEach(h => {
				if (h.households.size === 0) {
					paths.push(false);
				} else {
					paths.push(h.hasElectricity(visitedHouseholds));
				}
			});
			return paths.some(p => p); // return true if at least 1 path return true
		}
	}
}

class PowerPlant {
	constructor() {
		this.alive = true;
	}

	kill() {
		this.alive = false;
	}
	repair() {
		this.alive = true;
	}
}

class World {
	constructor() {
	}

	createPowerPlant() {
		return new PowerPlant();
	}


	createHousehold() {
		return new Household();
	}


	connectHouseholdToPowerPlant(household, powerPlant) {
		household.connectToPowerPlant(powerPlant);
	}


	connectHouseholdToHousehold(household1, household2) {
		household1.connectToHouseHold(household2);
		household2.connectToHouseHold(household1);
	}


	disconnectHouseholdFromPowerPlant(household, powerPlant) {
		household.disconnectFromPowerPlant(powerPlant);
	}


	killPowerPlant(powerPlant) {
		powerPlant.kill();
	}


	repairPowerPlant(powerPlant) {
		powerPlant.repair();
	}


	householdHasEletricity(household) {
		return household.hasElectricity();
	}
}


const assert = {
	equal(a, b) {
		if (a != b) {
			throw new Error('Assertion Failed');
		}
	}
};



/*

	The code below tests your implementation. You can consider the task finished
	when all the test do pass. Feel free to read the tests, but please don't alter them.

*/

mocha.setup('bdd');

describe("Households + Power Plants", function() {

	it("Household has no electricity by default", () => {
		const world = new World();
		const household = world.createHousehold();
		assert.equal(world.householdHasEletricity(household), false);
	});


	it("Household has electricity if connected to a Power Plant", () => {
		const world = new World();
		const household = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household, powerPlant);

		assert.equal(world.householdHasEletricity(household), true);
	});


	it("Household won't have Electricity after disconnecting from the only Power Plant", () => {
		const world = new World();
		const household = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household, powerPlant);

		assert.equal(world.householdHasEletricity(household), true);

		world.disconnectHouseholdFromPowerPlant(household, powerPlant);
		assert.equal(world.householdHasEletricity(household), false);
	});


	it("Household will have Electricity as long as there's at least 1 alive Power Plant connected", () => {
		const world = new World();
		const household = world.createHousehold();

		const powerPlant1 = world.createPowerPlant();
		const powerPlant2 = world.createPowerPlant();
		const powerPlant3 = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household, powerPlant1);
		world.connectHouseholdToPowerPlant(household, powerPlant2);
		world.connectHouseholdToPowerPlant(household, powerPlant3);

		assert.equal(world.householdHasEletricity(household), true);

		world.disconnectHouseholdFromPowerPlant(household, powerPlant1);
		assert.equal(world.householdHasEletricity(household), true);

		world.killPowerPlant(powerPlant2);
		assert.equal(world.householdHasEletricity(household), true);

		world.disconnectHouseholdFromPowerPlant(household, powerPlant3);
		assert.equal(world.householdHasEletricity(household), false);
	});


	it("Household won't have Electricity if the only Power Plant dies", () => {
		const world = new World();
		const household = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household, powerPlant);

		assert.equal(world.householdHasEletricity(household), true);

		world.killPowerPlant(powerPlant);
		assert.equal(world.householdHasEletricity(household), false);
	});


	it("PowerPlant can be repaired", () => {
		const world = new World();
		const household = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household, powerPlant);

		assert.equal(world.householdHasEletricity(household), true);

		world.killPowerPlant(powerPlant);
		assert.equal(world.householdHasEletricity(household), false);

		world.repairPowerPlant(powerPlant);
		assert.equal(world.householdHasEletricity(household), true);

		world.killPowerPlant(powerPlant);
		assert.equal(world.householdHasEletricity(household), false);

		world.repairPowerPlant(powerPlant);
		assert.equal(world.householdHasEletricity(household), true);
	});


	it("Few Households + few Power Plants, case 1", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();

		const powerPlant1 = world.createPowerPlant();
		const powerPlant2 = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant1);
		world.connectHouseholdToPowerPlant(household1, powerPlant2);
		world.connectHouseholdToPowerPlant(household2, powerPlant2);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);

		world.killPowerPlant(powerPlant2);
		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), false);

		world.killPowerPlant(powerPlant1);
		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
	});



	it("Few Households + few Power Plants, case 2", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();

		const powerPlant1 = world.createPowerPlant();
		const powerPlant2 = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant1);
		world.connectHouseholdToPowerPlant(household1, powerPlant2);
		world.connectHouseholdToPowerPlant(household2, powerPlant2);

		world.disconnectHouseholdFromPowerPlant(household2, powerPlant2);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), false);

		world.killPowerPlant(powerPlant2);
		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), false);

		world.killPowerPlant(powerPlant1);
		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
	});


	it("Household + Power Plant, case 1", () => {
		const world = new World();

		const household = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		assert.equal(world.householdHasEletricity(household), false);
		world.killPowerPlant(powerPlant);

		world.connectHouseholdToPowerPlant(household, powerPlant);

		assert.equal(world.householdHasEletricity(household), false);
	});

});


describe("Households + Households + Power Plants", function() {
	it("2 Households + 1 Power Plant", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant);
		world.connectHouseholdToHousehold(household1, household2);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);

		world.killPowerPlant(powerPlant);

		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
	});


	it("Power Plant -> Household -> Household -> Household", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();
		const household3 = world.createHousehold();
		const powerPlant = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant);
		world.connectHouseholdToHousehold(household1, household2);
		world.connectHouseholdToHousehold(household2, household3);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);
		assert.equal(world.householdHasEletricity(household3), true);

		world.killPowerPlant(powerPlant);

		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
		assert.equal(world.householdHasEletricity(household3), false);

		world.repairPowerPlant(powerPlant);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);
		assert.equal(world.householdHasEletricity(household3), true);

		world.disconnectHouseholdFromPowerPlant(household1, powerPlant);

		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
		assert.equal(world.householdHasEletricity(household3), false);
	});



	it("2 Households + 2 Power Plants", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();

		const powerPlant1 = world.createPowerPlant();
		const powerPlant2 = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant1);
		world.connectHouseholdToPowerPlant(household2, powerPlant2);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);

		world.killPowerPlant(powerPlant1);

		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), true);

		world.connectHouseholdToHousehold(household1, household2);

		assert.equal(world.householdHasEletricity(household1), true);
		assert.equal(world.householdHasEletricity(household2), true);

		world.disconnectHouseholdFromPowerPlant(household2, powerPlant2);

		assert.equal(world.householdHasEletricity(household1), false);
		assert.equal(world.householdHasEletricity(household2), false);
	});

	it("Graph", () => {
		const world = new World();

		const household1 = world.createHousehold();
		const household2 = world.createHousehold();
		const household3 = world.createHousehold();
		const household4 = world.createHousehold();
		const household5 = world.createHousehold();
		const household6 = world.createHousehold();
		const household7 = world.createHousehold();

		const powerPlant1 = world.createPowerPlant();

		world.connectHouseholdToPowerPlant(household1, powerPlant1);
		world.connectHouseholdToHousehold(household1, household2);
		world.connectHouseholdToHousehold(household2, household3);
		world.connectHouseholdToHousehold(household3, household4);
		world.connectHouseholdToHousehold(household4, household5);
		world.connectHouseholdToHousehold(household5, household6);
		world.connectHouseholdToHousehold(household6, household7);
		world.connectHouseholdToHousehold(household7, household3);

		assert.equal(world.householdHasEletricity(household2), true);
	});
});


mocha.run();