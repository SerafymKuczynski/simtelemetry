export interface IPacketBase {
    PacketNumber: number;
    CategoryPacketNumber: number;
    PartialPacketIndex: number;
    PartialPacketNumber: number;
    PacketType: number;
    PacketVersion: number;
}

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
    TurboBoostPressure: number;
    FullPosition: number[];
    BrakeBias: number;
    TickCount: number;
}

export interface IParticipantInfo {
    WorldPosition: number[];
    Orientation: number[];
    CurrentLapDistance: number;
    RacePosition: number;
    Sector: number;
    HighestFlag: number;
    PitModeSchedule: number;
    CarIndex: number;
    RaceState: number;
    CurrentLap: number;
    CurrentTime: number;
    CurrentSectorTime: number;
    MPParticipantIndex: number;
}

export interface ITimingsData {
    NumParticipants: number;
    ParticipantsChangedTimestamp: number;
    EventTimeRemaining: number;
    SplitTimeAhead: number;
    SplitTimeBehind: number;
    SplitTime: number;
    Participants: IParticipantInfo[];
    LocalParticipantIndex: number;
    TickCount: number;
}
