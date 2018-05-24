// regex
// ^\s*((?:signed|unsigned|char|short|float|int| )+)(?:s|m)(\w+)(?:\[\d\])?;.*$
// $2: "$1",

export const PacketTypes = {
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

export const PacketBaseTypes = {
    PacketNumber: "unsigned int ",
    CategoryPacketNumber: "unsigned int ",
    PartialPacketIndex: "unsigned char ",
    PartialPacketNumber: "unsigned char ",
    PacketType: "unsigned char ",
    PacketVersion: "unsigned char "
};

export interface IPacketBase {
    PacketNumber: number;
    CategoryPacketNumber: number;
    PartialPacketIndex: number;
    PartialPacketNumber: number;
    PacketType: number;
    PacketVersion: number;
}

export const TelemetryDataTypes = {
    // Participant info
    ViewedParticipantIndex: "signed char ",
    // Unfiltered input
    UnfilteredThrottle: "unsigned char ",
    UnfilteredBrake: "unsigned char ",
    UnfilteredSteering: "signed char ",
    UnfilteredClutch: "unsigned char ",
    // Car state
    CarFlags: "unsigned char ",
    OilTempCelsius: "signed short ",
    OilPressureKPa: "unsigned short ",
    WaterTempCelsius: "signed short ",
    WaterPressureKpa: "unsigned short ",
    FuelPressureKpa: "unsigned short ",
    FuelCapacity: "unsigned char ",
    Brake: "unsigned char ",
    Throttle: "unsigned char ",
    Clutch: "unsigned char ",
    FuelLevel: "float ",
    Speed: "float ",
    Rpm: "unsigned short ",
    MaxRpm: "unsigned short ",
    Steering: "signed char ",
    GearNumGears: "unsigned char ",
    BoostAmount: "unsigned char ",
    CrashState: "unsigned char ",
    OdometerKM: "float ",
    Orientation: "float array 3",
    LocalVelocity: "float array 3",
    WorldVelocity: "float array 3",
    AngularVelocity: "float array 3",
    LocalAcceleration: "float array 3",
    WorldAcceleration: "float array 3",
    ExtentsCentre: "float array 3",
    TyreFlags: "unsigned char array 4",
    Terrain: "unsigned char array 4",
    TyreY: "float array 4",
    TyreRPS: "float array 4",
    TyreTemp: "unsigned char array 4",
    TyreHeightAboveGround: "float array 4",
    TyreWear: "unsigned char array 4",
    BrakeDamage: "unsigned char array 4",
    SuspensionDamage: "unsigned char array 4",
    BrakeTempCelsius: "signed short array 4",
    TyreTreadTemp: "unsigned short array 4",
    TyreLayerTemp: "unsigned short array 4",
    TyreCarcassTemp: "unsigned short array 4",
    TyreRimTemp: "unsigned short array 4",
    TyreInternalAirTemp: "unsigned short array 4",
    TyreTempLeft: "unsigned short array 4",
    TyreTempCenter: "unsigned short array 4",
    TyreTempRight: "unsigned short array 4",
    WheelLocalPositionY: "float array 4",
    RideHeight: "float array 4",
    SuspensionTravel: "float array 4",
    SuspensionVelocity: "float array 4",
    SuspensionRideHeight: "unsigned short array 4",
    AirPressure: "unsigned short array 4",
    EngineSpeed: "float ",
    EngineTorque: "float ",
    Wings: "unsigned char array 2",
    HandBrake: "unsigned char ",
    // Car damage
    AeroDamage: "unsigned char ",
    EngineDamage: "unsigned char ",
    //  HW state
    JoyPad0: "unsigned int ",
    DPad: "unsigned char ",
    TyreCompound: "string 40 array 4"
};

export interface ITelemetryData {
    ViewedParticipantIndex: number;
    UnfilteredThrottle: number;
    UnfilteredBrake: number;
    UnfilteredSteering: number;
    UnfilteredClutch: number;
    CarFlags: number;
    OilTempCelsius: number;
    OilPressureKPa: number;
    WaterTempCelsius: number;
    WaterPressureKpa: number;
    FuelPressureKpa: number;
    FuelCapacity: number;
    Brake: number;
    Throttle: number;
    Clutch: number;
    FuelLevel: number;
    Speed: number;
    Rpm: number;
    MaxRpm: number;
    Steering: number;
    GearNumGears: number;
    BoostAmount: number;
    CrashState: number;
    OdometerKM: number;
    Orientation: number[];
    LocalVelocity: number[];
    WorldVelocity: number[];
    AngularVelocity: number[];
    LocalAcceleration: number[];
    WorldAcceleration: number[];
    ExtentsCentre: number[];
    TyreFlags: number[];
    Terrain: number[];
    TyreY: number[];
    TyreRPS: number[];
    TyreTemp: number[];
    TyreHeightAboveGround: number[];
    TyreWear: number[];
    BrakeDamage: number[];
    SuspensionDamage: number[];
    BrakeTempCelsius: number[];
    TyreTreadTemp: number[];
    TyreLayerTemp: number[];
    TyreCarcassTemp: number[];
    TyreRimTemp: number[];
    TyreInternalAirTemp: number[];
    TyreTempLeft: number[];
    TyreTempCenter: number[];
    TyreTempRight: number[];
    WheelLocalPositionY: number[];
    RideHeight: number[];
    SuspensionTravel: number[];
    SuspensionVelocity: number[];
    SuspensionRideHeight: number[];
    AirPressure: number[];
    EngineSpeed: number;
    EngineTorque: number;
    Wings: number[];
    HandBrake: number;
    AeroDamage: number;
    EngineDamage: number;
    JoyPad0: number;
    DPad: number;
    TyreCompound: string[];
}
