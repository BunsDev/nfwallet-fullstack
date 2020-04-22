pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/ENStools/ENSReverseRegistration.sol";
import "./core/Registry.sol";
import "./NFWallet.sol";


contract NFWalletFactory is Registry, ENSReverseRegistration
{
	constructor()
	public Registry(
		address(new NFWallet()),
		'NonFungibleWallets',
		'NFWs')
	{
	}

	function encodeInitializer(bytes32 _salt)
	internal pure returns (bytes memory)
	{
		return abi.encodeWithSignature('initialize()', _salt);
	}

	function openWallet(address _owner, bytes32 _salt)
	external returns(address)
	{
		return address(_mintCreate(_owner, encodeInitializer(_salt)));
	}

	function predictWallet(address _owner, bytes32 _salt)
	external view returns(address)
	{
		return address(_mintPredict(_owner, encodeInitializer(_salt)));
	}

	function setName(address _ens, string calldata _name)
	external onlyOwner()
	{
		_setName(ENS(_ens), _name);
	}
}
