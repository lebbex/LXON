// Every array indicates the sections of the page.
// These arrays have nested arrays, the first item
// reprensenting the section title, and the second,
// the header's id (for href and IntersectionObserver)
// Pages with children cannot have sections,
// it would be impossible to represent those sections
// as well as child pages all in once in the UI.

window.navTree = {
	Overview: [
		"", null,
		["Analogy", "analogy"],
		["Supported Features", "features"],
		["Supported Containers", "containers"],
		["Supported Keys", "keys"],
		["Supported Values", "values"],
		["Backstory", "backstory"]
	],
	Containers: {
		_: "/containers",
		__: "Containers",
		Object: [
			"/object", "Objects",
			["Definition", "def"],
			["Syntax", "syntax"]
		],
		Array: [
			"/array", "Arrays",
			["title", "id"]
		],
		Map: [
			"/map", "Maps",
			["title", "id"]
		],
		Doodad: [
			"/doodad", "Doodads",
			["title", "id"]
		],
	},
	Keys: {
		_: "/keys",
		__: "Keys",
		Text: {
			_: "/keys/text",
			__: "Text Keys",
			String: [
				"/keys/string", "String Keys",
				["title", "id"]
			],
			Char: [
				"/keys/char", "Char Keys",
				["title", "id"]
			],
		},
		Boolean: [
			"/keys/bool", "Bool Keys",
		],
		Number: [
			"/keys/number", "Num. Keys",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/keys/date", "Date Keys",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keys/keybind", "Keybind Keys",
		],
		Color: {
			_: "/keys/color",
			__: "Color Keys",
			SRGB_Color: [
				"/keys/srgb", "SRGB Keys",
			],
			Linear_Color: [
				"/keys/linear", "L. Color Keys",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/keys/enum", "Enum Keys",
		]
	},
	Values: {
		_: "/values",
		__: "Values",
		Text: {
			_: "/text",
			__: "Text Values",
			Full_String: [
				"/fullstring", "Full Strings",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			String: [
				"/string", "Strings",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Char: [
				"/char", "Chars",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
		},
		Boolean: [
			"/bool", "Booleans",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Visualization", "visualization"],
			["Usage", "usage"]
		],
		Number: [
			"/number", "Numbers",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/date", "Dates",
			["Definition", "def"],
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keybind", "Keybinds",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Color: {
			_: "/color",
			__: "Color Values",
			SRGB_Color: [
				"/srgb", "SRGB Colors",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Linear_Color: [
				"/linear", "Linear Colors",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/enum", "Enums",
		],
		Binary: [
			"/binary", "Binary Values",
		],
		Special: [
			"/special", "Special Values",
		]
	},
	Other: {
		_: "/other",
		__: "Other",
		Comments: [
			"/comments", "Comments",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Escape_Sequences: [
			"/escape", "Escape Sequences",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Supported Characters", "characters"],
			["Supported Environments", "environments"],
			["Usage", "usage"]
		]
	}
}
