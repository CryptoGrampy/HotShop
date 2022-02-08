export class ErrorInvalidMoneroAddress extends Error {
    name = this.constructor.name
    constructor(message) {
        super(message)
    }
}
