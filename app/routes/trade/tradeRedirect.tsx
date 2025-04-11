import { redirect } from 'react-router';
import { useTradeDataStore } from '~/stores/TradeDataStore';

export default function tradeRedirect() {
    try {
      // Log the store state to see what's happening
      const storeState = useTradeDataStore.getState();
      console.log('Market store state:', storeState);
      
      const defaultMarketId = storeState.symbol || 'BTC';
      console.log('Using default market ID:', defaultMarketId);
      
      // Make sure the redirect URL is correctly formatted
      const redirectUrl = `/trade/${defaultMarketId}`;
      console.log('Redirecting to:', redirectUrl);
      
      throw redirect(redirectUrl);
    // throw redirect('/trade/BTC');
    } catch (error) {
      // If the redirect throw fails, log the error
      if (!(error instanceof Response)) {
        console.error('Redirect error:', error);
      }
      throw error; // Rethrow the error or redirect
    }
  }