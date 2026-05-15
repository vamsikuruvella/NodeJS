const { MongoClient } = require('mongodb');

const db_username = "vamsi";
const db_password = "vamsi";
const url = "mongodb+srv://" + db_username + ":" + db_password + "@cluster0.rpx0i0o.mongodb.net/?appName=Cluster0"

const client = new MongoClient(url);

// Database Name
const dbName = 'HelloWorld';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('User');

    const data = {
        firstname: "Shradha",
        lastname: "Kapoor",
        city: "Mumbai",
        phonenumber: "9876987605"
    }
    //Insert
    // const insertResult = await collection.insertMany([data]);
    // console.log('Inserted documents =>', insertResult);

    //Update
    // const updateResult = await collection.updateOne({ firstname: "Shradha" }, { $set: { lastname: "Singh" } });
    // console.log('Updated documents =>', updateResult);

    //Read
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);

    //Delete
    const deleteResult = await collection.deleteMany({ firstname: "Shradha" });
    console.log('Deleted documents =>', deleteResult);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());