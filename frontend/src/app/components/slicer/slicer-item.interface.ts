import { Type } from "@angular/core";

export interface SlicerItem {
    title: string;
    icon: string;
    component: Type<any>;
}