import {Client, Account, Databases, Avatars, ID, TablesDB, Query} from "react-native-appwrite";
import {CreateUserParams, SignInParams} from "@/types";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    tableId: process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!,
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const databases = new Databases(client)
export const tablesDB = new TablesDB(client);
const avatars = new Avatars(client)


export const createUser = async ({ email, password, name}: CreateUserParams) => {
 try{
    const newAccount = await account.create({ userId: ID.unique(), email, password, name })

     if(!newAccount) throw Error

     await signIn({email, password})

     const avatarUrl = avatars.getInitialsURL(name)

     return  await tablesDB.createRow({
         databaseId: appwriteConfig.databaseId,
         tableId: appwriteConfig.tableId,
         rowId: ID.unique(),
         data: {
             accountId: newAccount.$id, name, email, avatar: avatarUrl
         }
     })
 } catch(e) {
    throw new Error(e as string)
 }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        return await account.createEmailPasswordSession({ email, password })
    } catch (e) {
        throw new Error(e as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error

        const currentUser = tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tableId,
            queries: [Query.equal('accountId', currentAccount.$id)]
        })

        if(!currentUser) throw Error
        return (await currentUser).rows[0]
    }
    catch(e) {
        throw new Error(e as string)
    }
}