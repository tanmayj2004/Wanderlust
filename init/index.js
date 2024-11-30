const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wandarlust');
}
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj ) => ({ ...obj, owner: "673eb95d37fbdba74096a236" }));

    await Listing.insertMany(initData.data);
    console.log("Data was intialiazed");
};
initDB();