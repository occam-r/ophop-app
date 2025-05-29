import axios from "axios";
import { BASE_URL } from "./config";
import { adaptLoginData, adaptSignupData } from "./adapters";
import messaging from '@react-native-firebase/messaging';

// Android notification channel constants
const ANDROID_CHANNEL_ID = 'chat_messages';
const ANDROID_IMPORTANCE_HIGH = 4;

const api_post = (url, data, token, method) => {
  let config = {
    method: method || "post",
    maxBodyLength: Infinity,
    url: BASE_URL + url,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: data || {},
  };

  return axios.request(config);
};

const api_get = (url, token) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: BASE_URL + url,
    headers: {
      Authorization: token,
    },
  };
  return axios.request(config);
};

export const login_api = (data, dial_code) => {
  console.warn(adaptLoginData(data, dial_code));
  
  return axios.post(BASE_URL + "/user/login", adaptLoginData(data, dial_code));
};

export const signup_api = (data) => {
  return axios.post(BASE_URL + "/user/sign-up", adaptSignupData(data));
};

export const checkCredentials_api = (data) => {
  console.warn(data);
  return axios.post(BASE_URL + "/checkCredentials", data);
};

export const restorePassword_api = (data) => {
  return axios.post(BASE_URL + "/user/restorePassword", data);
};

export const getTags_api = (token) => {
  return api_get("/tags", token);
};

