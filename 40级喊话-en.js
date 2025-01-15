
var text = "★Buy gold coins at igokay.com. ★买金币就到 igokay.com" ;
// let text = "全球最低金币, BW服务器已经上架。欢迎来到 igokay.com  。 The lowest gold price globally, the BW server On the shelves. Welcome to igokay.com." ;
var interval = 1*1000*60 ;    // 12分钟 720000毫秒  *60000
let Log = false
let today = new Date().toISOString().split('T')[0];  
var storage = storages.create("ABC");

// 原始别名
let Bm = storage.get("Bm",0);
if ( Bm == 0) {
    Bm = readLastLine().trim()
    storage.put("Bm", Bm);
    // console.log("storage.",storage.get(Bm))
}
// console.log("Bm",Bm)

if (storage.get("e_time",0) == 0){
    storage.put("e_time",today)
}

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
// console.log("Servers[Bm]-",Servers[Bm])
let SERVER_URL = Servers[Bm].OCRip + ":" + Servers[Bm].port

function log_z(message) {
    if (Log) {
        console.log("  * ",message);
    }
}

// 读取文件并返回最后一行
function readLastLine() {
    let filePath = "/storage/emulated/0/Documents/config.txt";
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

//  生成未来时间 
function addRandomMinutes(min, max) {
    let now = new Date();  // 获取当前时间
    let randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min; // 生成 min 到 max 之间的随机分钟数
    now.setMinutes(now.getMinutes() + randomMinutes); // 当前时间加上随机分钟数，自动处理进位
    return now;
}

//  对比时间
function compareTime() {
    let now = new Date();  // 获取当前时间
    let futureTime = new Date(storage.get("e_time"))
    // 比较时间戳
    if (futureTime > now) {
        log_z('未来时间大于当前时间');
        return true
    } else {
        log_z('未来时间小于当前时间');
        return false 
    }
}

/** 关闭所有运行的任务
 *  打开最近任务界面
 *  点击清理按钮
 */
function Recent() {
    // if (compareTime()) {
    //     sleep(15*1000*60)  // 等待15分钟
    //     return true
    // }
    var battery = device.getBattery()
    if (battery < 2.0) {
        console.log("电量不足 : ", battery)
        clearAll();
        // 直接卡在这里等1个小时
        sleep(1000*60*30);
        sleep(1000*60*30);
        return true;
    }
    return false;
}

/**
 * 打开最近任务清理所有
 */
function clearAll(){
    recents()    // 打开最近任务
    sleep(2000);
    let targetControl = id("net.oneplus.launcher:id/snapshot").findOne(5000);  // 是否打开了最近活动任务
    if (targetControl) {
        log_z("打开了最近活动任务")
        gesture(100, [[359, 1073]]);   // 最近任务的关闭位置
    }
}

// OCR请求
function getOcr(img) {
    try {
        
        // console.time("********&&& getOCR");  // 开始计时

        // console.time("tobase64");  // 开始计时
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");
        // console.timeEnd("tobase64");  // 输出执行时间

        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            "base64_str": imgData,
        };
        
        // console.time("httppost");  // 开始计时
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson(SERVER_URL+"/ocr/predict-by-base64", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 20000 // 设置超时时间为10秒
        });
        // console.timeEnd("httppost");  // 输出执行时间

        if (response.statusCode == 200) {
            // console.time("JSON.parse");  // 开始计时
            let result = JSON.parse(response.body.string());
            // console.time("JSON.parse");  // 开始计时
            // log_z("****************** OCR  time : ", result.time)
            // console.log(result.data)
            return result.data;
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
        sleep(10* 1000)  // 10秒
    } finally {
        // console.timeEnd("********&&& getOCR");  // 输出执行时间
    }
    
    return null;
}

// OCR请求
function getOcr2(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        let jsonData = {
            image: imgData,
            lang: "ch",
            save: true
        };
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson("http://192.168.1.142:5000/ocr", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string());
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    }
    return null;
}

/** 截图函数
 * 
 * @param {boolean} grayscale 是否进行二级化处理  去除色彩
 * @returns 
 */
