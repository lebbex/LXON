# LXON

LXON (Lebbex Object Notation) is a serialization format developped solely by Nick Jasper, designed to be simple to read/edit, all while being as capable as possible for many and most usages.

## License & Trademarks

This project's source code is proprietary and cannot be used, distributed, modified, adapted, altered, translated or otherwise used to create derivative works.

The overall combinations of syntax rules, in whole or in part, unique and identifiable to this serialization format, are also forbidden from being reused in any products.

A future EULA may be put in place to allow usage and distribution, which is the main reason this repository is public, although this isn't guaranteed. Think of this as more of a public showcase, look but don't touch.

## Goals

LXON was created with the following principles in mind:

* Fast parsing with minimal overhead.
* Easy implementation, just download once and have it do what it should with no complications.
* Human-readable syntax suitable for fast reading and manual editing.
* Compact with as little verbosity as possible.
* Simple and intuitive enough to be something you can do with minimal research.
* Extremely dynamic, supporting pracically all necessary container and value types.
* Extensible syntax that can evolve while still being able of parsing LXON written in previous versions.

## Supported Container Types
* Object
* Array
* Map (same as objects but with typed keys, key type must be homogeneous)
* Doodad (same as objects but with single character keys that optimize speed and size, practical for Vectors)

## Supported Key Types
* String
* Boolean
* Number
* Date
* Monetary
* Keybind
* Color
* Enum
* Binary

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

This repository is not open to contributions, as it is a proprietary project solely developed and maintained by the author. Pull requests, issues requesting code changes, and feature forks won't be accepted nor reviewed.
