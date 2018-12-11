import { ISimClientState } from "../../SimClients/type";

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
    TelemetryTickCount: number;
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
    TimingsTickCount: number;
}

export interface IGameState {
    BuildVersionNumber: number;
    GameState: number;
    AmbientTemperature: number;
    TrackTemperature: number;
    RainDensity: number;
    SnowDensity: number;
    WindSpeed: number;
    WindDirectionX: number;
    WindDirectionY: number;
}

export enum GameState {
    GAME_EXITED = 0,
    GAME_FRONT_END,
    GAME_INGAME_PLAYING,
    GAME_INGAME_PAUSED,
    GAME_INGAME_INMENU_TIME_TICKING,
    GAME_INGAME_RESTARTING,
    GAME_INGAME_REPLAY,
    GAME_FRONT_END_REPLAY,
}

export interface IRaceData {
    WorldFastestLapTime: number;
    PersonalFastestLapTime: number;
    PersonalFastestSector1Time: number;
    PersonalFastestSector2Time: number;
    PersonalFastestSector3Time: number;
    WorldFastestSector1Time: number;
    WorldFastestSector2Time: number;
    WorldFastestSector3Time: number;
    TrackLength: number;
    TrackLocation: string;
    TrackVariation: string;
    TranslatedTrackLocation: string;
    TranslatedTrackVariation: string;
    LapsTimeInEvent: number;
    EnforcedPitStopLap: number;
}

export interface IPC2StateMeta extends IRaceData {}
export interface IPC2StateValues extends ITelemetryData, ITimingsData { }
export interface IPC2State extends ISimClientState {
    meta: IPC2StateMeta;
    values: IPC2StateValues;
}
