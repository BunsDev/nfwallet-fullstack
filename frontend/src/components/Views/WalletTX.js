import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import AddressInputENS from '../UI/AddressInputENS';
import InputAdornment  from '@material-ui/core/InputAdornment';
import TextField       from '@material-ui/core/TextField';

import { ethers } from 'ethers';
import { abi as ABIWallet } from '../../abi/NFWallet.json';


const WalletTX = (props) =>
{
	const wallet = new ethers.Contract(props.data.wallet.id, ABIWallet, props.services.provider.getSigner());

	const [ addr,  setAddr ] = React.useState('');
	const [ value, setValue] = React.useState('');

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();

		wallet
		.forward(addr, ethers.utils.parseUnits(value, 'ether'), '0x')
		.then(txPromise => {
			props.services.emitter.emit('Notify', 'info', 'Transaction sent');
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'Transaction successfull');
			}) // success
			.catch(() => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(() => {
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
	}

	return (
		<form onSubmit={handleSubmit} className={`d-flex flex-column ${props.className}`}>
			<AddressInputENS
				className='my-1'
				label='destination'
				defaultValue={addr}
				onChange={setAddr}
				provider={props.services.provider}
			/>
			<TextField
				className='my-1'
				label='amount'
				placeholder='0.1'
				value={value}
				onChange={e => setValue(e.target.value)}
				InputProps={{
					startAdornment:
						<InputAdornment position='start'>
							{ethers.constants.EtherSymbol}
						</InputAdornment>,
					endAdornment:
						<InputAdornment position='end'>
							<MDBBtn color='blue' className='z-depth-0' size='sm' onClick={() => setValue(props.data.wallet.balance)}>max</MDBBtn>
						</InputAdornment>,
				}}
				variant='outlined'
			/>
			<MDBBtn color='blue' type='sumbit' className='mx-0' size='sm' disabled={(props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase())}>
				Send { (props.data.wallet.owner.id !== props.services.accounts[0].toLowerCase()) ? '(disabled for non owners)' : ''}
			</MDBBtn>
		</form>
	);
}

export default WalletTX;
