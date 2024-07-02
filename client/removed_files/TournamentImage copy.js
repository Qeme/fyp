// import { Button } from "src/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "src/components/ui/card";
// import { Input } from "src/components/ui/input";
// import { Label } from "src/components/ui/label";
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useAuthContext } from "src/hooks/useAuthContext";

// const TournamentImage = () => {
//   const { id } = useParams();
//   const { user } = useAuthContext();
//   const [files, setFiles] = useState({
//     tour_bg: null,
//     tour_banner: null,
//     tour_qr: null,
//   });

//   const handleFileChange = (event) => {
//     const { id, files } = event.target;
//     setFiles((prevFiles) => ({
//       ...prevFiles,
//       [id]: files[0],
//     }));
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     if (files.tour_bg) formData.append("files", files.tour_bg);
//     if (files.tour_banner) formData.append("files", files.tour_banner);
//     if (files.tour_qr) formData.append("files", files.tour_qr);
//     formData.append("topics", "tour_bg");
//     formData.append("topics", "tour_banner");
//     formData.append("topics", "tour_qr");

//     // Debugging: log each file
//     for (const pair of formData.entries()) {
//       console.log(pair[0], pair[1]);
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:3002/api/files/multiple/${id}`,
//         {
//           method: "POST",
//           body: formData,
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error("Error uploading files:", error);
//     }
//   };

//   return (
//     <main>
//       <Card>
//         <CardHeader>
//           <CardTitle>Upload necessary images!</CardTitle>
//           <CardDescription>
//             These include the background image of the tournament, a banner for
//             advertising, and a QR code for ticket purchasing.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
//             <div>
//               <Label htmlFor="tour_bg">Background</Label>
//               <Input
//                 id="tour_bg"
//                 type="file"
//                 accept=".jpg, .jpeg, .png"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="tour_banner">Banner</Label>
//               <Input
//                 id="tour_banner"
//                 type="file"
//                 accept=".jpg, .jpeg, .png"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="tour_qr">QR Code</Label>
//               <Input
//                 id="tour_qr"
//                 type="file"
//                 accept=".jpg, .jpeg, .png"
//                 onChange={handleFileChange}
//               />
//             </div>
//             <Button type="submit">Upload</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </main>
//   );
// };

// export default TournamentImage;