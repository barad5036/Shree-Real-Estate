import React, { useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { TiThMenu } from "react-icons/ti";
import { CgClose } from "react-icons/cg";
import { FaUser, FaChevronDown } from "react-icons/fa";

const NAV_LINKS = [
  { to: "/home",       label: "Home" },
  { to: "/search",     label: "Properties" },
  { to: "/categories", label: "Categories" },
  { to: "/agents",     label: "Agents" },
  { to: "/blog",       label: "Blog" },
];

const MainHeader = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const closeMenu = () => setIsMobileMenu(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    history.replace("/login");
  };

  const truncatedUser = user?.name || user?.email?.split("@")[0] || "Account";

  const getDashboardLinks = () => {
    if (!user) return [];
    
    const links = [];
    
    if (user.role === "buyer") {
      links.push(
        { to: "/dashboard", label: "My Dashboard" },
        { to: "/dashboard/favorites", label: "Saved Properties" }
      );
    } else if (user.role === "broker") {
      links.push(
        { to: "/dashboard/broker", label: "Broker Dashboard" },
        { to: "/dashboard/broker/add-property", label: "Add Property" },
        { to: "/dashboard/broker/my-properties", label: "My Properties" }
      );
    } else if (user.role === "admin") {
      links.push(
        { to: "/dashboard/admin", label: "Admin Panel" }
      );
    }
    
    return links;
  };

  const dashboardLinks = getDashboardLinks();

  return (
    <header className="z-10 w-full fixed bg-white top-0 p-4 px-6 lg:px-20 shadow-sm">
      <nav className="flex items-center justify-between font-Poppins">
        {/* Logo */}
        <Link to="/home" className="text-blue font-bold text-xl hover:text-liteBlue transition-colors">
          Shree Real Estate
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1 text-ash text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                activeClassName="text-blue font-medium"
                className="px-3 py-2 rounded-lg hover:text-blue transition-colors"
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDashboardOpen((v) => !v)}
                className="flex items-center gap-2 bg-blue text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md hover:bg-liteBlue transition-colors"
              >
                <FaUser />
                {truncatedUser}
                <FaChevronDown className={`transition-transform ${isDashboardOpen ? "rotate-180" : ""}`} />
              </button>
              {isDashboardOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-silver w-52 z-50 font-Poppins text-sm overflow-hidden">
                  {dashboardLinks.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setIsDashboardOpen(false)}>
                      <div className="px-4 py-3 hover:bg-silver text-ash hover:text-blue transition-colors">{link.label}</div>
                    </Link>
                  ))}
                  <div className="border-t border-silver">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="text-blue font-medium text-sm px-4 py-2 hover:underline">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md hover:bg-liteBlue transition-colors">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setIsMobileMenu((v) => !v)} className="lg:hidden">
          {isMobileMenu ? (
            <CgClose className="text-4xl p-1" />
          ) : (
            <TiThMenu className="text-4xl p-1" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenu && (
        <div className="lg:hidden mt-3 pb-4 border-t border-silver">
          <ul className="flex flex-col text-ash text-sm mt-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  activeClassName="text-blue font-medium"
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:text-blue transition-colors"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <>
                {dashboardLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={closeMenu} className="block px-4 py-3 text-ash hover:text-blue">{link.label}</Link>
                  </li>
                ))}
              </>
            )}
          </ul>
          <div className="flex gap-3 px-4 mt-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full bg-blue text-white font-bold text-sm py-2.5 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="flex-1">
                  <button className="w-full border-2 border-blue text-blue font-bold text-sm py-2.5 rounded-lg">Login</button>
                </Link>
                <Link to="/signup" onClick={closeMenu} className="flex-1">
                  <button className="w-full bg-blue text-white font-bold text-sm py-2.5 rounded-lg">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
