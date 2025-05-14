import { setup } from './utils';

async function main() {
    const { address, info } = await setup('mock');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    info.subscribe({ type: 'allMids' }, console.log);
    info.subscribe({ type: 'l2Book', coin: 'BTC' }, console.log);
    info.subscribe({ type: 'trades', coin: 'BTC' }, console.log);
    info.subscribe({ type: 'userEvents', user: address }, console.log);
    info.subscribe({ type: 'userFills', user: address }, console.log);
    info.subscribe(
        { type: 'candle', coin: 'BTC', interval: '1m' },
        console.log,
    );
    info.subscribe({ type: 'orderUpdates', user: address }, console.log);
    info.subscribe({ type: 'userFundings', user: address }, console.log);
    info.subscribe(
        { type: 'userNonFundingLedgerUpdates', user: address },
        console.log,
    );
    info.subscribe({ type: 'webData2', user: address }, console.log);
}

main();
