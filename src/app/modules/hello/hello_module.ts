/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext, BaseModule,


    BeforeBlockApplyContext, TransactionApplyContext
} from 'lisk-sdk';
// import { HelloAsset } from "./assets/hello_asset";

const { HelloAsset } = require('./assets/hello_asset');

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
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === HelloAssetID) {
		const helloAsset = codec.decode(helloAssetSchema, _input.transaction.asset);

		this._channel.publish('hello:newHello', {
	            sender: _input.transaction._senderAddress.toString('hex'),
	            hello: helloAsset.helloString
		});
	}	
    }

    public async afterGenesisBlockApply({transaction, stateStore, reducerHandler}) {
        // Set the hello counter to zero after the genesis block is applied
        await stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(helloCounterSchema, { helloCounter: 0 })
        );
    }
}
