import { Rack } from "./Rack";
import { Roll } from "./Roll";

describe('Rack', () => {
    test('should get all the knocked down pins', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 2, true));
        rack.addRoll(new Roll('123', 3, true));

        expect(rack.getKnockedDownPins()).toBe(9);
    });

    test('should get the available pins correctly', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 2, true));
        rack.addRoll(new Roll('123', 3, true));

        expect(rack.getAvailablePins()).toBe(1);
    });

    test('should be completed when all the pins are hit', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 2, true));

        expect(rack.isCompleted()).toBe(true);
    });

    test('should not be completed when all the pins are not hit', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 1, true));

        expect(rack.isCompleted()).toBe(false);
    });

    test('should return false for canAllowToHit() function when the incoming pins is greater than the total available pins', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 2, true));

        expect(rack.canAllowToHit(1)).toBe(false);
    });

    test('should return true for canAllowToHit() function when the incoming pins is less or equal to the total available pins', () => {
        const rack: Rack = new Rack(10);
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 4, true));
        rack.addRoll(new Roll('123', 1, true));

        expect(rack.canAllowToHit(1)).toBe(true);
    });
});