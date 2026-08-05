window.linkReg = {

    // All links implemented through double exclamation points are references to this link registry
    // Like that, the Nav Tree can be adjusted without requiring an edit of the link references
    // on all pages using that link

    // In most cases it should support singular and plural forms of the same key, QOL feature

    // IT IS IMPERATIVE THAT YOU NEVER CHANGE/REMOVE EXISTING LINK REGISTRY PATHS HERE
    // UNLESS YOU'RE WILLING TO GO THROUGH THE EFFORT OF MANUALLY FIXING THEM ON EACH PAGE

    get: function (path) {
        const split = path.split(".");
        const len = split.length;
        for (let i = 0; i < len; i++) {
            split[i] = split[i].trim();
        }

        switch (split[0]) {
            // Home
            case "home":
                if (len == 1) return "";
                switch (split[1]) {
                    case "anal":
                    case "analogy":
                        return "/#analogy";
                    default: return [split[1]];
                }
            // -------------------- Containers --------------------
            case "cont":
            case "conts":
            case "container":
            case "containers":
                if (len == 1) return "/containers";
                switch (split[1]) {
                    case "root":
                        if (len == 2) return "/root";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/root/#def";
                            case "syn":
                            case "synt":
                            case "syntax":
                                return "/root/#syntax";
                            case "use":
                            case "usa":
                            case "usage":
                                return "/root/#usage";
                            case "obj":
                            case "object":
                            case "objects":
                                return "/root/#object";
                            case "arr":
                            case "array":
                            case "arrays":
                                return "/root/#array";
                            case "map":
                            case "maps":
                                return "/root/#map";
                            case "doo":
                            case "doodad":
                            case "doodads":
                                return "/root/#doodad";
                            default: return [split[2]];
                        }
                    case "obj":
                    case "object":
                    case "objects":
                        if (len == 2) return "/object";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/object/#def";
                            case "syn":
                            case "synt":
                            case "syntax":
                                return "/object/#syntax";
                            case "mul":
                            case "mult":
                            case "multi":
                            case "multiline":
                                return "/object/#multiline";
                            case "ter":
                            case "term":
                            case "termi":
                            case "termin":
                            case "terminate":
                            case "termination":
                                return "/object/#termination";
                            case "emp":
                            case "empty":
                                return "/object/#empty";
                            case "use":
                            case "usa":
                            case "usage":
                                return "/object/#usage";
                            default: return [split[2]];
                        }
                    case "arr":
                    case "array":
                    case "arrays":
                        if (len == 2) return "/array";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/array/#def";
                            case "syn":
                            case "synt":
                            case "syntax":
                                return "/array/#syntax";
                            case "mul":
                            case "mult":
                            case "multi":
                            case "multiline":
                                return "/array/#multiline";
                            case "ter":
                            case "term":
                            case "termi":
                            case "termin":
                            case "terminate":
                            case "termination":
                                return "/array/#termination";
                            case "emp":
                            case "empty":
                                return "/array/#empty";
                            case "use":
                            case "usa":
                            case "usage":
                                return "/array/#usage";
                            default: return [split[2]];
                        }
                    case "map":
                    case "maps":
                        if (len == 2) return "/map";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/map/#def";
                            case "syn":
                            case "synt":
                            case "syntax":
                                return "/map/#syntax";
                            case "mul":
                            case "mult":
                            case "multi":
                            case "multiline":
                                return "/map/#multiline";
                            case "ter":
                            case "term":
                            case "termi":
                            case "termin":
                            case "terminate":
                            case "termination":
                                return "/map/#termination";
                            case "emp":
                            case "empty":
                                return "/map/#empty";
                            case "use":
                            case "usa":
                            case "usage":
                                return "/map/#usage";
                            default: return [split[2]];
                        }
                    case "set":
                    case "sets":
                        return "/set";
                    case "doo":
                    case "doodad":
                    case "doodads":
                        if (len == 2) return "/doodad";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/doodad/#def";
                            case "syn":
                            case "synt":
                            case "syntax":
                                return "/doodad/#syntax";
                            case "mul":
                            case "mult":
                            case "multi":
                            case "multiline":
                                return "/doodad/#multiline";
                            case "ter":
                            case "term":
                            case "termi":
                            case "termin":
                            case "terminate":
                            case "termination":
                                return "/doodad/#termination";
                            case "emp":
                            case "empty":
                                return "/doodad/#empty";
                            case "use":
                            case "usa":
                            case "usage":
                                return "/doodad/#usage";
                            default: return [split[2]];
                        }
                    default: return [split[1]];
                }
            // -------------------- Keys --------------------
            case "key":
            case "keys":
                if (len == 1) return "/key";
                switch (split[1]) {
                    case "outline":
                        return "/key/#outline";
                    case "reg":
                    case "regular":
                        if (len == 2) return "/key/#regular";
                        switch (split[2]) {
                            case "use":
                            case "usage":
                                return "/key/#regular-usage";
                            default: return [split[2]];
                        }
                    case "typed":
                        if (len == 2) return "/key/#typed";
                        switch (split[2]) {
                            case "use":
                            case "usage":
                                return "/key/#typed-usage";
                            default: return [split[2]];
                        }
                    case "single":
                    case "char":
                    case "singlechar":
                    case "character":
                    case "singlecharacter":
                        if (len == 2) return "/key/#single";
                        switch (split[2]) {
                            case "use":
                            case "usage":
                                return "/key/#single-usage";
                            default: return [split[2]];
                        }
                    case "str":
                    case "string":
                    case "strings":
                        if (len == 2) return "/key/string";
                        switch (split[2]) {
                            case "syntax":
                                return "/key/string/#syntax";
                            case "chain":
                            case "chaining":
                                return "/key/string/#chain";
                            case "important":
                                return "/key/string/#important";
                            case "usage":
                                return "/key/string/#usage";
                            default: return [split[2]];
                        }
                    case "bool":
                    case "bools":
                    case "boolean":
                    case "booleans":
                        if (len == 2) return "/key/bool";
                        switch (split[2]) {
                            case "cat":
                                return "/key/meow";
                            default: return [split[2]];
                        }
                    case "num":
                    case "nums":
                    case "number":
                    case "numbers":
                        if (len == 2) return "/key/number";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/key/number/#def";
                            case "reg":
                            case "regs":
                            case "regular":
                            case "regulars":
                                return "/key/number/#regular";
                            case "dec":
                            case "decs":
                            case "decimal":
                            case "decimals":
                                return "/key/number/#decimal";
                            case "sci":
                            case "scientific":
                            case "scientifics":
                                return "/key/number/#sci";
                            case "static":
                            case "statics":
                                return "/key/number/#static";
                            default: return [split[2]];
                        }
                    case "date":
                    case "dates":
                        if (len == 2) return "/key/date";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "mon":
                    case "mons":
                    case "monetary":
                    case "monetaries":
                        if (len == 2) return "/key/monetary";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "bind":
                    case "binds":
                    case "keybind":
                    case "keybinds":
                        if (len == 2) return "/key/keybind";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "col":
                    case "cols":
                    case "color":
                    case "colors":
                        if (len == 2) return "/key/color";
                        switch (split[2]) {
                            case "srgb":
                                return "/meow";
                            case "lin":
                            case "linear":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "enum":
                    case "enums":
                    case "enumerator":
                    case "enumerators":
                        if (len == 2) return "/key/enum";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    default: return [split[1]];
                }
            // -------------------- Values --------------------
            case "val":
            case "vals":
            case "value":
            case "values":
                if (len == 1) return "/values";
                switch (split[1]) {
                    case "outline":
                        return "/values/#outline"
                    case "static":
                        return "/values/#static"
                    case "dynamic":
                        return "/values/#dynamic"
                    case "use":
                    case "usage":
                        return "/values/#usage"
                    case "text":
                    case "texts":
                        if (len == 2) return "/text";
                        switch (split[2]) {
                            case "full":
                            case "fullstr":
                            case "fullstring":
                            case "fullstrings":
                                if (len == 3) return "/fullstring";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/fullstring/#syntax";
                                    case "important":
                                        return "/fullstring/#important";
                                    case "usage":
                                        return "/fullstring/#usage";
                                    default: return [split[3]];
                                }
                            case "str":
                            case "string":
                            case "strings":
                                if (len == 3) return "/string";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/string/#syntax";
                                    case "chain":
                                    case "chaining":
                                        return "/string/#chain";
                                    case "important":
                                        return "/string/#important";
                                    case "usage":
                                        return "/string/#usage";
                                    default: return [split[3]];
                                }
                            case "char":
                            case "chars":
                            case "character":
                            case "characters":
                                if (len == 3) return "/char";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/char/#syntax";
                                    case "important":
                                        return "/char/#important";
                                    case "usage":
                                        return "/char/#usage";
                                    default: return [split[3]];
                                }
                            default: return [split[2]];
                        }
                    case "bool":
                    case "bools":
                    case "boolean":
                    case "booleans":
                        if (len == 2) return "/bool";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "num":
                    case "nums":
                    case "number":
                    case "numbers":
                        if (len == 2) return "/number";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/number/#def";
                            case "reg":
                            case "regs":
                            case "regular":
                            case "regulars":
                                return "/number/#regular";
                            case "dec":
                            case "decs":
                            case "decimal":
                            case "decimals":
                                return "/number/#decimal";
                            case "sci":
                            case "scientific":
                            case "scientifics":
                                return "/number/#sci";
                            case "static":
                            case "statics":
                                return "/number/#static";
                            default: return [split[2]];
                        }
                    case "date":
                    case "dates":
                        if (len == 2) return "/date";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "mon":
                    case "monetary":
                    case "monetaries":
                        if (len == 2) return "/monetary";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/keybind/#def";
                            case "syntax":
                                return "/keybind/#syntax";
                            case "chain":
                            case "chains":
                            case "chaining":
                                return "/keybind/#chain";
                            default: return [split[2]];
                        }
                    case "kb":
                    case "key":
                    case "keys":
                    case "bind":
                    case "binds":
                    case "kbind":
                    case "kbinds":
                    case "keybind":
                    case "keybinds":
                        if (len == 2) return "/keybind";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/keybind/#def";
                            case "syntax":
                                return "/keybind/#syntax";
                            case "chain":
                            case "chains":
                            case "chaining":
                                return "/keybind/#chain";
                            default: return [split[2]];
                        }
                    case "col":
                    case "cols":
                    case "color":
                    case "colors":
                        if (len == 2) return "/color";
                        switch (split[2]) {
                            case "space":
                            case "spaces":
                                if (len == 3) return "/color/spaces";
                                switch (split[3]) {
                                    case "srgb":
                                        if (len == 4) return "/color/srgb";
                                        switch (split[4]) {
                                            case "def":
                                                return "/color/srgb/#def";
                                            default: return [split[4]];
                                        }
                                    case "lin":
                                    case "linear":
                                        if (len == 4) return "/color/linear";
                                        switch (split[4]) {
                                            case "def":
                                                return "/color/linear/#def";
                                            default: return [split[4]];
                                        }
                                    case "prof":
                                    case "profs":
                                    case "profile":
                                    case "profiles":
                                    case "profiled":
                                        if (len == 4) return "/color/profiled";
                                        switch (split[4]) {
                                            case "def":
                                            case "definition":
                                                return "/color/profiled/#def";
                                            case "syntax":
                                                return "/color/profiled/#syntax";
                                            case "code":
                                            case "codes":
                                                return "/color/profiled/#codes"
                                            case "prim":
                                            case "primary":
                                                return "/color/profiled/#primary"
                                            case "sec":
                                            case "secondary":
                                                return "/color/profiled/#secondary"
                                            case "cus":
                                            case "cust":
                                            case "custom":
                                                return "/color/profiled/#custom"
                                            case "term":
                                            case "terminator":
                                            case "terminators":
                                                return "/color/profiled/#terminators"
                                            case "reg":
                                            case "regular":
                                                return "/color/profiled/#regular";
                                            case "lin":
                                            case "linear":
                                                return "/color/profiled/#linear";
                                            default: return [split[4]];
                                        }
                                    default: return [split[3]];
                                }
                            case "prec":
                            case "precs":
                            case "precision":
                            case "precisions":
                                if (len == 3) return "/color/precisions";
                                switch (split[3]) {
                                    case "8":
                                    case "8bit":
                                    case "bit8":
                                        if (len == 4) return "/color/8bit";
                                        switch (split[4]) {
                                            case "def":
                                            case "types":
                                                return "/color/8bit/#types";
                                            case "syntax":
                                                return "/color/8bit/#syntax";
                                            case "termination":
                                                return "/color/8bit/#termination";
                                            case "channelskip":
                                            case "channel":
                                            case "ch":
                                            case "chskip":
                                            case "skip":
                                                return "/color/8bit/#skip";
                                            default: return [split[4]];
                                        }
                                    case "10":
                                    case "10bit":
                                    case "bit10":
                                        if (len == 4) return "/color/10bit";
                                        switch (split[4]) {
                                            case "def":
                                            case "types":
                                                return "/color/10bit/#types";
                                            case "syntax":
                                                return "/color/10bit/#syntax";
                                            case "termination":
                                                return "/color/10bit/#termination";
                                            case "channelskip":
                                            case "channel":
                                            case "ch":
                                            case "chskip":
                                            case "skip":
                                                return "/color/10bit/#skip";
                                            default: return [split[4]];
                                        }
                                    case "12":
                                    case "12bit":
                                    case "bit12":
                                        if (len == 4) return "/color/12bit";
                                        switch (split[4]) {
                                            case "def":
                                            case "types":
                                                return "/color/12bit/#types";
                                            case "syntax":
                                                return "/color/12bit/#syntax";
                                            case "termination":
                                                return "/color/12bit/#termination";
                                            case "channelskip":
                                            case "channel":
                                            case "ch":
                                            case "chskip":
                                            case "skip":
                                                return "/color/12bit/#skip";
                                            default: return [split[4]];
                                        }
                                    case "16":
                                    case "16bit":
                                    case "bit16":
                                        if (len == 4) return "/color/16bit";
                                        switch (split[4]) {
                                            case "def":
                                            case "types":
                                                return "/color/16bit/#types";
                                            case "syntax":
                                                return "/color/16bit/#syntax";
                                            case "channelskip":
                                            case "channel":
                                            case "ch":
                                            case "chskip":
                                            case "skip":
                                                return "/color/16bit/#skip";
                                            default: return [split[4]];
                                        }
                                    case "float":
                                    case "floating":
                                    case "floatpoint":
                                    case "floatingpoint":
                                        if (len == 4) return "/color/float";
                                        switch (split[4]) {
                                            case "def":
                                            case "types":
                                                return "/color/float/#types";
                                            case "syntax":
                                                return "/color/float/#syntax";
                                            case "channelskip":
                                            case "channel":
                                            case "ch":
                                            case "chskip":
                                            case "skip":
                                                return "/color/float/#skip";
                                            default: return [split[4]];
                                        }
                                    default: return [split[3]];
                                }
                            default: return [split[2]];
                        }
                    case "enum":
                    case "enums":
                    case "enumerator":
                    case "enumerators":
                        if (len == 2) return "/enum";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/enum/#def";
                            case "syntax":
                                return "/enum/#syntax";
                            case "chain":
                            case "chains":
                            case "chaining":
                                return "/enum/#chain";
                            case "use":
                            case "usage":
                                return "/enum/#usage";
                            default: return [split[2]];
                        }
                    case "byte":
                    case "bytes":
                    case "bin":
                    case "bins":
                    case "binary":
                    case "binarys":
                    case "binaries":
                        if (len == 2) return "/binary";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/binary/#def";
                            case "syntax":
                                return "/binary/#syntax";
                            case "chain":
                            case "chains":
                            case "chaining":
                                return "/binary/#chain";
                            case "use":
                            case "usage":
                                return "/binary/#usage";
                            default: return [split[2]];
                        }
                    case "special":
                    case "specials":
                        if (len == 2) return "/special";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    default: return [split[1]];
                }
            // -------------------- Other --------------------
            case "other":
                if (len == 1) return "/other";
                switch (split[1]) {
                    case "comment":
                    case "comments":
                        return "/comments";
                    case "escape":
                    case "escaped":
                        if (len == 2) return "/escape";
                        switch (split[2]) {
                            case "why":
                            case "just":
                            case "justification":
                                return "/escape/#why";
                            case "syntax":
                                return "/escape/#syntax";
                            case "char":
                            case "chars":
                            case "character":
                            case "chararacters":
                                return "/escape/#characters";
                            case "env":
                            case "environment":
                            case "environments":
                                return "/escape/#environments";
                            case "usage":
                                return "/escape/#usage"
                            default: return [split[2]];
                        }
                    default: return [split[1]];
                }
            default: return [split[0]];
        }
    }
}
