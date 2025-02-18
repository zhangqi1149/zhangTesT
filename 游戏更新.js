// 设置服务器地址
var text = "全球最低金币 PlayPal担保交易。欢迎来到igokay.com。 The lowest price gold transactions in the world. Use PlayPal guaranteed payment. Welcome to igokay.com." ;

var  Save = false  // true   false 
let filePath = "/storage/emulated/0/Documents/config.txt";
// 原始别名
let Bm = readLastLine().trim()
// console.log("Bm :", Bm )
let Log = false

let Servers = {
    "492f9be6": {
		"Id": "1",
		"Server": "ASIA081",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
    "5e19856c-7435-4426-813d-4c0b3899399b": {
		"Id": "000",
		"Server": "SA011",
		// "OCRip":"http://192.168.1.139",
		"OCRip":"http://192.168.1.139",
		"port" : "8001"
	},
	"145f0de7-ea15-4757-a0b6-28c4080cadee": {
		"Id": "200",
		"Server": "SA011",
		"OCRip":"http://192.168.1.139",
		"port" : "8001"
	},
	"befb893f": {
		"Id": "199",
		"Server": "SA012",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"99863ada-8921-4df4-a8d0-a6d5feaa6f35": {
		"Id": "198",
		"Server": "SA013",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"418527e2-ca21-45fd-be46-c46003f0eadf": {
		"Id": "197",
		"Server": "SA014",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"54203733-7890-40dc-97d4-c6234826107b": {
		"Id": "196",
		"Server": "SA021",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"69561c02-bb04-4403-8d3f-e14a125777c8": {
		"Id": "195",
		"Server": "SA022",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"09759f37-2602-4ed4-acd0-d8b83df325e5": {
		"Id": "194",
		"Server": "SA023",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"9ac8ecdf-acb2-4a3f-981f-12796fa4df9d": {
		"Id": "193",
		"Server": "SA031",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"c805c45c-29db-40c2-9a7e-e618d94a5481": {
		"Id": "192",
		"Server": "SA032",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"3a7e8e3d-1476-47fa-870b-41fe7639666c": {
		"Id": "191",
		"Server": "SA033",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"3c48acb4-2d07-44d5-8755-131de595f7b8": {
		"Id": "190",
		"Server": "SA034",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"362753d2-9c4e-4f4a-b6ac-40f9845a30bf": {
		"Id": "189",
		"Server": "SA041",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
    "1ef2dbc4-634c-4721-ac65-ca4106fe6d28": {
		"Id": "188",
		"Server": "SA043",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"4e8a403b-4887-4248-835b-7967ce71c62d": {
		"Id": "187",
		"Server": "SA044",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"603dc59b-7e09-4c8a-8284-2b0831ed731e": {
		"Id": "186",
		"Server": "SA051",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"5e4a803e-8159-41b2-bd72-7db6a306ae14": {
		"Id": "185",
		"Server": "SA052",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"7618ee50-4199-4ca3-83cc-2d26bc693efd": {
		"Id": "184",
		"Server": "SA053",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"5c4680fb-6f71-4306-91ea-e9d14a3f9c89": {
		"Id": "183",
		"Server": "SA054",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"779ff20d-6c04-4b21-94c5-d968d17ade1b": {
		"Id": "182",
		"Server": "SA061",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"23ab0919-15b3-4377-b58c-b8ade4ef8151": {
		"Id": "181",
		"Server": "SA071",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"b17895f8-937d-465c-a90c-cd44d3de7721": {
		"Id": "180",
		"Server": "SA072",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"2f44aae3-2d77-4706-928b-c989cd3a8a56": {
		"Id": "179",
		"Server": "SA081",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"1e82aa35-b79b-41d9-a8e8-d3d4d712d45e": {
		"Id": "178",
		"Server": "SA082",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"cd324f29-72bf-4902-b466-bf02c05b29f9": {
		"Id": "177",
		"Server": "SA083",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"6dc4afc3-943c-4df2-a895-8ef1f3244f67": {
		"Id": "176",
		"Server": "SA062",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
    "79ee6eab-e562-4d62-9880-027296a17564": {
		"Id": "175",
		"Server": "SA063",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"2259877e-5b94-45d4-a2f2-b085b680b5f3": {
		"Id": "174",
		"Server": "SA064",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"bf01a49e-449a-4062-a1b3-99d626518403": {
		"Id": "173",
		"Server": "SA073",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"63b73ee4": {
		"Id": "172",
		"Server": "NA011",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"9434ba65": {
		"Id": "171",
		"Server": "NA012",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"99f502fd": {
		"Id": "170",
		"Server": "NA021",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"b53d9b12": {
		"Id": "169",
		"Server": "NA022",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"c63ab7dc": {
		"Id": "168",
		"Server": "NA023",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"d8de1484": {
		"Id": "167",
		"Server": "NA031",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"10e56bcc": {
		"Id": "166",
		"Server": "NA032",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"30d5a6a8": {
		"Id": "165",
		"Server": "NA033",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"dff4a00": {
		"Id": "164",
		"Server": "NA034",
		"OCRip":"http://192.168.1.139",
		"port":"8001",

	},
	"c61320d3": {
		"Id": "163",
		"Server": "NA042",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"c9e6d3ef": {
		"Id": "162",
		"Server": "NA043",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"84761629": {
		"Id": "161",
		"Server": "NA044",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"a0673f35": {
		"Id": "160",
		"Server": "NA013",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"98fadf9d": {
		"Id": "159",
		"Server": "NA014",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"c2df4216": {
		"Id": "158",
		"Server": "NA051",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"e363abda": {
		"Id": "157",
		"Server": "NA054",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"8da15129": {
		"Id": "156",
		"Server": "NA064",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"244e67d6": {
		"Id": "155",
		"Server": "NA083",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"8f1383bc": {
		"Id": "154",
		"Server": "NA052",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"12238381": {
		"Id": "153",
		"Server": "NA053",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"1f08528f": {
		"Id": "152",
		"Server": "NA062",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"6df167cc": {
		"Id": "151",
		"Server": "NA061",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"895f0f14": {
		"Id": "150",
		"Server": "NA071",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
    "712ba73f": {
		"Id": "149",
		"Server": "NA072",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"9c9eb045": {
		"Id": "148",
		"Server": "NA073",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"bd253a0d": {
		"Id": "147",
		"Server": "NA074",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"c27bf550": {
		"Id": "146",
		"Server": "NA081",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"5b2adda0": {
		"Id": "145",
		"Server": "NA082",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"b9ad4ca5-c7c6-49cd-bdd7-bcaaef39388b": {
		"Id": "144",
		"Server": "EU043",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"5b408a2b-bad8-433d-b34e-ae6a92f469df": {
		"Id": "143",
		"Server": "EU011",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"d35cefcd-305d-466f-8d51-db923813e672": {
		"Id": "142",
		"Server": "EU021",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"9eba95cf-fffa-4597-a73c-ea6377a851e4": {
		"Id": "141",
		"Server": "EU041",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"a7ff01f5-7502-4b4b-a63a-7287abebb965": {
		"Id": "140",
		"Server": "EU012",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"1f049432-9494-440e-b004-511309a5e6a9": {
		"Id": "139",
		"Server": "EU013",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"0e3400fb-6a11-468c-b21e-2e8ec262a8cf": {
		"Id": "138",
		"Server": "EU014",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
	"1f2dfb0a-9546-468f-b685-187444763cc9": {
		"Id": "137",
		"Server": "EU022",
		"OCRip":"http://192.168.1.139",
		"port":"8002",
	},
    	
	"980dfa3f-1cf3-4864-a7d8-8b44cf7b5691": {
		"Id": "136",
		"Server": "EU023",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"d05726f5-e587-4657-9c44-eaf132d5eb01": {
		"Id": "135",
		"Server": "EU024",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"756996c8-f937-45f4-a426-57ee86a8caf7": {
		"Id": "134",
		"Server": "EU031",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"48a36291-0202-4513-8977-02b4a1199be8": {
		"Id": "133",
		"Server": "EU032",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"6588b429-83d1-4e8e-8a52-d1bdc2fa4bdc": {
		"Id": "132",
		"Server": "EU033",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"2e8887ce-5d4b-47df-b80a-5046bb228274": {
		"Id": "131",
		"Server": "EU034",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"fa9ee7b3-4131-43c9-977d-a8ffbc7e471e": {
		"Id": "130",
		"Server": "EU042",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},

	"63d74fc5-978c-4e59-b162-dabddac2183b": {
		"Id": "129",
		"Server": "BASIA001",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
	"237e1f42-4bdb-4a03-a6f1-923332f33b45": {
		"Id": "128",
		"Server": "BASIA002",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
	"b645032e-ef99-4a28-a0dc-a633eec7867d": {
		"Id": "127",
		"Server": "BNA011",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
	"bd9ddb80-8e31-4bf2-8aaa-5df15efc07ae": {
		"Id": "126",
		"Server": "BEU031",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
	"4f2cd5fa-47f3-4d9c-847c-1879ce2d8c75": {
		"Id": "125",
		"Server": "BSA021",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
	"22c22383-d02a-4c81-808f-f9a7c2cc831d": {
		"Id": "124",
		"Server": "BINMENA041",
		"OCRip":"http://192.168.3.184",
		"port":"8001",
	},
    
    "b402fcdb": {
        "Id": "123",
        "Server": "ASIA011",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "1ef862e0": {
        "Id": "122",
        "Server": "ASIA012",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "96a294d0": {
        "Id": "121",
        "Server": "ASIA013",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "f54f8429-8fc9-45be-be3d-db3d0bf99475": {
        "Id": "120",
        "Server": "ASIA014",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "71d8a433-4789-4dd5-a6da-2604c958615e": {
        "Id": "119",
        "Server": "ASIA021",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "e5f1b8f8-0b74-4ff6-ab03-13e58a19bdec": {
        "Id": "118",
        "Server": "ASIA022",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "b491a690-521c-4a2e-8a7e-21e979085e67": {
        "Id": "117",
        "Server": "ASIA023",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "edcef95f-c98a-4107-a76b-715908e0e659": {
        "Id": "116",
        "Server": "ASIA024",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "12fdc099-8351-4a20-a046-a74b8adcfa83": {
        "Id": "115",
        "Server": "ASIA031",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "4cd13a96-4b51-4862-b503-5881f339242a": {
        "Id": "114",
        "Server": "ASIA032",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "0c86be59-cbea-4fa0-816c-7c5f16bcbe9f": {
        "Id": "113",
        "Server": "ASIA033",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "408830f3-7f73-44d1-b33c-c79d18fc4de4": {
        "Id": "112",
        "Server": "ASIA041",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "40e83d09-d549-443d-bfc4-d004bd693d19": {
        "Id": "111",
        "Server": "ASIA042",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },    

    "50e7f21d-2508-4cab-97e9-8a676e0986ea": {
        "Id": "110",
        "Server": "ASIA043",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "047a7c32-de99-4bd9-8503-a11050de37b5": {
        "Id": "109",
        "Server": "ASIA051",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "da727009-8386-4aa3-b7ad-b12e069f7eba": {
        "Id": "108",
        "Server": "ASIA052",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "b546783d-1a82-4465-938b-07fe5fa1cda7": {
        "Id": "107",
        "Server": "ASIA053",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "d6e6a347-c8e7-462d-90be-de1e35da5848": {
        "Id": "106",
        "Server": "ASIA054",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "63f061a5-bd02-4ee5-b4a7-f360068c69a3": {
        "Id": "105",
        "Server": "ASIA061",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "3207acb8-545c-460b-8237-30c9aaef161a": {
        "Id": "104",
        "Server": "ASIA062",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "7fd8c4be-69c4-48a9-b3fd-aaa7598f479e": {
        "Id": "103",
        "Server": "ASIA063",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "36408acc-ca39-4b57-bfec-8fc4b1d1bac3": {
        "Id": "102",
        "Server": "ASIA064",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "0f8f4a18-d173-4045-a0f1-f991d681700c": {
        "Id": "101",
        "Server": "ASIA071",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "a4a38793-f81f-4fe6-95cd-e12343fa5768": {
        "Id": "100",
        "Server": "ASIA072",
        // "OCRip":"http://192.168.3.184",  // todo
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "b3d90a30-0513-4ff8-ab72-4cc5154e91a4": {
        "Id": "99",
        "Server": "ASIA073",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "1dbb01ca-cdf4-42c1-8935-0e9cc8ca556e": {
        "Id": "98",
        "Server": "ASIA081",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },    
    "45ab4f25-81f8-4bcc-9043-acc85dc47e62": {
        "Id": "97",
        "Server": "ASIA082",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "970c32eb-b623-4764-8743-b5685e308fb5": {
        "Id": "96",
        "Server": "ASIA083",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "f92f2125-71fa-4a0e-b2a6-9a02531ce067": {
        "Id": "95",
        "Server": "ASIA343",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "47ffe00d-52cb-4150-bdb1-49d50b3c1a4f": {
        "Id": "94",
        "Server": "ASIA342",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "843e61dd-3243-4196-ad84-347d1d33ceb6": {
        "Id": "93",
        "Server": "ASIA341",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "4d1a81a4-5e7e-4d41-b65f-5bedf13dc23e": {
        "Id": "92",
        "Server": "ASIA333",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "5d75350e-975e-43e6-b8ab-7ff58df796ad": {
        "Id": "91",
        "Server": "ASIA332",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "beb9afa5-1898-499e-93a7-706034a5c0df": {
        "Id": "90",
        "Server": "ASIA331",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
	"2e01cc5f-a829-4a35-87fc-8ce7f0ae5a39": {
        "Id": "89",
        "Server": "ASIA324",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
	"355f4465-1f65-469c-bf6c-81f629bc5b2d": {
        "Id": "88",
        "Server": "ASIA323",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "187eb6fb-520b-4cf0-b469-0c34d21b3711": {
        "Id": "87",
        "Server": "ASIA322",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "73940854": {
		"Id": "86",
		"Server": "ASIA321",
		"OCRip":"http://192.168.3.184",
		"port" : "8002"
	},
    "5cf80fc6-b4b2-4034-990a-42900fba3630": {
        "Id": "85",
        "Server": "ASIA314",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "3c7a0b0c-f3d1-44bc-9613-0015f038b5f9": {
        "Id": "84",
        "Server": "ASIA313",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "6c3f773c-c662-433b-97d3-7cb0c2d27fbe": {
        "Id": "83",
        "Server": "ASIA312",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "d3bfaea1-e0eb-4169-92e3-b4165a43bc30": {
        "Id": "82",
        "Server": "ASIA311",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "bd36bbe9-383e-4f09-824f-e60a313746eb": {
        "Id": "81",
        "Server": "ASIA353",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "6e4c7f85-e171-414c-bbd2-f7333b48d605": {
        "Id": "80",
        "Server": "ASIA351",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "b9c5acfc-e77c-4d29-a0e7-8e347de0b1c3": {
        "Id": "79",
        "Server": "ASIA353",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "3172dc49-bc00-42d9-b97a-3f8f5796ccc4": {
        "Id": "78",
        "Server": "ASIA354",
        "OCRip":"http://192.168.3.184",
		"port":"8001",
    },
    "73b351fe-9789-4a7d-b27f-ec431b16677b": {
        "Id": "77",
        "Server": "ASIA361",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "b0d0cbd3-be11-4a50-8b5b-4a50e0efcb55": {
        "Id": "76",
        "Server": "ASIA362",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "7df85b12-105d-438c-a2e7-f487b1ded057": {
        "Id": "75",
        "Server": "ASIA363",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "18055116-dd62-4365-9917-501ec0bf8bd5": {
        "Id": "74",
        "Server": "ASIA364",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "1a8c31f1-2aac-42cf-a5d9-dae264ff31b7": {
        "Id": "73",
        "Server": "ASIA371",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "d02b7531-161c-4fc1-ab6d-bd64783fd6e8": {
        "Id": "72",
        "Server": "ASIA372",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "2b808dbf-8156-4f42-a458-56313648a57a": {
        "Id": "71",
        "Server": "ASIA373",
        "OCRip":"http://192.168.3.184",
		"port":"8002",
    },
    "502ea617-95c7-4345-9c9b-07de90939c3c": {
        "Id": "2",
        "Server": "PP1",
        "OCRip":"http://192.168.3.184",
        "port":"8001",
    },
    "f035e510-885d-48e8-9ca7-1be7d4bb7244": {
        "Id": "4",
        "Server": "PP1",
        "Area": "Honor",
        "OCRip":"http://192.168.3.184",
        "port" : "8001"
    },
    "db0a9c6e-4861-44ca-b100-df2e3fa10aa9": {
        "Id": "5",
        "Server": "PP1",
        "Area": "Metus",
        "OCRip":"http://192.168.3.184",
        "port" : "8001"
    },
    "2c032b18-6c37-4553-bb40-b272f2c1ffa0": {
        "Id": "6",
        "Server": "PP1",
        "Area": "Dolor",
        "OCRip":"http://192.168.3.184",
        "port" : "8002"
    },
    "c7459aa8-7b24-4dd2-96e0-4003b56a74b2": {
        "Id": "8",
        "Server": "PP1",
        "Area": "Mors",
        "OCRip":"http://192.168.3.184",
        "port" : "8002"
    },
    "d597973b-b1df-4815-bc6c-a9a6350e83eb": {
        "Id": "70",
        "Server": "PP1",
        "Area": "Metus",
        "OCRip":"http://192.168.3.184",
        "port" : "8001"
    },
    "ede8024d-fe43-4ccc-b321-4acd86afe04b": {
        "Id": "16",
        "Server": "PP1",
        "Area": "Honor",
        "OCRip":"http://192.168.3.184",
        "port" : "8002"
    },

    "d213ae0d-baa4-467b-9e10-94906403a326": {
        "Id": "9",
        "Server": "PP1",
        "Area": "Salus",
        "OCRip":"http://192.168.1.139",
        "port" : "8001"
    },
    "e9568c72-b6cc-4b82-8d57-90398ad81f83": {
        "Id": "10",
        "Server": "PP1",
        "Area": "Honor",
        "OCRip":"http://192.168.1.139",
        "port" : "8002"
    },
    "19cf0d1b-8a79-4518-aecd-1323cf72c856": {
        "Id": "11",
        "Server": "PP1",
        "Area": "Metus",
        "OCRip":"http://192.168.1.139",
        "port" : "8001"
    },
    "8306d9c7-2353-4941-b729-1c4112ef96fd": {
        "Id": "12",
        "Server": "PP1",
        "Area": "Dolor",
        "OCRip":"http://192.168.1.139",
        "port" : "8002"
    },
    "84cd9728-e572-4033-8517-9c43cf053dbf": {
        "Id": "13",
        "Server": "PP1",
        "Area": "Fides",
        "OCRip":"http://192.168.1.139",
        "port" : "8001"
    },
    "abc03056-838a-4780-b603-a114d45c7608": {
        "Id": "14",
        "Server": "PP1",
        "Area": "Mors",
        "OCRip":"http://192.168.1.139",
        "port" : "8002"
    },
    "4aee80d3-0e50-4cd7-b0da-0c87cee6f782": {
        "Id": "15",
        "Server": "PP1",
        "Area": "Salus",
        "OCRip":"http://192.168.1.139",
        "port" : "8001"
    },
}



function log_z(message) {
    if (Log) {
        console.log(message);
    }
}

let SERVER_URL = Servers[Bm].OCRip + ":" + Servers[Bm].port
// console.log("SERVER_URL :",SERVER_URL)

// let SERVER_URL = "http://192.168.1.140:8001"

// 读取文件并返回最后一行
function readLastLine() {
    let reader = new java.io.BufferedReader(new java.io.FileReader(filePath));
    let line;
    let lastLine = '';

    // 逐行读取文件内容
    while ((line = reader.readLine()) !== null) {
        lastLine = line;  // 不断更新最后一行
    }

    reader.close();
    return lastLine;  // 返回最后一行内容
}

// SERVER_URL = "http://192.168.1.94:8002";  // 服务器2  8001 -8005  每个13个
// let SERVER_URL = "http://192.168.1.139:8002";  // 服务器1 8001 -8005

var storage = storages.create("ABC");

// OCR请求
function getOcr(img) {
    function postJson(url, jsonData) {
        let response = null;
        // 创建线程执行 HTTP 请求
        let thread = threads.start(function () {
            try {
                response = http.postJson(url, jsonData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                log_z("请求出错: " + e);
            }
        });
    
        // 等待线程完成, 超时时间为 10 
        // 当接受到数据之后join也立即返回.
        thread.join(10000)
        thread.interrupt();
        return response;
    }
    try {
        
        console.time("********&&& getOCR");  // 开始计时

        // console.time("tobase64");  // 开始计时
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");
        // console.timeEnd("tobase64");  // 输出执行时间

        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            "base64_str": imgData,
            "save": false,
            "path": "mir4/test"
        };
        
        // console.time("httppost");  // 开始计时
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = postJson(SERVER_URL+"/ocr/predict-by-base64", jsonData)
        // let response = http.postJson("http://192.168.1.94:8001/ocr/predict-by-base64", jsonData, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     timeout: 100000 // 设置超时时间为10秒
        // });

        // console.timeEnd("httppost");  // 输出执行时间

        if (response && response.statusCode == 200) {
            console.time("JSON.parse");  // 开始计时
            let result = JSON.parse(response.body.string());
            console.time("JSON.parse");  // 开始计时
            console.log("****************** OCR  time : ", result.time)
            return result.data;
            // return JSON.parse(response.body.string());
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    } finally {
        console.timeEnd("********&&& getOCR");  // 输出执行时间
    }
    
    return null;
}

// 查看控件
function npackageName() {
    // 查找屏幕上的所有控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历找到满足条件的控件
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        if (node.packageName() === "com.wemade.mir4global") {
            // console.log("找到匹配的控件，包名: " + node.packageName());
            // 可以在这里对控件进行其他操作
            // toast("找到匹配的控件，包名" + node.packageName())
            // break; // 如果只需要找到一个，找到后可以跳出循环
            node.recycle();  // 释放控件资源
            return true
        }
    }
    return false
}

function packageNameEndsWith(suffix) {
    // 查找所有的控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历控件列表
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        // 使用 endsWith 检查包名是否以指定的后缀结尾
        if (node.packageName().endsWith(suffix)) {
            return true;  // 找到匹配的控件，返回 true
        }
    }
    
    // nodes.recycle();  // 如果没有找到匹配的控件，释放资源
    nodes = null
    return false;  // 没有找到匹配的控件，返回 false
}

// 初始化
function init() {
    // 检查权限 无障碍
    if (!auto.service) {
        auto();
        throw new Error("请求无障碍权限失败");
    }
    if (!requestScreenCapture(true)) {
        // throw new Error("请求屏幕捕获权限失败");
        log_z("请求屏幕捕获权限失败")
        sleep(3000);
    }
    
    if (packageNameEndsWith("android.vending")) {
        console.log("在谷歌")
        return true
    }
    if (!packageNameEndsWith("mir4global")) {
        app.launch('com.wemade.mir4global')
        sleep(3000);
        return true
    }
    return false
}

//  释放资源
function imgRecycle(params) {
    if (params) {
        // 释放图片资源
        params.recycle();
        // 将参数设为null，帮助垃圾回收
        params = null;
    }
}

/**强行关闭游戏 控件本版
 * 
 * let currentPkg = currentPackage();  可以获取 com.wemade.mir4global  这个表示传奇4 
 * @param {string} str  APP包的名字   
 * @param {boolean} execute  是否启动
 */
function close_app(str,execute) {
    if (execute == null) {
        execute = false
    }
    // 打开详情  
    app.openAppSetting(str)
    let btn = text("强行停止").findOne(4000);
    if (btn) {
        btn.click();
        console.log("点击强行停止按钮成功");
    }
    let qd = text("确定").findOne(3000)
    if (qd) {
        qd.click();
        console.log("点击确定按钮成功");
    }
    // 再一次执行App
    if (execute) {
        app.launch(str)
    }
}

/** 在一定时间等待指定文字出现
 * 
 * @param {string} str 
 * @param {number} time 
 * @returns 
 */
function wait(str, time) {
    let startTime = Date.now();  // 获取当前时间（毫秒）
    while (Date.now() - startTime < time) {
        // 尝试找到指定的内容
        let img = captureScreen();
        let grayscaleImage = images.grayscale(img);
        imgRecycle(img)
        let reData = getOcr(grayscaleImage);
        imgRecycle(grayscaleImage)
        if (reData) {
            let top = select(reData,str)
            if (top) {
                return true
            }
        }
        sleep(3000);  // 等待 3000 毫秒再继续查找
    }
    // 超时返回
    return false
}

/** 生成随机英文名  名字要求6-12 
 * 
 * @returns string
 */
function getRandomName() {
    // 随机生成 2 到 5 之间的长度
    let length = random(2, 5);
    
    // 定义字符集，可以根据需要修改
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let name = "";

    // 循环生成随机字符组成名字
    for (let i = 0; i < length; i++) {
        var randomIndex = random(0, characters.length - 1);
        name += characters.charAt(randomIndex);
    }
    
    // 加上前缀
    let prefix = "igokay ";  
    let fullName = prefix + name;
    return fullName;
}

/** 通用裁剪函数
 * 
 * @param {*} img 
 * @param {Array} box 
 * @returns 
 */
function cropImage(img, box) {
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    return images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);
}

// 区域裁剪
function clip(img, box) {
    // 获取裁剪区域的坐标
    let x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    let x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    let y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    let y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    let croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    return croppedImage
}

/** 查找后执行点击操作并等待指定时间。
 *
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} text - 要查找的文本。
 * @param {number} waitTime - 点击后等待的时间，单位为毫秒。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function ClickSleep(reData, text, waitTime, exactMatch) {
    waitTime = (waitTime !== undefined) ? waitTime : 5000;
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (selclick(reData, text, exactMatch)) {
        log_z(`点击"${text}"，等待 ${waitTime / 1000} 秒`);
        sleep(waitTime);
        return true;
    }
    return false;
}

/** 查找内容并返回。
 *  
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} targetText - 要查找的文本。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function select(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        // console.log(item[1][0])
        if (exactMatch) {
            // console.log("进行精准查询 :",item[1][0])
            if (item[1][0] === targetText) {
                // console.log("找到目标文本:", item);
                return item;
            }
        }else{
            // console.log("   * 进行模糊查询 :",item[1][0])
            if (item[1][0].includes(targetText)) {
                // console.log("模糊查找目标文本:", item.text);
                return item;
            }
        }
    }
    return null;
}

/** 查找文本并点击
 * 
 * @param {Array} reData 
 * @param {string} src   要查找的字
 * @param {boolean} exactMatch  是否精准查询
 * @returns 
 */
function selclick(reData,src,exactMatch){
    var target = select(reData, src,exactMatch)
    if(target != null){
        // 计算文本区域的中心点
        let centerX = (target[0][0][0] + target[0][2][0]) / 2;
        let centerY = (target[0][0][1] + target[0][2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        // console.log(`selclick-点击${src}: x=${x_phone}, y=${y_phone}`);
        // console.log(`selclick-点击 ${src}: x=${centerX}, y=${centerY}`);

        // 点击坐标
        // code = httpclick(centerX,centerY);
        code = click(centerX,centerY);
        // console.log("code",code)
        // code = click(x_phone,y_phone);
        if (!code) {
            log_z(`selclick ${src} 点击失败`)
            return false
        }
        return true
    }
    return false
}

/** 点击偏移文本
 * 
 * @param {Array} target  数据
 * @param {number} x 偏移量
 * @param {number} y 偏移量
 */
function textClick(target,x,y){
    // 计算文本区域的中心点
    let centerX = (target[0][0][0] + target[0][2][0]) / 2;
    let centerY = (target[0][0][1] + target[0][2][1]) / 2;
    // 将坐标从截图转换到设备屏幕坐标
    // let x_phone = (centerX / 1285) * device.height;
    // let y_phone = (centerY / 720) * device.width;
    // console.log(`点击${target.text}: x=${x_phone}, y=${y_phone}`);
    log_z(` textClick 点击 : ${target.text} 偏移: x=${centerX}, y=${centerY}`);
    // 点击坐标
    // click(x_phone+x,y_phone+y);
    click(centerX+x,centerY+y);
}

/** 点击等待
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} delay 
 */
function clickWithDelay(x, y, delay) {
    delay = (delay !== undefined) ? delay : 500;
    click(x, y);
    sleep(delay);
}

/** 查找并点击
 * 
 * @param {*} reData 
 * @param {*} text 
 * @param {*} x 
 * @param {*} y 
 * @param {*} delay 
 * @returns 
 */
function checkAndClick(reData, text, x, y, delay) {
    delay = (delay !== undefined) ? delay : 500;
    if (select(reData, text)) {
        clickWithDelay(x, y, delay);
        return true;
    }
    return false;
}

//  获取等级
function getlv(lvData){
    if (!Array.isArray(lvData)) {
        return null;
    }
    for (let i = 0; i < lvData[0].length; i++) {
        let item = lvData[0][i];
        if (item[1][0].includes("级")) {
            let index = item[1][0].indexOf('级');
            let numberBeforeLevel = item[1][0].slice(0, index).trim();
            storage.put("lv", numberBeforeLevel);
            return numberBeforeLevel;
        }
    }
    return null ;
}

//  关闭通知
function closeNote(reData,src) {
    var target = select(reData, src)
    // console.log(target)
    if (target) {
        let centerY = (target[0][0][1] + target[0][2][1]) / 2;
        let y_phone = (centerY / 720) * device.width;
        // console.log(`点击${src}: x= 1166, y=${y_phone}`);
        let code = click(1166,y_phone);
        return code
    }
    return false
}

//  查找第二个指示字符
function selectTow(ocrResults, targetText) {
    let num = 0
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        if (item[1][0] === targetText) {
            num += 1;
            if (num == 2) {
                return item;
            }
        }
    }
    return null;
}

// 查找文本并点击
function clickTow(reData,src){
    var target = selectTow(reData, src)
    if(target != null){
        // 存在 点击
        // console.log("开始点击",src);

        // 计算文本区域的中心点
        let centerX = (target[0][0][0] + target[0][2][0]) / 2;
        let centerY = (target[0][0][1] + target[0][2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        log_z(` clickTow 点击坐标: x=${centerX}, y=${centerY}`);

        // 点击坐标
        click(centerX,centerY);

        return true
    }
    return false
}

// 处理弹窗函数
function wrong(reData) {
    if (selclick(reData,"Google登录")) {
        sleep(5000);
        return 
    }

     // 网络异常波动
     if (selclick(reData,"前往登录")) {
        sleep(2000);
        return
    }
    if (select(reData,"存在最新版本")||select(reData,"无法确认版本")) { 
        selclick(reData,"确定",true);
        selclick(reData,"确认",true);
        // SetCom("pm clear com.wemade.mir4global")
        // throw new Error("游戏更新");
        return true;
    }
    if (select(reData,"环境下载") || select(reData,"正在下载")) {
        selclick(reData,"确认",true);
        // sleep(5000);
        throw new Error("游戏更新中ing");
    }

    //  去认证界面
    if (select(reData,"资格的证明")) {
        selclick(reData,"登录游戏",true)
        sleep(2000);
        return 
    }
    // 临时维护
    if (select(reData,"Temporary")|| select(reData,"Maintenance")||select(reData,"更新维护公告")) {
        console.log("游戏临时维护");
        // 杀掉游戏
        close_app("com.wemade.mir4global")
        throw new Error("游戏临时维护")
    }
    if (selclick(reData,"前往登录")) {
        sleep(2000);
        return true
    }
    // 更新维护
    if (select(reData,"更新维护公告")) { 
        // SetCom("pm clear com.wemade.mir4global")
        close_app("com.wemade.mir4global")
        throw new Error("更新维护公告");
    }
    

    if (select(reData,"提示") && select(reData,"更新信息")) {
        selclick(reData,"游戏结束");
        return true
        
    }
    if (selclick(reData,"重新连接")) {
        return true
    }
    // 服务器连接断开 -> 前往登录
    if (select(reData, "服务器连接断开")) {
        return ClickSleep(reData, '前往登录');
    }
    if (select(reData,"服务器断开连接")) {
        return ClickSleep(reData,"确认")
    }
    // 网络问题 -> 重新尝试 
    if (select(reData, "网络套")) {
        close_app("com.wemade.mir4global")
        console.log("需要关闭游戏重新登录")
        return true;
    }
    // 重新尝试
    if (select(reData, "重新尝试")) {
        return ClickSleep(reData, '重新尝试');
    }
    // 据点复活
    if (selclick(reData, "据点复活")) {
        console.log("点击据点复活，等待5秒");
        sleep(5000);
        return true;
    }
    // 说明 -> 确认 或 结束
    if (select(reData, "说明")) {
        if (ClickSleep(reData, '确认') || ClickSleep(reData, '结束', 2000) || ClickSleep(reData, '确定')) {
            return true;
        }
    }
    // 警告 -> 确认
    if (select(reData, "警告")) {
        return ClickSleep(reData, '确认');
    }
    // 错误 -> 确认 或 游戏结束
    if (select(reData, "错误")) {
        if (ClickSleep(reData, '确认', 5000, true) || ClickSleep(reData, '游戏结束', 5000, true) || ClickSleep(reData, '确定', 5000, true)) {
            return true;
        }
    }
    // 关闭广告 -> 今日不
    let reai = select(reData, '今日不')
    if (reai) {
        selclick(reData, '今日不')
        // console.log("点击关闭广告")
        textClick(reai,920,0)
        sleep(2000);
        return true
    }
    // Loading 界面
    if (select(reData, "Loading")) {
        sleep(5000);
        return true;
    }
    // Loading 界面
    if (select(reData, "购买",true)) {
        click(1219,93);
        return true;
    }

    if (select(reData,"关闭节电模式")){
        swipe(468, 491, 1000, 0, 500);
        sleep(5000);
        return true
    }
    if (select(reData,"节电模式中")){
        click(644, 614);
        sleep(5000);
        return true
    }
    return false;
}

//  升级
function upLevel(){
    let img = captureScreen();      // 截图
    if (!img) {
        log_z("截图失败");
        return ;
    }
    let grayscaleImage = images.grayscale(img);      // 二级化

    // 获取OCR
    let reData = getOcr(grayscaleImage);
    imgRecycle(img)
    if (reData) {
        log_z("处理异常弹窗")
        // select(reData,"开始更新")
        selclick(reData,"开始游戏",true)
        if (wrong(reData)) {return } //  处理异常弹窗
    } 
}

// 主函数
function main(){
    let start = desc("开始游戏").findOne(1000)
    if (start) {
        console.log("更新完成")
        let bounds = start.bounds();
        // 计算控件的中心坐标
        let centerX = bounds.centerX();
        let centerY = bounds.centerY();
        console.log("点击坐标: ", centerX, centerY);  // 打印计算出来的坐标
        gesture(200, [[centerX, centerY]]);
        start=null;
    }

    let GX = desc("更新").findOne(3000)  
    if (GX) {
        console.log("找到了")
        let bounds = GX.bounds();
        // 计算控件的中心坐标
        let centerX = bounds.centerX();
        let centerY = bounds.centerY();
        console.log("点击坐标: ", centerX, centerY);  // 打印计算出来的坐标
        gesture(200, [[centerX, centerY]]);
    }
    
    if (desc("卸载").findOne(1000)) {
        console.log("在更新游戏了")
        return
    }
    GX=null;

    // 初始化
    if (!init()) {
        // console.log(" 进入 ")
        upLevel()
    }
}

// for (let i = 0; i < 10; i++) {
    // console.log("$$$$$$$$$$$$$$  执行开始!")
    main()
    // console.log("##############  执行完成")
    // sleep(1000);
// }


if (false) {
    // console.log("开始请求截图")
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }
    let img = captureScreen();
    // let grayscaleImage = images.grayscale(img);

    // console.log("开始请求")
    // let reData = getOcr(grayscaleImage);
    // let reData = getOcr(img);

    // let hp =  images.pixel(img, 522,41);   // -13553096
    // console.log(hp)
    console.log()
    console.log()
 
}
