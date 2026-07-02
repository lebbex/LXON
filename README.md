# LXON

LXON is a serialization format developped solely by Nicholas (Jasper) Birla-Eliade out of his frustration towards JSON.

## The backstory

Originally, Nick Jasper was creating a way to automatically set up email redirect on Cloudflare for the @lebbex.com domain (and all its LTD alternatives). The redirect editor script had a HTML user interface that would allow him to add email addresses and where they redirect to and sync up these changes accross the different domain extensions automatically. Initially, he structured it under a tree navigation system, before switching to a pure custom-made JSON editor. 

He then realized how terrible JSON is to write and read, so he modified the editor, removing clutter. One of the first big changes, the root of what was changed in what would later become LXON, was the removal of trailing quotation marks for string values.

As he developped the editor, he decided to remake it due to its bugs, switching from a text based editor similar to Visual Studio Code, to something node based with seemless editing, the best of both worlds.

With this came the realization of the limitations of JSON, where it's missing many crucial value types and container types. This realization is what gave birth to LXON.

## Supported containers and values

Container types:
* Objects
* Arrays
* Maps (same as objects but with typed keys, key type must be homogenious)
* Doodads (micro-objects with single character keys that optimize speed and size, used mostly for things such as Vectors)

Value types:
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