function getimg(grayscale) {
    let img ;
    try {
        img = captureScreen();
        if (img == null) {
            return null
        }
        // 是否二级化 
        if (grayscale) {
            let grayscaleImage = images.grayscale(img);
            imgRecycle(img) // 清理资源
            return grayscaleImage
        }
        return img
    } catch (error) {
        console.error("截图失败 ",error)
    }
    return null
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
    log_z("检查权限 无障碍")
    if (!auto.service) {
        // log_z("请求无障碍权限失败")
        console.log("请求无障碍权限失败")
        auto();
        throw new Error("请求无障碍权限失败");
    }
    log_z("检查权限 无障碍 完成")
    // 锁屏了就打开
    // if (!device.isScreenOn()) {
    //     device.wakeUpIfNeeded() // 唤醒
    //     swipe(232, 1000, 232, 200, 800);  // 打开
    // }

    // log_z("请求屏幕捕获权限")
    // if (!requestScreenCapture(true)) {
    //     // throw new Error("请求屏幕捕获权限失败");
    //     log_z("请求屏幕捕获权限失败")
    //     sleep(5000);
    //     return false
    // }
    // log_z("请求屏幕捕获权限 完成")
    
    try {
        let ts = textContains("选择账号").findOne(3000)
        if (ts) {
            log_z("谷歌登录-选择账号")
            click(600,314);
            return
        }
    } catch (error) {
        console.error("选择账号  Error during database operation:", error);
        return false
    }

    //  检查电量
    if (Recent()) {
        return false
    }
    if (!packageNameEndsWith("mir4global")) {
        app.launch('com.wemade.mir4global')
        log_z("启动游戏")
        sleep(3000);
        return false
    } 
    return true
}

