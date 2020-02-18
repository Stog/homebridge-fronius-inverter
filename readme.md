# homebridge-fronius-inverter
A homebridge plugin to pull Fronius solar inverter data into HomeKit as a light sensor accessory.

Inspired by homebridge-symo-cmd

# Installation

1. Install homebridge using: sudo npm install -g homebridge
2. Install this plugin using: sudo npm install -g homebridge-fronius-inverter
3. Update your configuration file using the example below.

# Configuration

Add a new accessory for "FroniusInverter" with a name for the accessory and the inverts IP Address as per the example below.

Consumption is the only value currently supported and will be returned by the accessory.

```
"accessories": [
    {
        "accessory": "FroniusInverter",
        "name": "Consumption",
        "ip": "xxx.xxx.xxx.xxx"
    }
]
```
