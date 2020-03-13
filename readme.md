# homebridge-fronius-inverter
A homebridge plugin to pull Fronius solar inverter data into HomeKit as a light sensor accessory.

Inspired by homebridge-symo-cmd

# Installation

1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-fronius-inverter
3. Update your configuration file using the example below.

# Configuration

Add a new accessory for "FroniusInverter" with a name for the accessory and the inverts IP Address as per the example below.

The following inverter data can be returned :

* **P_PV** - Live energy generation from the solar array
* **P_Load** - Live energy consumption through the inverter
* **P_Grid** - Live energy consumption from the grid

The following data can also be returned but is not fully supported at this time:

* **E_Day** - Energy generated in watt-hours for the current year
* **E_Year** - Energy generated in watt-hours for the current year
* **E_Total** - Total energy generated in watt-hours
* **P_Akku** - Battery charge or discharge state. 

```
"accessories": [
    {
        "accessory": "FroniusInverter",
        "name": "Generation",
        "ip": "xxx.xxx.xxx.xxx",
        "inverter_data": "P_PV"
    },
    {
        "accessory": "FroniusInverter",
        "name": "Consumption",
        "ip": "xxx.xxx.xxx.xxx",
        "inverter_data": "P_Load"
    }
]
```


