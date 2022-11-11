"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=error-response.js.map