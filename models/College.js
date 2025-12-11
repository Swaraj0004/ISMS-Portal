"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var collegeSchema = new mongoose_1.Schema({
    taluka: { type: String, required: true },
    name: { type: String, required: true },
    nameData: { type: String, default: "" },
});
exports.default = mongoose_1.default.models.College || mongoose_1.default.model("College", collegeSchema);
