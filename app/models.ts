

export class Device{
    id: string;
    name: string;

}
export class Script {
	Id: string;
    Name: string;
	ScriptUuid: string;
	DeviceUuid: string
}
export class ScriptVersion{
	Version: number;
	Content: string;
}
export class DeviceValue{
    rt: string;
    value: any;
}
export class DeviceVariable{
    name: string;
    valies: Array<DeviceValue>;
    
}

