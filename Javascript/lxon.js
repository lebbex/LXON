/**
 * @file lxon.js
 * @description Official JavaScript reference parser and stringifier for LXON.
 * 
 * Copyright 2026 Nicholas (Jasper) Birla-Eliade. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { inspect } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



class LxonError extends Error {
    constructor(message) {
        const stop = new Set(["\n","\r","\t"]);
        let start = i;
        let end = i;
        for (let k = 0; k < 20 && start > 0; k++) {
            if (stop.has(file[start - 1])) break;
            start--;
        }
        for (let k = 0; k < 20 && end < file.length; k++) {
            if (stop.has(file[end])) break;
            end++;
        }
        const line = file.slice(start, end);
        super(message + `\n⤷ at line ${ln}, column ${col}\n→ ` + line + " ←\n  " + " ".repeat(i - start) + "^");
        this.name = "LxonError";
    }
}


class ColorSRGB {
    constructor(r, g, b, a = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static fromHex(hex){
        const r = parseInt(hex.slice(0,2), 16);
        const g = parseInt(hex.slice(2,4), 16);
        const b = parseInt(hex.slice(4,6), 16);
        const a = hex.length >= 8 ? parseInt(hex.slice(6,8), 16) : 255;
        return new ColorSRGB(r / 255, g / 255, b / 255, a / 255);
    }

    static from8bit(r, g, b, a = 255){
        return new ColorSRGB(r / 255, g / 255, b / 255, a / 255);
    }

    toHex(){
        const r = Math.round(this.r * 255).toString(16).padStart(2, "0");
        const g = Math.round(this.g * 255).toString(16).padStart(2, "0");
        const b = Math.round(this.b * 255).toString(16).padStart(2, "0");
        const a = Math.round(this.a * 255).toString(16).padStart(2, "0");
        return this.a === 1 ? r + g + b : r + g + b + a;
    }

    toString(){ return `#${this.toHex()}`; }

    [inspect.custom]() { return `#${this.toHex()} (srgb)`; }

    toLinear(){
        return new LinearColor(
            Math.pow(this.r, 2.2),
            Math.pow(this.g, 2.2),
            Math.pow(this.b, 2.2),
            this.a, false
        );
    }
}


class LinearColor{
    constructor(r, g, b, a = 1, bit16 = false){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.bit16 = bit16;
    }

    static fromHex(hex){
        const r = parseInt(hex.slice(0,2), 16);
        const g = parseInt(hex.slice(2,4), 16);
        const b = parseInt(hex.slice(4,6), 16);
        const a = hex.length >= 8 ? parseInt(hex.slice(6,8), 16) : 255;
        return new LinearColor(r / 255, g / 255, b / 255, a / 255, false);
    }

    static from16bit(r, g, b, a = 65535){
        return new LinearColor(r / 65535, g / 65535, b / 65535, a / 65535, true);
    }

    static from8bit(r, g, b, a = 255){
        return new LinearColor(r / 255, g / 255, b / 255, a / 255);
    }

    static fromString(str){
        let index = 0;
        let char = str[0];
        const len = str.length;
        while(char >= "0" && char <= "9" && index < len){
            index++;
            char = str[index];
        }
        if(char === ","){
            const re = index;
            if(0 === re) return LinearColor.from16bit(0, 0, 0);
            index++; char = str[index];
            while(char === " "){ index++; char = str[index]; }
            const g = index;
            while(char >= "0" && char <= "9" && char !== null){ index++; char = str[index]; }
            const ge = index
            if(g === ge) return LinearColor.from16bit(Number(str.slice(0, re)), 0, 0);
            if(char === ","){ index++; char = str[index]; }
            else return LinearColor.from16bit(Number(str.slice(0, re)), Number(str.slice(g, ge)), 0);
            while(char === " "){ index++; char = str[index]; }
            const b = index;
            while(char >= "0" && char <= "9" && char !== null){ index++; char = str[index]; };
            const be = index;
            if(g === ge) return LinearColor.from16bit(Number(str.slice(0, re)), 0, 0);
            if(char === ","){ index++; char = str[index]; }
            else return LinearColor.from16bit(Number(str.slice(0, re)), Number(str.slice(g, ge)), Number(str.slice(b, be)));
            while(char === " "){ index++; char = str[index]; }
            const a = index;
            while(char >= "0" && char <= "9" && char !== null){ index++; char = str[index]; }
            return LinearColor.from16bit(Number(str.slice(0, re)), Number(str.slice(g, ge)), Number(str.slice(b, be)), Number(str.slice(a, index)));
        }
        return LinearColor.fromHex(str);
    }

    toHex(){
        const r = Math.round(this.r * 255).toString(16).padStart(2, "0");
        const g = Math.round(this.g * 255).toString(16).padStart(2, "0");
        const b = Math.round(this.b * 255).toString(16).padStart(2, "0");
        const a = Math.round(this.a * 255).toString(16).padStart(2, "0");
        return this.a === 1 ? r + g + b : r + g + b + a;
    }

    toString(){
        if(this.bit16){
            const r = Math.round(this.r * 65535);
            const g = Math.round(this.g * 65535);
            const b = Math.round(this.b * 65535);
            const a = Math.round(this.a * 65535);
            return a === 65535 ? `/${r},${g},${b}` : `/${r},${g},${b},${a}`;
        }
        return `=${this.toHex()}`;
    }

    toStringRaw(){
        if(this.bit16){
            const r = Math.round(this.r * 65535);
            const g = Math.round(this.g * 65535);
            const b = Math.round(this.b * 65535);
            const a = Math.round(this.a * 65535);
            return a === 65535 ? `${r},${g},${b}` : `${r},${g},${b},${a}`;
        }
        return this.toHex();
    }

    [inspect.custom]() {
        if(this.bit16) return `#${this.toHex()} (16bit linear)`;
        return `#${this.toHex()} (linear)`;
    }

    toSRGB(){
        return new ColorSRGB(
            Math.pow(Math.max(0, this.r), 1 / 2.2), 
            Math.pow(Math.max(0, this.g), 1 / 2.2), 
            Math.pow(Math.max(0, this.b), 1 / 2.2), 
            this.a
        );
    }
}


class Doodad{
    constructor(obj){
        this.obj = obj;
    }

    toObj(){ return this.obj; }

    toString(){ return this.obj.toString(); }

    [inspect.custom](depth, options, inspectFn) {
        const formatted = inspectFn(this.obj, options);
        const label = options.stylize('Doodad', 'special');
        if (formatted.includes('\n')) {
            return label + ' ' + formatted;
        }
        return label + '(' + formatted.slice(1, -1) + ')';
    }
}


// -------------------- Variable Declarations --------------------

let file; // String we're parsing
let i; // Index of parsing (0 = first)
let ch; // String character the parser is observing
let ln; // Current line/row (1 = first) used for error message
let col; // Current column (1 = first) used for error messge
let depth; // Container nesting depth, 0 = root container, indentation expected = depth
let wasNewline;


// -------------------- Parse Functions --------------------


function parseFile(fileName){
    file = fs.readFileSync(fileName, "utf8");
    i = 0;
    depth = -1;
    ch = file[0];
    if(file.length < 1) return undefined;
    ln = 1;
    col = 1;
    switch(ch){
        case "{": nextChar(); return parseObject();
        case "[": nextChar(); return parseArray();
        case "(": nextChar(); return parseMap();
        default: return parseDoodad();
    }
}


function parse(str){
    file = str;
    i = 0;
    depth = -1;
    ch = file[0];
    if(file.length < 1) return undefined;
    ln = 1;
    col = 1;
    switch(ch){
        case "{": nextChar(); return parseObject();
        case "[": nextChar(); return parseArray();
        case "(": nextChar(); return parseMap();
        default: return parseDoodad();
    }
}


// -------------------- Parse Object --------------------

function parseObject(){ // NCP
    depth++;
    let temp;
    let finalObj = {};
    temp = parseObjectPair();
    while(temp[0]){
        finalObj[temp[1]] = temp[2];
        if(wasNewline) temp = parseObjectPairWasNewline();
        else temp = parseObjectPair();
    }
    depth--; return finalObj;
}


function parseObjectPair(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === "}"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null)nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, file.slice(start, end), parseValue("Object")];
}


function parseObjectPairWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === "}"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, file.slice(start, end), parseValue("Object")];
}



// -------------------- Parse Doodad --------------------

function parseDoodad(){ // NCP
    depth++;
    let temp;
    let finalObj = {};
    temp = parseDoodadPair();
    while(temp[0]){
        finalObj[temp[1]] = temp[2];
        if(wasNewline) temp = parseDoodadPairWasNewline();
        else temp = parseDoodadPair();
    }
    depth--; return new Doodad(finalObj);
}


function parseDoodadPair(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false]; // End of file test
        tempCh = file[tempI];
    }
    if(tempCh === "|"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(i < tempI) nextChar();
    nextChar();
    return [true, tempCh, parseValue(`Doodad (key is ${tempCh})`)];
}


function parseDoodadPairWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false]; // End of file test
        tempCh = file[tempI];
    }
    if(tempCh === "|"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(i < tempI) nextChar();
    nextChar();
    return [true, tempCh, parseValue(`Doodad (key is ${tempCh})`)];
}



// -------------------- Parse Array --------------------

function parseArray(){ // NCP
    depth++;
    let temp;
    let finalArray = [];
    temp = parseArrayItem();
    while(temp[0]){
        finalArray.push(temp[1]);
        if(wasNewline) temp = parseArrayItemWasNewline();
        else temp = parseArrayItem();
    }
    depth--; return finalArray;
}


function parseArrayItem(){ //
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false]; // End of file test
        tempCh = file[tempI];
    }
    if(tempCh === "]"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(i < tempI) nextChar();
    return [true, parseValue("Array Item")];
}


function parseArrayItemWasNewline(){ //
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false]; // End of file test
        tempCh = file[tempI];
    }
    if(tempCh === "]"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(i < tempI) nextChar();
    return [true, parseValue("Array Item")];
}



// -------------------- Parse Map --------------------

function parseMap(){ // NCP
    depth++;
    let temp;
    let finalMap = new Map();
    while(ch === "\n" || ch === "\t" || ch === " ") nextChar();
    switch(ch){
        case null: return undefined;
        case ")": 
            nextChar(); 
            depth--; 
            return finalMap;
        case '"':
            nextChar();
            temp = parseMapPairStr();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairStrWasNewline();
                else temp = parseMapPairStr();
            } break;
        case "'":
            nextChar();
            temp = parseMapPairChar();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairCharWasNewline();
                else temp = parseMapPairChar();
            } break;
        case "$":
        case "!":
            temp = parseMapPairBool();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairBoolWasNewline();
                else temp = parseMapPairBool();
            } break;
        case "&":
            nextChar();
            temp = parseMapPairDate();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairDateWasNewline();
                else temp = parseMapPairDate();
            } break;
        case "@": 
            nextChar();
            temp = parseMapPairKeybind();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairKeybindWasNewline();
                else temp = parseMapPairKeybind();
            } break;
        case "#":
            nextChar();
            temp = parseMapPairColor();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairColorWasNewline();
                else temp = parseMapPairColor();
            } break;
        case "=":
        case "/":
            nextChar();
            temp = parseMapPairLinCol();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairLinColWasNewline();
                else temp = parseMapPairLinCol();
            } break;
        case ".":
        case "+":
        case "~":
        case "-":
            temp = parseMapPairNum();
            while(temp[0]){
                finalMap.set(temp[1], temp[2]);
                if(wasNewline) temp = parseMapPairNumWasNewline();
                else temp = parseMapPairNum();
            } break;
        default:
            if(ch >= "0" && ch <= "9"){
                temp = parseMapPairNum();
                while(temp[0]){
                    finalMap.set(temp[1], temp[2]);
                    if(wasNewline) temp = parseMapPairNumWasNewline();
                    else temp = parseMapPairNum();
                }
            }
            else throw new LxonError("Unknown key type definition '" + ch + "'.");
            break;
    }
    depth--; return finalMap;
}



// -------------------- Parse Map String --------------------


function parseMapPairStr(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const str = parseStringKey();
    while(ch !== ":" && ch !== null) nextChar();
    nextChar()
    while(ch === " "){ nextChar(); }
    return [true, str, parseValue("String Map")];
}


function parseMapPairStrWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const str = parseStringKey();
    while(ch !== ":" && ch !== null) nextChar();
    nextChar()
    while(ch === " "){ nextChar(); }
    return [true, str, parseValue("String Map")];
}



// -------------------- Parse Map Character --------------------


function parseMapPairChar(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const char = ch;
    nextChar();
    while(ch === " " || ch === ":"){ nextChar(); }
    return [true, char, parseValue(`Char (${char}) Map`)];
}


function parseMapPairCharWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const char = ch;
    nextChar();
    while(ch === " " || ch === ":"){ nextChar(); }
    return [true, char, parseValue(`Char (${char}) Map`)];
}



// -------------------- Parse Map Number --------------------

function parseMapPairNum(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    if(tempCh === "+") { nextChar(); nextChar(); return [true, Infinity, parseValue("Number (+) Map")]; } // Positive infinity
    if(tempCh === "~") { nextChar(); nextChar(); return [true, -Infinity, parseValue("Number (~) Map")]; } // Negative infinity
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, Number(file.slice(start, end)), parseValue("Number Map")];
}


function parseMapPairNumWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) return [false]; // Checks depth if on a new line
    wasNewline = false;
    if(tempCh === "+") { nextChar(); nextChar(); return [true, Infinity, parseValue("Number (+) Map")]; } // Positive infinity
    if(tempCh === "~") { nextChar(); nextChar(); return [true, -Infinity, parseValue("Number (~) Map")]; } // Negative infinity
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, Number(file.slice(start, end)), parseValue(`Number Map`)];
}



// -------------------- Parse Map Color SRGB --------------------

function parseMapPairColor(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, ColorSRGB.fromHex(file.slice(start, end)), parseValue("SRGB Color Map")];
}


function parseMapPairColorWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) return [false]; // Checks depth if on a new line
    wasNewline = false;
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, ColorSRGB.fromHex(file.slice(start, end)), parseValue("SRGB Color Map")];
}



// -------------------- Parse Map Linear Color --------------------

function parseMapPairLinCol(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, LinearColor.fromString(file.slice(start, end)), parseValue("Linear Color Map")];
}


function parseMapPairLinColWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) return [false]; // Checks depth if on a new line
    wasNewline = false;
    let start = i + thisDepth;
    while(ch !== ":" && ch !== null) nextChar();
    let end = i;
    nextChar();
    while(ch === " "){ nextChar(); }
    return [true, LinearColor.fromString(file.slice(start, end)), parseValue("Linear Color Map")];
}



// -------------------- Parse Map Boolean --------------------

function parseMapPairBool(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    if(ch === "$") { // True
        nextChar();
        while(ch === " " || ch === ":") nextChar();
        return [true, true, parseValue("Bool ($) Map")]; 
    }
    if(ch === "!") { // False
        nextChar();
        while(ch === " " || ch === ":") nextChar();
        return [true, false, parseValue("Bool (!) Map")]; 
    }
    if(ch === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(ch === null) return [false]; // End of file test again (necessary)
    throw new LxonError("Invalid boolean key for Map, expecting either '$' or '!'.");
}


function parseMapPairBoolWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    if(ch === "$") { // True
        nextChar();
        while(ch === " " || ch === ":") nextChar(); 
        return [true, true, parseValue("Bool ($) Map")]; 
    }
    if(ch === "!") { // False
        nextChar();
        while(ch === " " || ch === ":") nextChar(); 
        return [true, false, parseValue("Bool (!) Map")]; 
    }
    if(ch === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(ch === null) return [false]; // End of file test again (necessary)
    throw new LxonError("Invalid boolean key for Map, expecting either '$' or '!'.");
}


// -------------------- Parse Map Date --------------------

function parseMapPairDate(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " "){ nextChar(); } // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const date = parseDate();
    while(ch !== ":" && ch !== null) nextChar();
    while(ch === ":") nextChar();
    while(ch === " "){ nextChar(); }
    return [true, date, parseValue("Date Map")];
}


function parseMapPairDateWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    wasNewline = false;
    const date = parseDate();
    while(ch !== ":" && ch !== null) nextChar();
    while(ch === ":") nextChar();
    while(ch === " "){ nextChar(); }
    return [true, date, parseValue("Date Map")];
}



// -------------------- Parse Map Keybind --------------------

function parseMapPairKeybind(){ // NCP
    let thisDepth = 0;
    let newline = false;
    while(ch === " ") nextChar();  // Skips all spaces
    while(ch === "\n"){ nextChar(); newline = true; } // Skips all newlines
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth && newline) { wasNewline = true; return [false]; } // Checks depth if on a new line
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const str = parseStringKey();
    while(ch !== ":" && ch !== null) nextChar();
    nextChar()
    while(ch === " "){ nextChar(); }
    return [true, Symbol.for(str), parseValue("Keybind Map")];
}


function parseMapPairKeybindWasNewline(){ // NCP
    let thisDepth = 0;
    let tempI = i;
    let tempCh = ch;
    while(tempCh === "\t" || tempCh === " "){ // Determines depth
        thisDepth++;
        tempI++;
        if(tempI > file.length - 1) return [false];
        tempCh = file[tempI];
    }
    if(tempCh === ")"){ nextChar(); return [false]; } // Checks for terminator symbol
    if(tempCh === null) return [false]; // End of file test again (necessary)
    if(thisDepth < depth) { return [false]; } // Checks depth if on a new line
    wasNewline = false;
    while(ch === "\t" || ch === " ") nextChar();  // Skips empty
    const str = parseStringKey();
    while(ch !== ":" && ch !== null) nextChar();
    nextChar()
    while(ch === " "){ nextChar(); }
    return [true, Symbol.for(str), parseValue("Keybind Map")];
}



// -------------------- Parse Value Switch --------------------


function parseValue(container){ // NCP
    switch(ch){
        case null:
            return undefined;
        case '"':
            nextChar(); return parseStringFull();
        case '`':
            nextChar(); return parseString();
        case '^':
            nextChar(); return parseString();
        case "'":
            nextChar(); if(ch === null) return undefined; const char = ch; nextChar(); return char;
        case "$":
            nextChar(); return true;
        case "!":
            nextChar(); return false;
        case "_":
            nextChar(); return null;
        case "%":
            nextChar(); return undefined;
        case "+":
            nextChar(); return Infinity;
        case "~":
            nextChar(); return -Infinity;
        case "?":
            nextChar(); return parseBinary();
        case "&":
            nextChar(); return parseDate();
        case "@":
            nextChar(); return parseKeybind();
        case "-":
            nextChar(); return parseNegNumber();
        case "{":
            nextChar(); return parseObject();
        case "\n":
            nextChar(); return parseObject();
        case "[":
            nextChar(); return parseArray();
        case "(":
            nextChar(); return parseMap();
        case "#":
            nextChar(); return parseColorHex();
        case "=":
            nextChar(); return parseColorLinearHex();
        case "/":
            nextChar(); return parseColorLinear16bit();
        default:
            if(ch >= "0" && ch <= "9") return parsePosNumber();
            if(ch === ".") return parsePosNumber();
            const code = file.charCodeAt(i) | 32; // forces uppercase -> lowercase range
            if(code >= 97 && code <= 122) return parseDoodad(); // tests if a-z or A-Z
            throw new LxonError(`Unknown value type definition '${ch}'.\nValue for: ${container}`);
    }
}



// -------------------- Parse Values --------------------

function parseStringFull(){ // NCP
    const out = [];
    while(ch !== "\n" && ch !== null){
        if(ch === "\\"){
            nextChar();
            if(ch === null) return out.join("");
            switch(ch){
                case "n": out.push("\n"); break;
                case "r": out.push("\r"); break;
                case "t": out.push("\t"); break;
                case "s": out.push(" "); break;
                default: out.push(ch);
            }
            nextChar();
        } else {
            out.push(ch);
            nextChar();
        }
    }
    return out.join("");
}


function parseString(){ // NCP
    const out = [];
    while(ch !== "`" && ch !== "^" && ch !== null){
        if(ch === "\\"){
            nextChar();
            if(ch === null) return out.join("");
            switch(ch){
                case "n": out.push("\n"); break;
                case "r": out.push("\r"); break;
                case "t": out.push("\t"); break;
                case "s": out.push(" "); break;
                default: out.push(ch);
            }
            nextChar();
        } else {
            out.push(ch);
            nextChar();
        }
    }
    if(ch !== "^") nextChar();
    return out.join("");
}


function parseStringKey(){ // NCP
    const out = [];
    while(ch !== ":" && ch !== null){
        if(ch === "\\"){
            nextChar();
            if(ch === null) return out.join("");
            switch(ch){
                case "n": out.push("\n"); break;
                case "r": out.push("\r"); break;
                case "t": out.push("\t"); break;
                case "s": out.push(" "); break;
                default: out.push(ch);
            }
            nextChar();
        } else {
            out.push(ch);
            nextChar();
        }
    }
    return out.join("");
}


function parsePosNumber(){
    const start = i;
    if(ch === null) return NaN;
    while(ch >= "0" && ch <= "9" && ch !== null){ nextChar(); }
    if(ch === "."){
        nextChar();
        while(ch >= "0" && ch <= "9" && ch !== null){ nextChar(); }
    }
    if(ch === "e" || ch === "E"){
        const eStart = i;
        nextChar();
        if(ch === "+" || ch === "-") nextChar();
        const digitsStart = i;
        while(ch >= "0" && ch <= "9" && ch !== null){ nextChar(); }
        if(i === digitsStart){
            i = eStart;
            ch = file[i] ?? null;
        }
    }
    if(start === i) return NaN;
    return Number(file.slice(start, i));
}


function parseNegNumber(){
    return -parsePosNumber();
}


function parseBinary(){
    let out = [];
    let byte = 0;
    let high = true;
    let c = file.charCodeAt(i);
    while(true){
        while(ch === " "){ nextChar(); c = file.charCodeAt(i); }
        if(ch === "`"){ nextChar(); return new Uint8Array(out); }
        if(!((c >= 48 && c <= 57) || (c >= 97 && c <= 102))) break;
        let v = c - 48 - ((c > 57) * 39);
        if(high){
            byte = v << 4;
            high = false;
        }else{
            out.push(byte | v);
            high = true;
        }
        nextChar();
        c = file.charCodeAt(i);
    }
    return new Uint8Array(out);
}


function parseKeybind(){ // NCP
    const out = [];
    while(ch !== "`" && ch !== "^" && ch !== "@" && ch !== "\n" && ch !== null){
        if(ch === "\\"){
            nextChar();
            if(ch === null) return Symbol.for(out.join(""));
            switch(ch){
                case "n": out.push("\n"); break;
                case "r": out.push("\r"); break;
                case "t": out.push("\t"); break;
                case "s": out.push(" "); break;
                default: out.push(ch);
            }
            nextChar();
        } else {
            out.push(ch);
            nextChar();
        }
    }
    if(ch === "`") nextChar();
    return Symbol.for(out.join(""));
}


function parseColorHex(){
    const start = i;
    while(ch !== null && ((ch >= "0" && ch <= "9") || (ch >= "a" && ch <= "f"))) nextChar();
    return ColorSRGB.fromHex(file.slice(start, i));
}


function parseColorLinearHex(){
    const start = i;
    while(ch !== null && ((ch >= "0" && ch <= "9") || (ch >= "a" && ch <= "f"))) nextChar();
    return LinearColor.fromHex(file.slice(start, i));
}


function parseColorLinear16bit(){
    const r = i;
    while(ch >= "0" && ch <= "9" && ch !== null) nextChar();
    const re = i;
    if(r === re) return LinearColor.from16bit(0, 0, 0);
    if(ch === ",") nextChar();
    else return LinearColor.from16bit(Number(file.slice(r, re)), 0, 0);
    while(ch === " ") nextChar();
    const g = i;
    while(ch >= "0" && ch <= "9" && ch !== null) nextChar();
    const ge = i
    if(g === ge) return LinearColor.from16bit(Number(file.slice(r, re)), 0, 0);
    if(ch === ",") nextChar();
    else return LinearColor.from16bit(Number(file.slice(r, re)), Number(file.slice(g, ge)), 0);
    while(ch === " ") nextChar();
    const b = i;
    while(ch >= "0" && ch <= "9" && ch !== null) nextChar();
    const be = i;
    if(g === ge) return LinearColor.from16bit(Number(file.slice(r, re)), 0, 0);
    if(ch === ",") nextChar();
    else return LinearColor.from16bit(Number(file.slice(r, re)), Number(file.slice(g, ge)), Number(file.slice(b, be)));
    while(ch === " ") nextChar();
    const a = i;
    while(ch >= "0" && ch <= "9" && ch !== null) nextChar();
    return LinearColor.from16bit(Number(file.slice(r, re)), Number(file.slice(g, ge)), Number(file.slice(b, be)), Number(file.slice(a, i)));
}


function parseDate(){
    let year = 1000;
    let month = 1;
    let day = 1;
    let hour = 0;
    let min = 0;
    let sec = 0;
    let ms = 0;

    if(ch >= "0" && ch <= "9"){
        year = 0;
        let len = 0;
        while(ch >= "0" && ch <= "9" && ch !== null){
            year = Number(ch) + year * 10;
            nextChar();
            len++;
        }
        if(len > 11) return new Date(year);
        if(len > 7) return new Date(year * 1000);
        if(len < 3) year += 2000;
        if(ch === "-" || ch === "W"){
            if(ch === "-") nextChar();
            if(ch === "W"){
                nextChar();
                if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the week when reading Date value.");
                let week = Number(ch);
                nextChar();
                if(ch >= "0" && ch <= "9" && ch !== null){
                    week = Number(ch) + week * 10;
                    nextChar();
                }
                let dayOf = 1;
                if(ch === "-"){
                    nextChar();
                    if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid day of the week when reading Date value.");
                    dayOf = Number(ch);
                }
                const jan4 = new Date(Date.UTC(year, 0, 4));
                const jan4Day = jan4.getUTCDay() || 7;
                const days = (week - 1) * 7 + dayOf - jan4Day;
                day = 4 + days;
                nextChar();
            }
            else{
                if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the month when reading Date value.");
                month = Number(ch);
                nextChar();
                if(ch >= "0" && ch <= "9" && ch !== null){
                    month = Number(ch) + month * 10;
                    nextChar();
                }
                if(ch === "-"){
                    nextChar();
                    if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the day when reading Date value.");
                    day = Number(ch);
                    nextChar();
                    if(ch >= "0" && ch <= "9" && ch !== null){
                        day = Number(ch) + day * 10;
                        nextChar();
                    }
                }
            }
        }
    }
    if(ch === "T"){
        // Hour
        nextChar();
        if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the hour when reading Date value.");
        hour += Number(ch);
        nextChar();
        if(ch >= "0" && ch <= "9" && ch !== null){
            hour = Number(ch) + hour * 10;
            nextChar();
        }
        if(ch === ":"){
            // Minute
            nextChar();
            if(ch < "0" || ch > "9" || ch === null) return new Date(Date.UTC(year, month - 1, day, hour, 0, 0, 0))
            min += Number(ch);
            nextChar();
            if(ch >= "0" && ch <= "9" && ch !== null){
                min = Number(ch) + min * 10;
                nextChar();
            }
            if(ch === ":"){
                // Second
                nextChar();
                if(ch < "0" || ch > "9" || ch === null) return new Date(Date.UTC(year, month - 1, day, hour, min, 0, 0))
                sec += Number(ch);
                nextChar();
                if(ch >= "0" && ch <= "9" && ch !== null){
                    sec = Number(ch) + sec * 10;
                    nextChar();
                }
                if(ch === "."){
                    // Millisecond
                    nextChar();
                    if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the milliseconds when reading Date value.");
                    ms += Number(ch) * 100;
                    nextChar();
                    if(ch >= "0" && ch <= "9" && ch !== null){
                        ms += Number(ch) * 10;
                        nextChar();
                        if(ch >= "0" && ch <= "9" && ch !== null){
                            ms += Number(ch);
                            nextChar();
                        }
                    }
                }
            }
        }
    }
    if(ch === "+" || ch === "-"){
        let offsetMultiplier = 1;
        let offsetMin = 0;
        if(ch === "-") offsetMultiplier = -1;
        nextChar();
        if(ch < "0" || ch > "9" || ch === null) throw new LxonError("Invalid first digit for the hour offset when reading Date value.");
        let offsetHour = Number(ch);
        nextChar();
        if(ch >= "0" && ch <= "9" && ch !== null){
            offsetHour = Number(ch) + offsetHour * 10;
            nextChar();
        }
        if(ch === ":"){
            nextChar();
            if(ch >= "0" && ch <= "9" && ch !== null){
                offsetMin += Number(ch) * 10;
                nextChar();
                if(ch >= "0" && ch <= "9" && ch !== null){
                    offsetMin += Number(ch);
                    nextChar();
                }
            }
        }
        hour += offsetHour * offsetMultiplier;
        min += offsetMin * offsetMultiplier;
    }
    else if(ch === "Z"){
        nextChar();
    }
    return new Date(Date.UTC(year, month - 1, day, hour, min, sec, ms));
}



// -------------------- Next Character --------------------

function nextChar(){
    i++;
    col++;
    if(i >= file.length){ ch = null; return; }
    ch = file[i];
    if(ch === "\n" || ch === "\r") {
        let tempI = i;
        let tempCh = "\n";
        let tempTempI;
        let tempTempCh;
        while(true){
            col = 1; ln++;
            while(tempCh === "\n" || tempCh === "\r"){ // Skips empty newlines
                tempI++;
                tempCh = file[tempI];
            }
            tempTempI = tempI;
            tempTempCh = tempCh;
            while(tempTempCh === "\t"){ // Tests skipping tabs on newline
                tempTempI++;
                tempTempCh = file[tempTempI];
            }
            if(tempTempCh === "\n" || tempTempCh === "\r"){ // If a line has only tabs, skips the line
                tempCh = tempTempCh;
                tempI = tempTempI;
                continue;
            }
            if(tempTempI >= file.length){ // Deal with end of file
                i = tempI;
                ch = null;
                return;
            }
            if(tempTempCh === "#"){ // If a line's first non-tab character is a #, then it's a comment
                tempCh = tempTempCh;
                tempI = tempTempI;
                while(tempCh !== "\n" && tempCh !== "\r"){
                    tempI++;
                    if(tempI < file.length) tempCh = file[tempI];
                    else{ // Deal with end of file
                        i = tempI;
                        ch = null;
                        return;
                    }
                }
            }
            if(tempTempCh === " "){ // If a line's first non-tab character is a space
                ch = tempTempCh;
                i = tempTempI;
                throw new LxonError("Space indentation not supported, use real tab characters instead.");
            }
            else{ // Exit loop when new non-empty non-comment line is found
                i = tempI - 1;
                ch = "\n";
                return;
            }
        }
    }
}



// -------------------- Stringify Functions --------------------

let trailContainers = true;

function stringify(obj, newlineAfterContainers = true, newlineAtEnd = true){
    trailContainers = newlineAfterContainers;
    depth = -1;
    if (obj instanceof Map) {
        file = ["("];
        writeMap(obj);
    } else if (Array.isArray(obj)) {
        file = ["["];
        writeArray(obj);
    } else if (obj instanceof Doodad) {
        file = [];
        writeDoodad(obj)
    } else if (typeof obj === "object" && obj !== null) {
        file = ["{"];
        writeObject(obj)
    } else {
        throw new Error("Invalid root container. Must be of type Object, Array, Map or lxon.Doodad")
    }
    if(newlineAtEnd){
        if(file.at(-1) !== "\n") file.push("\n");
    }
    return file.join("");
}


function writeFile(obj, dest, newlineAfterContainers = true, newlineAtEnd = true) {
    try {
        const content = stringify(obj, newlineAfterContainers, newlineAtEnd);
        fs.writeFileSync(dest, content, 'utf8');
    } catch (error) {
        console.error(`Failed to write file to ${dest}:`, error.message);
        throw error;
    }
}



// -------------------- Stringify Object --------------------

function writeObject(obj, wasArray){
    wasNewline = false;
    depth++;
    const entries = Object.entries(obj)
    const len = entries.length;
    if (len === 0) {
        file.push("{}");
        depth--;
        return;
    }
    const inline = len < 3;
    if(!inline) {
        if(wasArray) file.push("{\n");
        else file.push("\n");
    }
    else if(depth > 0) file.push("{ ")
    let i = 0;
    for (const [key, value] of entries) {
        i++;
        file.push(inline ? "" : "\t".repeat(depth), cleanKey(key));
        writeColon(value, inline);
        writeValue(value, inline, i === len);
    }
    depth--;
    if(trailContainers && !inline && !wasNewline) {
        file.push("\n");
        wasNewline = true;
    }
}



// -------------------- Stringify Array --------------------

function writeArray(arr){
    wasNewline = false;
    depth++;
    const len = arr.length;
    let inline = len < 5;
    if (len === 0) {
        file.push("[]");
        depth--;
        return;
    }
    for (const value of arr) {
        if(typeof value === "object"){
            if(value instanceof Date) continue;
            else if(value === null) continue;
            else if(value instanceof LinearColor) continue;
            else if(value instanceof Uint8Array) continue;
            else if(value instanceof ColorSRGB) continue;
            inline = false;
            break;
        }
    }
    if(!inline) file.push("[\n")
    else if(depth > 0) file.push("[ ")
    let i = 0;
    for (const value of arr) {
        i++;
        file.push(inline ? "" : "\t".repeat(depth));
        writeValue(value, inline, i === len, true);
    }
    depth--;
    if(trailContainers && !inline && !wasNewline) {
        file.push("\n");
        wasNewline = true;
    }
}



// -------------------- Stringify Doodad --------------------

function writeDoodad(obj, wasDoodad){
    wasNewline = false;
    depth++;
    const entries = Object.entries(obj.obj)
    const len = entries.length;
    if (len === 0) {
        file.push("{}");
        depth--;
        return;
    }
    let inline = len < 5;
    for (const [key, value] of entries) {
        if(typeof value === "object"){
            if(value instanceof Date) continue;
            else if(value === null) continue;
            else if(value instanceof LinearColor) continue;
            else if(value instanceof Uint8Array) continue;
            else if(value instanceof ColorSRGB) continue;
            inline = false;
            break;
        }
    }
    if(!wasDoodad) file.push(" ");
    let i = 0;
    if (len > 0) {
    const [firstKey, firstValue] = entries[0];
        file.push(cleanKey(firstKey));
        writeValue(firstValue, inline, len === 1, false, true);
        for (let i = 1; i < len; i++) {
            const [key, value] = entries[i];
            file.push(inline ? "" : "\t".repeat(depth), cleanKey(key[0]));
            writeValue(value, inline, i === len - 1, false, true);
        }
    }
    depth--;
    if(trailContainers && !inline && !wasNewline) {
        file.push("\n");
        wasNewline = true;
    }
}



// -------------------- Stringify Map --------------------

const keyTypes = [
    "", //  0 Number
    "&", // 1 Date
    "@", // 2 Keybind (Symbol)
    "=", // 3 Linear Color
    "", // 4 Boolean
    "#", // 5 Color SRGB
    "'", // 6 String Character
    '"' //  7 String
]


function getKeyType(key) {
    if (typeof key === 'number') return 0;
    if (key instanceof Date) return 1;
    if (typeof key === 'symbol') return 2;
    if (key instanceof LinearColor) return 3;
    if (typeof key === 'boolean') return 4;
    if (key instanceof ColorSRGB) return 5;
    if (typeof key === 'string') {
        if(key.length === 1) return 6;
        return 7;
    }
    throw new Error("Invalid map key type. Must be of type String, Number, Bool, Date, ColorSRGB, LinearColor, Symbol, ")
}


function writeMap(obj){
    wasNewline = false;
    depth++;
    // Test key type
    const keys = [...obj.keys()];
    if (keys.length === 0) {
        file.push("()");
        depth--;
        return;
    }
    let type = getKeyType(keys[0]);
    for (let i = 1; i < keys.length; i++) {
        if (getKeyType(keys[i]) !== type) {
            type = '7';
            break;
        }
    }
    const entries = [...obj.entries()];
    const len = entries.length;
    const inline = len < 3;
    if(!inline) file.push("(", keyTypes[type], "\n")
    else if(depth > 0) file.push("(", keyTypes[type], " ")
    let i = 0;
    for (const [key, value] of entries) {
        i++;
        writeMapKey(key, inline, type);
        writeColon(value, inline);
        writeValue(value, inline, i === len);
    }
    depth--;
    if(trailContainers && !inline && !wasNewline) {
        file.push("\n");
        wasNewline = true;
    }
}


function writeMapKey(key, inline, type){
    switch(type){
        case 0: // Number
            file.push(inline ? "" : "\t".repeat(depth), cleanNumber(key));
            break;
        case 1: // Date
            file.push(inline ? "" : "\t".repeat(depth), cleanDate(key));
            break;
        case 2: // Keybind
            file.push(inline ? "" : "\t".repeat(depth), cleanStringKey(Symbol.keyFor(key)));
            break;
        case 3: // Linear Color
            file.push(inline ? "" : "\t".repeat(depth), key.toStringRaw());
            break;
        case 4: // Boolean
            if(key) file.push(inline ? "" : "\t".repeat(depth), "$");
            else file.push(inline ? "" : "\t".repeat(depth), "!");
            break;
        case 5: // Color SRGB
            file.push(inline ? "" : "\t".repeat(depth), key.toHex());
            break;
        case 6: // String char
        case 7: // String
            file.push(inline ? "" : "\t".repeat(depth), cleanStringKey(key));
            break;
    }
}


function cleanStringKey(key) {
    const len = key.length;
    if (len === 0) return key;
    // Quick scan to see if anything needs escaping — lets us return
    // the original string unchanged in the common case (no allocation).
    let needsWork = key.charCodeAt(0) === 32; // leading space
    if (!needsWork) {
        for (let i = 0; i < len; i++) {
            const c = key.charCodeAt(i);
            if (c === 58 || c === 10 || c === 13 || c === 9) { // : \n \r \t
                needsWork = true;
                break;
            }
        }
    }
    if (!needsWork) return key;
    let result = '';
    let chunkStart = 0;
    let i = 0;
    if (key.charCodeAt(0) === 32) {
        result += '\\s';
        chunkStart = 1;
        i = 1;
    }
    for (; i < len; i++) {
        const c = key.charCodeAt(i);
        let escaped = null;
        switch (c) {
            case 58: escaped = '\\:'; break; // :
            case 10: escaped = '\\n'; break; // \n
            case 13: escaped = '\\r'; break; // \r
            case 9:  escaped = '\\t'; break; // \t
        }
        if (escaped !== null) {
            result += key.slice(chunkStart, i) + escaped;
            chunkStart = i + 1;
        }
    }
    result += key.slice(chunkStart);
    return result;
}



// -------------------- Key Write Things --------------------

function writeColon(value, inline){
    if(typeof value === "object"){
        if(value instanceof Date){ file.push(": "); }
        else if(value instanceof Uint8Array){ file.push(": "); }
        else if(value === null){ file.push(": "); }
        else if(value instanceof LinearColor){ file.push(": "); }
        else if(value instanceof ColorSRGB){ file.push(": "); }
        else file.push(":");
        return;
    }
    file.push(": ");
}


function writeValue(value, inline, last, wasArray = false, wasDoodad = false){
    const end = last ? "" : (inline ? " " : "\n");
    switch(typeof value){
        case "string":
            if(value.length === 1) file.push("'", cleanStringFull(value), end); // Char
            else if(inline && !last) file.push('`', cleanString(value), "` "); // Inline String
            else file.push('"', cleanStringFull(value), end); // Multiline String
            break;
        case "boolean":
            if(value) file.push("$", end); // True
            else file.push("!", end); // False
            break;
        case "undefined":
            file.push("%", end); // Undefined
            break;
        case "symbol":
            if(inline && !last) file.push("@", cleanKeybind(value), "` "); // Inline Keybind
            else file.push('@', cleanKeybindFull(value), end); // Multiline Keybind
            break;
        case "number":
            if(Number.isNaN(value)) file.push("-", end); // NaN
            else if(value === Infinity) file.push("+", end); // +Infinity
            else if(value === -Infinity) file.push("~", end); // -Infinity
            else file.push(cleanNumber(value), end); // Number
            break;
        case "object":
            if(value === null){
                file.push("_", end); // Null
            }
            else if(value instanceof Uint8Array){
                if(inline && !last) file.push("?", cleanBinary(value), "` "); // Inline Binary
                else file.push("?", cleanBinary(value), end); // Multiline Binary
            }
            else if(value instanceof Date){
                file.push("&", cleanDate(value), end); // Date
            }
            else if(value instanceof ColorSRGB){
                file.push(value.toString(), end); // Color SRGB
            }
            else if(value instanceof LinearColor){
                file.push(value.toString(), end); // Linear Color
            }
            else if(Array.isArray(value)){ // Array
                writeArray(value);
                if(end.length > 0) file.push(end);
            }
            else if(value instanceof Map){ // Map
                writeMap(value);
                if(end.length > 0) file.push(end);
            }
            else if(value instanceof Doodad){ // Doodad
                writeDoodad(value, wasDoodad);
                if(end.length > 0) file.push(end);
            }
            else{
                writeObject(value, wasArray); // Object
                if(end.length > 0) file.push(end);
            }
            break;
    }
}



// -------------------- Clean for Stringify --------------------

function cleanKey(key){
    const out = [];
    const c0 = key.charCodeAt(0);
    if(c0 !== 9 && c0 !== 10 && c0 !== 13 && c0 !== 58 && c0 !== 32) out.push(key[0]);;
    for(let i = 1; i < key.length; i++){
        const c = key.charCodeAt(i);
        if(c === 9 || c === 10 || c === 13 || c === 58) continue;
        out.push(key[i]);
    }
    return out.join("");
}


function cleanStringFull(str){
    const out = [];
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        if(c === 10){ out.push("\\n"); continue; }
        if(c === 13){ out.push("\\r"); continue; }
        if(c === 9){ out.push("\\t"); continue; }
        out.push(str[i]);
    }
    if(out[out.length - 1] === " ") out[out.length - 1] = "\\s";
    return out.join("");
}


function cleanString(str){
    const out = [];
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        if(c === 10){ out.push("\\n"); continue; }
        if(c === 13){ out.push("\\r"); continue; }
        if(c === 9){ out.push("\\t"); continue; }
        if(c === 96){ out.push("\\`"); continue; }
        if(c === 94){ out.push("\\^"); continue; }
        out.push(str[i]);
    }
    return out.join("");
}


function cleanKeybindFull(sym){
    const str = Symbol.keyFor(sym);
    const out = [];
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        if(c === 10){ out.push("\\n"); continue; }
        if(c === 13){ out.push("\\r"); continue; }
        if(c === 9){ out.push("\\t"); continue; }
        if(c === 96){ out.push("\\`"); continue; }
        if(c === 94){ out.push("\\^"); continue; }
        out.push(str[i]);
    }
    if(out[out.length - 1] === " ") out[out.length - 1] = "\\s";
    return out.join("");
}


function cleanKeybind(sym){
    const str = Symbol.keyFor(sym);
    const out = [];
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        if(c === 10){ out.push("\\n"); continue; }
        if(c === 13){ out.push("\\r"); continue; }
        if(c === 9){ out.push("\\t"); continue; }
        if(c === 96){ out.push("\\`"); continue; }
        if(c === 94){ out.push("\\^"); continue; }
        out.push(str[i]);
    }
    return out.join("");
}


function cleanNumber(number){
    const str = number.toString();
    if(str.includes("e") || str.includes("E")) return str;
    const num = Math.abs(number);
    if(num > 0 && num < 1) return number < 0 ? "-" + str.slice(2) : str.slice(1);
    return str;
}


function cleanBinary(arr){
    const out = [];
    for(let i = 0; i < arr.length; i++){
        out.push(arr[i].toString(16).padStart(2, "0"));
    }
    return out.join("");
}


function cleanDate(date){
    const out = [];
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const sec = date.getUTCSeconds();
    const ms = date.getUTCMilliseconds();

    if(year >= 2000 && year <= 2099) out.push((year - 2000).toString().padStart(2, "0"));
    else out.push(year.toString().padStart(4, "0"));

    if(month !== 1 || day !== 1){
        out.push("-", month.toString().padStart(2, "0"));
        if(day !== 1){
            out.push("-", day.toString().padStart(2, "0"));
        }
    }
    if(hour !== 0 || min !== 0 || sec !== 0 || ms !== 0){
        out.push("T", hour.toString().padStart(2, "0"));
        if(min !== 0 || sec !== 0 || ms !== 0){
            out.push(":", min.toString().padStart(2, "0"));
            if(sec !== 0 || ms !== 0){
                out.push(":", sec.toString().padStart(2, "0"));
                if(ms !== 0) out.push(".", ms.toString());
            }
        }
    }

    return out.join("");
}



// -------------------- Stringify Functions Inline --------------------

function stringifyInline(obj){
    depth = -1;
    file = [];
    if (obj instanceof Map) {
        writeMapInline(obj);
    } else if (Array.isArray(obj)) {
        writeArrayInline(obj);
    } else if (obj instanceof Doodad) {
        writeDoodadInline(obj)
    } else if (typeof obj === "object" && obj !== null) {
        writeObjectInline(obj)
    } else {
        throw new Error("Invalid root container. Must be of type Object, Array, Map or lxon.Doodad")
    }
    return file.join("");
}


function writeFileInline(obj, dest) {
    try {
        const content = stringifyInline(obj);
        fs.writeFileSync(dest, content, 'utf8');
    } catch (error) {
        console.error(`Failed to write file to ${dest}:`, error.message);
        throw error;
    }
}



// -------------------- Stringify Object Inline --------------------

function writeObjectInline(obj){
    depth++;
    const entries = Object.entries(obj)
    const len = entries.length;
    if (len === 0) {
        file.push("{}");
        depth--;
        return;
    }
    file.push("{");
    for (const [key, value] of entries) {
        file.push(cleanKey(key), ":");
        writeValueInline(value);
    }
    file.push("}");
    depth--;
}



// -------------------- Stringify Array --------------------

function writeArrayInline(arr){
    depth++;
    const len = arr.length;
    if (len === 0) {
        file.push("[]");
        depth--;
        return;
    }
    file.push("[");
    let i = 0;
    for (const value of arr) {
        const wasString = typeof arr[i - 1] === 'string';
        const willString = typeof arr[i + 1] === 'string'
        writeValueInline(value, wasString, willString);
        i++;
    }
    file.push("]");
    depth--;
}



// -------------------- Stringify Doodad --------------------

function writeDoodadInline(obj){
    depth++;
    const entries = Object.entries(obj.obj)
    const len = entries.length;
    if (len === 0) {
        file.push("{}");
        depth--;
        return;
    }
    for (let i = 0; i < len; i++) {
        const [key, value] = entries[i];
        file.push(cleanKey(key[0]));
        writeValueInline(value);
    }
    file.push("|");
    depth--;
}



// -------------------- Stringify Map Inline --------------------

function writeMapInline(obj){
    depth++;
    // Test key type
    const keys = [...obj.keys()];
    if (keys.length === 0) {
        file.push("()");
        depth--;
        return;
    }
    let type = getKeyType(keys[0]);
    for (let i = 1; i < keys.length; i++) {
        if (getKeyType(keys[i]) !== type) {
            type = '7';
            break;
        }
    }
    const entries = [...obj.entries()];
    const len = entries.length;
    file.push("(", keyTypes[type]);
    for (const [key, value] of entries) {
        writeMapKeyInline(key, type);
        file.push(":");
        writeValueInline(value);
    }
    file.psuh(")");
    depth--;
}


function writeMapKeyInline(key, type){
    switch(type){
        case 0: // Number
            file.push(cleanNumber(key));
            break;
        case 1: // Date
            file.push(cleanDate(key));
            break;
        case 2: // Keybind
            file.push(cleanStringKey(key));
            break;
        case 3: // Linear Color
            file.push(key.toStringRaw());
            break;
        case 4: // Boolean
            if(key) file.push("$");
            else file.push("!");
            break;
        case 5: // Color SRGB
            file.push(key.toHex());
            break;
        case 6: // String char
        case 7: // String
            file.push(cleanStringKey(key));
            break;
    }
}



// -------------------- Key Write Things Inline --------------------

function writeValueInline(value, wasString = false, willString = false){
    switch(typeof value){
        case "string":
            if(value.length === 1) file.push("'", cleanStringFull(value), end); // Char
            else file.push(wasString ? "" : '`', cleanString(value), willString ? "^" : "`"); // String
            break;
        case "boolean":
            if(value) file.push("$"); // True
            else file.push("!"); // False
            break;
        case "undefined":
            file.push("%"); // Undefined
            break;
        case "symbol":
            file.push("@", cleanKeybind(value), "`"); // Keybind
            break;
        case "number":
            if(Number.isNaN(value)) file.push("-"); // NaN
            else if(value === Infinity) file.push("+"); // +Infinity
            else if(value === -Infinity) file.push("~"); // -Infinity
            else file.push(cleanNumber(value)); // Number
            break;
        case "object":
            if(value === null){
                file.push("_"); // Null
            }
            else if(value instanceof Uint8Array){
                file.push("?", cleanBinary(value), "`"); // Binary
            }
            else if(value instanceof Date){
                file.push("&", cleanDate(value), " "); // Date
            }
            else if(value instanceof ColorSRGB){
                file.push(value.toString(), " "); // Color SRGB
            }
            else if(value instanceof LinearColor){
                file.push(value.toString(), " "); // Linear Color
            }
            else if(Array.isArray(value)){ // Array
                writeArrayInline(value);
            }
            else if(value instanceof Map){ // Map
                writeMapInline(value);
            }
            else if(value instanceof Doodad){ // Doodad
                writeDoodadInline(value);
            }
            else{
                writeObjectInline(value); // Object
            }
            break;
    }
}



/* -------------------- EXPORTS --------------------
 * 
 * Reminder to read the Notice at the top of the file
 * It is legally significant and should not be ignored
 */

export default { parse, parseFile, stringify, writeFile, stringifyInline, writeFileInline, ColorSRGB, LinearColor, Doodad };