//  释放资源
function imgRecycle(params) {
    if(params == null) {
        return;
    }
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

    try {
        // 打开详情  
        app.openAppSetting(str)
        let btn = text("强行停止").findOne(4000);
        if (btn) {
            btn.click();
            log_z("点击强行停止按钮成功");
        }
        let qd = text("确定").findOne(3000)
        if (qd) {
            qd.click();
            log_z("点击确定按钮成功");
        }
        // 再一次执行App
        if (execute) {
            app.launch(str)
        }
    } catch (e) {
        console.error("操作失败: ", e);
        sleep(10* 1000)  // 10秒
    }  
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
    waitTime = (waitTime !== undefined) ? waitTime : 10000;
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (selclick(reData, text, exactMatch)) {
        // log_z(`点击"${text}"，等待 ${waitTime / 1000} 秒`);
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
        // log_z(item[1][0])
        // console.log(item[1][0])
        if (exactMatch) {
            if (item[1][0] === targetText) {
                return item;
            }
        }else{
            if (item[1][0].includes(targetText)) {
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

        // console.log(`点击 ${src} x = ${centerX}  y = ${centerY}`)
        code = click(centerX,centerY);  // 点击坐标
        if (!code) {
            // log_z(`selclick ${src} 点击失败`)
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
        console.log("checkAndClick  text: ",text)
        clickWithDelay(x, y, delay);
        return true;
    }
    return false;
}

// 关闭窗口
function closeX(reData){
    if (checkAndClick(reData, '排位奖励', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '好友请求', 48,33,1000)) return true;  // 被屏蔽了

    if (select(reData, "是否结束游戏") || select(reData, '龙再炼')||select(reData, '只攻击玩家')) {
        back()
        return true
    }
    if (checkAndClick(reData, '已付款的商品将发放至商店保管箱', 1130, 66, 2000)) return true;
    if (checkAndClick(reData, '伪像切换', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '大地图', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '奇缘', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '闭关修炼', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '画面位置', 1230, 88, 2000)) return true;
    if (select(reData, '可佩戴')) {
        clickWithDelay(948,200,1000);// 选中
        clickWithDelay(1150,675,2000); // 购买
        clickWithDelay(1150,675,1000); // 乘骑设置
        clickWithDelay(1230,29,1000);
        return true
    }

    if (checkAndClick(reData, '龙神器', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '远征队', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '接受委托', 795, 149, 2000)) return true;
    if (checkAndClick(reData, '切换频道', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '一键删除', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '合成魔', 1241, 29, 2000)) return true;
    
    // 利用活力
    if (checkAndClick(reData, '利用活力', 223, 560, 1200)) return true;
    if (checkAndClick(reData, '战斗设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '快捷栏设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '特殊强化', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '精灵合成', 1241, 29, 2000)) return true;

    // 活力补充
    if (checkAndClick(reData, '活力补充', 950, 164, 2000)) return true;
    if (checkAndClick(reData, '指南', 1226, 38, 2000)) return true;

    if (select(reData,"输入数字") &&  selclick(reData,"取消") ) {
        sleep(2000);
        return true
    }
    if (checkAndClick(reData, '自动装备', 732,538, 2000)) return true;
    
    if (select(reData,"选择购买数量") && selclick(reData,"取消")) {
        sleep(1000);
    }

    let long = select(reData,"中型生命")
    if (long) {
        if (long[0][0][0] > 700) {
            click(1219,94); //  X
            sleep(2000);
            return true
        }
    }

    if (!select(reData,"前往狭窄的通道") && select(reData,"请拖拽虚拟摇杆进行移动") ) {
        swipe(232, 455, 232, 200, 4000);
        return true
    }
    return false
}


// 处理弹窗函数
function wrong(reData) {

    if (select(reData, '补丁出错')) {
        console.log("补丁出错: clearAll")
        clearAll();
        sleep(10000);
        return true
    }
    if (select(reData, '补丁失败') || select(reData, '无法连接服务器')) {
        console.log("补丁失败: clearAll")
        clearAll()
        sleep(10000);
        return true
    }
    if (select(reData, '网络状态不佳') || select(reData, '服务器无响应')) {
        console.log("网络状态不佳: clearAll")
        clearAll()
        sleep(10000);
        return true
    }
    if (select(reData, "错误",true)) {
        if (ClickSleep(reData, '确认', 10000, true) || ClickSleep(reData, '游戏结束', 10000, true) || ClickSleep(reData, '确定', 10000, true)) {
            return true;
        }
    }
    if (select(reData, '再添加一个')) {
        log_z("谷歌登录");
        click(600,314);
        sleep(10000);
        return true;
    }

    if (selclick(reData, '游戏结束',true)) {
        log_z("点击界面进入游戏");
        sleep(10000);
        return true;
    }
    if (select(reData,"正在下载")) {
        throw new Error(" 正在下载")
    }
    if (selclick(reData, '开始游戏',true)) {
        log_z("点击界面进入游戏");
        sleep(15000);
        return true;
    }
    if (select(reData,"环境下载")) {
        selclick(reData, '确认',true)
        sleep(25000);
        return true;
    }

    if (select(reData,"网络状态不佳")) {
        selclick(reData,"前往登录",true)
        sleep(10000);
        return true
    }
    //  游戏需要更新
    if (select(reData,"重启游戏") || select(reData,"开始更新")) {
        selclick(reData,"确认")
        sleep(10000);  // 等待更新游戏
        return true
    }

    // 重新尝试
    if (select(reData, "重新尝试")) {
        return ClickSleep(reData, '重新尝试');
    }
    if (selclick(reData,"Google登录")) {
        sleep(10000);
        return true;
    }
    if (selclick(reData,"重新连接",true)) {
        sleep(10000);
        return true
    }
    // 服务器连接断开 -> 前往登录
    if (select(reData, "服务器连接断开")) {
        return ClickSleep(reData, '前往登录');
    }
    // 网络异常波动   -- 提示
    if (selclick(reData,"前往登录")) {
        sleep(10000);
        return
    }
    
    if (selclick(reData,"确定",true)|| selclick(reData,"确认",true)) {
        sleep(10000);
        return true
    }
    if (select(reData,"存在最新版本")||select(reData,"无法确认版本")) { 
        selclick(reData,"确定",true);
        // SetCom("pm clear com.wemade.mir4global")
        // throw new Error("游戏更新");
        sleep(10000);
        return true;
    }

    //  去认证界面
    if (select(reData,"资格的证明")) {
        selclick(reData,"登录游戏",true)
        sleep(10000);
        return 
    }
    // 临时维护
    if (select(reData,"Temporary")|| select(reData,"Maintenance")||select(reData,"更新维护公告")) {
        // log_z("游戏临时维护");
        // 杀掉游戏
        close_app("com.wemade.mir4global")
        throw new Error("游戏临时维护")
    }
    // 更新维护
    if (select(reData,"更新维护公告")) { 
        // SetCom("pm clear com.wemade.mir4global")
        close_app("com.wemade.mir4global")
        throw new Error("更新维护公告");
    }
    

    if (select(reData,"提示") && select(reData,"更新信息")) {
        selclick(reData,"游戏结束");
        sleep(10000);
        return true
        
    }
    if (selclick(reData,"重新连接")) {
        sleep(10000);
        return true
    }

    if (select(reData,"服务器断开连接")) {
        return ClickSleep(reData,"确认")
    }
    // 网络问题 -> 重新尝试 
    if (select(reData, "网络套")) {
        close_app("com.wemade.mir4global")
        sleep(10000);
        // log_z("需要关闭游戏重新登录")
        return true;
    }

    // 据点复活
    if (selclick(reData, "据点复活")) {
        // log_z("点击据点复活，等待5秒");
        sleep(10000);
        return true;
    }
    // 说明 -> 确认 或 结束
    if (select(reData, "说明")) {
        if (ClickSleep(reData, '确认') || ClickSleep(reData, '结束') || ClickSleep(reData, '确定')) {
            return true;
        }
    }
    // 警告 -> 确认
    if (select(reData, "警告")) {
        return ClickSleep(reData, '确认');
    }

    // 关闭广告 -> 今日不
    let reai = select(reData, '今日不')
    if (reai) {
        selclick(reData, '今日不')
        textClick(reai,920,0)
        sleep(10000);
        return true
    }
    // Loading 界面
    if (select(reData, "Loading")) {
        sleep(10000);
        return true;
    }
    // Loading 界面
    // if (select(reData, "购买",true)) {
    //     click(1219,93);
    //     return true;
    // }

    if (select(reData,"关闭节电模式")){
        swipe(468, 491, 1000, 0, 500);
        sleep(10000);
        return true
    }
    if (select(reData,"节电模式中")){
        click(644, 614);
        sleep(10000);
        return true
    }
    return false;
}


//  喊话   喊话内容 test  喊话间隔 interval
function Shout(reData) {
    //  输入法是打开的情况
    try {
        let ts = className("android.widget.EditText").findOne(1000)
        if (ts) {
            log_z("输入法打开了")
            // 输入文字
            // ts.setText(text)
            sleep(1000);
            input(text);  // autox 的方法
            sleep(500);
            // 点击发送
            click(1187,683)
            sleep(1000);
            // click(952,656)  //攻击键 
            // sleep(1000);
            click(114.5 , 116.5) //  点击全部按钮
            sleep(1000);
            click(243.5,670)  // 再点击 请输入对话
            sleep(interval);
            return true
        }
    } catch (error) {
        console.error("Error during database operation:", error);
    }

    // 打开输入法
    if (selclick(reData,"请输入内容")) {
        sleep(1500);
        return true
    }
    
    // 点击全部
    if (selclick(reData,"全部")) {
        sleep(3000);
        return true
    }

    // 打开对话框
    if (select(reData,"卡组变更")) {
        clickWithDelay(53,497,3000);
        return true
    }
}

//  升级
function upLevel(){
    log_z("初始化完成")
    try {
        let ts = className("android.widget.EditText").findOne(1000)
        if (ts) {
            log_z("输入法打开了")
            // 输入文字
            // ts.setText(text)
            sleep(1000);
            input(text);
            sleep(500);
            // 点击发送
            click(1187,683)
            sleep(1000);
            // click(952,656)  //攻击键 
            // sleep(1000);
            click(114.5 , 116.5) //  点击全部按钮
            sleep(1000);
            click(243.5,670)  // 再点击 请输入对话
            sleep(interval);
            return
        }
    } catch (error) {
        console.error("upLevel  Error during database operation:", error);
        return 
    }
   
    let img = getimg(false)
    if (img == null) {
        sleep(20000);
        console.log("没有截图权限 ")
        if (!requestScreenCapture(true)) {
            console.log("请求屏幕捕获权限失败")
            sleep(5000);
            return false
        }
        console.log("执行结束 ")
        return false
    }

    // let s_hp = images.pixel(img, 534, 657);   // 判断省电模式下的血
    // let s_mp = images.pixel(img, 666, 657);   // 判断省电模式下的蓝

    // let SD = images.pixel(img, 602, 588);   // 判断省电模式是否在打怪
    // if (SD == -4376777 && s_hp !=  -10347235 && s_mp != -10347235) {
    //     // device.setBrightness(1) // 设置点亮为100
    //     log_z("在省电模式下升级中 - 休眠 10分钟")
    //     sleep(10 * 1000 * 60)  // 休息10分钟
    //     return 
    // }

    let grayscaleImage = images.grayscale(img);      // 二级化

    let clors =  images.pixel(img, 522,41);   // 判断是否在打怪  
    if (clors == -13553096 || clors == -13487302) {
        throw new Error("当前账号在练等级")
    }

    // 获取OCR
    let reData = getOcr(grayscaleImage);
    imgRecycle(img)
    if (reData) {
        log_z("处理异常弹窗")
        if (wrong(reData)) {return } //  处理异常弹窗

        log_z("处理异常弹窗结束")

        // 进入游戏界面以前
        if(select(reData, 'REA') ){
            // 进入游戏
            if (selclick(reData, '点击')) {
                console.log("点击界面进入游戏");
                sleep(5000);
                return
            }
            if (select(reData, '退出登录') ) {
                if (!select(reData, '选项')) {
                    // home()  // 返回
                    app.launch('com.wemade.mir4global');
                    sleep(5000);
                }
            }
            if (selclick(reData, '加载补丁中')) {   // 加载补丁中
                log_z("加载补丁中 等待5秒")
                sleep(5000);
                return
            }
            if(select(reData, '资格的证明')){
                // 进入游戏
                if (selclick(reData, '登录游戏',true)) {
                    log_z(" 资格的证明 - 登录游戏");
                    sleep(5000);
                }
            }
            return
        }else{
            //  选择角色界面
            if(select(reData, '选择角色')){
                // 开始游戏
                if (selclick(reData, '开始游戏')) {
                    return sleep(5000);
                }
            }
        }

        log_z("开始喊话")

        Shout(reData);

        log_z("关闭所有的弹窗")
        if (closeX(reData)) {return } // 关闭所有的弹窗
    }
}

// 主函数
function main(){
    // 初始化
    if (init()) {
        upLevel()
    }
}


// for (let i = 0; i < 3; i++) {
    // log_z("main 执行")
    // log_z("$$$$$$$$$$$$$$  执行开始!")
    main()
    // log_z("##############  执行完成")
    // log_z("main 结束")
// }



// 查找内容  支持模糊查询  默认 模糊查找内容
function select3(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error("OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        console.log("item.text ",item.text)
        if (item && item.text !== undefined) {
            if (exactMatch) {
                if (item.text === targetText) {
                    console.log("找到目标文本:", item);
                    return item;
                }
            }else{
                if (item.text.includes(targetText)) {
                    console.log("模糊查找目标文本:", item.text);
                    return item;
                }
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }
    }
    return null;
}


// if (!requestScreenCapture(true)) {
//     // throw new Error("请求屏幕捕获权限失败");
// }

// let img = getimg(false)
// let grayscaleImage = images.grayscale(img);      // 二级化
// let croppedImage = images.clip(img, 79, 19, 76, 26);
// let croppedImage = images.clip(grayscaleImage, 478, 623, 322, 30);
// let reData = getOcr2(croppedImage)
// let reData = getOcr(grayscaleImage)
// wrong(reData)
// select(reData, "aaaaaa")
// select3(reData,"1544777")


// storage.put("e_time",today)