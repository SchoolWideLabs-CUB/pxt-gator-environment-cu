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

    _wireType = HARD_WIRE; //Default to Wire.h

    _referencePressure = 101325.0; //Default but is changeable


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

        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG);
        return(controlData & 0b00000011); //Clear bits 7 through 2


       

    } //Get the current mode: sleep, forced, or normal

    //Set the mode bits in the ctrl_meas register
    // Mode 00 = Sleep
    // 01 and 10 = Forced
    // 11 = Normal mode
    setMode(mode: bigint){

        if (mode > 0b11) {
            mode = 0; //Error check. Default to sleep mode
        }
    
        let controlData = readRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG);
        controlData &= ~( (1<<1) | (1<<0) ); //Clear the mode[1:0] bits
        controlData |= mode; //Set
        writeRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG, controlData);

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

    //Set the temperature oversample value
    //0 turns off temp sensing
    //1 to 16 are valid over sampling values
    setTempOverSample(overSampleAmount: bigint){
        overSampleAmount = checkSampleValue(overSampleAmount); //Error check
    
        let originalMode: bigint = getMode(); //Get the current mode so we can go back to it at the end
        
        setMode(MODE_SLEEP); //Config will only be writeable in sleep mode, so first go to sleep mode

        //Set the osrs_t bits (7, 6, 5) to overSampleAmount
        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG);
        controlData &= ~( (1<<7) | (1<<6) | (1<<5) ); //Clear bits 765
        controlData |= overSampleAmount << 5; //Align overSampleAmount to bits 7/6/5
        writeRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG, controlData);
        
        setMode(originalMode); //Return to the original user's choice

    } //Set the temperature sample mode

    //Set the pressure oversample value
    //0 turns off pressure sensing
    //1 to 16 are valid over sampling values
    setPressureOverSample(overSampleAmount: bigint){
        overSampleAmount = checkSampleValue(overSampleAmount); //Error check
    
        let originalMode: bigint = getMode(); //Get the current mode so we can go back to it at the end
        
        setMode(MODE_SLEEP); //Config will only be writeable in sleep mode, so first go to sleep mode

        //Set the osrs_p bits (4, 3, 2) to overSampleAmount
        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG);
        controlData &= ~( (1<<4) | (1<<3) | (1<<2) ); //Clear bits 432
        controlData |= overSampleAmount << 2; //Align overSampleAmount to bits 4/3/2
        writeRegister(BME280_ADDRESS, BME280_CTRL_MEAS_REG, controlData);
        
        setMode(originalMode); //Return to the original user's choice

    } //Set the pressure sample mode

    //Set the humidity oversample value
    //0 turns off humidity sensing
    //1 to 16 are valid over sampling values
    setHumidityOverSample(overSampleAmount: bigint){
        overSampleAmount = checkSampleValue(overSampleAmount); //Error check
        
        let originalMode: bigint = getMode(); //Get the current mode so we can go back to it at the end
        
        setMode(MODE_SLEEP); //Config will only be writeable in sleep mode, so first go to sleep mode

        //Set the osrs_h bits (2, 1, 0) to overSampleAmount
        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CTRL_HUMIDITY_REG);
        controlData &= ~( (1<<2) | (1<<1) | (1<<0) ); //Clear bits 2/1/0
        controlData |= overSampleAmount << 0; //Align overSampleAmount to bits 2/1/0
        writeRegister(BME280_ADDRESS, BME280_CTRL_HUMIDITY_REG, controlData);

        setMode(originalMode); //Return to the original user's choice

    } //Set the humidity sample mode

    //Set the standby bits in the config register
    //tStandby can be:
    //  0, 0.5ms
    //  1, 62.5ms
    //  2, 125ms
    //  3, 250ms
    //  4, 500ms
    //  5, 1000ms
    //  6, 10ms
    //  7, 20ms
    setStandbyTime(timeSetting: bigint){
        if (timeSetting > 0b111) {
            timeSetting = 0; //Error check. Default to 0.5ms
        }
    
        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CONFIG_REG);
        controlData &= ~( (1<<7) | (1<<6) | (1<<5) ); //Clear the 7/6/5 bits
        controlData |= (timeSetting << 5); //Align with bits 7/6/5
        writeRegister(BME280_ADDRESS, BME280_CONFIG_REG, controlData);

    } //Set the standby time between measurements

    //Set the filter bits in the config register
    //filter can be off or number of FIR coefficients to use:
    //  0, filter off
    //  1, coefficients = 2
    //  2, coefficients = 4
    //  3, coefficients = 8
    //  4, coefficients = 16
    setFilter(filterSetting: bigint){
        if(filterSetting > 0b111){ 
            filterSetting = 0; //Error check. Default to filter off
        }
        let controlData: bigint = readRegister(BME280_ADDRESS, BME280_CONFIG_REG);
        controlData &= ~( (1<<4) | (1<<3) | (1<<2) ); //Clear the 4/3/2 bits
        controlData |= (filterSetting << 2); //Align with bits 4/3/2
        writeRegister(BME280_ADDRESS, BME280_CONFIG_REG, controlData);

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
        let value: bigint = readRegister(CCS811_ADDRESS, CCS811_STATUS);
        return (value & 1 << 3);
    }

    getTVOC(){
        return tVOC;
    }

    getCO2(){
        return CO2;

    //Check the measuring bit and return true while device is taking measurement
    isMeasuring(){
        let stat: bigint = readRegister(BME280_ADDRESS, BME280_STAT_REG);
        return (stat & (1<<3)); //If the measuring bit (3) is set, return true
    }//Returns true while the device is taking measurement

    //Software reset routine: strictly resets. Run .begin() afterwards
    reset(){
        writeRegister(BME280_ADDRESS, BME280_RST_REG, 0xB6);

    }

    //Returns the values as floats.
    readFloatPressure(){

        // Returns pressure in Pa as unsigned 32 bit integer in Q24.8 format (24 integer bits and 8 fractional bits).
        // Output value of “24674867” represents 24674867/256 = 96386.2 Pa = 963.862 hPa
        uint8_t buffer[3];
        readRegisterRegion(BME280_ADDRESS, &buffer[0], BME280_PRESSURE_MSB_REG, 3);
        int32_t adc_P = ((uint32_t)buffer[0] << 12) | ((uint32_t)buffer[1] << 4) | ((buffer[2] >> 4) & 0x0F);
        
        int64_t var1, var2, p_acc;
        var1 = ((int64_t)t_fine) - 128000;
        var2 = var1 * var1 * (int64_t)calibration.dig_P6;
        var2 = var2 + ((var1 * (int64_t)calibration.dig_P5)<<17);
        var2 = var2 + (((int64_t)calibration.dig_P4)<<35);
        var1 = ((var1 * var1 * (int64_t)calibration.dig_P3)>>8) + ((var1 * (int64_t)calibration.dig_P2)<<12);
        var1 = (((((int64_t)1)<<47)+var1))*((int64_t)calibration.dig_P1)>>33;
        if (var1 == 0)
        {
            return 0; // avoid exception caused by division by zero
        }
        p_acc = 1048576 - adc_P;
        p_acc = (((p_acc<<31) - var2)*3125)/var1;
        var1 = (((int64_t)calibration.dig_P9) * (p_acc>>13) * (p_acc>>13)) >> 25;
        var2 = (((int64_t)calibration.dig_P8) * p_acc) >> 19;
        p_acc = ((p_acc + var1 + var2) >> 8) + (((int64_t)calibration.dig_P7)<<4);
        
        pressure = (float)p_acc / 256.0;
        return pressure;
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

    //Validates an over sample value
    //Allowed values are 0 to 16
    //These are used in the humidty, pressure, and temp oversample functions
    checkSampleValue(userValue: bigint){
        switch(userValue) 
        {
            case(0): 
                return 0;
                break; //Valid
            case(1): 
                return 1;
                break; //Valid
            case(2): 
                return 2;
                break; //Valid
            case(4): 
                return 3;
                break; //Valid
            case(8): 
                return 4;
                break; //Valid
            case(16): 
                return 5;
                break; //Valid
            default: 
                return 1; //Default to 1x
                break; //Good
        }
    } //Checks for valid over sample values


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








