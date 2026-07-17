// Every array indicates the sections of the page.
// These arrays have nested arrays, the first item
// reprensenting the section title, and the second,
// the header's id (for href and IntersectionObserver)
// Pages with children cannot have sections,
// it would be impossible to represent those sections
// as well as child pages all in once in the UI.

window.navTree = {
	Overview: [
		"",
		["Analogy", "analogy"],
		["Supported Features", "features"],
		["Supported Containers", "containers"],
		["Supported Keys", "keys"],
		["Supported Values", "values"],
		["Backstory", "backstory"]
	],
	Containers: {
		_: "/containers",
		Object: [
			"/object",
			["Definition", "def"],
			["Syntax", "syntax"]
		],
		Array: [
			"/array",
			["title", "id"]
		],
		Map: [
			"/map",
			["title", "id"]
		],
		Doodad: [
			"/doodad",
			["title", "id"]
		],
	},
	Keys: {
		_: "/keys",
		Text: {
			_: "/keys/text",
			String: [
				"/keys/string",
				["title", "id"]
			],
			Char: [
				"/keys/char",
				["title", "id"]
			],
		},
		Boolean: [
			"/keys/bool"
		],
		Number: [
			"/keys/number",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/keys/date",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keys/keybind"
		],
		Color: {
			_: "/keys/color",
			SRGB_Color: [
				"/keys/srgb"
			],
			Linear_Color: [
				"/keys/linear",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/keys/enum"
		]
	},
	Values: {
		_: "/values",
		Text: {
			_: "/text",
			Full_String: [
				"/fullstring",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			String: [
				"/string",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Char: [
				"/char",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
		},
		Boolean: [
			"/bool",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Visualization", "visualization"],
			["Usage", "usage"]
		],
		Number: [
			"/number",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/date",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keybind"
		],
		Color: {
			_: "/color",
			SRGB_Color: [
				"/srgb"
			],
			Linear_Color: [
				"/linear",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/enum"
		],
		Binary: [
			"/binary"
		],
		Special: [
			"/special"
		]
	},
	Other: {
		_: "/other",
		Comments: [
			"/comments",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Escape_Sequences: [
			"/escape",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		]
	}
}
