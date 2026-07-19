// Every array indicates the sections of the page.
// These arrays have nested arrays, the first item
// reprensenting the section title, and the second,
// the header's id (for href and IntersectionObserver)
// Pages with children cannot have sections,
// it would be impossible to represent those sections
// as well as child pages all in once in the UI.

// _nav: what you see in the side nav bar
// _tit: what you see as content title
// _url: the page's url
// _page: what you see as the page tab's title

// in arrays, they're set in this same exact order

window.navTree = {
	Overview: [
		"Overview", "LXON Documentation",
		"", null, // <- null because it gets set through code
		["Analogy", "analogy"],
		["Supported Features", "features"],
		["Supported Containers", "containers"],
		["Supported Keys", "keys"],
		["Supported Values", "values"],
		["Backstory", "backstory"]
	],
	Containers: {
		_nav: "Containers",
		_tit: "LXON Containers",
		_url: "/containers",
		_page: "Containers",
		Object: [
			"Object", "Object",
			"/object", "Objects",
			["Definition", "def"],
			["Syntax", "syntax"]
		],
		Array: [
			"Array", "Array",
			"/array", "Arrays",
			["title", "id"]
		],
		Map: [
			"Map", "Map",
			"/map", "Maps",
			["title", "id"]
		],
		Doodad: [
			"Doodad", "Doodad",
			"/doodad", "Doodads",
			["title", "id"]
		],
	},
	Keys: {
		_nav: "Keys",
		_tit: "LXON Keys",
		_url: "/keys",
		_page: "Keys",
		Text: {
			_nav: "Text",
			_tit: "Text Key Types",
			_url: "/keys/text",
			_page: "Text Keys",
			String: [
				"String", "String Key",
				"/keys/string", "String Keys",
				["title", "id"]
			],
			Char: [
				"Char", "Char Key",
				"/keys/char", "Char Keys",
				["title", "id"]
			],
		},
		Boolean: [
			"Boolean", "Boolean Key",
			"/keys/bool", "Bool Keys",
		],
		Number: [
			"Number", "Number Key",
			"/keys/number", "Num. Keys",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"Date", "Date Key",
			"/keys/date", "Date Keys",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"Keybind", "Keybind Key",
			"/keys/keybind", "Keybind Keys",
		],
		Color: {
			_nav: "Color",
			_tit: "Color Key Types",
			_url: "/keys/color",
			_page: "Color Keys",
			SRGB_Color: [
				"SRGB Color", "SRGB Color Key",
				"/keys/srgb", "SRGB Keys",
			],
			Linear_8: [
				"Linear Color (8\u00A0Bit)", "Linear Color Key (8\u00A0Bit)",
				"/keys/linear8", "8bit Color Keys (Linear)",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			],
			Linear_16: [
				"Linear Color (16\u00A0Bit)", "Linear Color Key (16\u00A0Bit)",
				"/keys/linear16", "16bit Color Keys (Linear)",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"Enum", "Enum Key",
			"/keys/enum", "Enum Keys",
		]
	},
	Values: {
		_nav: "Values",
		_tit: "LXON Values",
		_url: "/values",
		_page: "Values",
		Text: {
			_nav: "Text",
			_tit: "Text Value Types",
			_url: "/text",
			_page: "Text Values",
			Full_String: [
				"Full String", "Full String",
				"/fullstring", "Full Strings",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			String: [
				"String", "String",
				"/string", "Strings",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Char: [
				"Char", "Char",
				"/char", "Chars",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
		},
		Boolean: [
			"Boolean", "Boolean",
			"/bool", "Booleans",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Visualization", "visualization"],
			["Usage", "usage"]
		],
		Number: [
			"Number", "Number",
			"/number", "Numbers",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"Date", "Date",
			"/date", "Dates",
			["Definition", "def"],
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"Keybind", "Keybind",
			"/keybind", "Keybinds",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Color: {
			_nav: "Color",
			_tit: "Color Value Types",
			_url: "/color",
			_page: "Color Values",
			SRGB_Color: [
				"SRGB Color", "SRGB Color",
				"/srgb", "SRGB Colors",
				["Syntax", "syntax"],
				["Termination", "termination"],
				["Channel Skipping", "skip"]
			],
			Linear_8: [
				"Linear Color (8\u00A0Bit)", "Linear Color (8\u00A0Bit)",
				"/keys/linear8", "8 Bit Linear Colors",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			],
			Linear_16: [
				"Linear Color (16\u00A0Bit)", "Linear Color (16\u00A0Bit)",
				"/linear", "16 Bit Linear Colors"
				["Syntax", "syntax"],
				["Termination", "termination"],
				["Channel Skipping", "skip"]
			]
		},
		Enum: [
			"Enum", "Enum",
			"/enum", "Enums",
		],
		Binary: [
			"Binary", "Binary",
			"/binary", "Binary Values",
		],
		Special: [
			"Special", "Special Value Types",
			"/special", "Special Values",
		]
	},
	Other: {
		_nav: "Other",
		_tit: "Other Features",
		_url: "/other",
		_page: "Other",
		Comments: [
			"Comments", "LXON Comments",
			"/comments", "Comments",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Escape_Sequences: [
			"Escape Sequences", "Escape Sequences",
			"/escape", "Escape Sequences",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Supported Characters", "characters"],
			["Supported Environments", "environments"],
			["Usage", "usage"]
		]
	}
}
