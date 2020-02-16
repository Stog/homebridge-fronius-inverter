const axios = require('axios');

var Service, Characteristic;

const DEF_MIN_LUX = 0,
      DEF_MAX_LUX = 10000;

var inverter_ip = ''
const PLUGIN_NAME   = 'homebridge-fronius-inverter';
const ACCESSORY_NAME = 'FroniusInverter';

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-fronius-inverter', 'FroniusInverter', FroniusInverter);
}

// main api request with all data
const getInverterData = async() => {
	try {
	    return await axios.get(inverter_ip+'/solar_api/v1/GetPowerFlowRealtimeData.fcgi')
	} catch (error) {
	    console.error(error)
	}
}

// live power consumption
const getCurrentConsumption = async () => {
	const currentConsumption = await getInverterData()

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
    }

    getServices () {
    	const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'Fronius')
        .setCharacteristic(Characteristic.Model, 'Inverter')
        .setCharacteristic(Characteristic.SerialNumber, 'fronius-inverter-1')

        this.service.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
	      .on('get', this.getOnCharacteristicHandler.bind(this))

	    return [informationService, this.service]
    }

    async getOnCharacteristicHandler (callback) {
	    /*
	     * this is called when HomeKit wants to retrieve the current state of the characteristic as defined in our getServices() function
	     * it's called each time you open the Home app or when you open control center
	     */

	    const consumption = await getCurrentConsumption()

	    /* Log to the console the value whenever this function is called */
	    this.log(`calling getOnCharacteristicHandler`, await getCurrentConsumption())

	    // console.log('Current Consumption: '+ getCurrentConsumption())

	    /*
	     * The callback function should be called to return the value
	     * The first argument in the function should be null unless and error occured
	     * The second argument in the function should be the current value of the characteristic
	     * This is just an example so we will return the value from `this.isOn` which is where we stored the value in the set handler
	     */
	    callback(null, await getCurrentConsumption())
	}
}
