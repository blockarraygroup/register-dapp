pragma solidity ^0.4.23;
pragma experimental ABIEncoderV2;


/// @title User Storage
contract UserStorage {
    /*
    * @author Austin Hester
    * @dev Built to be used by other contracts
    */

    // Represents a user
	struct User {
	    string first;
	    string last;
	    string email;
	    bool isRegistered;
	    //string other;
	}

	mapping(address => User) private mUsers;

    // Solidity 0.4.23 has an issue with inheritence
    // and multiple contsructors
    // using old-style contsructor here for now
    constructor(string _creator) public {
    	require(msg.sender != 0x0);
       	mUsers[msg.sender] = User(_creator, "-", "-", false);
        assert(strcmp(mUsers[msg.sender].first, _creator));
    }

    // Get info about the user at given address
    /// @param _of address 
    /// @return array [first, last, email]
    function getUserInfo(
        address _of
    ) public view returns (
        string first,
        string last,
        string email
    ) {
        require(_of != 0x0);
        User storage u = mUsers[_of];
        return (u.first, u.last, u.email);
    } 

    // Get the User object, cannot get through web3 as of now
    // Can only be used in contracts.
    // Cannot use struct as return values. -Apr 18
    /// @return {User} object 
    function getUserObject(
        address _of
    ) internal view returns (User) {
        require(_of != 0x0);
        User memory u = mUsers[_of];
        return u;
    } 

    // Store the User object
    /// @param _of address 
    /// @param _user object 
    function storeUser(address _of, User _user) internal {
    	require(msg.sender == _of);
        require(!mUsers[msg.sender].isRegistered);
    	mUsers[msg.sender] = _user;
        assert(mUsers[msg.sender].isRegistered);
        assert(strcmp(mUsers[msg.sender].first, _user.first));
        assert(strcmp(mUsers[msg.sender].last, _user.last));
        assert(strcmp(mUsers[msg.sender].email, _user.email));
    }

    /// @param a string 
    /// @param b string 
    /// @return boolean 
    function strcmp(
        string a,
        string b
    ) internal pure returns (bool) {
        return (keccak256(a) == keccak256(b));
    }

}
