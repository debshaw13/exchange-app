import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark">
      <div className="row container mx-auto">
        <p className="list-inline-item text-white align-middle my-auto py-2 mx-auto">	&copy; <a className="text-white" href="https://dshawportfolio.netlify.app">Deb Shaw</a> {(new Date().getFullYear())}</p>
      </div>
    </footer>
  )
}

export default Footer;
