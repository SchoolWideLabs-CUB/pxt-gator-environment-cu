/**
 * Michael Schneider and James Luther @ University of Colorado Boulder
 * August 12, 2022
 * 
 * Functional version of the pxt-gator-environment extension from Sparkfun.
 */

/**
 * Functions to operate the gatorEnvironment sensor
 */
enum measurementType {
    degreesC = 1,
    degreesF = 2,
    humidity = 3,
    pressure = 4,
    eCO2 = 5,
    TVOC = 6,
}

//% color=#f44242 icon="\uf0c2"
namespace gatorEnvironment {
    // Functions for reading Particle from the gatorEnvironment in Particle or straight adv value

    /**
    * Initialize the gator:environment sensor for readings
    */
    //% weight=32 
    //% blockId="gatorEnvironment_beginEnvironment" 
    //% block="initialize gator:environment sensors"
    //% shim=gatorEnvironment::beginEnvironment
    export function beginEnvironment() {
        return
    }

    /**
    * Grab the temperature, humidity, pressure, equivalent C02, or total Volatile Organic Compounds from the gator:environment
    */
    //% weight=31
    //% blockId="gatorEnvironment_getMeasurement"
    //% block="get %measurementType | value"
    //% shim=gatorEnvironment::getMeasurement
    export function getMeasurement(type: measurementType): number {
        return 0
    }
}