"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshot = exports.getRefs = exports.getRef = exports.getFirstRef = exports.getFirstDoc = exports.getField = exports.getDocs = exports.getDoc = exports.getCollectionRef = exports.fieldValue = exports.init = void 0;
var firebase_admin_1 = __importDefault(require("firebase-admin"));
var db;
var init = function (serviceAccount) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
    db = firebase_admin_1.default.firestore();
};
exports.init = init;
exports.fieldValue = firebase_admin_1.default.firestore.FieldValue;
var getCollectionRef = function (name) {
    return db.collection(name);
};
exports.getCollectionRef = getCollectionRef;
var getDoc = function (query) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, exports.getFirstDoc(query)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.getDoc = getDoc;
var getDocs = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var result, snapshot, _i, _a, doc;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                result = [];
                if (!query || !Object.keys(query).length)
                    return [2 /*return*/, result];
                return [4 /*yield*/, exports.getSnapshot(query)];
            case 1:
                snapshot = _b.sent();
                if (!snapshot || snapshot.empty)
                    return [2 /*return*/, result];
                for (_i = 0, _a = snapshot.docs; _i < _a.length; _i++) {
                    doc = _a[_i];
                    if (doc.exists)
                        result.push(doc.data());
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.getDocs = getDocs;
var getField = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var result, snapshot, _i, _a, doc, field;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                result = [];
                if (!query || !Object.keys(query).length)
                    return [2 /*return*/, result];
                return [4 /*yield*/, exports.getSnapshot(query)];
            case 1:
                snapshot = _b.sent();
                if (!snapshot || snapshot.empty)
                    return [2 /*return*/, null];
                for (_i = 0, _a = snapshot.docs; _i < _a.length; _i++) {
                    doc = _a[_i];
                    field = doc.get(query.field);
                    if (!field)
                        return [2 /*return*/, null];
                    result.push(field);
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.getField = getField;
var getFirstDoc = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var docs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!query || !Object.keys(query).length)
                    return [2 /*return*/, null];
                return [4 /*yield*/, exports.getDocs(query)];
            case 1:
                docs = _a.sent();
                return [2 /*return*/, docs.length ? docs[0] : null];
        }
    });
}); };
exports.getFirstDoc = getFirstDoc;
var getFirstRef = function (query, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query || !Object.keys(query).length)
                        return [2 /*return*/, defaultVal];
                    return [4 /*yield*/, exports.getSnapshot(query)];
                case 1:
                    snapshot = _a.sent();
                    if (!snapshot || snapshot.empty)
                        return [2 /*return*/, defaultVal];
                    return [2 /*return*/, snapshot.docs.length ? snapshot.docs[0].ref : null];
            }
        });
    });
};
exports.getFirstRef = getFirstRef;
var getRef = function (query, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFirstRef(query, defaultVal)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    }); });
};
exports.getRef = getRef;
var getRefs = function (query, defaultVal) {
    if (defaultVal === void 0) { defaultVal = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var result, snapshot, _i, _a, doc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    result = [];
                    if (!query || !Object.keys(query).length)
                        return [2 /*return*/, defaultVal];
                    return [4 /*yield*/, exports.getSnapshot(query)];
                case 1:
                    snapshot = _b.sent();
                    if (!snapshot || snapshot.empty)
                        return [2 /*return*/, defaultVal];
                    for (_i = 0, _a = snapshot.docs; _i < _a.length; _i++) {
                        doc = _a[_i];
                        if (doc.exists)
                            result.push(doc.ref);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getRefs = getRefs;
var getSnapshot = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var collectionRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!query || !Object.keys(query).length)
                    return [2 /*return*/, null];
                collectionRef = exports.getCollectionRef(query.collection);
                query.params.forEach(function (param) {
                    var path = param[0], op = param[1], value = param[2];
                    collectionRef = collectionRef.where(path, op, typeof value === "function" ? value(query.data) : value);
                });
                return [4 /*yield*/, collectionRef.get()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getSnapshot = getSnapshot;
