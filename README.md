# LXON

LXON (Lebbex Object Notation) is a serialization format developped solely by Nicholas (Jasper) Birla-Eliade, designed to be simple to read/edit, all while being as capable as possible for many and most usages.

## Goals

LXON was created with the following principles in mind:

* Fast parsing with minimal overhead.
* Easy implementation, just download once and have it do what it should with no complications.
* Human-readable syntax suitable for fast reading and manual editing.
* Eliminate verbsoity
* Simple and intuitive enough to be something you can do with minimal research.
* Extremely dynamic, supporting pracically all necessary container and value types.
* Extensible syntax that can evolve while still being able of parsing LXON written in previous versions.
* Compact with as little verbosity as possible.

## How To Use

Go to Releases, then find the latest version which has the tag representing the programming language or framework your project uses. 

Alternatively, you can simply open the folder representing the programming language or framework your project uses, and download the source code from there, whether it be a single file script or a full Unreal Engine plugin.

## Why LXON?

It's just better, like it or not. Name me something better and I'll find a reason to call you a loser.
- Nick Jasper (I do not speak in the image of the company)

## Supported Container Types
* Objects
* Arrays
* Maps (same as objects but with typed keys, key type must be homogenious)
* Doodads (same as objects but with single character keys that optimize speed and size, practical for Vectors)

## Supported Value Types
* Strings
* Char (Single character string)
* Boolean
* Numbers
* Null, Undefined, NaN, +Infinity and -Infinity
* Dates (ISO standard, very forgiving and dynamic syntax)
* Keybinds (Can be used as special String alternatives in unsupporting languages, with more limitations)
* SRGB Colors (represented through 8bit hexadecimal color code)
* Linear Colors (represented through 8bit hexadecimal color code or unlimited 16bit declaration)
* Byte Arrays (stored as hexadecimal)

## The Backstory

Originally, Nick Jasper was creating a way to automatically set up email redirect on Cloudflare for the @lebbex.com domain (and all its LTD alternatives). The redirect editor script had a HTML user interface that would allow him to add email addresses and where they redirect to and sync up these changes accross the different domain extensions automatically. Initially, he structured it under a tree navigation system, before switching to a pure custom-made JSON editor. 

He then realized how terrible JSON is to write and read, so he modified the editor, removing clutter. One of the first big changes, the root of what was changed in what would later become LXON, was the removal of trailing quotation marks for string values.

As he developped the editor, he decided to remake it due to its bugs, switching from a text based editor similar to Visual Studio Code, to something node based with seemless editing, the best of both worlds.

With this came the realization of the limitations of JSON, where it's missing many crucial value types and container types. This realization is what gave birth to LXON.
