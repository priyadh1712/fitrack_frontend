import React from "react";

const ProfileCard = ({ user }) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 h-32"></div>
      <div className="relative -mt-16 text-center">
        <img
          className="w-32 h-32 rounded-full border-4 border-white mx-auto"
          src={user.avatar}
          alt={`${user.name}'s avatar`}
        />
        <h2 className="text-xl font-bold text-gray-800 mt-4">{user.name}</h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-700">About Me</h3>
        <p className="text-gray-600 text-sm mt-2">{user.bio || "No bio available."}</p>
        <h3 className="font-semibold text-gray-700 mt-4">Goals Achieved</h3>
        <p className="text-gray-600 text-sm">{user.goalsAchieved || 0}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
