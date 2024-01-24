export interface UserRoom {
  id: string;
  created_at: string;
  huddle_room_id: string;
  user_id: string;
  host_is_connecting: boolean;
  host_is_joined: boolean;
  peer_is_joined: boolean;
  // User properties to be merged
  fc_username?: string;
  fc_id?: string;
  fc_image_url?: string;
  session_huddle_room_id?: string;
}

export interface Room {
  id: string;
  created_at: string;
  huddle_room_id: string;
  user_id: string;
  host_is_connecting: boolean;
  host_is_joined: boolean;
  peer_is_joined: boolean;
}

export interface User {
  id: string;
  created_at: string;
  fc_username: string;
  fc_id: string;
  fc_image_url: string;
  updated_at: string;
  is_active: boolean;
  session_huddle_room_id: string;
}
