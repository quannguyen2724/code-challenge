

1. List out the computational inefficiencies and anti-patterns found in the code block below.
- Incomplete Datasource class:
  The original code had a TODO comment for implementing the Datasource class. I provided a complete implementation that fetches and processes the price data.
- The blockchain parameter in getPriority is typed as any, but it should be a string or some other specific type.
- The lhsPriority variable is not defined in the sortedBalances function.
- Function formattedBalances was never used
- Formatting issue in formattedBalances:
  balance.amount.toFixed() without arguments will round to the nearest integer. It's better to specify decimal places, e.g., balance.amount.toFixed(2).
- console.err in useEffect should be console.error:
  The original code used console.err(error), which is incorrect. It should be console.error(error).
- The useMemo is used without any dependencies, which causing them to run on every render.
- children is never used so it should be removed from props.
- The filter condition in sortedBalances should return true for balances with amount > 0, not <= 0.
- the sortedBalances function recalculates priorities for each comparison, which can be optimized like this:

const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);

2. Implement the Datasource class so that it can retrieve the prices required.

- Datasource class

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Process the data to create a map of currency to price
      const prices: Record<string, number> = {};
      data.forEach((item: { currency: string; price: number }) => {
        prices[item.currency] = item.price;
      });

      return prices;
    } catch (error) {
      console.error("Error fetching prices:", error);
      throw error;
    }
  }
}


- Implement the Datasource class

useEffect(() => {
  const datasource = new Datasource("https://interview.switcheo.com/prices.json");
  datasource.getPrices().then(prices => {
    setPrices(prices);
  }).catch(error => {
    console.error(error);
  });
}, []);

3. You should explicitly state the issues and explain how to improve them.
I have listed the issues and the explain how to improve some of them in section 1, the rest of the improvements I will show in the improved code in improvedWalletPage folder.

4. You should also provide a refactored version of the code.
The refactored version of the code is in the WalletPage.ts file in the improvedWalletPage folder
It's might show some error warnings in the IDE because they are simply TS files instead of TS files in a React Application