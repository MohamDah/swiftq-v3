import React from 'react';
import rays from "../assets/rays.png";
import logoBanner from "../assets/logoBanner.png";
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <div className="h-dvh bg-primary flex flex-col justify-center items-center overflow-hidden">

      <img src={rays} alt="Rays" className="w-36" />

      <div className="mx-5 space-y-6">
        <img src={logoBanner} alt="logo banner" className="w-full max-w-md" />
        <Outlet />
      </div>
      <img src={rays} alt="Rays" className="w-36 rotate-180" />
    </div>
  );
}
