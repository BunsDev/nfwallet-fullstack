import React from 'react';
import {
	MDBBtn,
	MDBNavLink,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
} from 'mdbreact';
import { ethers } from 'ethers';

import TextField from '@material-ui/core/TextField';
import AddressInputENS from '../UI/AddressInputENS';

const MintWallet = (props) =>
{
	const [ open, setOpen ] = React.useState(false);
	const [ full, setFull ] = React.useState(!!props.advanced);
	const [ addr, setAddr ] = React.useState(props.services.accounts[0]);
	const [ seed, setSeed ] = React.useState('');
	const toggle     = () => setOpen(!open);
	const toggleFull = () => setFull(!full);

	const handleSubmit = (ev) =>
	{
		ev.preventDefault();
		props.services.registry.createWallet(
			addr,
			full ? ethers.utils.id(seed) : ethers.utils.randomBytes(32),
		)
		.then(txPromise => {
			txPromise.wait()
			.then(() => {
				props.services.emitter.emit('Notify', 'success', 'New wallet minted');
			}) // success
			.catch(() => {
				props.services.emitter.emit('Notify', 'error', 'Transaction failled');
			}) // transaction error
		})
		.catch(() => {
			props.services.emitter.emit('Notify', 'error', 'Signature required');
		}) // signature error
		.finally(toggle);
	}

	return (
		<>
			<MDBNavLink to='#!' onClick={toggle}>
				New wallet
			</MDBNavLink>
			<MDBModal isOpen={open} toggle={toggle} centered>
				<MDBModalHeader toggle={toggle}>New wallet</MDBModalHeader>
				<MDBModalBody>
					{
						full
						?
							<form onSubmit={handleSubmit} className='d-flex flex-column'>
								<AddressInputENS className='my-1' label='initial owner' defaultValue={addr} onChange={setAddr}                                         {...props}/>
								<TextField       className='my-1' label='seed'          defaultValue={seed} onChange={e => setSeed(e.target.value)} variant='outlined' {...props}/>
								<MDBBtn color='indigo' type='sumbit' className='mx-0'>Mint</MDBBtn>
							</form>
						:
							<form onSubmit={handleSubmit} className='d-flex'>
								<AddressInputENS className='flex-grow-1' label='initial owner' defaultValue={addr} onChange={setAddr} {...props}/>
								<MDBBtn color='indigo' type='sumbit' className='my-0'>Mint</MDBBtn>
							</form>
					}
					<div className='lined text-muted'>
						<a href='#!' className='text-reset' onClick={toggleFull}>
							toggle advanced mode
						</a>
					</div>
				</MDBModalBody>
			</MDBModal>
		</>
	);
}

export default MintWallet;
