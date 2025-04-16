import { setup } from './utils';

async function main() {
    const { address, info } = await setup('mock');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const meta = await info.meta();
    console.log(meta);

    const metaAndAssetCtxs = await info.metaAndAssetCtxs();
    console.log(metaAndAssetCtxs);

    const allMids = await info.allMids();
    console.log(allMids);

    const userFills = await info.userFills(address);
    console.log(userFills);
}

main();
