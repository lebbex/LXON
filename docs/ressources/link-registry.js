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
                return "";
            // -------------------- Containers --------------------
            case "cont":
            case "conts":
            case "container":
            case "containers":
                if (len == 1) return "/containers";
                switch (split[1]) {
                    case "obj":
                    case "object":
                    case "objects":
                        return "/object";
                    case "arr":
                    case "array":
                    case "arrays":
                        return "/array";
                    case "map":
                    case "maps":
                        return "/map";
                    case "doo":
                    case "doodad":
                    case "doodads":
                        return "/doodad";
                    default: return [split[1]];
                }
            // -------------------- Keys --------------------
            case "key":
            case "keys":
                if (len == 1) return "/keys";
                switch (split[1]) {
                    case "outline":
                        return "/keys/#outline";
                    case "reg":
                    case "regular":
                        if (len == 2) return "/keys/#regular";
                        switch (split[2]) {
                            case "use":
                            case "usage":
                                return "/keys/#regular-usage";
                            default: return [split[2]];
                        }
                    case "typed":
                        if (len == 2) return "/keys/#typed";
                        switch (split[2]) {
                            case "use":
                            case "usage":
                                return "/keys/#typed-usage";
                            default: return [split[2]];
                        }
                    case "text":
                    case "texts":
                        if (len == 2) return "/keys/text";
                        switch (split[2]) {
                            case "full":
                            case "fullstr":
                            case "fullstring":
                            case "fullstrings":
                                if (len == 3) return "/keys/fullstring";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/keys/fullstring/#syntax";
                                    case "important":
                                        return "/keys/fullstring/#important";
                                    case "usage":
                                        return "/keys/fullstring/#usage";
                                    default: return [split[3]];
                                }
                            case "str":
                            case "string":
                            case "strings":
                                if (len == 3) return "/keys/string";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/keys/string/#syntax";
                                    case "chain":
                                    case "chaining":
                                        return "/keys/string/#chain";
                                    case "important":
                                        return "/keys/string/#important";
                                    case "usage":
                                        return "/keys/string/#usage";
                                    default: return [split[3]];
                                }
                            case "char":
                            case "chars":
                            case "character":
                            case "characters":
                                if (len == 3) return "/keys/char";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/keys/char/#syntax";
                                    case "important":
                                        return "/keys/char/#important";
                                    case "usage":
                                        return "/keys/char/#usage";
                                    default: return [split[3]];
                                }
                            default: return [split[2]];
                        }
                    case "bool":
                    case "bools":
                    case "boolean":
                    case "booleans":
                        if (len == 2) return "/keys/bool";
                        switch (split[2]) {
                            case "cat":
                                return "/keys/meow";
                            default: return [split[2]];
                        }
                    case "num":
                    case "nums":
                    case "number":
                    case "numbers":
                        if (len == 2) return "/keys/number";
                        switch (split[2]) {
                            case "def":
                            case "definition":
                                return "/keys/number/#def";
                            case "reg":
                            case "regs":
                            case "regular":
                            case "regulars":
                                return "/keys/number/#regular";
                            case "dec":
                            case "decs":
                            case "decimal":
                            case "decimals":
                                return "/keys/number/#decimal";
                            case "sci":
                            case "scientific":
                            case "scientifics":
                                return "/keys/number/#sci";
                            case "static":
                            case "statics":
                                return "/keys/number/#static";
                            default: return [split[2]];
                        }
                    case "date":
                    case "dates":
                        if (len == 2) return "/keys/date";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "bind":
                    case "binds":
                    case "keybind":
                    case "keybinds":
                        if (len == 2) return "/keys/keybind";
                        switch (split[2]) {
                            case "cat":
                                return "/meow";
                            default: return [split[2]];
                        }
                    case "col":
                    case "cols":
                    case "color":
                    case "colors":
                        if (len == 2) return "/keys/color";
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
                        if (len == 2) return "/keys/enum";
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
                    case "bind":
                    case "binds":
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
                            case "srgb":
                                if (len == 3) return "/srgb";
                                switch (split[3]) {
                                    case "syntax":
                                        return "/keys/char/#syntax";
                                    case "important":
                                        return "/keys/char/#important";
                                    case "usage":
                                        return "/keys/char/#usage";
                                    default: return [split[3]];
                                }
                            case "lin":
                            case "linear":
                                if (len == 3) return "/linear";
                                switch (split[3]) {
                                    case "8":
                                    case "8bit":
                                    case "bit8":
                                        if (len == 4) return "/linear";
                                        switch (split[4]) {
                                            case "syntax":
                                                return "/keys/char/#syntax";
                                            case "important":
                                                return "/keys/char/#important";
                                            case "usage":
                                                return "/keys/char/#usage";
                                            default: return [split[4]];
                                        }
                                    case "16":
                                    case "16bit":
                                    case "bit16":
                                        if (len == 4) return "/keys/char";
                                        switch (split[4]) {
                                            case "syntax":
                                                return "/keys/char/#syntax";
                                            case "important":
                                                return "/keys/char/#important";
                                            case "usage":
                                                return "/keys/char/#usage";
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
                            case "cat":
                                return "/meow";
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
                            case "cat":
                                return "/meow";
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
