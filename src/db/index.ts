import { AppDataSource } from "./userConnect";
import { User } from "./entity/user";

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");

        // Example: Create and save a new user
        const user = new User();
        user.username = "John Doe";
        user.phantomWallet = "johndoe@example.com";


        await AppDataSource.manager.save(user);
        console.log("User has been saved:", user);
    })
    .catch((error) => console.log("Error initializing data source:", error));
