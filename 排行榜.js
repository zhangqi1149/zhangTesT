/** 排行榜喊话
 *  使用小图进行识别
 *  名字不可靠识别会混乱  等级有重复的   使用战斗力 重复出现的少   
 *  选择比自己战斗力少的  到100就换个职业 这样可以一直跑下去
 *  记录滑动的次数  
 *  多动作联合执行减少识别次数   
*/


/** 
 *  首先获取到机器码
 *  用机器码去拿对应的OCR服务器
 *  检查游戏是否启动
 *  检查是否可以喊话
 *  选择排行榜的人进行密语
 */
let Log = false   // 是否显示打印内容
let storage = storages.create("ABC");
let text = "全球最低金币 PlayPal担保交易。欢迎来到 igokay.com  。 The lowest price gold transactions in the world. Use PlayPal guaranteed payment. Welcome to igokay.com." ;
// let today = new Date().toISOString().split('T')[0];         // 获取今日日期，格式为 YYYY-MM-DD
let today = "YYYY-MM-DD";         // 一直是一个
let careers = ["道士","弩手","武士","黑道士","战士","法师"];  // 职业顺序

// 原始别名
let Bm = storage.get("Bm",0);
if ( Bm == 0) {
    Bm = readLastLine().trim()
    storage.put("Bm", Bm);
}

