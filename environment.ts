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

const CCS811_ADDRESS = 0x5B;
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

    tVOC: bigint = 0;
    CO2: bigint = 0;
    temperature = 0;
    pressure = 0;
    humidity = 0;

    t_fine: bigint;

    SensorCalibration calibration;
    BMErunMode: bigint;
    BMEtStandby: bigint;
    BMEfilter: bigint;
    BMEtempOverSample: bigint;
    BMEpressOverSample: bigint;
    BMEhumidOverSample: bigint;
    BMEtempCorrection: number;


    constructor(){
        return;
    }

    //Call to apply SensorSettings.
	//This also gets the SensorCalibration constants
    begin(){

        BMErunMode = 3; //Normal/Run
        BMEtStandby = 0; //0.5ms
        BMEfilter = 0; //Filter off
        BMEtempOverSample = 1;
        BMEpressOverSample = 1;
        BMEhumidOverSample = 1;
        BMEtempCorrection = 0.0; // correction of temperature - added to the result
        //Check communication with IC before anything else

        //Reading all compensation data, range 0x88:A1, 0xE1:E7
        calibration.dig_T1 = (readRegister(BME280_ADDRESS, BME280_DIG_T1_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_T1_LSB_REG);
        calibration.dig_T2 = (readRegister(BME280_ADDRESS, BME280_DIG_T2_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_T2_LSB_REG);
        calibration.dig_T3 = (readRegister(BME280_ADDRESS, BME280_DIG_T3_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_T3_LSB_REG);

        calibration.dig_P1 = (readRegister(BME280_ADDRESS, BME280_DIG_P1_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P1_LSB_REG);
        calibration.dig_P2 = (readRegister(BME280_ADDRESS, BME280_DIG_P2_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P2_LSB_REG);
        calibration.dig_P3 = (readRegister(BME280_ADDRESS, BME280_DIG_P3_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P3_LSB_REG);
        calibration.dig_P4 = (readRegister(BME280_ADDRESS, BME280_DIG_P4_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P4_LSB_REG);
        calibration.dig_P5 = (readRegister(BME280_ADDRESS, BME280_DIG_P5_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P5_LSB_REG);
        calibration.dig_P6 = (readRegister(BME280_ADDRESS, BME280_DIG_P6_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P6_LSB_REG);
        calibration.dig_P7 = (readRegister(BME280_ADDRESS, BME280_DIG_P7_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P7_LSB_REG);
        calibration.dig_P8 = (readRegister(BME280_ADDRESS, BME280_DIG_P8_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P8_LSB_REG);
        calibration.dig_P9 = (readRegister(BME280_ADDRESS, BME280_DIG_P9_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_P9_LSB_REG);

        calibration.dig_H1 = readRegister(BME280_ADDRESS, BME280_DIG_H1_REG);
        calibration.dig_H2 = (readRegister(BME280_ADDRESS, BME280_DIG_H2_MSB_REG) << 8) + readRegister(BME280_ADDRESS, BME280_DIG_H2_LSB_REG);
        calibration.dig_H3 = readRegister(BME280_ADDRESS, BME280_DIG_H3_REG);
        calibration.dig_H4 = (readRegister(BME280_ADDRESS, BME280_DIG_H4_MSB_REG) << 4) + (readRegister(BME280_ADDRESS, BME280_DIG_H4_LSB_REG) & 0x0F);
        calibration.dig_H5 = (readRegister(BME280_ADDRESS, BME280_DIG_H5_MSB_REG) << 4) + ((readRegister(BME280_ADDRESS, BME280_DIG_H4_LSB_REG) >> 4) & 0x0F);
        calibration.dig_H6 = readRegister(BME280_ADDRESS, BME280_DIG_H6_REG);

        //Most of the time the sensor will be init with default values
        //But in case user has old/deprecated code, use the BMEsettings.x values
        setStandbyTime(BMEtStandby);
        setFilter(BMEfilter);
        setPressureOverSample(BMEtempOverSample); //Default of 1x oversample
        setHumidityOverSample(BMEpressOverSample); //Default of 1x oversample
        setTempOverSample(BMEhumidOverSample); //Default of 1x oversample
        
        setMode(BMErunMode); //Go!
        
        let data[4]: number[]= [0x11,0xE5,0x72,0x8A]; //Reset key
        
        readRegister(CCS811_ADDRESS, CCS811_HW_ID);

        //Reset the device
        multiWriteRegister(CCS811_ADDRESS, CCS811_SW_RESET, data, 4);

        //Tclk = 1/16MHz = 0x0000000625
        //0.001 s / tclk = 16000 counts
        let temp: bigint = 0;

        for(let i = 0; i < 200000; i++ ) //Spin for a good while
        {
            temp++;
        }
        
        checkForStatusError();
        
        appValid();
        //Write 0 bytes to this register to start app

    }

    //Set the mode bits in the ctrl_meas register
    // Mode 00 = Sleep
    // 01 and 10 = Forced
    // 11 = Normal mode
    getMode(){

        if (mode > 0b11) {
            mode = 0; //Error check. Default to sleep mode
        }
    
        let controlData = readRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG);
        controlData &= ~( (1<<1) | (1<<0) ); //Clear the mode[1:0] bits
        controlData |= mode; //Set
        writeRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG, controlData);

    } //Get the current mode: sleep, forced, or normal

    setMode(mode: bigint){

    } //Set the current mode

    //Mode 0 = Idle
    //Mode 1 = read every 1s
    //Mode 2 = every 10s
    //Mode 3 = every 60s
    //Mode 4 = RAW mode
    setDriveMode(mode) {
        if (mode > 4) {
            mode = 4; //sanitize input
        }
        let value = readRegister(CCS811_ADDRESS, CCS811_MEAS_MODE); //Read what's currently there
        value &= ~(0b00000111 << 4); //Clear DRIVE_MODE bits
        value |= (mode << 4); //Mask in mode
        writeRegister(CCS811_ADDRESS, CCS811_MEAS_MODE, value);

    }

    setTempOverSample(overSampleAmount: bigint){

    } //Set the temperature sample mode

    setPressureOverSample(overSampleAmount: bigint){

    } //Set the pressure sample mode

    setHumidityOverSample(overSampleAmount: bigint){

    } //Set the humidity sample mode

    setStandbyTime(timeSetting: bigint){

    } //Set the standby time between measurements

    setFilter(filterSetting: bigint){

    } //Set the filter

    setReferencePressure(refPressure: any){

    } //Allows user to set local sea level reference pressure

    getReferencePressure(){
        let float: number;
        return float;
    }

    readAlgorithmResults(){

        let data: [number, number, number, number];
        readRegisterRegion(CCS811_ADDRESS, data, CCS811_ALG_RESULT_DATA, 4);
        // Data ordered:
        // co2MSB, co2LSB, tvocMSB, tvocLSB

        CO2 = (data[0] << 8) | data[1];
        tVOC = (data[2] << 8) | data[3];

    }
    dataAvailable(){
        let bool: boolean;
        return bool;
    }

    getTVOC(){
        let int: bigint;
        return int;
    }

    getCO2(){
        let int: bigint;
        return int;
    }

    isMeasuring(){
        let bool: boolean;
        return bool;
    }//Returns true while the device is taking measurement

    //Software reset routine
    reset(){

    }

    //Returns the values as floats.
    readFloatPressure(){
        let float: number;
        return float;
    }
    readFloatAltitudeMeters(){
        let float: number;
        return float;
    }
    readFloatAltitudeFeet(){
        let float: number;
        return float;
    }

    readFloatHumidity(){
        let float: number;
        return float;
    }

//Temperature related methods
    readTempC(){
        let float: number;
        return float;
    }
    readTempF(){
        let float: number;
        return float;
    }

//Dewpoint related methods
//From Pavel-Sayekat: https://github.com/sparkfun/SparkFun_BME280_Breakout_Board/pull/6/files
    dewPointC(){
        let double: bigint;
        return double;
    }
    dewPointF(){
        let double: bigint;
        return double;
    }

    checkForStatusError(){
        let value = readRegister(CCS811_ADDRESS, CCS811_STATUS);
        return (value & 1 << 0);
    }
    appValid(){
        let value = readRegister(CCS811_ADDRESS, CCS811_STATUS);
        return (value & 1 << 4);
    }
    
    setDriveMode(mode: bigint){

    }
//The following utilities read and write

//ReadRegisterRegion takes a ubigint array address as input and reads
//a chunk of memory into that array.
    readRegisterRegion(address: bigint, outputPointer: bigint, offset: bigint, length: bigint){

    }
//readRegister reads one register
    readRegister(int: bigint, int2: bigint){
        return int;
    }
//Reads two regs, LSByte then MSByte order, and concatenates them
//Used for two-byte reads
    readRegisterInt16(int1: bigint, offset: bigint){
        int: bigint;
        return int;
    }
//Writes a byte;
    writeRegister(int1: bigint, int2: bigint, int3: bigint){

    }

    multiWriteRegister(address: bigint, offset: bigint, inputPointer: bigint, length: bigint){

    }

// private

    checkSampleValue(userValue: bigint){
        int: bigint;
        return int;
    } //Checks for valid over sample values

    _wireType = HARD_WIRE; //Default to Wire.h

    _referencePressure = 101325.0; //Default but is changeable
}

class SensorCalibration {

    dig_T1: bigint;
    dig_T2: bigint;
    dig_T3: bigint;
    
    dig_P1: bigint;
    dig_P2: bigint;
    dig_P3: bigint;
    dig_P4: bigint;
    dig_P5: bigint;
    dig_P6: bigint;
    dig_P7: bigint;
    dig_P8: bigint;
    dig_P9: bigint;
    
    dig_H1: bigint;
    dig_H2: bigint;
    dig_H3: bigint;
    dig_H4: bigint;
    dig_H5: bigint;
    dig_H6: bigint;

    constructor(){
        return;
    }
}








