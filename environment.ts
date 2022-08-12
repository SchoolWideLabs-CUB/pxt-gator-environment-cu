/**
 * James Luther and Michael Schneider @ University of Colorado Boulder
 * 
 * Environment Class
 */

const BME280_ADDRESS = 0xEE;
const BME280_DIG_T1_LSB_REG = 0x88;
const BME280_DIG_T1_MSB_REG = 0x89;
const BME280_DIG_T2_LSB_REG = 0x8A;
const BME280_DIG_T2_MSB_REG = 0x8B;
const BME280_DIG_T3_LSB_REG = 0x8C;
const BME280_DIG_T3_MSB_REG = 0x8D;
const BME280_DIG_P1_LSB_REG = 0x8E;
const BME280_DIG_P1_MSB_REG = 0x8F;
const BME280_DIG_P2_LSB_REG = 0x90;
const BME280_DIG_P2_MSB_REG = 0x91;
const BME280_DIG_P3_LSB_REG = 0x92;
const BME280_DIG_P3_MSB_REG = 0x93;
const BME280_DIG_P4_LSB_REG = 0x94;
const BME280_DIG_P4_MSB_REG = 0x95;
const BME280_DIG_P5_LSB_REG = 0x96;
const BME280_DIG_P5_MSB_REG = 0x97;
const BME280_DIG_P6_LSB_REG = 0x98;
const BME280_DIG_P6_MSB_REG = 0x99;
const BME280_DIG_P7_LSB_REG = 0x9A;
const BME280_DIG_P7_MSB_REG = 0x9B;
const BME280_DIG_P8_LSB_REG = 0x9C;
const BME280_DIG_P8_MSB_REG = 0x9D;
const BME280_DIG_P9_LSB_REG = 0x9E;
const BME280_DIG_P9_MSB_REG = 0x9F;
const BME280_DIG_H1_REG = 0xA1;
const BME280_CHIP_ID_REG = 0xD0; //Chip ID
const BME280_RST_REG = 0xE0; //Softreset Reg
const BME280_DIG_H2_LSB_REG = 0xE1;
const BME280_DIG_H2_MSB_REG = 0xE2;
const BME280_DIG_H3_REG = 0xE3;
const BME280_DIG_H4_MSB_REG = 0xE4;
const BME280_DIG_H4_LSB_REG = 0xE5;
const BME280_DIG_H5_MSB_REG = 0xE6;
const BME280_DIG_H6_REG = 0xE7;
const BME280_CTRL_HUMIDITY_REG = 0xF2; //Ctrl Humidity Reg
const BME280_STAT_REG = 0xF3; //Status Reg
const BME280_CTRL_MEAS_REG = 0xF4; //Ctrl Measure Reg
const BME280_CONFIG_REG = 0xF5; //Configuration Reg
const BME280_PRESSURE_MSB_REG = 0xF7; //Pressure MSB
const BME280_PRESSURE_LSB_REG = 0xF8; //Pressure LSB
const BME280_PRESSURE_XLSB_REG = 0xF9; //Pressure XLSB
const BME280_TEMPERATURE_MSB_REG = 0xFA; //Temperature MSB
const BME280_TEMPERATURE_LSB_REG = 0xFB; //Temperature LSB
const BME280_TEMPERATURE_XLSB_REG = 0xFC; //Temperature XLSB
const BME280_HUMIDITY_MSB_REG = 0xFD; //Humidity MSB
const BME280_HUMIDITY_LSB_REG = 0xFE; //Humidity LSB

const CCS811_ADDRESS = 0xB6;
const CCS811_STATUS = 0x00;
const CCS811_MEAS_MODE = 0x01;
const CCS811_ALG_RESULT_DATA = 0x02;
const CCS811_RAW_DATA = 0x03;
const CCS811_ENV_DATA = 0x05;
const CCS811_NTC = 0x06;
const CCS811_THRESHOLDS = 0x10;
const CCS811_BASELINE = 0x11;
const CCS811_HW_ID = 0x20;
const CCS811_HW_VERSION = 0x21;
const CCS811_FW_BOOT_VERSION = 0x23;
const CCS811_FW_APP_VERSION = 0x24;
const CCS811_ERROR_ID = 0xE0;
const CCS811_APP_START = 0xF4;
const CCS811_SW_RESET = 0xFF;


const MODE_SLEEP = 0b00;
const MODE_FORCED = 0b01;
const MODE_NORMAL = 0b11;


class Environment {

    let tVOC: int = 0;
    let CO2: int = 0;
    let temperature = 0;
    let pressure = 0;
    let humidity = 0;

    let t_fine: int32;


    constructor(){
        return;
    }

    //Call to apply SensorSettings.
	//This also gets the SensorCalibration constants
    begin(){

    }

    getMode(){

    } //Get the current mode: sleep, forced, or normal

    setMode(mode: int8){

    } //Set the current mode

    setTempOverSample(overSampleAmount: int8){

    } //Set the temperature sample mode

    setPressureOverSample(overSampleAmount: int8){

    } //Set the pressure sample mode

    setHumidityOverSample(overSampleAmount: int8){

    } //Set the humidity sample mode

    setStandbyTime(timeSetting: int8){

    } //Set the standby time between measurements

    setFilter(filterSetting: int8){

    } //Set the filter

    setReferencePressure(refPressure: any){

    } //Allows user to set local sea level reference pressure

    getReferencePressure(){
        let float: any;
        return float;
    }

    readAlgorithmResults(){

    }
    dataAvailable(){
        let bool: any;
        return bool;
    }

    getTVOC(){
        let int: int16;
        return int;
    }

    getCO2(){
        let int: int16;
        return int;
    }

    isMeasuring(){
        let bool: any;
        return bool;
    }//Returns true while the device is taking measurement

    //Software reset routine
    reset(){

    }

    //Returns the values as floats.
    readFloatPressure(){
        let float: any;
        return float;
    }
    readFloatAltitudeMeters(){
        let float: any;
        return float;
    }
    readFloatAltitudeFeet(){
        let float: any;
        return float;
    }

    readFloatHumidity(){
        let float: any;
        return float;
    }

//Temperature related methods
    readTempC(){
        let float: any;
        return float;
    }
    readTempF(){
        let float: any;
        return float;
    }

//Dewpoint related methods
//From Pavel-Sayekat: https://github.com/sparkfun/SparkFun_BME280_Breakout_Board/pull/6/files
    dewPointC(){
        let double: any;
        return double;
    }
    dewPointF(){
        let double: any;
        return double;
    }

    checkForStatusError(){
        let bool: any;
        return bool;
    }
    appValid(){
        let bool: any;
        return bool;
    }
    
    setDriveMode(mode: int8){

    }
//The following utilities read and write

//ReadRegisterRegion takes a uint8 array address as input and reads
//a chunk of memory into that array.
    readRegisterRegion(address: int8, outputPointer: int8, offset: int8, length: int8){

    }
//readRegister reads one register
    readRegister(int: int8, int2: int8){
        return int;
    }
//Reads two regs, LSByte then MSByte order, and concatenates them
//Used for two-byte reads
    readRegisterInt16(int1: int8, offset: int8){
        let int: int8;
        return int;
    }
//Writes a byte;
    writeRegister(int1: int8, int2: int8, int3: int8){

    }

    multiWriteRegister(address: int8, offset: int8, inputPointer: int8, length: int8){

    }

// private

    checkSampleValue(userValue: int8){
        let int: int8;
        return int;
    } //Checks for valid over sample values

    _wireType = HARD_WIRE; //Default to Wire.h

    _referencePressure = 101325.0; //Default but is changeable
    

}