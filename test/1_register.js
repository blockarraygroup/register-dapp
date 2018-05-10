var Register = artifacts.require("Register");

contract('Register', function(accounts) {
    var instance;
    Register.deployed().then((rinst) => {
        //console.log(rinst);
        instance = rinst;
    });

    // Register the Creator
    it("should register the creator", function() {
        return instance.register("New", "Creator",
                                 "creator@a.com", {from: accounts[0]})
        .then((result) => {
            return instance.getUser.call(accounts[0])
            .then((user) => {
                //console.log(user);
                assert.equal(user[0].toString(), "New",
                                "creator re-registration failed");
            });
        });
    });
    // Register a new user
    it("should register a new user", function() {
        return instance.register("Bob", "Johnson",
                                 "bjohn@a.com", {from: accounts[1]})
        .then((result) => {
            return instance.getUser.call(accounts[1])
            .then((user) => {
                //console.log(user);
                assert.equal(user[0].toString(), "Bob",
                                "new user registration failed");
            });
        });
    });
    // This should NOT work. Sometimes your local client will not
    // like this one. Using geth works fine. Sometimes
    // ganache will throw an error and this test fails. That is normal.
    it("should not allow that user to re-register", function() {
        return instance.register("Bab", "Json",
                                 "bjon@a.com", {from: accounts[1]})
        .then((result) => {
            return instance.getUser.call(accounts[1])
            .then((user) => {
                //console.log(user);
                assert.equal(user[0].toString(), "Bob",
                                "new user registerd again");
            });

        })
        .catch((error) => {
            //console.log(error);
            if (!error)
                assert.fail("They got through.");
            assert.notEqual(error, undefined, "Not allowed"); 
        });
    });
});
