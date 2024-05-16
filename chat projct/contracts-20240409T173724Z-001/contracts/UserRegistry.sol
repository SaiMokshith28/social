// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    mapping(address => string) public userAddressesToUsernames;
    mapping(string => address) public usernamesToUserAddresses;

    function registerUsername(string memory _username) public {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(usernamesToUserAddresses[_username] == address(0), "Username already taken");
        require(bytes(userAddressesToUsernames[msg.sender]).length == 0, "Address already registered with a username");

        userAddressesToUsernames[msg.sender] = _username;
        usernamesToUserAddresses[_username] = msg.sender;
    }

    function isUsernameAvailable(string memory _username) public view returns (bool) {
        return usernamesToUserAddresses[_username] == address(0);
    }

    function isAddressRegistered(address _userAddress) public view returns (bool) {
        return bytes(userAddressesToUsernames[_userAddress]).length > 0;
    }

    function getUsername(address _userAddress) public view returns (string memory) {
        require(bytes(userAddressesToUsernames[_userAddress]).length > 0, "User does not exist");
        return userAddressesToUsernames[_userAddress];
    }
}
