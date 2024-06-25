import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from 'src/components/ui/card';

const Home = () => {
  return (
    <div className="flex justify-center items-center mt-12 bg-gray-50 p-6">
      <Card className="max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">About ESMS</h1>
        </CardHeader>
        <CardContent>
          <p className="mt-4 text-gray-600 leading-relaxed">
            The ESMS (E-Sport Management System) application is a comprehensive tool designed for handling and managing tournaments. It allows organizers to create, manage, and handle tournaments efficiently. If they have too many things to handle, they can assign referees to monitor the game.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            As a user, you can join tournaments either as a player or a spectator. ESMS also provides a seamless experience to track the bracket progress, having social interaction as well as streaming section to watch the game at your home.
          </p>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-gray-500">Experience the best way to manage and enjoy e-sports tournaments with ESMS.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Home