export const getNearByShops_api = (city_id, token) => {
  console.log('getNearByShops_api called with:', { city_id, token });
  
  if (!token) {
    console.error('getNearByShops_api: token is missing');
    return Promise.reject(new Error('Authentication token is required'));
  }

  const url = city_id ? `/user/shops/${city_id}` : "/user/shops/nearby";
  console.log('Making API request to:', BASE_URL + url);
  
  return api_get(url, token)
    .then(response => {
      console.log('Nearby shops API response:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Nearby shops API error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    });
};

export const getCity_api = (token) => {
  return api_get("/user/cities", token);
};

export const add_fav_shop_api = (id, data, token) => {
  return api_post("/user/toggleFavorite/" + id, data, token);
};

export const get_about_store_api = (id, token) => {

  console.warn({id,token});
  

  return api_get("/user/shop/" + id + "/about", token);
};

export const get_store_products_api = (id, page, limit, token) => {
  return api_get(
    `/user/shop/` + id + `/products?page=` + page + `&limit=` + limit,
    token
  );
};

export const add_remove_products_api = (id, status, token) => {
  return api_post(`/user/shoppingCart/` + id + `/` + status, null, token);
};

export const get_store_posts_api = (id, page, limit, token) => {
  return api_get(
    `/user/shop/` + id + `/posts?page=` + page + `&limit=` + limit,
    token
  );
};

export const like_store_post_api = (id, data, token) => {
  console.log({ id,data, token });
  return api_post(`/user/post/` + id + `/like`, data, token);
};

export const show_post_interest_api = (id, data, token) => {
  console.log({ id, token });
  return api_post(`/user/post/` + id + `/interested`, data, token);
};

export const post_attended_api = (id, data, token) => {
console.warn({id, data, token});


  return api_post(`/user/post/` + id + `/attended`, data, token);
};

export const donations_api = (data, token) => {
  return api_post(`/user/donations`, data, token);
};

export const volunteers_api = (id, data, token) => {
  return api_post(`/user/shop/` + id + `/volunteers`, data, token);
};

export const get_questions_api = (id, page, limit, token) => {
  return api_get(
    `/user/shop/` + id + `/questions?page=` + page + `&limit=` + limit,
    token
  );
};

export const get_holidays_api = (id, page, limit, token) => {
  return api_get(
    `/user/shop/` + id + `/holidays?page=` + page + `&limit=` + limit,
    token
  );
};

export const rate_store_api = (id, data, token) => {
  console.warn({ id, data, token });
  return api_post(`/user/rateShop/` + id, data, token);
};

export const subscribe_store_api = (id, data, token) => {
  return api_post(`/user/shop/` + id + `/subscribe`, data, token);
};

export const share_to_notes_api = (data, token) => {
  return api_post(`/user/notes`, data, token);
};

export const get_contacts_api = (token) => {
  return api_get(`/user/contacts`, token);
};

export const actions_api = (data, token) => {
  console.warn({ msg:"Action API is hit",data, token });
  return api_post(`/user/actions`, data, token);
};

export const messages_api = (id, data, token) => {
  console.warn({ id, data, token });
  return api_post(`/user/chat/user/` + id + `/message`, data, token);
};

export const report_api = (id, data, token) => {
  return api_post(`/user/shop/` + id + `/report`, data, token);
};

export const user_details_api = (token) => {
  return api_get(`/user/profile/details`, token);
};

export const get_city_details_api = (id, token) => {
  return api_get(`/user/homeScreen/` + id + `/city`, token);
};

export const get_shopping_cart_api = (token) => {
  return api_get(`/user/shoppingCart`, token);
};

export const checkout_api = (data, token) => {
  console.warn({ data, token });
  return api_post(`/user/shoppingCart/final-checkout`, data, token);
};

export const get_events_api = (token) => {
  return api_get(`/user/events`, token);
};

export const get_states_api = (token) => {
  return api_get(`/user/states`, token);
};

export const upd_user_details_api = (data, token) => {
  return api_post(`/user/profile/details`, data, token, "PATCH");
};

export const send_suggestion_api = (data, token) => {
  return api_post(`/user/supportRequest`, data, token);
};

export const upd_avatar_api = (data, token) => {
  return api_post(`/user/profile/userAvatar`, data, token, "PUT");
};

export const get_rooms_api = (token) => {
  return api_get(`/user/chat/rooms`, token);
};

export const get_notes_api = (token) => {
  return api_get(`/user/notes`, token);
};

export const post_notes_api = (data, token) => {
  return api_post(`/user/notes`, data, token);
};

export const delete_notes_api = (id, token) => {
  return api_post(`/user/notes/` + id, id, token, "DELETE");
};

export const get_requests_api = (token) => {
  return api_get(`/user/contactRequests`, token);
};

export const acccept_request_api = (id, token) => {
  return api_get(`/user/acceptRequest/` + id, token);
};

export const reject_request_api = (id, token) => {
  return api_get(`/user/declineRequest/` + id, token);
};

export const store_message_api = async (roomId, data, token) => {
  try {
    const response = await api_post(`/user/chat/room/${roomId}/message`, data, token);
    
    if (response.data && response.data.success) {
      const messageData = response.data.data;
      
      // Send notification through Firebase
      const message = {
        data: {
          type: 'message',
          chatId: roomId,
          senderId: messageData.senderId,
          senderName: messageData.senderName || 'New Message',
          message: messageData.message,
          timestamp: new Date().toISOString(),
          messageId: messageData.id || `${messageData.senderId}_${Date.now()}`,
          senderAvatar: messageData.senderAvatar
        },
        notification: {
          title: messageData.senderName || 'New Message',
          body: messageData.message
        },
        topic: `chat_${roomId}`
      };

      try {
        await messaging().sendMessage(message);
        console.log('Notification sent successfully');
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const send_shop_message_api = async (shopId, data, token) => {
  try {
    const response = await api_post(`/user/chat/shop/${shopId}/message`, data, token);
    
    if (response.data && response.data.success) {
      const messageData = response.data.data;
      
      // Send notification through Firebase
      const message = {
        data: {
          type: 'message',
          chatId: messageData.roomId,
          senderId: messageData.senderId,
          senderName: messageData.senderName || 'New Message',
          message: messageData.message,
          timestamp: new Date().toISOString()
        },
        notification: {
          title: messageData.senderName || 'New Message',
          body: messageData.message
        },
        topic: `shop_${shopId}` // Using shop ID as topic
      };

      try {
        await messaging().sendMessage(message);
        console.log('Shop notification sent successfully');
      } catch (notificationError) {
        console.error('Error sending shop notification:', notificationError);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error sending shop message:', error);
    throw error;
  }
};

export const send_user_message_api = async (userId, data, token) => {
  try {
    const response = await api_post(`/user/chat/shop/${userId}/message`, data, token);
    
    if (response.data && response.data.success) {
      const messageData = response.data.data;
      
      // Send notification through Firebase
      const message = {
        data: {
          type: 'message',
          chatId: messageData.roomId,
          senderId: messageData.senderId,
          senderName: messageData.senderName || 'New Message',
          message: messageData.message,
          timestamp: new Date().toISOString()
        },
        notification: {
          title: messageData.senderName || 'New Message',
          body: messageData.message
        },
        topic: `user_${userId}` // Using user ID as topic
      };

      try {
        await messaging().sendMessage(message);
        console.log('User notification sent successfully');
      } catch (notificationError) {
        console.error('Error sending user notification:', notificationError);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error sending user message:', error);
    throw error;
  }
};

export const get_shop_activity_api = (shopid, month, from, to, token) => {
  const url = `/shop/686dba1f-bf69-4a14-a679-ceab4f33416d/dashboard/0?from=2024-07-02&to=2024-07-31`;
  // const url =  `/shop/` + shopid`/dashboard/` + month + `?from=` + from + `&to=` + to;
  return api_get(url, "Bearer 320|9GowEyUjcUqNqto9rbB9dG1Yq3NXMcvY3ydTY3Vd");
};

export const find_users_api = (searchQuery, token) => {
  console.warn({ searchQuery, token });
  const url = `/user/findUser`;
  return api_post(url, { searchQuery, include_fcm_token: true }, token);
};

export const sendRequest_api = async (userId, token) => {
  if (!userId || !token) {
    throw new Error('User ID and token are required');
  }
  
  const url = `/user/sendRequest/${userId}`;
  try {
    const fcmToken = await getFCMToken();
    const response = await api_get(url + `?fcm_token=${fcmToken}`, token);
    
    // If the API call is successful, send a notification
    if (response.data && response.data.success) {
      const userData = response.data.data;
      await sendFCMNotification(
        fcmToken,
        'New Friend Request',
        `${userData.senderName || 'Someone'} sent you a friend request`,
        {
          type: 'friend_request',
          requestId: userData.requestId,
          senderId: userData.senderId,
          senderName: userData.senderName,
          timestamp: new Date().toISOString()
        }
      );
    }
    
    return response;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const declineRequest_api = (userId, token) => {
  const url = `/user/declineRequest/${userId}`;
  return api_get(url, token);
};

export const acceptRequest_api = (userId, token) => {
  const url = `/user/acceptRequest/${userId}`;
  return api_get(url, token);
};

export const get_shops_slash_msg_api = (roomId, token) => {
  const url = `/user/chat/room/` + roomId + `/messages?id=`;
  return api_get(url, token);
};

export const fetchPaymentIntentClientSecret = (amount, token) => {
  const url = `/user/shoppingCart/generate-token`;
  return api_post(url, { amount }, token);
};

export const get_orders_api = (token) => {
  const url = `/user/orders`;
  return api_get(url, token);
};

export const get_orders_products_api = (id, token) => {
  const url = `/user/orders/` + id + `/products`;
  return api_get(url, token);
};

export const get_profile_details_api = (token) => {
  const url = `/user/profile/details`;
  return api_get(url, token);
};

export const get_chat_msgs_api = (room_id, token) => {
  const url = `/user/chat/room/` + room_id + `/messages?id=`;
  return api_get(url, token);
};

export const delete_msg_api = (msg_id, token) => {
  const url = `/user/chat/message/` + msg_id;
  return api_post(url, {}, token, "delete");
};

export const delete_chat_api = (room_id, token) => {
  const url = `/user/chat/room/` + room_id;
  return api_post(url, {}, token, "delete");
};

export const get_messages_api = (room_id,token)=>{
  return api_get('/user/chat/room/'+room_id+'/messages?id=',token);
}

export const get_total_attended_andgotdeal_api = (token)=>{
  return api_get('/user/post/total',token);
}

export const unsend_request_api = (id,token)=>{
  return api_get('/user/unsendRequest/'+id,token);
}
