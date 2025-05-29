import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../Private_Screens/Home";
import Sidebar from "./Sidebar";
import Search_Page from "../../utilities/SearchBar/Search_Page";
import Hop from "../Private_Screens/Hop";
import StoreDetails from "../Private_Screens/StoreDetails";
import Account from "../Private_Screens/Account";
import Shopping_Cart from "../Private_Screens/Account/Shopping_Cart";
import EventList from "../Private_Screens/EventList";
import Subscribed_stores from "../Private_Screens/Account/Subscribed_stores";
import Favourite_stores from "../Private_Screens/Account/Favourite_stores";
import Recently_visited from "../Private_Screens/Account/Recently_visited";
import Set_Profile from "../Private_Screens/Account/Profile";
import Suggestions from "../Private_Screens/Account/Suggestions";
import Change_Password from "../Private_Screens/Account/ChangePassword";
import Friends from "../Private_Screens/Friends";
import ChatScreen from "../Private_Screens/Friends/ChatScreen/index";
import OrderHistory from "../Private_Screens/Account/Orders/OrderHistory";
import OrderDetails from "../Private_Screens/Account/Orders/OrderDetails";
import Checkout_Modal from "../Private_Screens/Account/Shopping_Cart/Checkout_Page";
import Checkout_Page from "../Private_Screens/Account/Shopping_Cart/Checkout_Page";

const Private_Routes = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      backBehavior="history"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{

      }}
    > 

      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Search"
        component={Search_Page}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Hop"
        component={Hop}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Store Details"
        component={StoreDetails}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Shopping_Cart}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Events"
        component={EventList}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Subscribed Stores"
        component={Subscribed_stores}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Favourite Stores"
        component={Favourite_stores}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Recently Visited"
        component={Recently_visited}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Set Profile"
        component={Set_Profile}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Suggestions"
        component={Suggestions}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Change Password"
        component={Change_Password}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Friends"
        component={Friends}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Order History"
        component={OrderHistory}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Order Details"
        component={OrderDetails}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Checkout"
        component={Checkout_Page}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default Private_Routes;
