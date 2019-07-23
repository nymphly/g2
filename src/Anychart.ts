import { HelloWorld } from './HelloWorld';

export class Anychart {
    private hello_: HelloWorld;

    constructor(helloMessage: string|undefined) {
        this.hello_ = new HelloWorld(helloMessage);
    }

    public sayHello() {
        this.hello_.sayHello();
    }
}