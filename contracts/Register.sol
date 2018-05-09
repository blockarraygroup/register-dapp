pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;

import {UserStorage} from "./UserStorage.sol";


/// @title Node Registration
contract Register is UserStorage("creator") {
    /*
    * @author Austin Hester
    * @dev For use in the Registration Dapp
    */

    // User struct located in ./UserStorage.sol
    mapping(address => User) users;

    event UserRegistered(string _first, string _last, string _email);

    constructor() public {
        require(msg.sender != 0x0);
    }

    // Register user with given info
    // Revert o alredy registered
    /// @param _first name
    /// @param _last name
    /// @param _email email
    function register(
        string _first,
        string _last,
        string _email
    ) public {
        require(msg.sender != 0x0);
        require(!isRegistered(msg.sender));
        User memory newUser = User(_first, _last, _email, true);
        storeUser(msg.sender, newUser);
        emit UserRegistered(newUser.first, newUser.last, newUser.email);
    }
    
    // Get array of user info
    /// @param _of address _of
    /// @return array [first, last, email]
    function getUser(
        address _of
    ) public view returns (
        string first,
        string last,
        string email
    ) {
        require(_of != 0x0);
        User memory u = getUserObject(_of);
        return (u.first, u.last, u.email);
    }

    // Is this user registerede
    /// @param _of address 
    /// @return boolean
    function isRegistered(
        address _of
    ) public view returns (bool) {
        require(_of != 0x0);
        User memory u = getUserObject(_of);
        return u.isRegistered;
    }

}
