const axios = require('axios');

var Service, Characteristic;

const DEF_MIN_LUX = 0,
      DEF_MAX_LUX = 10000;

const PLUGIN_NAME   = 'homebridge-fronius-inverter';
const ACCESSORY_NAME = 'FroniusInverter';

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory(PLUGIN_NAME, ACCESSORY_NAME, FroniusInverter);
}

// main api request with all data
const getInverterData = async(ip) => {
	try {
	    return await axios.get('http://'+ip+'/solar_api/v1/GetPowerFlowRealtimeData.fcgi')
	} catch (error) {
	    console.error(error)
	}
}

// live power consumption
const getCurrentConsumption = async (ip) => {

	const currentConsumption = await getInverterData(ip)

	if(currentConsumption.data.Body.Data.Site.P_Load == null) {
		return 0
	} else {
		return Math.abs(Math.round(currentConsumption.data.Body.Data.Site.P_Load, 1))
	}
}

class FroniusInverter {
    constructor(log, config) {
    	this.log = log
    	this.config = config

    	this.service = new Service.LightSensor(this.config.name)

    	this.name = config["name"];
    	this.manufacturer = config["manufacturer"] || "Fronius";
	    this.model = config["model"] || "Inverter";
	    this.serial = config["serial"] || "fronius-inverter-1";
	    this.ip = config["ip"];
	    this.inverter_data = config["inverter_data"];
	    this.minLux = config["min_lux"] || DEF_MIN_LUX;
    	this.maxLux = config["max_lux"] || DEF_MAX_LUX;
    }

    getServices () {
    	const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
        .setCharacteristic(Characteristic.Model, this.model)
        .setCharacteristic(Characteristic.SerialNumber, this.serial)

        this.service.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
	      .on('get', this.getOnCharacteristicHandler.bind(this))

	    return [informationService, this.service]
    }

    async getOnCharacteristicHandler (callback) {
	    const consumption = await getCurrentConsumption(this.ip)

	    this.log(`calling getOnCharacteristicHandler`, await getCurrentConsumption(this.ip))

	    callback(null, await getCurrentConsumption(this.ip))
	}
}
