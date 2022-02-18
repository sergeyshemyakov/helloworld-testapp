/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext, BaseModule, codec,


    BeforeBlockApplyContext, TransactionApplyContext
} from 'lisk-sdk';
// import { HelloAsset } from "./assets/hello_asset";

const { HelloAsset } = require('./assets/hello_asset');

const {
    helloCounterSchema,
    helloAssetSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('./schemas');

export class HelloModule extends BaseModule {
    
    public accountSchema = {
	type: 'object',
	properties: {
		helloMessage: {
			fieldNumber: 1,
			dataType: 'string',
			maxLength: 64,
		},
	},
	default: {
		helloMessage: '',
	},
    };

    public actions = {
        // Example below
        // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
        // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
	amountOfHellos: async () => {
            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLO_COUNTER);
	    console.log(res);
            const count = codec.decode(
                helloCounterSchema,
                res
            );
            return count;
	}
    };
    public reducers = {
        // Example below
        // getBalance: async (
		// 	params: Record<string, unknown>,
		// 	stateStore: StateStore,
		// ): Promise<bigint> => {
		// 	const { address } = params;
		// 	if (!Buffer.isBuffer(address)) {
		// 		throw new Error('Address must be a buffer');
		// 	}
		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
		// 	return account.token.balance;
		// },
    };
    public name = 'hello';
    public transactionAssets = [
        	new HelloAsset()];
    public events = [
        // Example below
        // 'hello:newBlock',
	'newHello'
    ];
    public id = 1000;

    // public constructor(genesisConfig: GenesisConfig) {
    //     super(genesisConfig);
    // }

    // Lifecycle hooks
    public async beforeBlockApply(_input: BeforeBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async afterBlockApply(_input: AfterBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async beforeTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public async afterTransactionApply({transaction, stateStore, reducerHandler}) {
        // Publish a `newHello` event for every received hello transaction
        if (transaction.moduleID === this.id && transaction.assetID === 0) {
		const helloAsset = codec.decode(helloAssetSchema, transaction.asset);

		this._channel.publish('hello:newHello', {
	            sender: transaction._senderAddress.toString('hex'),
	            hello: helloAsset.helloString
		});
	}	
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Set the hello counter to zero after the genesis block is applied
        await _input.stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(helloCounterSchema, { helloCounter: 0 })
        );	
    }
}
