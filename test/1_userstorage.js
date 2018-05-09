var UserStorage = artifacts.require("UserStorage");

contract('UserStorage', function(accounts) {
    var instance;
    UserStorage.deployed().then((inst) => {
        //console.log(rinst);
        instance = inst;
    });
    it("should have pre-registered the creator", function() {
        return instance.getUserInfo.call(accounts[0])
        .then((user) => {
            //console.log(user);
            assert.equal(user[0].toString(), "creator",
                            "creator registration failed");
        });
    });
});
