export const totalToken = 1000000000000000000;

export function calculateCirculating(reserveValue: number): number {
    return (totalToken - reserveValue) / 10**6;
}

export function scPrice(reserveDjed: number, adaReserve: number, adaPrice: number): number {
    const circulatingDjed = (totalToken - reserveDjed) / 10**6;
    const reserveAda = adaReserve / 10**6;
    const scPrice1 = 1/adaPrice;
    const scPrice2 = reserveAda/circulatingDjed;
    if (scPrice1 <= scPrice2){
        return scPrice1;
    } else {
        return scPrice2;
    }
}

export function calculateLiabilities(circDjed: number, price: number): number {
    return circDjed * price;
}

export function calculateEquity(liabilities: number, adaReserve: number): number {
    return adaReserve - liabilities;
}

export function rcPrice(reserveShen: number, equity: number): number {
    const circulatingShen = (totalToken - reserveShen) / 10**6;
    return equity / circulatingShen;
}

export function calculateRatio(reserveAda: number, liabilities: number): number {
    return reserveAda / liabilities;
}

export function convertUnixTimestampsToDateStrings(timestamps: number[]): string[] {
    return timestamps.map((timestamp) => {
      // Multiply by 1000 to convert seconds to milliseconds
      const date = new Date(timestamp * 1000);
  
      // Use Date methods to get the components of the date
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are zero-indexed
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
  
      // Format the date string
      return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    });
  }
  
// Helper function to pad a number with a leading zero if needed
export function padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}  