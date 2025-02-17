import React from "react";
import Carousel from "../components/Carousel/Carousel";
import Header from "../components/Header/Header";
import QRScanner from "../components/QRScanner/QRScanner";

export function Home() {
  return (
    <>
      <Carousel />
      <QRScanner />
    </>
  );
}
