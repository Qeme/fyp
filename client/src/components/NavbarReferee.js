import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "./ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@radix-ui/react-menubar";
import { useUserContext } from "src/hooks/useUserContext";
import AvatarProfile from "./AvatarProfile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFileContext } from "src/hooks/useFileContext";

// create a NavbarReferee function
function NavbarReferee() {
  // call for the logout function
  const { logout } = useLogout();
  // call for the user context from useAuthContext to show the email of the user if he has logged in
  const { users, dispatch } = useUserContext();
  const { files, dispatch: dispatchFiles } = useFileContext();
  const { user } = useAuthContext();

  const [showSheet, setShowSheet] = useState(false);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
  });
  const [userAvatar, setUserAvatar] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const currentUser = users.find((us) => us._id === user?._id);
    if (currentUser) {
      setEditUser({
        name: currentUser.name,
        email: currentUser.email,
      });

      setUserAvatar(currentUser);
    }
  }, [users, user?._id]);

  const handleSheetToggle = () => {
    setShowSheet(!showSheet);
  };

  const handleClick = () => {
    logout();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:3002/api/users/${user._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_USER", payload: json });

      if (profileImage) {
        // Find the existing profile image file for the user
        const existingProfileFile = files.find(
          (file) =>
            file.metadata.topic === "profile" &&
            (file.metadata.uploader?.$oid || file.metadata.uploader) ===
              user._id
        );

        if (existingProfileFile) {
          // Delete the existing profile image file
          const deleteResponse = await fetch(
            `http://localhost:3002/api/files/del/${existingProfileFile.fileId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          // const deleteJson = await deleteResponse.json();
          // console.log("LOL", existingProfileFile)

          if (deleteResponse.ok) {
            dispatchFiles({
              type: "REMOVE_FILE",
              payload: existingProfileFile,
            });
          } else {
            console.log(
              "Error deleting existing profile file",
              existingProfileFile
            );
            return;
          }
        }

        // construct a formData which you need to pass it to axios, make sure the properties file is equal to backend file
        const fd = new FormData();
        fd.append("file", profileImage, profileImage.name);
        fd.append("topic", "profile");

        // Set up the headers
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: (ProgressEvent) => {
            console.log(
              "Uploading Progress: " +
                Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
                "%"
            );
          },
        };

        // Use Axios to handle the file upload
        try {
          const uploadResponse = await axios.post(
            "http://localhost:3002/api/files",
            fd,
            config
          );
          const { file } = uploadResponse.data;
          dispatchFiles({ type: "UPLOAD_FILE", payload: file });
          setProfileImage(null);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 flex items-center justify-between">
      <Menubar className="flex items-center space-x-4">
        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <Link
              to="/tournaments/referee"
              className="text-white hover:text-gray-300"
            >
              Tournament
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <div className="flex items-center space-x-4">
        <Sheet>
          <SheetTrigger>
            <div onClick={handleSheetToggle}>
              <AvatarProfile participant={userAvatar} />
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editUser.name}
                  type="text"
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editUser.email}
                  type="email"
                  disabled={true}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="picture" className="text-right">
                  Profile
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="col-span-3"
                />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        <div className="text-white flex flex-col items-center justify-center">
          <div>{user.email}</div>
          <div className="text-orange-500">{user.role}</div>
        </div>

        <Button
          onClick={handleClick}
          className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-3xl"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}

// export NavbarReferee
export default NavbarReferee;