let Servers = {
    "73940854": {
		"Id": "2",
		"Server": "ASIA073",
		"OCRip":"http://192.168.1.139",
		"port" : "8002"
	},
    "5e19856c-7435-4426-813d-4c0b3899399b": {
		"Id": "000",
		"Server": "SA011",
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
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"237e1f42-4bdb-4a03-a6f1-923332f33b45": {
		"Id": "128",
		"Server": "BASIA002",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"b645032e-ef99-4a28-a0dc-a633eec7867d": {
		"Id": "127",
		"Server": "BNA011",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"bd9ddb80-8e31-4bf2-8aaa-5df15efc07ae": {
		"Id": "126",
		"Server": "BEU031",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"4f2cd5fa-47f3-4d9c-847c-1879ce2d8c75": {
		"Id": "125",
		"Server": "BSA021",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
	"22c22383-d02a-4c81-808f-f9a7c2cc831d": {
		"Id": "124",
		"Server": "BINMENA041",
		"OCRip":"http://192.168.1.139",
		"port":"8001",
	},
    
    "b402fcdb": {
        "Id": "123",
        "Server": "ASIA011",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "1ef862e0": {
        "Id": "122",
        "Server": "ASIA012",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "96a294d0": {
        "Id": "121",
        "Server": "ASIA013",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "f54f8429-8fc9-45be-be3d-db3d0bf99475": {
        "Id": "120",
        "Server": "ASIA014",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "71d8a433-4789-4dd5-a6da-2604c958615e": {
        "Id": "119",
        "Server": "ASIA021",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "e5f1b8f8-0b74-4ff6-ab03-13e58a19bdec": {
        "Id": "118",
        "Server": "ASIA022",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "b491a690-521c-4a2e-8a7e-21e979085e67": {
        "Id": "117",
        "Server": "ASIA023",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "edcef95f-c98a-4107-a76b-715908e0e659": {
        "Id": "116",
        "Server": "ASIA024",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "12fdc099-8351-4a20-a046-a74b8adcfa83": {
        "Id": "115",
        "Server": "ASIA031",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "4cd13a96-4b51-4862-b503-5881f339242a": {
        "Id": "114",
        "Server": "ASIA032",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "0c86be59-cbea-4fa0-816c-7c5f16bcbe9f": {
        "Id": "113",
        "Server": "ASIA033",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "408830f3-7f73-44d1-b33c-c79d18fc4de4": {
        "Id": "112",
        "Server": "ASIA041",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "40e83d09-d549-443d-bfc4-d004bd693d19": {
        "Id": "111",
        "Server": "ASIA042",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },    

    "50e7f21d-2508-4cab-97e9-8a676e0986ea": {
        "Id": "110",
        "Server": "ASIA043",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "047a7c32-de99-4bd9-8503-a11050de37b5": {
        "Id": "109",
        "Server": "ASIA051",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "da727009-8386-4aa3-b7ad-b12e069f7eba": {
        "Id": "108",
        "Server": "ASIA052",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "b546783d-1a82-4465-938b-07fe5fa1cda7": {
        "Id": "107",
        "Server": "ASIA053",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "d6e6a347-c8e7-462d-90be-de1e35da5848": {
        "Id": "106",
        "Server": "ASIA054",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "63f061a5-bd02-4ee5-b4a7-f360068c69a3": {
        "Id": "105",
        "Server": "ASIA061",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "3207acb8-545c-460b-8237-30c9aaef161a": {
        "Id": "104",
        "Server": "ASIA062",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "7fd8c4be-69c4-48a9-b3fd-aaa7598f479e": {
        "Id": "103",
        "Server": "ASIA063",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "36408acc-ca39-4b57-bfec-8fc4b1d1bac3": {
        "Id": "102",
        "Server": "ASIA064",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "0f8f4a18-d173-4045-a0f1-f991d681700c": {
        "Id": "101",
        "Server": "ASIA071",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "a4a38793-f81f-4fe6-95cd-e12343fa5768": {
        "Id": "100",
        "Server": "ASIA072",
        // "OCRip":"http://192.168.1.140",  // todo
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "b3d90a30-0513-4ff8-ab72-4cc5154e91a4": {
        "Id": "99",
        "Server": "ASIA073",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "1dbb01ca-cdf4-42c1-8935-0e9cc8ca556e": {
        "Id": "98",
        "Server": "ASIA081",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },    
    "45ab4f25-81f8-4bcc-9043-acc85dc47e62": {
        "Id": "97",
        "Server": "ASIA082",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "970c32eb-b623-4764-8743-b5685e308fb5": {
        "Id": "96",
        "Server": "ASIA083",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "f92f2125-71fa-4a0e-b2a6-9a02531ce067": {
        "Id": "95",
        "Server": "ASIA343",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "47ffe00d-52cb-4150-bdb1-49d50b3c1a4f": {
        "Id": "94",
        "Server": "ASIA342",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "843e61dd-3243-4196-ad84-347d1d33ceb6": {
        "Id": "93",
        "Server": "ASIA341",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "4d1a81a4-5e7e-4d41-b65f-5bedf13dc23e": {
        "Id": "92",
        "Server": "ASIA333",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "5d75350e-975e-43e6-b8ab-7ff58df796ad": {
        "Id": "91",
        "Server": "ASIA332",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "beb9afa5-1898-499e-93a7-706034a5c0df": {
        "Id": "90",
        "Server": "ASIA331",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
	"2e01cc5f-a829-4a35-87fc-8ce7f0ae5a39": {
        "Id": "89",
        "Server": "ASIA324",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
	"355f4465-1f65-469c-bf6c-81f629bc5b2d": {
        "Id": "88",
        "Server": "ASIA323",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "187eb6fb-520b-4cf0-b469-0c34d21b3711": {
        "Id": "87",
        "Server": "ASIA322",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "502ea617-95c7-4345-9c9b-07de90939c3c": {
        "Id": "86",
        "Server": "ASIA321",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "5cf80fc6-b4b2-4034-990a-42900fba3630": {
        "Id": "85",
        "Server": "ASIA314",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "ded8b096-6ff9-4436-9a15-d960e05e683e": {
        "Id": "84",
        "Server": "ASIA313",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "6c3f773c-c662-433b-97d3-7cb0c2d27fbe": {
        "Id": "83",
        "Server": "ASIA312",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "d3bfaea1-e0eb-4169-92e3-b4165a43bc30": {
        "Id": "82",
        "Server": "ASIA311",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "bd36bbe9-383e-4f09-824f-e60a313746eb": {
        "Id": "81",
        "Server": "ASIA353",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "6e4c7f85-e171-414c-bbd2-f7333b48d605": {
        "Id": "80",
        "Server": "ASIA351",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "b9c5acfc-e77c-4d29-a0e7-8e347de0b1c3": {
        "Id": "79",
        "Server": "ASIA353",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "3172dc49-bc00-42d9-b97a-3f8f5796ccc4": {
        "Id": "78",
        "Server": "ASIA354",
        "OCRip":"http://192.168.1.140",
		"port":"8001",
    },
    "73b351fe-9789-4a7d-b27f-ec431b16677b": {
        "Id": "77",
        "Server": "ASIA361",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "b0d0cbd3-be11-4a50-8b5b-4a50e0efcb55": {
        "Id": "76",
        "Server": "ASIA362",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "7df85b12-105d-438c-a2e7-f487b1ded057": {
        "Id": "75",
        "Server": "ASIA363",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "18055116-dd62-4365-9917-501ec0bf8bd5": {
        "Id": "74",
        "Server": "ASIA364",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "1a8c31f1-2aac-42cf-a5d9-dae264ff31b7": {
        "Id": "73",
        "Server": "ASIA371",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "d02b7531-161c-4fc1-ab6d-bd64783fd6e8": {
        "Id": "72",
        "Server": "ASIA372",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
    "2b808dbf-8156-4f42-a458-56313648a57a": {
        "Id": "71",
        "Server": "ASIA373",
        "OCRip":"http://192.168.1.140",
		"port":"8002",
    },
}

let SERVER_URL = Servers[Bm].OCRip + ":" + Servers[Bm].port  // 拿到服务器地址

manage_value()
//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);                 // 当前职业 : e_career  喊了话的战斗力 : e_war  当前职业喊的数量 : e_count  停止时间 : e_time
        storage.put(today,{e_career:'道士', e_war:0, e_count:0 ,e_time:0})  // 职业  战力值  喊话的数量  休息时间
        storage.put("keysList", keys);  // 更新键列表
    }
    
    // 遍历之前保存的所有键，并删除不符合条件的键
    keys.forEach(function(key) {
        // console.log("Removing key:", key);
        if (key !== today) {
            storage.remove(key);  // 删除不是今天的数据
        }
    });
}

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

//  查找 后缀控件
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
    return false;
}

// 初始化
function init() {
    // 检查权限 无障碍
    if (!auto.service) {
        throw new Error("请求无障碍权限失败");
    }
    if (!requestScreenCapture(true)) {
        // throw new Error("请求屏幕捕获权限失败");
        log_z("请求屏幕捕获权限失败")
        sleep(5000);
    }
    if (!packageNameEndsWith("mir4global")) {
        app.launch('com.wemade.mir4global')
        log_z("启动游戏")
        sleep(3000);
        return true
    } 
    return false
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
            return grayscaleImage
        }
        return img
    } catch (error) {
        console.error("截图失败 ",error)
    }
    return null
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
    // log_z(`ocrResults[0].length : ${ocrResults[0].length}`)
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        // log_z(item[1][0])
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

//  识别3次
function text3(str) {
    for (let i = 0; i < 3 ; i++) {
        // 截取图片
        let img = captureScreen(); 
        let grayscaleImage = images.grayscale(img);
        // 找对应的内容
        let reData4 = getOcr(grayscaleImage);
        if (reData4) {
            // 开始查找内容
            if (select(reData4,str)) {
                return true
            }
        }
    }
    return false
}

// 查找后面的文本
function getNextText(ocrResult,targetText) {
    if (!Array.isArray(ocrResult)) {
        console.error(`getNextText 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResult[0].length; i++) {
        // console.log("ocrResult[0][i][1][0] :", ocrResult[0][i][1][0])
      if (ocrResult[0][i][1][0].trim().replace(/[.,]/g, '') === targetText.replace(/[.,]/g, '') || ocrResult[0][i][1][0].trim().replace(/[.,]/g, '') < targetText.replace(/[.,]/g, '') ) {
        // 如果目标文本不是最后一个，返回下一个文本
        if (i + 1 < ocrResult[0].length) {
            // console.log("parseInt(ocrResult[0][i][1][0].trim().replace(/[.,]/g, ''))",parseInt(ocrResult[0][i][1][0].trim().replace(/[.,]/g, '')) )
            // console.log("parseInt(targetText.replace(/[.,]/g, ''))",parseInt(targetText.replace(/[.,]/g, '')))
            if (parseInt(ocrResult[0][i + 1][1][0].trim().replace(/[.,]/g, '')) < parseInt(targetText.replace(/[.,]/g, ''))){
                // console.log("找到了 : ",ocrResult[0][i + 1][1][0])
                return ocrResult[0][i + 1][1][0];
            }
        } else {
          return null; // 如果目标文本是最后一个，返回 null
        }
      }
    }
    return null; // 如果没有找到目标文本，返回 null
}
// 关闭窗口
function closeX(reData){
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
    // if (checkAndClick(reData, '指南', 1226, 38, 2000)) return true;

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
    if (selclick(reData, '游戏结束',true)) {
        log_z("点击界面进入游戏");
        return sleep(5000);
    }
    if (select(reData,"正在下载")) {
        throw new Error(" 正在下载")
    }
    if (selclick(reData, '开始游戏',true)) {
        log_z("点击界面进入游戏");
        return sleep(15000);
    }
    if (select(reData,"环境下载")) {
        selclick(reData, '确认',true)
        return sleep(25000);
    }

    if (select(reData,"网络状态不佳")) {
        selclick(reData,"前往登录",true)
        return true
    }
    //  游戏需要更新
    if (select(reData,"重启游戏") || select(reData,"开始更新")) {
        selclick(reData,"确认")
        sleep(8000);  // 等待更新游戏
        return true
    }

    if (selclick(reData,"Google登录")) {
        sleep(5000);
        return 
    }
    if (selclick(reData,"重新连接",true)) {
        return true
    }
    // 服务器连接断开 -> 前往登录
    if (select(reData, "服务器连接断开")) {
        return ClickSleep(reData, '前往登录');
    }
    // 网络异常波动   -- 提示
    if (selclick(reData,"前往登录")) {
        sleep(2000);
        return
    }

    if (select(reData,"屏蔽")) {
        if (selclick(reData,"确认",true)) {  // 被屏蔽了 
            sleep(1000);
            clickWithDelay(48,33,1000);
            return true
        }
    }

    if (selclick(reData,"确定",true)|| selclick(reData,"确认",true)) {
        return true
    }
    if (select(reData,"存在最新版本")||select(reData,"无法确认版本")) { 
        selclick(reData,"确定",true);
        // throw new Error("游戏更新");
        return true;
    }

    //  去认证界面
    if (select(reData,"资格的证明")) {
        selclick(reData,"登录游戏",true)
        sleep(2000);
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
        return true
        
    }
    if (selclick(reData,"重新连接")) {
        return true
    }

    if (select(reData,"服务器断开连接")) {
        return ClickSleep(reData,"确认")
    }
    // 网络问题 -> 重新尝试 
    if (select(reData, "网络套")) {
        close_app("com.wemade.mir4global")
        // log_z("需要关闭游戏重新登录")
        return true;
    }
    // 重新尝试
    if (select(reData, "重新尝试")) {
        return ClickSleep(reData, '重新尝试');
    }
    // 据点复活
    if (selclick(reData, "据点复活")) {
        // log_z("点击据点复活，等待5秒");
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
        textClick(reai,920,0)
        sleep(2000);
        return true
    }
    // Loading 界面
    if (select(reData, "Loading")) {
        sleep(5000);
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

// 排行榜喊话
function Ranking(reData) {
    /**
     * 打开排行榜界面
     * 1.获取当前排行榜角色的战斗力
     * 2.记录战斗力点击进入个人界面
     * 3.点击对话
     * 4.开始输入广告文本
     * 5.输入完毕就对话列表
     *          需要存的值为  喊了话的战斗力 e_war  当前职业  e_career     当前职业喊的数量  e_count
     */
    let care = storage.get(today)
    // log_z("排行榜喊话")
    log_z(`排行榜进度 :${care.e_career}`)
    //  输入法是打开的情况
    try {
        let ts = className("android.widget.EditText").findOne(1000)
        if (ts) {
            sleep(200);
            input(text);  // 输入文字
            sleep(500);
            clickWithDelay(1187,683,1000); // 点击发送
            clickWithDelay(633,105,1000); // 关闭对话
            // clickWithDelay(633,40,1000);  // 关闭对话框
            clickWithDelay(1230,29,1000);
            clickWithDelay(1038.5,630.5,1000);
            return true
        }
    } catch (error) {
        console.error("Ranking  Error during database operation:", error);
        return 
    }

    //  对话框
    if (select(reData,"聊天") && select(reData,"门派")) {
        // 请输入内容
        if (selclick(reData,"请输入内容")) {
            return true;
        }
        return true
    }

    //  进入对话界面
    if (select(reData,"其他玩家信息")) {
        if (selclick(reData,"确认",true)) {  // 被屏蔽了 
            clickWithDelay(48,33,1000);
            return true
        }
        let dh = select(reData,"对话")
        if (dh) {
            textClick(dh,0,-30)
            textClick(dh,0,-30)
            sleep(1500);
            // 等待切换显示
            // 等待切换界面
            if (!text3("请输入")) {
                console.log("该角色不存在")
                // toast("未等到要点的界面")
                clickWithDelay(48,33,1000);
            } 
            return true
        }
    }
    log_z(`不在其他玩家信息界面`)

    // 在排行榜界面
    if (select(reData,"每日服务器")) {
        // 选择职业 下拉框
        if (select(reData,"战士") && select(reData,"法师")) {
            return selclick(reData, care.e_career.trim());
        }
        // 没有选择分组
        if (select(reData,"全部") || select(reData, care.e_career.trim()) == null) { // 才打开不是当前分组
            if (selclick(reData,"全部") || selclick(reData,"战斗力（") || selclick(reData, "战斗力 (") || selclick(reData,"战斗力 （")) {
                return 
            }
        }
    }

    // 记录战斗力
    if (select(reData,care.e_career)) {
        // 开始挑选
        log_z(`开始挑选 ${care.e_war}`)
        let startTime = Date.now();  // 获取当前时间（毫秒）
        let img
        let croppedImage
        let croppedImage2
        let crop
        let crop2
        while (Date.now() - startTime < 2*60*1000) {   // 找3分钟找不到返回
            // 重新截图
            img = captureScreen(); 
            croppedImage = images.clip(img, 1097, 305, 91, 402); // 战斗力
            croppedImage2 = images.clip(img, 200, 645, 48, 38); // 100 排名  

            crop = getOcr(croppedImage);
            crop2 = getOcr(croppedImage2);

            if (care.e_war == 0) {
                // console.log(storage.get(today))
                //  未点击过
                if (crop) {
                    // console.log(crop[0][0][1][0])
                    storage.put(today,{e_career:care.e_career, e_war:crop[0][0][1][0], e_count:1 ,e_time:0})
                    if (selclick(reData,crop[0][0][1][0])) {
                        return true;
                    }
                }
            }else{
                let nt = getNextText(crop,care.e_war)
                if ( nt == null) {
                    log_z("向上滑动")
                    // swipe(600, 400, 600, 345, 500);  // 原始快短的上滑
                    // sleep(2000);
                    // swipe(1128, 660, 1128, 457, 3000);  // 缓速向上

                    swipe(1128, 660, 1128, 510, 1800);
                    if (crop2[0].length > 0) {
                        log_z(`排名 : ${crop2[0][0][1][0]}`);
                        if (crop2[0][0][1][0] == 100 ) {
                            // 点击右上角退出
                            // clickWithDelay(1235,41,2000); // 关闭窗口
                            let index = careers.indexOf(care.e_career); // 当前职业的index
                            if (index == careers.length -1) {
                                // 一轮喊完了  休息一小时
                                console.log("一轮喊完了")
                                storage.put(today,{e_career:"道士", e_war:0, e_count:0 ,e_time:addRandomMinutes(1,2)})
                                // throw new Error("一轮喊完了")
                            }else{
                                console.log("更换职业",storage.get(today))
                                storage.put(today,{e_career:careers[index+1], e_war:0, e_count:0 ,e_time:0})
                                // throw new Error("更换职业")
                            }
                            return true;
                        }
                    }
                    // return true;
                }else{
                    log_z("我要点击了 ")
                    // console.log("nt 下一个 : " ,nt)
                    img = captureScreen();
                    let grayscaleImage = images.grayscale(img);
                    reData = getOcr(grayscaleImage);
                    selclick(reData,nt);
                    storage.put(today,{e_career:care.e_career, e_war:nt, e_count:care.e_count + 1 , e_time:0})
                    return true;
                }
            }
        }
        return
    }

    // 在游戏界面
    if (select(reData,"和平",true) || select(reData,"近距",true) || select(reData,"卡组变更",true)||select(reData,"安全",true) ) {
        log_z("在游戏界面")
        clickWithDelay(1230,29,1300);
        clickWithDelay(1038.5,630.5,1000);
        return
    }

    // 打开了 设置
    if (select(reData,"快速设置")) {
        log_z("快速设置")
        if (selclick(reData,"排位",true)) {
            return true
        }
    }
}

// 主函数
function main(){
    // 初始化
    if (!init()) {
        log_z("初始化完成")
        try {
            let ts = className("android.widget.EditText").findOne(1000)
            if (ts) {
                input(text);  // 输入文字
                sleep(500);
                clickWithDelay(1187,683,1000); // 点击发送
                clickWithDelay(633,105,1000); // 关闭对话
                // clickWithDelay(633,40,1000);  // 关闭对话框
                clickWithDelay(1230,29,1000);
                clickWithDelay(1038.5,630.5,1000);
                return true
            }
        } catch (error) {
            console.error("upLevel  Error during database operation:", error);
            return 
        }
    
        let img = getimg(false)
        if (img == null) {
            console.log("截图失败 停止5秒")
            sleep(5000);
            return
        }
    
        let grayscaleImage = images.grayscale(img);      // 二级化
    
        // 获取OCR
        let reData = getOcr(grayscaleImage);
        if (reData) {
            log_z("处理异常弹窗")
            if (wrong(reData)) {return } //  处理异常弹窗
    
            log_z("登陆界面")
    
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
    
            Ranking(reData);
    
            log_z("关闭所有的弹窗")
            if (closeX(reData)) {return } 
            if (checkAndClick(reData, '指南', 1226, 38, 2000)) return true;
        }
    }
}

// for (let i = 0; i < 1000; i++) {
    log_z("main 执行")
    main()
    log_z("main 结束")
//     // console.log(storage.get(today))
// }
 

// console.log(storage.get(today))
// storage.put(today,{e_career:'道士', e_war:0, e_count:0 ,e_time:0})
// throw new Error("啊啊")

// for (let i = 0; i < 20; i++) {
//     swipe(1128, 660, 1128, 510, 1800);
// }

/** 各个大区更新排行榜时间
 *   SA 是 13:00 
 *   EU  是 18:00
 *   ASIA 是 00:00
 *   NA  是 12:00
 */



// console.log(storage.get(today))
// storage.put(today,{e_career:"道士", e_war:0, e_count:0 ,e_time:0})
// console.log("当前电量百分比 ",device.getBattery())

function select3(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    // log_z(`ocrResults[0].length : ${ocrResults[0].length}`)
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        console.log(". -=",item[1][0])
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

// let img = getimg(false)
// let grayscaleImage = images.grayscale(img);      // 二级化
// let reData = getOcr(grayscaleImage);
// select3(reData,"战斗力 （")
