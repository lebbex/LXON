# LXON

LXON (Lebbex Object Notation) is a serialization format developped solely by Nick Jasper, designed to be simple to read/edit, all while being as capable as possible for many and most usages.

## License & Trademarks

This project's source code is licensed under Apache License 2.0. The `/docs` folder (the lxon.lebbex.com website) is proprietary and excluded from that license. 

"Lebbex", "LXON", associated logos, and the name "Nicholas (Nick) Jasper" are trademarks/names of their owner and are NOT licensed under Apache 2.0 or any other license granted in this repository.

**Read [LICENSE](./LICENSE) and [NOTICE](./NOTICE) in full before using, forking, or contributing to this project**. NOTICE covers naming rules for forks/derivatives (e.g. what you can and can't call a fork using "LXON").

## Goals

LXON was created with the following principles in mind:

* Fast parsing with minimal overhead.
* Easy implementation, just download once and have it do what it should with no complications.
* Human-readable syntax suitable for fast reading and manual editing.
* Compact with as little verbosity as possible.
* Simple and intuitive enough to be something you can do with minimal research.
* Extremely dynamic, supporting pracically all necessary container and value types.
* Extensible syntax that can evolve while still being able of parsing LXON written in previous versions.

## How To Use

Read the LICENSE and NOTICE files.

Go to Releases, then find the latest version which has the tag representing the programming language or framework your project uses. 

Alternatively, you can simply open the folder representing the programming language or framework your project uses, and download the source code from there, whether it be a single file script or a full Unreal Engine plugin.

You can also do `npm i lebbex` (lxon is too similar to other packages unfortunately, but since Lebbex probably will never have any other npm packages this works, i rather something simple and personal)

## Why LXON?

It's just better, like it or not. Name me something better and I'll find a reason to call you a loser.

Now go read the LICENSE and NOTICE files.

## Supported Container Types
* Object
* Array
* Map (same as objects but with typed keys, key type must be homogeneous)
* Doodad (same as objects but with single character keys that optimize speed and size, practical for Vectors)

## Supported Value Types
* Raw String (Doesn't require trailing double quote)
* String (Inline and Multiline)
* Char (Single character string)
* Boolean
* Number (Regular, Decimal, Scientific Notation)
* Date (ISO standard, very forgiving and dynamic syntax)
* Monetary (Big Int, along with optional currency information)
* Keybind (Can be used as special String alternatives in unsupporting languages, with more limitations)
* Color (All color spaces in 8bit, 10bit, 12bit, 16bit and float precision)
* Enum
* Binary (Stored as hexadecimal)
* Null, Undefined, NaN, +Infinity and -Infinity

## Contributing

Before even considering contribution, read the LICENSE and NOTICE files.

Contributions are welcome. Feel free to create your own parser/stringify scripts/plugins/etc. using LXON in the name, however it cannot be called just LXON the way ours are. 

If you want to reach out to us further, contact us at lxon@lebbex.com
