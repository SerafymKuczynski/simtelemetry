// regex
// ^\s*((?:signed|unsigned|char|short|float|int| )+)(?:s|m)(\w+)(?:\[\d\])?;.*$
// $2: "$1",

// (\w)+: "((\w| )+)"(,?)
// { name: "$1", type: "$2" }$4

export interface IPacketInformation {
    size: number;
    td?: IType[];
}

export interface IType {
    name: string;
    type: string;
}

export const Categories = {
    CarPhysics: 0,
    RaceDefinition: 1,
    Participants: 2,
    Timings: 3,
    GameState: 4,
    WeatherState: 5,
    VehicleNames: 6,
    TimeStats: 7,
    ParticipantVehicleNames: 8
};

export const BaseTypes: IType[] = [
    { name: "PacketNumber", type: "unsigned int " },
    { name: "CategoryPacketNumber", type: "unsigned int " },
    { name: "PartialPacketIndex", type: "unsigned char " },
    { name: "PartialPacketNumber", type: "unsigned char " },
    { name: "PacketType", type: "unsigned char " },
    { name: "PacketVersion", type: "unsigned char " }
];

export const TelemetryDataTypes: IType[] = [
    // Participant info
    { name: "ViewedParticipantIndex", type: "signed char " },
    // Unfiltered input
    { name: "UnfilteredThrottle", type: "unsigned char " },
    { name: "UnfilteredBrake", type: "unsigned char " },
    { name: "UnfilteredSteering", type: "signed char " },
    { name: "UnfilteredClutch", type: "unsigned char " },
    // Car state
    { name: "CarFlags", type: "unsigned char " },
    { name: "OilTempCelsius", type: "signed short " },
    { name: "OilPressureKPa", type: "unsigned short " },
    { name: "WaterTempCelsius", type: "signed short " },
    { name: "WaterPressureKpa", type: "unsigned short " },
    { name: "FuelPressureKpa", type: "unsigned short " },
    { name: "FuelCapacity", type: "unsigned char " },
    { name: "Brake", type: "unsigned char " },
    { name: "Throttle", type: "unsigned char " },
    { name: "Clutch", type: "unsigned char " },
    { name: "FuelLevel", type: "float " },
    { name: "Speed", type: "float " },
    { name: "Rpm", type: "unsigned short " },
    { name: "MaxRpm", type: "unsigned short " },
    { name: "Steering", type: "signed char " },
    { name: "GearNumGears", type: "unsigned char " },
    { name: "BoostAmount", type: "unsigned char " },
    { name: "CrashState", type: "unsigned char " },
    { name: "OdometerKM", type: "float " },
    { name: "Orientation", type: "float array 3" },
    { name: "LocalVelocity", type: "float array 3" },
    { name: "WorldVelocity", type: "float array 3" },
    { name: "AngularVelocity", type: "float array 3" },
    { name: "LocalAcceleration", type: "float array 3" },
    { name: "WorldAcceleration", type: "float array 3" },
    { name: "ExtentsCentre", type: "float array 3" },
    { name: "TyreFlags", type: "unsigned char array 4" },
    { name: "Terrain", type: "unsigned char array 4" },
    { name: "TyreY", type: "float array 4" },
    { name: "TyreRPS", type: "float array 4" },
    { name: "TyreTemp", type: "unsigned char array 4" },
    { name: "TyreHeightAboveGround", type: "float array 4" },
    { name: "TyreWear", type: "unsigned char array 4" },
    { name: "BrakeDamage", type: "unsigned char array 4" },
    { name: "SuspensionDamage", type: "unsigned char array 4" },
    { name: "BrakeTempCelsius", type: "signed short array 4" },
    { name: "TyreTreadTemp", type: "unsigned short array 4" },
    { name: "TyreLayerTemp", type: "unsigned short array 4" },
    { name: "TyreCarcassTemp", type: "unsigned short array 4" },
    { name: "TyreRimTemp", type: "unsigned short array 4" },
    { name: "TyreInternalAirTemp", type: "unsigned short array 4" },
    { name: "TyreTempLeft", type: "unsigned short array 4" },
    { name: "TyreTempCenter", type: "unsigned short array 4" },
    { name: "TyreTempRight", type: "unsigned short array 4" },
    { name: "WheelLocalPositionY", type: "float array 4" },
    { name: "RideHeight", type: "float array 4" },
    { name: "SuspensionTravel", type: "float array 4" },
    { name: "SuspensionVelocity", type: "float array 4" },
    { name: "SuspensionRideHeight", type: "unsigned short array 4" },
    { name: "AirPressure", type: "unsigned short array 4" },
    { name: "EngineSpeed", type: "float " },
    { name: "EngineTorque", type: "float " },
    { name: "Wings", type: "unsigned char array 2" },
    { name: "HandBrake", type: "unsigned char " },
    // Car damage
    { name: "AeroDamage", type: "unsigned char " },
    { name: "EngineDamage", type: "unsigned char " },
    //  HW state
    { name: "JoyPad0", type: "unsigned int " },
    { name: "DPad", type: "unsigned char " },
    { name: "TyreCompound", type: "string 40 array 4" },
    { name: "TurboBoostPressure", type: "float" },
    { name: "FullPosition", type: "float array 3" },
    { name: "BrakeBias", type: "unsigned char" },
    { name: "TickCount", type: "unsigned int" }
];

export const HeaderSize = 12;
export const TypeInformations: IPacketInformation[] = [
    { size: 559,    td: TelemetryDataTypes },
    { size: 308,    td: undefined },
    { size: 1136,   td: undefined },
    { size: 1063,   td: undefined },
    { size: 24,     td: undefined },
    { size: 1024,   td: undefined },
    { size: 0,      td: undefined }
];
