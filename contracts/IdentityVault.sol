// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityVault {
    struct Identity {
        string identityHash;
        string sourceChain;
        uint256 timestamp;
        bool isActive;
    }

    mapping(address => Identity) public identities;
    mapping(address => mapping(address => bool)) public sharedIdentities;

    event IdentityStored(address indexed user, string identityHash, string sourceChain);
    event IdentityShared(address indexed from, address indexed to);
    event IdentityRevoked(address indexed from, address indexed to);

    function storeIdentity(string memory _identityHash, string memory _sourceChain) external {
        identities[msg.sender] = Identity({
            identityHash: _identityHash,
            sourceChain: _sourceChain,
            timestamp: block.timestamp,
            isActive: true
        });

        emit IdentityStored(msg.sender, _identityHash, _sourceChain);
    }

    function getIdentity(address _user) external view returns (Identity memory) {
        return identities[_user];
    }

    function shareIdentity(address _to) external {
        require(identities[msg.sender].isActive, "No active identity to share");
        sharedIdentities[msg.sender][_to] = true;
        emit IdentityShared(msg.sender, _to);
    }

    function revokeIdentityShare(address _from) external {
        sharedIdentities[_from][msg.sender] = false;
        emit IdentityRevoked(_from, msg.sender);
    }

    function canAccessIdentity(address _user, address _requester) external view returns (bool) {
        return _user == _requester || sharedIdentities[_user][_requester];
    }
} 