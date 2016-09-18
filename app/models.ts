

export class Device{
    id: string;
    name: string;

}
export class Script {
	Id: string;
    Name: string;
	ScriptUuid: string;
	DeviceUuid: Array<string>;
}
export class ScriptVersion{
	Version: number;
	Content: string;
}

export class DeviceVariable{
    name: string;
    values: any;
    
}

export class Log{
    Content: string;
    Timestamp: number;

}

