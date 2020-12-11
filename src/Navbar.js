import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg p-0 smooth-scroll" id="header">
      <div className="d-none d-lg-flex flex-grow-1 mx-auto" id="lgNavbar">
        <div className="navbar-brand my-auto ml-3" id="brand" href="#">React Currency Converter</div>
        <div className="navbar-nav ml-auto">
          <a className="nav-item nav-link px-3 my-2" href="#currency-converter">Currency Converter</a>
          <a className="nav-item nav-link px-3 mr-2 my-2" href="#currency-table">Currency Table</a>
        </div>
      </div>

      <a className="nav-item nav-link px-3 my-2 order-2" role="button" data-toggle="collapse" href="#navbarMenu" id="navbarMenuToggler"><i className="fas fa-bars mr-3"></i></a>
      <div className="order-1">
        <div className="navbar-toggler navbar-brand px-2 ml-2">Currency Converter</div>
      </div>
      <div className="collapse navbar-collapse order-3" id="navbarMenu">
        <div className="nav-item dropdown">
        <a className="nav-item nav-link p-3 m-2" href="#currency-converter">Currency Converter</a>
        <a className="nav-item nav-link p-3 m-2" href="#currency-table">Currency Table</a>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
