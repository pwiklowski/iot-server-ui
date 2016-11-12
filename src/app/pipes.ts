import { Pipe } from '@angular/core';
import { IotService } from './iot.service';

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterable {
    transform(map: {}, args: any[] = null): any {
        if (!map)
            return null;
        return Object.keys(map).map((key) => ({ 'key': key, 'value': map[key] }));
    }
}



@Pipe({
    name: 'deviceAlias'
})
export class DeviceAlias{
    constructor(private iot: IotService) {}

    transform(uuid: string): string{
        console.log("transform", uuid);
        return this.iot.getAlias(uuid);
    }
}