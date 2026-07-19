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
		"Overview", "Documentation",
		"", null, // <- null because it gets set through code
		"Documentation",
		["Analogy", "analogy"],
		["Supported Features", "features"],
		["Supported Containers", "containers"],
		["Supported Keys", "keys"],
		["Supported Values", "values"],
		["Backstory", "backstory"]
	],
	Containers: {
		_nav: "Containers",
		_tit: "Containers",
		_url: "/containers",
		_page: "Containers",
		_min: "Containers",
		Object: [
			"Object", "Object",
			"/object", "Objects",
			"Obj",
			["Definition", "def"],
			["Syntax", "syntax"]
		],
		Array: [
			"Array", "Array",
			"/array", "Arrays",
			"Array",
			["title", "id"]
		],
		Map: [
			"Map", "Map",
			"/map", "Maps",
			"Map",
			["title", "id"]
		],
		Doodad: [
			"Doodad", "Doodad",
			"/doodad", "Doodads",
			"Doodad",
			["title", "id"]
		],
	},
	Keys: {
		_nav: "Keys",
		_tit: "(Typed) Keys",
		_url: "/keys",
		_page: "Keys",
		_min: "Keys",
		Text: {
			_nav: "Text",
			_tit: "Text Key Types",
			_url: "/keys/text",
			_page: "Keys // Text Types",
			_min: "Text",
			String: [
				"String", "String Key",
				"/keys/string", "Keys // Strings",
				"Str",
				["title", "id"]
			],
			Char: [
				"Char", "Char Key",
				"/keys/char", "Keys // Chars",
				"Char",
				["title", "id"]
			],
		},
		Boolean: [
			"Boolean", "Boolean Key",
			"/keys/bool", "Keys // Booleans",
			"Bool"
		],
		Number: [
			"Number", "Number Key",
			"/keys/number", "Keys // Numbers",
			"Num",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"Date", "Date Key",
			"/keys/date", "Keys // Dates",
			"Date",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"Keybind", "Keybind Key",
			"/keys/keybind", "Keys // Keybinds",
			"KBind"
		],
		Color: {
			_nav: "Color",
			_tit: "Color Key Types",
			_url: "/keys/color",
			_page: "Keys // Color Types",
			_min: "Color",
			SRGB_Color: [
				"SRGB Color", "SRGB Color Key",
				"/keys/srgb", "Keys // SRGB Colors",
				"SRGB",
			],
			Linear_8: [
				"Linear Color (8\u00A0Bit)", "Linear Color Key (8\u00A0Bit)",
				"/keys/linear8", "Keys // 8 Bit Linear Colors",
				"Lin. 8 Bit",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			],
			Linear_16: [
				"Linear Color (16\u00A0Bit)", "Linear Color Key (16\u00A0Bit)",
				"/keys/linear16", "Keys // 16 Bit Linear Colors",
				"Lin. 16 Bit",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"Enum", "Enum Key",
			"/keys/enum", "Keys // Enums",
			"Enum",
		]
	},
	Values: {
		_nav: "Values",
		_tit: "Values",
		_url: "/values",
		_page: "Values",
		_min: "Values",
		Text: {
			_nav: "Text",
			_tit: "Text Value Types",
			_url: "/text",
			_page: "Text Values",
			_min: "Text",
			Full_String: [
				"Full String", "Full String",
				"/fullstring", "Full Strings",
				"Full",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			String: [
				"String", "String",
				"/string", "Strings",
				"Str",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Char: [
				"Char", "Char",
				"/char", "Chars",
				"Char",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
		},
		Boolean: [
			"Boolean", "Boolean",
			"/bool", "Booleans",
			"Bool",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Visualization", "visualization"],
			["Usage", "usage"]
		],
		Number: [
			"Number", "Number",
			"/number", "Numbers",
			"Num",
			["Definition", "def"],
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"Date", "Date",
			"/date", "Dates",
			"Date",
			["Definition", "def"],
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"Keybind", "Keybind",
			"/keybind", "Keybinds",
			"KBind",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Color: {
			_nav: "Color",
			_tit: "Color Value Types",
			_url: "/color",
			_page: "Color Values",
			_min: "Color",
			SRGB_Color: [
				"SRGB Color", "SRGB Color",
				"/srgb", "SRGB Colors",
				"SRGB",
				["Syntax", "syntax"],
				["Termination", "termination"],
				["Channel Skipping", "skip"]
			],
			Linear_8: [
				"Linear Color (8\u00A0Bit)", "Linear Color (8\u00A0Bit)",
				"/keys/linear8", "8 Bit Linear Colors",
				"Lin. 8 Bit",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			],
			Linear_16: [
				"Linear Color (16\u00A0Bit)", "Linear Color (16\u00A0Bit)",
				"/linear", "16 Bit Linear Colors",
				"Lin. 16 Bit",
				["Syntax", "syntax"],
				["Termination", "termination"],
				["Channel Skipping", "skip"]
			]
		},
		Enum: [
			"Enum", "Enum",
			"/enum", "Enums",
			"Enum",
		],
		Binary: [
			"Binary", "Binary",
			"/binary", "Binary Values",
			"Binary",
		],
		Special: [
			"Special", "Special Value Types",
			"/special", "Special Values",
			"Special",
		]
	},
	Other: {
		_nav: "Other",
		_tit: "Other Features",
		_url: "/other",
		_page: "Other",
		_min: "Other",
		Comments: [
			"Comments", "Comments",
			"/comments", "Comments",
			"Comments",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Escape: [
			"Escape Sequences", "Escape Sequences",
			"/escape", "Escape Sequences",
			"Escape",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Supported Characters", "characters"],
			["Supported Environments", "environments"],
			["Usage", "usage"]
		]
	}
}
