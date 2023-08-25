import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useCallback, useEffect, useState } from "react";
import { ReactComponent as ProfileSvg } from "../assets/profile.svg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/TimeLine";
import Tweet from "../components/Tweet";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: scroll;
`;

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const handleOnChangeAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) return;

    const { files } = e.target;

    if (files && files.length === 1) {
      const file = files[0];

      if (file.size > 1024 ** 2) return;

      const locationRef = ref(storage, `avatars/${user.uid}`);
      const ret = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(ret.ref);

      setAvatar(avatarUrl);

      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const fetchTweets = useCallback(async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    const snapShot = await getDocs(tweetsQuery);
    const tweetsData = snapShot.docs.map((doc) => {
      const { tweet, username, userId, photo, createdAt } = doc.data();
      return { tweet, username, userId, photo, createdAt, docId: doc.id };
    });
    setTweets(tweetsData);
  }, [user]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  // TODO: edit username, tweet realtime update
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <ProfileSvg />}
      </AvatarUpload>
      <AvatarInput
        onChange={handleOnChangeAvatar}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ? user.displayName : "Anonymous"}</Name>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.docId} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
};

export default Profile;
