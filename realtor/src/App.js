import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./components/Layout/Layout";

// Existing pages
import HomePage from "./pages/HomePage";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Agent from "./pages/Agent";

// New marketplace pages
import SearchPage from "./pages/search/SearchPage";
import PropertyDetailPage from "./pages/property/PropertyDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import BrokerDashboard from "./pages/dashboard/BrokerDashboard";
import AddPropertyPage from "./pages/dashboard/AddPropertyPage";
import MyPropertiesPage from "./pages/dashboard/MyPropertiesPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import EditPropertyPage from "./pages/dashboard/EditPropertyPage";
import AgentsPage from "./pages/agents/AgentsPage";
import AgentProfilePage from "./pages/agents/AgentProfilePage";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>

        {/* Core */}
        <Route path="/home" component={HomePage} />
        <Route path="/agent" component={Agent} />
        <Route path="/blog" exact component={Blog} />
        <Route path="/blog/:blogId" component={Blog} />

        {/* Auth */}
        <Route path="/signup">
          {!isAuthenticated ? <Signup /> : <Redirect to="/" />}
        </Route>
        <Route path="/login">
          {!isAuthenticated ? <Login /> : <Redirect to="/" />}
        </Route>

        {/* Marketplace */}
        <Route path="/search" component={SearchPage} />
        <Route path="/property/:id" component={PropertyDetailPage} />
        <Route path="/categories" component={CategoriesPage} />

        {/* Agents marketplace */}
        <Route path="/agents" exact component={AgentsPage} />
        <Route path="/agents/:id" component={AgentProfilePage} />

        {/* Dashboards */}
        <Route path="/dashboard/broker/add-property" component={AddPropertyPage} />
        <Route path="/dashboard/broker/my-properties" component={MyPropertiesPage} />
        <Route path="/dashboard/broker/edit-property/:id" component={EditPropertyPage} />
        <Route path="/dashboard/broker" component={BrokerDashboard} />
        <Route path="/dashboard/admin" component={AdminDashboard} />
        <Route path="/dashboard/favorites" component={FavoritesPage} />
        <Route path="/dashboard" component={BuyerDashboard} />

        {/* Legacy routes — keep backward compat */}
        <Route path="/listings" exact component={Listings} />
        <Route path="/listings/:listingId" component={ListingDetail} />

        <Route path="*" component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
