import React, { useState, useEffect, useMemo } from 'react';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;  // Added missing property
  }
  
  interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
  }
  
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
  
  const WalletPage = (props: Props) => {
    const { ...rest } = props;  // Removed unused 'children'
    const balances = useWalletBalances();
    const [prices, setPrices] = useState<Record<string, number>>({});
  
    useEffect(() => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        console.error(error);  // Fixed error logging
      });
    }, []);
  
    const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}
  
    const sortedBalances = useMemo(() => {
      return balances
        .filter((balance: WalletBalance) => {
          const balancePriority = getPriority(balance.blockchain);
          return balancePriority > -99 && balance.amount > 0;  // Fixed filter logic
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          return rightPriority - leftPriority;  // Simplified sort logic
        });
    }, [balances]);
  
    const formattedBalances: FormattedWalletBalance[] = sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2)  // Specify decimal places
    }));
  
    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;  // Handle potential undefined price
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  
    return (
      <div {...rest}>
        {rows}
      </div>
    );
  };