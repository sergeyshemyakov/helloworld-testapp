// This key is used to save the data for the hello counter in the database
const CHAIN_STATE_HELLO_COUNTER = "hello:helloCounter";

// This schema is used to decode/encode the data of the hello counter from/for the database
const helloCounterSchema = {
    $id: "lisk/hello/counter",
    type: "object",
    required: ["helloCounter"],
    properties: {
        helloCounter: {
            dataType: "uint32",
            fieldNumber: 1,
        },
    },
};

// This schema is used to decode/encode the data of the asset of the hello transaction from/for the database
const helloAssetSchema = {
  $id: "lisk/hello/asset",
  type: "object",
  required: ["helloString"],
  properties: {
    helloString: {
      dataType: "string",
      fieldNumber: 1,
    },
  },
};

