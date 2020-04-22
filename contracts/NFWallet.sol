pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/ENStools/ENSReverseRegistration.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./core/RegistryEntry.sol";


contract NFWallet is IERC721Receiver, RegistryEntry, ENSReverseRegistration
{
	function initialize()
	external
	{
		_initialize(msg.sender);
	}

	function forward(address to, uint256 value, bytes calldata data)
	external onlyOwner()
	{
		(bool success, bytes memory returndata) = payable(to).call{value: value}(data);
		require(success, string(returndata));
	}

	function setName(address _ens, string calldata _name)
	external onlyOwner()
	{
		_setName(ENS(_ens), _name);
	}

	function onERC721Received(address, address, uint256, bytes memory)
	public override returns (bytes4)
	{
		return this.onERC721Received.selector;
	}
}
