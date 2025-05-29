import * as React from "react";
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { light_theme, theme_color } from "../../../../utilities/colors";
import About_Store from "./Components/About_Store";
import { useDispatch, useSelector } from "react-redux";
import Products from "./Components/Products";
import Posts from "./Components/Posts";
import Donations from "./Components/Donations";
import { get_about_store_api } from "../../../../apis";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import Volunteers from "./Components/Volunteers";
import Gallery from "./Components/Gallery";
import FAQ from "./Components/FAQ";
import Holidays from "./Components/Holiday";
import Videos from "./Components/Videos";

const Tab_Container = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};

export default function Tab_Comps({
  navigation,
  store_details,
  setstore_details,
}) {
  const { params } = useRoute();
  const isFocused = useIsFocused();

  const { text_color, backgroundColor, shadowColor, grey } = light_theme;

  const { token } = useSelector((state) => state?.authReducer);

  const layout = useWindowDimensions();

  const [tab_index, setIndex] = React.useState(0);

  const dispatch = useDispatch();

  const get_store_details = () => {
      dispatch(set_loading_action(true));
      get_about_store_api(params?.id, token)
        .then((res) => {
          setstore_details(res.data.data?.shopData || {});
          dispatch(set_loading_action(false));
          // console.warn(res.data.data.shopData?.latestPosts);
        })
        .catch((err) => {
          dispatch(set_loading_action(false));
          console.error(err);
        });
  };

  React.useEffect(() => {
    // if (tab_index) {
      get_store_details();
    // }
  }, [isFocused, tab_index]);

  const AboutRoute = () => (
    <Tab_Container>
      <About_Store
        tab_index={tab_index}
        store_details={store_details}
        navigation={navigation}
        token={token}
        get_store_details={get_store_details}
      />
    </Tab_Container>
  );

  const ProductsRoute = () => (
    <Tab_Container>
      <Products tab_index={tab_index} navigation={navigation} token={token} />
    </Tab_Container>
  );

  const PostsRoute = () => (
    <Tab_Container>
      <Posts tab_index={tab_index} navigation={navigation} token={token} />
    </Tab_Container>
  );

  const DonationsRoute = () => (
    <Tab_Container>
      <Donations
        navigation={navigation}
        tab_index={tab_index}
        token={token}
        donations={store_details?.donations || []}
        notTakenDonations={store_details?.notTakenDonations || []}
      />
    </Tab_Container>
  );

  const VolunteersRoute = () => (
    <Tab_Container>
      <Volunteers
        navigation={navigation}
        tab_index={tab_index}
        token={token}
        volunteers={store_details?.volunteers || []}
        store_details={store_details}
      />
    </Tab_Container>
  );

  const GalleryRoute = () => (
    <Tab_Container>
      <Gallery tab_index={tab_index} images={store_details?.gallery || []} />
    </Tab_Container>
  );
  const FAQRoute = () => (
    <Tab_Container>
      <FAQ tab_index={tab_index} token={token} />
    </Tab_Container>
  );
  const HolidaysRoute = () => (
    <Tab_Container>
      <Holidays tab_index={tab_index} token={token} />
    </Tab_Container>
  );
  const VideosRoute = () => (
    <Tab_Container>
      <Videos videos={store_details?.videos || []} />
    </Tab_Container>
  );

  const renderScene = SceneMap({
    about: AboutRoute,
    products: ProductsRoute,
    posts: PostsRoute,
    donations: DonationsRoute,
    volunteers: VolunteersRoute,
    gallery: GalleryRoute,
    videos: VideosRoute,
    faq: FAQRoute,
    holidays: HolidaysRoute,
  });

  const tab_routes = [
    { key: "about", title: "About" },
    { key: "products", title: "Products" },
    { key: "posts", title: "Posts" },
    { key: "donations", title: "Donations" },
    { key: "volunteers", title: "Volunteers" },
    { key: "gallery", title: "Gallery" },
    { key: "videos", title: "Videos" },
    { key: "faq", title: "Faq" },
    { key: "holidays", title: "Holidays" }
  ];

  const [routes,setroutes] = React.useState(tab_routes);

  React.useEffect(() => {
    setroutes(tab_routes?.filter((el) => {
      if (store_details?.showProducts == false ? el?.key != "products" : true) {
        return true;
      } else {
        return false;
      }
    }));
  }, [store_details]);
  

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View>
        <FlatList
          horizontal={true}
          data={props.navigationState.routes}
          renderItem={({ item, index }) => {
            const i = index;
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex) =>
                inputIndex === i ? 1 : 0.5
              ),
            });

            return (
              <TouchableOpacity
                style={{
                  // flex: 1,
                  backgroundColor,
                  alignItems: "center",
                  padding: 16,
                  // borderBottomColor: theme_color,
                  // borderBottomWidth: tab_index == i ? 2 : 0,
                  // height:53
                  // width: "",
                }}
                onPress={() => {
                  // console.warn(i);
                  setIndex(i);
                }}
              >
                <Animated.Text
                  style={{
                    //   marginLeft: i == 0 ? "50%" : 0,
                    opacity,
                    color: tab_index == i ? theme_color : text_color,
                    fontWeight: tab_index == i ? 600 : 400,
                  }}
                >
                  {item.title}
                </Animated.Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          height: layout.height-360,
        }}
      >
        <TabView
          navigationState={{ index: tab_index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width,flex:1 }}
          renderTabBar={_renderTabBar}
          swipeEnabled={false}
        />
      </View>
    </>
  );
}
