export interface FileInputEventTarget extends EventTarget {
    files: File[];
}

export interface FileInputEvent extends Event {
    target: FileInputEventTarget;
    getMessage():string;
}

export interface FileReaderEventTarget extends EventTarget {
    result:string
}

export interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}
