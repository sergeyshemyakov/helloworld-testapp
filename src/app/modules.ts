/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { HelloModule } from "./modules/hello/hello_module";

// @ts-expect-error Unused variable error happens here until at least one module is registered
export const registerModules = (_app: Application): void => {

    console.log("Before registering Hello Module");
    _app.registerModule(HelloModule);
    console.log("After registering");
};
