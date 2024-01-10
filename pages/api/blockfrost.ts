import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
    circulatingDjed: number,
    circulatingShen: number,
    adaPrice: number,
    reserve: number,
    scPrice: number,
    rcPrice: number,
    liabilities: number,
    equity: number,
    ratio: number
  }

  const SHEN_ID = "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd615368656e4d6963726f555344";
  const DJED_ID = "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344";
  const RESERVE = "addr1zxem3j9xw7gyqnry0mfdhku7grrzu0707dc9fs68zwkln5sm5kjdmrpmng059yellupyvwgay2v0lz6663swmds7hp0qul0eqc";
  const API = new BlockFrostAPI({
    projectId: "mainnetYXpeV3KNdSXwkWVTsc5b2szE7Z7cnlWB"
  });
  
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    const reserveAddr = await API.addresses(RESERVE);
    // Get amounts in reserve contract
    let reserveDjed = 0;
    let reserveShen = 0;  // *10^6
    let reserveAda = 0;  // *10^6
    const amount = reserveAddr.amount;
    var i = 0;
    while (i < amount.length) {
        if (amount[i].unit === "lovelace") {
            reserveAda = Number(amount[i].quantity) / 1000000;
        } else if (amount[i].unit === SHEN_ID) {
            reserveShen = Number(amount[i].quantity);
        } else if (amount[i].unit === DJED_ID) {
            reserveDjed = Number(amount[i].quantity);
        }
        i ++;
    }

    // Get minted amounts from token contracts
    const djedToken = await API.assetsById(DJED_ID);
    const totalDjed = Number(djedToken.quantity);
    const shenToken = await API.assetsById(SHEN_ID);
    const totalShen = Number(shenToken.quantity);

    // Get circulating amounts (total - reserve)
    const circulatingDjed = (totalDjed - reserveDjed) / 10**6;
    const circulatingShen = (totalShen - reserveShen) / 10**6;  

    const adaPriceUSD = await getCardanoPrice();


    const scPrice = Math.min(1/adaPriceUSD, reserveAda/circulatingDjed);
    const liabilities = circulatingDjed * scPrice;
    const equity = reserveAda - liabilities;
    const rcPrice = equity / circulatingShen;
    const ratio = reserveAda / liabilities;
    let data: Data = {
        circulatingDjed: circulatingDjed,
        circulatingShen: circulatingShen,
        adaPrice: adaPriceUSD,
        reserve: reserveAda,
        scPrice: scPrice,
        rcPrice: rcPrice,
        liabilities: liabilities,
        equity: equity,
        ratio: ratio
    }
    res.status(200).json(data);
  }
  
  interface CardanoPriceData {
    cardano: {
      usd: number;
    };
  }
  
  // Function to fetch the Cardano price
  async function getCardanoPrice(): Promise<number> {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd';
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch Cardano price. Status: ${response.status}`);
      }
  
      const data: CardanoPriceData = await response.json();
      return data.cardano.usd;
    } catch (error) {
      console.error('Error fetching Cardano price:', error);
      return -1;
    }
  }