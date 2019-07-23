export class HelloWorld {
    private message_: string;

    constructor(message: string = 'Anon') {
        this.message_ = message;    
    }

    public sayHello(): void {
        console.log(`Hello, ${this.message_}`)
    }
}