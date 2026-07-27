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
		["Backstory", "backstory"],
		["License & Trademarks", "license-trademarks"]
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
		Color: [
			"Color", "Color Key Types",
			"/keys/color", "Keys // Color Types",
			"Color"
		],
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
			_tit: "Text",
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
			["Chaining", "chain"],
			["Usage", "usage"]
		],
		Color: {
			_nav: "Color",
			_tit: "Color",
			_url: "/color",
			_page: "Colors",
			_min: "Color",
			Spaces: {
				_nav: "Spaces",
				_tit: "Color Spaces",
				_url: "/color/spaces",
				_page: "Color Spaces",
				_min: "Spaces",
				SRGB: [
					"SRGB", "SRGB Color",
					"/color/srgb", "SRGB Colors",
					"SRGB",
				],
				Linear: [
					"Linear SRGB", "Linear SRGB Color",
					"/color/linear", "Linear SRGB Colors",
					"Linear",
				],
				Profiles: [
					"Profiled", "Profiled Color",
					"/color/profiled", "Profiled Colors",
					"Profiled",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Codes", "codes"],
					["Terminators", "terminators"],
				]
			},
			Precisions: {
				_nav: "Precisions",
				_tit: "Color Precision Levels",
				_url: "/color/precisions",
				_page: "Color Precisions",
				_min: "Precisions",
				Bit_8: [
					"8 Bit", "8 Bit Color",
					"/color/8bit", "8 Bit Colors",
					"8 Bit",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Termination", "termination"],
					["Channel Skipping", "skip"]
				],
				Bit_10: [
					"10 Bit", "10 Bit Color",
					"/color/10bit", "10 Bit Colors",
					"10 Bit",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Termination", "termination"],
					["Channel Skipping", "skip"],
				],
				Bit_12: [
					"12 Bit", "12 Bit Color",
					"/color/12bit", "12 Bit Colors",
					"16 Bit",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Termination", "termination"],
					["Channel Skipping", "skip"]
				],
				Bit_16: [
					"16 Bit", "16 Bit Color",
					"/color/16bit", "16 Bit Colors",
					"16 Bit",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Termination", "termination"],
					["Channel Skipping", "skip"]
				],
				Float: [
					"Infinite (Float)", "Float. Point Color",
					"/color/float", "Float. Point Colors",
					"Float",
					["Definition", "def"],
					["Syntax", "syntax"],
					["Channel Skipping", "skip"]
				]
			}
		},
		Enum: [
			"Enum", "Enum",
			"/enum", "Enums",
			"Enum",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Chaining", "chain"],
			["Usage", "usage"]
		],
		Binary: [
			"Binary", "Binary",
			"/binary", "Binary Values",
			"Binary",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Chaining", "chain"],
			["Usage", "usage"]
		],
		Special: [
			"Special", "Special Values",
			"/special", "Special Values",
			"Special",
			["Definition", "def"],
			["Syntax", "syntax"],
			["Usage", "usage"]
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
