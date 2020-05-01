import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient   } from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { HttpLink       } from 'apollo-link-http';
import { EventEmitter   } from 'fbemitter';
import { ethers         } from 'ethers';
import LoginWithEthereum  from '../libs/login-with-ethereum';

import Main          from './Main';
import Error         from './UI/Error';
import Notifications from './Services/Notifications';

import NFWalletFactory from '../abi/NFWalletFactory.json';

import CONFIG from '../config.json';



const Core = () =>
{
	const [ emitter,              ] = React.useState(new EventEmitter());
	const [ provider, setProvider ] = React.useState(null);
	const [ services, setServices ] = React.useState(null);

	const configure = async (web3) => {

		// Disconnect
		if (!web3)
		{
			setProvider(null);
			setServices(null);
			return;
		}

		// initiate provider
		const provider = new ethers.providers.Web3Provider(web3)
		setProvider(provider);

		// configure services
		try
		{
			const accounts = await provider.listAccounts()
			const network  = await provider.getNetwork()
			const config   = CONFIG.networks[network.name]
			const registry = new ethers.Contract(NFWalletFactory.networks[network.chainId].address, NFWalletFactory.abi, provider.getSigner());
			const uri      = config.subgraph;
			const cache    = new InMemoryCache();
			const link     = new HttpLink({ uri });
			const client   = new ApolloClient({ cache, link });

			setServices({
				accounts,
				network,
				config,
				registry,
				client,
			});
		}
		catch (e)
		{
			setServices(null);
		}
	}

	const connect = (web3) => {
		emitter.emit('Notify', 'success', 'You are connected');
		web3.on('accountsChanged', (accounts) => (accounts.length === 0) ? setProvider(null) : configure(web3)); // should not be needed, but prevents crash
		web3.on('networkChanged',  (network ) =>                                               configure(web3));
		web3.autoRefreshOnNetworkChange = false;
		configure(web3);
	}

	const disconnect = () => {
		emitter.emit('Notify', 'warning', 'You are disconnect');
		setProvider(null);
	}

	return (
		<>
			<Notifications emitter={emitter}/>
			<LoginWithEthereum
				className    = { provider ? 'connected' : 'disconnected' }
				config       = { CONFIG.enslogin                         }
				connect      = { connect                                 }
				disconnect   = { disconnect                              }
				startVisible = { true                                    }
				noInjected   = { false                                   }
			/>
			{
				provider &&
				(
					services
					?
						<ApolloProvider client={services.client}>
							<Main services={{
								emitter,
								provider,
								...services
							}}/>
						</ApolloProvider>
					:
						<Error message='Please switch network to a supported network'/>
				)
			}
		</>
	);
}

export default Core;
