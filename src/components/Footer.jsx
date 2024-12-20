import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
          &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
        </p>
        <div className="mt-4">
          <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/priyadharshini-ashok/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Priya Dharshini
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
