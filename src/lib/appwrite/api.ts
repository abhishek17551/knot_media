import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {ID, Query} from 'appwrite'

export const createUserAccount = async (user : INewUser) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountID : newAccount.$id,
            name : newAccount.name,
            email : newAccount.email,
            username : user.username,
            imageUrl : avatarUrl
        })

        return newUser;
    }
    catch (error) {
        console.error(error);
        return error
    }
}

export const saveUserToDB = async (user : {
    accountID : string;
    email : string;
    name : string;
    imageUrl : URL;
    username?: string 
}) => {

    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser
    }
    catch(error) {
        console.error(error)
    }

}

export const signInAccount = async (user : {email:string; password:string}) => {

    try {
        const session = await account.createEmailSession(user.email,user.password)

        return session
    }
    catch(error) {
        console.error(error)
    }

}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountID", currentAccount.$id)]
          );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    }
    catch(error) {
        console.error(error)
    }
}

export const signOutAccount = async () => {
    try {   
        const session = await account.deleteSession('current')
        return session
    }
    catch(error) {
        console.error(error)
    }

}

export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
}

export async function deleteFile(fileId: string) {
   try {
     await storage.deleteFile(appwriteConfig.storageId, fileId);
 
     return { status: "ok" };
   } catch (error) {
     console.log(error);
   }
}

export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
}


export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost (postId:string, likesArray:string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes : likesArray
      }
    )

    if(!updatedPost) throw Error
  }
  catch (error) {
    console.error(error)
  }
}

export async function savePost (postId:string, userId:string[]) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savedCollectionId,
      ID.unique(),
      {
        user : userId,
        post : postId
      }
    )

    if(!updatedPost) throw Error
  }
  catch (error) {
    console.error(error)
  }
}

export async function deleteSavedPost (savedRecordId:string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savedCollectionId,
      savedRecordId
    )

    if(!statusCode) throw Error

    return {status:'ok'}
  }
  catch (error) {
    console.error(error)
  }
}

export async function getPostById(postId:string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return post
  }
  catch(err){
    console.error(err)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0
  try {
    let image = {
      imageUrl : post.imageUrl,
      imageId : post.imageId
    }

    if(hasFileToUpdate) {
       // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = {...image,imageUrl:fileUrl,imageId:uploadedFile.$id}
    }


    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId:string, imageId:string) {
  if(!postId || imageId) throw Error

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return {status:'ok'}
  }
  catch(err) {
    console.error(err)
  }
}