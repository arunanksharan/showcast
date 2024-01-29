// Render it server side
import { useProfile } from '@farcaster/auth-kit';

const UserProfilePage = () => {
  const {
    isAuthenticated,
    profile: { username, fid },
  } = useProfile();
  return (
    <div>
      {isAuthenticated ? (
        <p>
          Hello, {username}! Your fid is: {fid}
        </p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
};

export default UserProfilePage;
